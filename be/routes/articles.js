const express = require('express');
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/articleController');
const tagService = require('../services/tagService');
const reactionRouter = require('./articleReact');
const router = express.Router();

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

// /search 라우트를 가장 위로 이동
router.get('/search', articleController.searchArticlesByTags);

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

// ✅ 삭제 요청 로그 추가
router.delete('/:id', (req, res, next) => {
  console.log('🧨 DELETE 요청 수신됨, 게시글 ID:', req.params.id);
  next();
}, articleController.deleteArticle);

router.get('/tag/:tag', articleController.getArticlesByTag);
router.get('/', articleController.getArticlesByUser);
router.get('/:id', articleController.getArticleById);

router.use('/:articleId/reactions', reactionRouter);

module.exports = router;
