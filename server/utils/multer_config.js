// utils/multer_config.js
const multer = require('multer');
const path = require('path');
const boom = require('@hapi/boom');

const PROFILE_PICTURES_DIR = path.join(__dirname, '..', 'uploads', 'profile_pictures');
const PLAYLIST_PICTURES_DIR = path.join(__dirname, '..', 'uploads', 'playlist_pictures');

// Configuración de almacenamiento para fotos de perfil
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILE_PICTURES_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.user && req.user.sub ? req.user.sub : 'anonymous';
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${userId}-${uniqueSuffix}${ext}`);
  }
});


const playlistPictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PLAYLIST_PICTURES_DIR);
  },
  filename: (req, file, cb) => {
    const playlistId = req.params.id || 'new';
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${playlistId}-${uniqueSuffix}${ext}`);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(boom.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
  }
};

// Instancias de Multer para cada tipo de subida
const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Limite de 2MB
  }
});

const uploadPlaylistPicture = multer({
  storage: playlistPictureStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


module.exports = {
  uploadProfilePicture,
  uploadPlaylistPicture,
  PROFILE_PICTURES_DIR,
  PLAYLIST_PICTURES_DIR
};