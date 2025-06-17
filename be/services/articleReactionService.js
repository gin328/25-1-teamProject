const articleReaction = require('../models/articleReaction');

const reactionService = {
  // 공감 등록 또는 수정
  upsertReaction: async (user_id, article_id, reaction) => {
    await articleReaction.upsert(user_id, article_id, reaction);
  },

  // 공감 삭제
  deleteReaction: async (user_id, article_id) => {
    await articleReaction.delete(user_id, article_id);
  },

  // 공감 수 조회 (이모지별 카운트)
  countReactions: async (article_id) => {
    const rows = await articleReaction.countByArticle(article_id);
    const result = {};
    for (const row of rows) {
      result[row.reaction] = row.count;
    }
    return result;
  },

  // ✅ 현재 유저가 누른 공감 이모지 조회
  getUserReaction: async (user_id, article_id) => {
    const row = await articleReaction.findByUserAndArticle(user_id, article_id);
    return row?.reaction || null;
  }
};

module.exports = reactionService;
