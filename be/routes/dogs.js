const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');

router.get('/', dogController.getDogsByUser);
router.post('/', dogController.createDog);

module.exports = router;

