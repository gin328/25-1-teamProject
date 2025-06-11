const Article = require('../models/article');
const tagService = require('../services/tagService');

const articleController = {
  createArticle: async (req, res) => {
    try {
      const { user_id, title, question, content, community_type } = req.body;
      const files = req.files;
      const imgList = files ? files.map(file => file.filename) : [];

       const article_id = await Article.create({
        user_id,
        title,
        question,
        content,
        img: imgList.length > 0 ? JSON.stringify(imgList) : null,
        community_type
      });
      console.log('hashtags:', req.body.hashtags);

      if (req.body.hashtags) {
        const hashtags = JSON.parse(req.body.hashtags);
  
        const recommendedTags = await tagService.getTagRecommend(user_id, content);
        const mergedTags = Array.from(new Set([...hashtags, ...recommendedTags]));

        await tagService.saveTags(article_id, mergedTags);
      }


      res.status(201).json({ article_id });
    } catch (err) {
      console.error('작성 중 오류 발생:', err);
      res.status(500).json({ error: '작성에 실패했습니다.' });
    }
  },

  updateArticle: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, content } = req.body;
      let existingImgs = [];
      if (req.body.existingImgs) {
        try {
          existingImgs = JSON.parse(req.body.existingImgs);
        } catch (e) {
          return res.status(400).json({ error: 'existingImgs는 JSON 배열' });
        }
      }
      const newImgs = req.files ? req.files.map(file => file.filename) : [];
      const finalImgList = [...existingImgs, ...newImgs];

      const affectedRows = await Article.update(id, {
        title,
        content,
        img: finalImgList.length > 0 ? JSON.stringify(finalImgList) : null
      });
      if (affectedRows === 0) return res.status(404).json({ error: '게시글이 존재하지 않거나 수정할 수 없습니다.' });

      if (req.body.hashtags) {
        const hashtags = JSON.parse(req.body.hashtags);
        await tagService.removeTagsByArticleId(id);
        await tagService.saveTags(id, hashtags);
     }

      res.json({ message: '게시글이 수정되었습니다.' });
    } catch (err) {
      console.error('수정 중 오류 발생', err);
      res.status(500).json({ error: '수정에 실패했습니다.' });
    }
  },

  deleteArticle: async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    await tagService.removeTagsByArticleId(id);

    const affectedRows = await Article.remove(id);
    if (affectedRows === 0) return res.status(404).json({ error: '게시글이 존재하지 않거나 삭제할 수 없습니다.' });

    res.json({ message: '게시글이 삭제되었습니다' });
  } catch (err) {
    console.error('삭제 중 오류 발생', err);
    res.status(500).json({ error: '삭제에 실패했습니다.' });
  }
},


  getAllArticles: async (req, res) => {
    try {
      const articles = await Article.findAll();
      res.json(articles);
    } catch (err) {
      console.error('조회 중 오류 발생:', err);
      res.status(500).json({ error: '조회에 실패했습니다.' });
    }
  },

  getArticleById: async (req, res) => {
    try {
      const id = req.params.id;
      const article = await Article.findById(id);
      if (!article) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      const tags = await tagService.getTagsByArticleId(id);
      res.json({
        ...article,
        tags
    });
    } catch (err) {
      console.error('조회 중 오류 발생:', err);
      res.status(500).json({ error: '조회에 실패했습니다.' });
    }
  }

};

module.exports = articleController;
