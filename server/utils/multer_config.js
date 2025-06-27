const multer = require('multer');
const boom = require('@hapi/boom');

// Configuración de Multer para almacenar en memoria
const storage = multer.memoryStorage();

const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(boom.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
    }
  },
});

// Puedes hacer lo mismo para uploadPlaylistPicture si lo tienes en el mismo archivo
const uploadPlaylistPicture = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(boom.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
    }
  },
});

module.exports = {
  uploadProfilePicture,
  uploadPlaylistPicture, // Asegúrate de exportar ambos si los configuras aquí
};