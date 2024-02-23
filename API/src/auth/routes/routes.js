const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route pour l'inscription
router.post('/registerClient', authController.registerClient);

// Route pour la connexion
router.post('/loginClient',authController.loginClient);

// Route pour la validation du compte Client
//router.post('/validationClient',authController.validationClient);
router.get('/validationClient', authController.activateAccount); // Route pour l'activation du compte


// Route pour la liste des clients
router.get('/getClient',authController.getListeClient);


module.exports = router;
