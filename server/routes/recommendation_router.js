// routes/recommendation_router.js
const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator_handler');
const { recommendItemSchema } = require('../schemas/recommendation_schema');
const RecommendationService = require('../services/ai/recommendation_service');

const router = express.Router();
const recommendationService = new RecommendationService();

// Función auxiliar para generar rutas de recomendación
const createRecommendationRoute = (type, serviceMethod) => {
  router.post(
    `/${type}`,
    passport.authenticate('jwt', { session: false }),
    validatorHandler(recommendItemSchema, 'body'),
    async (req, res, next) => {
      try {
        const { itemName } = req.body;
        const recommendedItems = await recommendationService[serviceMethod](itemName);
        // La respuesta JSON debe contener la clave del tipo de contenido
        res.json({ [type]: recommendedItems });
      } catch (error) {
        next(error);
      }
    }
  );
};

// Crea las rutas para cada tipo de contenido
createRecommendationRoute('movies', 'recommendMovies');
createRecommendationRoute('tvshows', 'recommendTvShows'); // Asegúrate de implementar recommendTvShows en el servicio
createRecommendationRoute('books', 'recommendBooks');     // Asegúrate de implementar recommendBooks en el servicio
createRecommendationRoute('songs', 'recommendSongs');
createRecommendationRoute('artists', 'recommendArtists'); // Asegúrate de implementar recommendArtists en el servicio
createRecommendationRoute('albums', 'recommendAlbums');   // Asegúrate de implementar recommendAlbums en el servicio
createRecommendationRoute('videogames', 'recommendVideogames'); // Asegúrate de implementar recommendVideogames en el servicio


module.exports = router;