const express = require('express');
const router = express.Router();
const albumController = require('../controller/album.controller');


router.post('/add-album' , albumController.addAlbum);

router.get('/all-album', albumController.getAllAlbum);

router.put('/:id', albumController.updateAlbum);

router.get('/:id', albumController.getAlbumById);

router.delete('/:id', albumController.deleteAlbum);



module.exports = router;