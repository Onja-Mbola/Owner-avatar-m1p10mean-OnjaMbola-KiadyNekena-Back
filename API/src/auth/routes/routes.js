const express = require('express');
const authController = require('../controllers/authController');
const employeController = require('../controllers/employeControler');
const globalController = require('../controllers/globalController');
const rendezVousController = require('../controllers/rendezVousController');
const authJwt = require('../middlewares/authJwt');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// Route pour l'inscription
router.post('/registerClient', authController.registerClient);

// Route pour la connexion
router.post('/loginClient',authController.loginClient);

// Route pour la validation du compte Client
//router.post('/validationClient',authController.validationClient);
router.get('/validationClient', authController.activateAccount); // Route pour l'activation du compte


// Route pour la liste des clients
router.get('/getClient', authAdmin, authController.getListeClient);


// Route pour avoir l'information Client
router.get("/getInfoClient", authJwt, authController.getInfoClient);


// Route pour avoir l'information Client by ID
router.get("/getInfoClientById", authAdmin, authController.getInfoClientById);


// Route pour modifier l'information Client
router.put("/modifInfoClient", authJwt, authController.modifGeneral);

// Route pour modifier l'information Client
router.put("/modifInfoClientById", authAdmin, authController.modifGeneralById);

// Route pour modifier photo
router.put('/uploadPhotoClient', authJwt, globalController.upload.single('file'), globalController.uploadImageClient);

//Route pour avoir image Client
router.get('/getPhotoClient/:id', authJwt, globalController.getImageClient);

// Route pour avoir la liste des employe
router.get("/getListeEmploye", authJwt, authController.getListeEmploye);

// Route pour avoir la liste des employe
router.get("/getListeEmploye", authJwt, authController.getListeEmploye);


// Route pour creez un rendez vous
router.post("/createRendezVous", authJwt, rendezVousController.registerRendezVous);

// Route pour avoir la liste des rendez vous par Id
router.get("/getRendezVous/:id", authAdmin, rendezVousController.getListeRendezVousById);

// Route pour avoir la liste des rendez vous
router.get("/getRendezVous", authJwt, rendezVousController.getListeRendezVous);






/*             Route pour Admin et Employe              */

// Route pour l'inscription
router.post('/registerEmploye', authAdmin, employeController.registerEmploye);

// Route pour la connexion
router.post('/loginEmploye',employeController.loginEmploye);

// Route pour la validation du compte Employe
router.get('/validationEmploye', employeController.activateAccount); // Route pour l'activation du compte


// Route pour la liste des Employe
router.get('/getEmploye', authAdmin,employeController.getListeEmploye);


// Route pour avoir l'information Employe
router.get("/getInfoEmploye", authAdmin, employeController.getInfoEmploye);


// Route pour avoir l'information Employe by Id
router.get("/getInfoEmployeId", authAdmin, employeController.getInfoEmployebyId);


// Route pour modifier l'information Employe
router.put("/modifInfoEmploye", authAdmin, employeController.modifGeneral);


// Route pour modifier l'image Employe
router.put('/uploadPhotoEmploye', authAdmin, globalController.upload.single('file'), globalController.uploadImage);

//Route pour avoir image Employe
router.get('/getPhoto/:id',authAdmin, globalController.getImage);



module.exports = router;
