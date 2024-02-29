const express = require('express');
const serviceController = require('../controllers/serviceController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// get all service route
router.get('/',authAdmin,serviceController.getServices);
router.get('/read/:id',authAdmin,serviceController.getServiceById);
router.post('/create',authAdmin,serviceController.upload.single('file'),serviceController.createService);
router.put('/update/:id',authAdmin,serviceController.updateService);
router.delete('/delete/:id',authAdmin,serviceController.deleteService);
router.get('/getImageService/:id',authAdmin,serviceController.getImageService);


module.exports = router;
