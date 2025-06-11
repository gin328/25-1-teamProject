const express = require('express');
const router = express.Router({ mergeParams: true });
const reactionController = require('../controllers/articleReactionController');

router.post('/', reactionController.reactToArticle);
router.delete('/', reactionController.removeReaction);
router.get('/', reactionController.getReactions);

module.exports = router;
