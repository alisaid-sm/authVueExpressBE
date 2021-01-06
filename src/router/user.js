const express = require('express');

const usersController = require('../controllers/user');

const router = express.Router();

router
    .post('/user/register', usersController.register)
    .post('/user/login', usersController.login)
    .post('/user/refresh-token', usersController.renewToken)
    .get('/user/active/:token', usersController.active)
    .post('/user/resendactive', usersController.resendActivation)
    .get('/user/profile/:email', usersController.profile)

module.exports = router;