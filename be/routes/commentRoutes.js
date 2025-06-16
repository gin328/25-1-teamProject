const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.post('/', commentController.createComment);
router.get('/count', commentController.getCommentCount);
router.get('/', commentController.getCommentsByArticle);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
