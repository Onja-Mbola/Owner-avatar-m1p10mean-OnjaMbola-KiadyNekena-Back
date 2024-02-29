const express = require('express');
const serviceController = require('../controllers/serviceController');


const router = express.Router();

// get all service route
router.get('/services',serviceController.getServices);
router.get('/services/:id',serviceController.getServiceById);


module.exports = router;
