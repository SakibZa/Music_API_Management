const express = require('express');
const router = express.Router();
const favoriteController = require('../controller/favorites.controller');


router.post('/add-favorite', favoriteController.addFavorite);

router.get('/:category', favoriteController.getFavoritesByCategory);

router.delete('/remove-fovorite/:id', favoriteController.removeFavorite);


module.exports = router;