const Article = require('../models/article');
const tagService = require('../services/tagService');
const User = require('../models/userModel');
const Reaction = require('../models/articleReaction');
const Comment = require('../models/commentModel');

const articleController = {
  createArticle: async (req, res) => {
    try {
      const { user_id, title, question, content } = req.body;
      const files = req.files;
      const imgList = files ? files.map(file => file.filename) : [];

      const article_id = await Article.create({
        user_id,
        title,
        question,
        content,
        img: imgList.length > 0 ? JSON.stringify(imgList) : null,
      });

      const userInfo = await User.findById(user_id);
      const regionTag = userInfo?.village ? [`#${userInfo.village}`] : [];
      const hashtags = req.body.hashtags ? JSON.parse(req.body.hashtags) : [];
      const recommendedTags = await tagService.getTagRecommend(user_id, content);
      const mergedTags = Array.from(new Set([...regionTag, ...hashtags, ...recommendedTags]));
      await tagService.saveTags(article_id, mergedTags);

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
          return res.status(400).json({ error: 'existingImgs는 JSON 배열이어야 합니다.' });
        }
      }

      const newImgs = req.files ? req.files.map(file => file.filename) : [];
      const finalImgList = [...existingImgs, ...newImgs];

      const affectedRows = await Article.update(id, {
        title,
        content,
        img: finalImgList.length > 0 ? JSON.stringify(finalImgList) : null,
      });

      if (affectedRows === 0)
        return res.status(404).json({ error: '게시글이 존재하지 않거나 수정할 수 없습니다.' });

      if (req.body.hashtags) {
        const hashtags = JSON.parse(req.body.hashtags);
        await tagService.removeTagsByArticleId(id);
        await tagService.saveTags(id, hashtags);
      }

      res.json({ message: '게시글이 수정되었습니다.' });
    } catch (err) {
      console.error('수정 중 오류 발생:', err);
      res.status(500).json({ error: '수정에 실패했습니다.' });
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      await tagService.removeTagsByArticleId(id);
      const affectedRows = await Article.remove(id);

      if (affectedRows === 0)
        return res.status(404).json({ error: '게시글이 존재하지 않거나 삭제할 수 없습니다.' });

      res.json({ message: '게시글이 삭제되었습니다' });
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
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
      const commentCount = await Comment.countByArticleId(id);

      res.json({ ...article, tags, commentCount });
    } catch (err) {
      console.error('조회 중 오류 발생:', err);
      res.status(500).json({ error: '조회에 실패했습니다.' });
    }
  },

  getArticlesByTag: async (req, res) => {
    try {
      const tag = req.params.tag;
      const ids = await tagService.getArticleIdsByTag(`#${tag}`);
      const articles = await Article.findByIds(ids);
      res.json(articles);
    } catch (err) {
      console.error('태그별 게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: '태그 게시글 조회 실패' });
    }
  },

  getArticlesByUser: async (req, res) => {
    try {
      const userId = req.query.user_id;
      if (!userId) return res.status(400).json({ error: 'user_id가 필요합니다.' });

      const articles = await Article.findByUserId(userId);

      const enrichedArticles = await Promise.all(
        articles.map(async (article) => {
          const hashtags = await tagService.getTagsByArticleId(article.article_id);
          const reactionCount = await Reaction.countByArticleId(article.article_id);
          const commentCount = await Comment.countByArticleId(article.article_id);
          return {
            article_id: article.article_id,
            title: article.title,
            content: article.content,
            tags: hashtags,
            likes: reactionCount,
            comments: commentCount,
          };
        })
      );

      res.json(enrichedArticles);
    } catch (err) {
      console.error("사용자 게시글 조회 실패:", err);
      res.status(500).json({ error: '사용자 게시글 조회 실패' });
    }
  },

  // ✅ AND 조건 다중 태그 검색
  searchArticlesByTags: async (req, res) => {
    try {
      let tags = req.query.tag;
      if (!tags || tags.length === 0)
        return res.status(400).json({ error: '태그를 하나 이상 입력하세요.' });

      if (!Array.isArray(tags)) tags = [tags];

      const articleIds = await tagService.getArticleIdsByTags(tags);
      const articles = await Article.findByIds(articleIds);

      const enrichedArticles = await Promise.all(
        articles.map(async (article) => {
          const hashtags = await tagService.getTagsByArticleId(article.article_id);
          const user = await User.findById(article.user_id);
          const reactionCount = await Reaction.countByArticleId(article.article_id);
          const commentCount = await Comment.countByArticleId(article.article_id);

          return {
            article_id: article.article_id,
            userNickname: user.nickname,
            hashtags,
            title: article.title,
            content: article.content,
            reactionCount,
            commentCount,
          };
        })
      );

      res.json(enrichedArticles);
    } catch (err) {
      console.error('다중 태그 게시글 조회 중 오류:', err);
      res.status(500).json({ error: '게시글 검색 실패' });
    }
  }
};

module.exports = articleController;
