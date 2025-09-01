// utils/imgbb_uploader.js
const axios = require('axios');
const boom = require('@hapi/boom');
const {config} = require('./../config/config')

// Asegúrate de que esta variable de entorno esté configurada
const IMGBB_API_KEY = config.apiKeys.imgbbApiKey;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_DELETE_URL = 'https://api.imgbb.com/1/delete';


if (!IMGBB_API_KEY) {
  console.warn('IMGBB_API_KEY is not defined. Image uploads to ImgBB will fail. Please set the environment variable.');
}


async function uploadImageToImgBB(imageBuffer, filename) {
  if (!IMGBB_API_KEY) {
    throw boom.preconditionRequired('ImgBB API Key is not configured. Cannot upload image.');
  }

  // Convert buffer to base64 as per ImgBB documentation
  const base64Image = imageBuffer.toString('base64');

  const formData = new FormData();
  formData.append('image', base64Image); // Send as base64 string
  formData.append('name', filename); // Optional filename

  const maxRetries = 3;
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

  console.error('All ImgBB upload attempts failed');
  throw boom.badImplementation('Failed to upload image to ImgBB after all retries.', lastError);
}

async function deleteImageFromImgBB(deleteHash) {
  if (!deleteHash) {
    console.warn('No delete hash provided for image deletion. Skipping.');
    return { message: 'No delete hash provided, deletion skipped.' };
  }

  // Detect which service the delete URL belongs to
  let deleteHost = null;
  let isImgBBUrl = false;

  // If deleteHash looks like a URL, try to parse the host
  try {
    // Check if value starts with http(s)://
    if (/^https?:\/\//i.test(deleteHash)) {
      const urlObj = new URL(deleteHash);
      deleteHost = urlObj.hostname.toLowerCase();
      // Allowed ImgBB domains
      const allowedImgBBHosts = ['ibb.co', 'imgbb.com', 'www.imgbb.com', 'www.ibb.co'];
      if (allowedImgBBHosts.includes(deleteHost)) {
        isImgBBUrl = true;
      }
    }
  } catch (err) {
    // Malformed URL, treat it as hash
    deleteHost = null;
  }
  
  // Proceed if it's an ImgBB URL or if it's a plausible plain hash
  if (isImgBBUrl || /^[a-zA-Z0-9]{8,}$/.test(deleteHash)) {
    // ImgBB deletion
    if (!IMGBB_API_KEY) {
      console.warn('ImgBB API Key is not configured. Skipping image deletion.');
      return { message: 'ImgBB API Key not configured, deletion skipped.' };
    }

    // If it's a URL, extract the hash from pathname; else, use as is
    let hash;
    if (isImgBBUrl) {
      const urlObj = new URL(deleteHash);
      hash = urlObj.pathname.split('/').pop();
    } else {
      hash = deleteHash;
    }
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

  } else {
    console.warn('Unknown image hosting service or invalid delete hash:', deleteHash);
    return { message: 'Unknown image hosting service or invalid hash, deletion skipped.' };
  }
}

module.exports = {
  uploadImageToImgBB,
  deleteImageFromImgBB
};