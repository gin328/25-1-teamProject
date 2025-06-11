const express = require('express');
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/articleController');
const tagService = require('../services/tagService');
const router = express.Router();

const reactionRouter = require('./articleReact');
router.use('/:articleId/reactions', reactionRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const uploadFile = multer({ storage });

router.post('/', uploadFile.array('img', 30), articleController.createArticle);
router.post('/recommend', async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const recommendedTags = await tagService.getTagRecommend(user_id, content);
    res.json({ recommendedTags });
  } catch (err) {
    console.error('조회 중 오류:', err);
    res.status(500).json({ error: '추천 태그 조회 실패' });
  }
});
router.put('/:id', uploadFile.array('img', 30), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.get('/:id', articleController.getArticleById);
router.get('/', articleController.getAllArticles);

module.exports = router;
