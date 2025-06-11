const articleReaction = require('../models/articleReaction');

const reactionService = {
  upsertReaction: async (user_id, article_id, reaction) => {
    await articleReaction.upsert(user_id, article_id, reaction);
  },

  deleteReaction: async (user_id, article_id) => {
    await articleReaction.delete(user_id, article_id);
  },

  countReactions: async (article_id) => {
    const rows = await articleReaction.countByArticle(article_id);
    const result = {};
    for (const row of rows) {
      result[row.reaction] = row.count;
    }
    return result;
  }
};

module.exports = reactionService;
