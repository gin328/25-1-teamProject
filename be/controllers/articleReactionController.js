const reactionService = require('../services/articleReactionService');

const articleReactionController = {
  // 공감 등록 or 변경
  reactToArticle: async (req, res) => {
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

  // 공감 삭제
  removeReaction: async (req, res) => {
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

  // 공감 수 + 현재 유저의 반응 조회
  getReactions: async (req, res) => {
  const article_id = parseInt(req.params.articleId, 10);

  // ✅ user_id가 없거나 이상한 값일 경우 null 처리
  const user_id_raw = req.query.user_id;
  const user_id =
    user_id_raw && !isNaN(parseInt(user_id_raw, 10))
      ? parseInt(user_id_raw, 10)
      : null;

  if (!article_id) {
    return res.status(400).json({ error: 'article_id 필요' });
  }

  try {
    const counts = await reactionService.countReactions(article_id);
    const userReaction = user_id
      ? await reactionService.getUserReaction(user_id, article_id)
      : null;

    const formattedCounts = {};
    for (const emoji in counts) {
      formattedCounts[emoji] = counts[emoji];
    }

    res.status(200).json({
      counts: formattedCounts,
      userReaction: userReaction,
    });
  } catch (err) {
    console.error("❌ getReactions 실패:", err);
    res.status(500).json({ error: '반응 조회 실패' });
  }
},
};

module.exports = articleReactionController;
