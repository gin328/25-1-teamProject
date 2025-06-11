const reactionService = require('../services/articleReactionService');

const articleReactionController ={
  reactToArticle : async (req, res) => {
    console.log('요청 body:', req.body);
    const user_id = req.body.user_id;
    const reaction = req.body.reaction;
    const article_id = parseInt(req.params.articleId, 10);

    if (!user_id || !reaction || !article_id) {
      return res.status(400).json({ error: 'user_id, article_id, reaction 필요' });
    }

    try {
      await reactionService.upsertReaction(user_id, article_id, reaction);
      res.status(200).json({ message: '반응 완료' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '반응 실패' });
    }
  },

  removeReaction : async (req, res) => {
    const user_id = req.body.user_id;
    const article_id = parseInt(req.params.articleId, 10);

    if (!user_id || !article_id) {
      return res.status(400).json({ error: 'user_id, article_id 필요' });
    }

    try {
      await reactionService.deleteReaction(user_id, article_id);
      res.status(200).json({ message: '반응 취소' });
    } catch (err) {
     console.error(err);
     res.status(500).json({ error: '반응 취소 실패' });
    }
  },

  getReactions : async (req, res) => {
   const article_id = parseInt(req.params.articleId, 10);

   if (!article_id) {
     return res.status(400).json({ error: 'article_id 필요' });
   }

   try {
     const reactions = await reactionService.countReactions(article_id);
     res.status(200).json(reactions);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: '반응 조회 실패' });
   }
 }
};

module.exports = articleReactionController;