const express = require('express');
const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');

const router = express.Router();

// Route pour l'inscription
router.post('/register', authValidation.registerValidation, authController.register);

// Route pour la connexion
router.post('/login', authValidation.loginValidation, authController.login);

module.exports = router;
