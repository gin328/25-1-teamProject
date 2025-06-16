const express = require('express');
const router = express.Router();
const commentReactionController = require('../controllers/commentReactionController');


router.post('/', commentReactionController.addOrUpdateReaction);
router.delete('/', commentReactionController.deleteReaction);

module.exports = router;
