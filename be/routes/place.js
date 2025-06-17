const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// GET /places/nearby?lat=...&lng=...&radius=...
router.get('/nearby', placeController.getNearbyPlaces);

module.exports = router; 