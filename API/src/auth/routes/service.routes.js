const express = require('express');
const serviceController = require('../controllers/serviceController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// get all service route
router.get('/',authAdmin,serviceController.getServices);
router.get('/read/:id',authAdmin,serviceController.getServiceById);
router.post('/create',authAdmin,serviceController.createService);
router.put('/update/:id',authAdmin,serviceController.updateService);
router.delete('/delete/:id',authAdmin,serviceController.deleteService);


module.exports = router;
