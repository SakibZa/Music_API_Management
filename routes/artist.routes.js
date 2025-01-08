const express = require('express');
const router = express.Router();
const artistController = require('../controller/artist.controller');

router.post('/add-artist', artistController.addArtist);
 
router.get('/all-artist', artistController.getAllArtist);

router.get('/:id', artistController.getArtistById);

router.put('/:id', artistController.updateArtist);

router.delete('/:id', artistController.deleteArtist)


module.exports = router;




// {
//     "email": "Deebazaidi2000@gmail.com",
//   "password": "Deeba@123",
     //   "role": "editor"
// }

// {
//     "email": "sakibhusainzaidi2000@gmail.com",
//     "password": "Sakib@123",
//     "role": "Admin"
// }

// {
//     "email": "sakibhussain1582000@gmail.com",
//     "password": "Sakib@123",
//     "role": "viewer"
// }