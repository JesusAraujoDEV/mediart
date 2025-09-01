// utils/imgbb_uploader.js
const axios = require('axios');
const boom = require('@hapi/boom');
const {config} = require('./../config/config')

// Asegúrate de que esta variable de entorno esté configurada
const IMGBB_API_KEY = config.apiKeys.imgbbApiKey;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_DELETE_URL = 'https://api.imgbb.com/1/delete';

// Fallback to Imgur API if available
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';

if (!IMGBB_API_KEY) {
  console.warn('IMGBB_API_KEY is not defined. Image uploads to ImgBB will fail. Please set the environment variable.');
}

// Fallback upload function for Imgur
async function uploadImageToImgur(imageBuffer, filename) {
  if (!IMGUR_CLIENT_ID) {
    throw boom.preconditionRequired('Imgur Client ID is not configured. Cannot upload image.');
  }

  const base64Image = imageBuffer.toString('base64');

  try {
    console.log('Attempting Imgur upload as fallback...');

    const response = await axios.post(IMGUR_UPLOAD_URL, {
      image: base64Image,
      type: 'base64',
      name: filename
    }, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      },
      timeout: 30000
    });

    if (response.data && response.data.data) {
      console.log('Imgur upload successful!');
      return {
        url: response.data.data.link,
        deleteUrl: `https://api.imgur.com/3/image/${response.data.data.deletehash}` // Imgur delete URL
      };
    } else {
      throw boom.badImplementation('Imgur upload response malformed.');
    }
  } catch (error) {
    console.error('Imgur upload failed:', error.response?.data || error.message);
    throw boom.badImplementation('Failed to upload image to Imgur.', error);
  }
}

async function uploadImageToImgBB(imageBuffer, filename) {
  if (!IMGBB_API_KEY) {
    console.warn('ImgBB API Key not configured, trying Imgur fallback...');
    if (IMGUR_CLIENT_ID) {
      return await uploadImageToImgur(imageBuffer, filename);
    }
    throw boom.preconditionRequired('Neither ImgBB API Key nor Imgur Client ID is configured. Cannot upload image.');
  }

  // Convert buffer to base64 as per ImgBB documentation
  const base64Image = imageBuffer.toString('base64');

  const formData = new FormData();
  formData.append('image', base64Image); // Send as base64 string
  formData.append('name', filename); // Optional filename

  const maxRetries = 2; // Reduced retries since we have fallback
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting ImgBB upload (attempt ${attempt}/${maxRetries})...`);

      const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
        params: {
          key: IMGBB_API_KEY
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 45000 // 45 seconds timeout for base64 upload
      });

      if (response.data && response.data.data) {
        console.log('ImgBB upload successful!');
        return {
          url: response.data.data.url,
          deleteUrl: response.data.data.delete_url
        };
      } else {
        throw boom.badImplementation('ImgBB upload response malformed.');
      }
    } catch (error) {
      lastError = error;
      console.error(`ImgBB upload attempt ${attempt} failed:`, error.response?.data || error.message);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s
        console.log(`Retrying ImgBB in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If ImgBB fails completely, try Imgur as fallback
  console.log('ImgBB failed, trying Imgur fallback...');
  if (IMGUR_CLIENT_ID) {
    try {
      return await uploadImageToImgur(imageBuffer, filename);
    } catch (imgurError) {
      console.error('Both ImgBB and Imgur failed');
      throw boom.badImplementation('Failed to upload image to both ImgBB and Imgur.', { imgbb: lastError, imgur: imgurError });
    }
  }

  console.error('All ImgBB upload attempts failed and no Imgur fallback available');
  throw boom.badImplementation('Failed to upload image to ImgBB after all retries.', lastError);
}

async function deleteImageFromImgBB(deleteHash) {
  if (!deleteHash) {
    console.warn('No delete hash provided for image deletion. Skipping.');
    return { message: 'No delete hash provided, deletion skipped.' };
  }

  // Detect which service the delete URL belongs to
  if (deleteHash.includes('ibb.co') || deleteHash.includes('imgbb.com')) {
    // ImgBB deletion
    if (!IMGBB_API_KEY) {
      console.warn('ImgBB API Key is not configured. Skipping image deletion.');
      return { message: 'ImgBB API Key not configured, deletion skipped.' };
    }

    const hash = deleteHash.split('/').pop();
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting ImgBB deletion (attempt ${attempt}/${maxRetries})...`);

        const response = await axios.get(`${IMGBB_DELETE_URL}/${hash}`, {
          params: {
            key: IMGBB_API_KEY
          },
          timeout: 30000
        });

        if (response.data && response.data.success) {
          console.log('ImgBB deletion successful!');
          return { message: 'Image successfully deleted from ImgBB.' };
        } else {
          console.warn('ImgBB deletion reported non-success:', response.data);
          return { message: 'ImgBB deletion reported non-success or image not found.', details: response.data };
        }
      } catch (error) {
        lastError = error;
        console.error(`ImgBB deletion attempt ${attempt} failed:`, error.response?.data || error.message);

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying ImgBB deletion in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error('All ImgBB deletion attempts failed');
    return { message: 'Failed to delete image from ImgBB after all retries.', error: lastError?.response?.data || lastError?.message };

  } else if (deleteHash.includes('imgur.com')) {
    // Imgur deletion
    if (!IMGUR_CLIENT_ID) {
      console.warn('Imgur Client ID is not configured. Skipping image deletion.');
      return { message: 'Imgur Client ID not configured, deletion skipped.' };
    }

    const deleteHashFromUrl = deleteHash.split('/').pop();

    try {
      console.log('Attempting Imgur deletion...');

      const response = await axios.delete(`https://api.imgur.com/3/image/${deleteHashFromUrl}`, {
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        timeout: 30000
      });

      if (response.data && response.data.success) {
        console.log('Imgur deletion successful!');
        return { message: 'Image successfully deleted from Imgur.' };
      } else {
        console.warn('Imgur deletion reported non-success:', response.data);
        return { message: 'Imgur deletion reported non-success or image not found.', details: response.data };
      }
    } catch (error) {
      console.error('Imgur deletion failed:', error.response?.data || error.message);
      return { message: 'Failed to delete image from Imgur.', error: error.response?.data || error.message };
    }

  } else {
    console.warn('Unknown image hosting service for delete URL:', deleteHash);
    return { message: 'Unknown image hosting service, deletion skipped.' };
  }
}

module.exports = {
  uploadImageToImgBB,
  deleteImageFromImgBB
};