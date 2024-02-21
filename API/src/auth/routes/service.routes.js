const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

// get all service route
router.get('/',serviceController.getServices);
router.post('/create',serviceController.createService);


module.exports = router;
