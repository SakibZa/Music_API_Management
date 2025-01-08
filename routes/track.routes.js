const express = require('express');
const router = express.Router();
const trackController = require('../controller/track.controller');

router.post('/add-track', trackController.addTrack);

router.get('/allTrack', trackController.getAllTracks)

router.put('/:id', trackController.updateTrack)

router.delete('/:id', trackController.deleteTrackById)

router.get('/:id', trackController.getTrackById);


module.exports = router;