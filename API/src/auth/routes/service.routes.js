const express = require('express');
const serviceController = require('../controllers/serviceController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// get all service route
router.get('/',authAdmin,serviceController.getServices);
router.post('/create',authAdmin,serviceController.createService);


module.exports = router;
