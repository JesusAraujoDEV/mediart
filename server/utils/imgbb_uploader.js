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

  const formData = new FormData();
  // Crea un Blob a partir del buffer para que Axios pueda enviarlo correctamente
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });
  formData.append('image', blob, filename); // 'image' es el nombre del campo esperado por ImgBB

  try {
    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      params: {
        key: IMGBB_API_KEY
      },
      headers: {
        'Content-Type': 'multipart/form-data' // Axios con FormData generalmente lo establece, pero es bueno ser explícito
      }
    });

    if (response.data && response.data.data) {
      return {
        url: response.data.data.url, // URL de la imagen subida
        deleteUrl: response.data.data.delete_url // URL para eliminar la imagen
      };
    } else {
      throw boom.badImplementation('ImgBB upload response malformed.');
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error.response?.data || error.message);
    throw boom.badImplementation('Failed to upload image to ImgBB.', error);
  }
}

async function deleteImageFromImgBB(deleteHash) {
  if (!IMGBB_API_KEY) {
    console.warn('ImgBB API Key is not configured. Skipping image deletion.');
    return { message: 'ImgBB API Key not configured, deletion skipped.' };
  }
  if (!deleteHash) {
    console.warn('No delete hash provided for ImgBB deletion. Skipping.');
    return { message: 'No delete hash provided, deletion skipped.' };
  }

  // El deleteHash es la parte final de la delete_url
  const hash = deleteHash.split('/').pop(); // Extraer el hash de la URL si se pasó la URL completa

  try {
    const response = await axios.get(`${IMGBB_DELETE_URL}/${hash}`, {
      params: {
        key: IMGBB_API_KEY
      }
    });

    if (response.data && response.data.success) {
      return { message: 'Image successfully deleted from ImgBB.' };
    } else {
      // ImgBB devuelve success: false si la imagen no existe o el hash es inválido
      // O si hay otro error, el campo success será false
      console.warn('ImgBB deletion reported non-success:', response.data);
      return { message: 'ImgBB deletion reported non-success or image not found.', details: response.data };
    }
  } catch (error) {
    console.error('Error deleting image from ImgBB:', error.response?.data || error.message);
    // No lanzamos un boom fatal aquí, ya que la eliminación de la imagen no debería detener la operación principal
    // si la imagen ya no existe, por ejemplo. Solo logueamos el error.
    return { message: 'Failed to delete image from ImgBB.', error: error.response?.data || error.message };
  }
}

module.exports = {
  uploadImageToImgBB,
  deleteImageFromImgBB
};