const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator_handler');
const { recommendItemSchema } = require('../schemas/recommendation_schema');
const RecommendationService = require('../services/ai/recommendation_service');

const router = express.Router();
const recommendationService = new RecommendationService();

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
createRecommendationRoute('tvshows', 'recommendTvShows');
createRecommendationRoute('books', 'recommendBooks');
createRecommendationRoute('songs', 'recommendSongs');
createRecommendationRoute('artists', 'recommendArtists');
createRecommendationRoute('albums', 'recommendAlbums');
createRecommendationRoute('videogames', 'recommendVideogames');


module.exports = router;