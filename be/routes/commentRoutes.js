const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 작성 API → POST /api/comments
router.post('/', commentController.createComment);

module.exports = router;
