const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middleware/validation');
const userController = require('../controller/user.controller');


router.post('/signup', validateAuth, userController.signup );

router.post('/login', validateAuth, userController.login);

router.get('/user-details', userController.getAllUsers);

router.post('/add-user', validateAuth, userController.addUser);

router.delete('/:id', userController.deleteUser);

router.put('/update-password',  userController.updatePassword);

module.exports = router;



// Authentication and RBAC are implemented with JWT tokens and roles (Admin, Editor, Viewer).
// Admin can perform all CRUD operations for users, artists, albums, and tracks.
// Editor can edit and delete artists, albums, tracks, and update their password.
// Viewer can only read all entities.