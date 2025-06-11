const db = require('../db');

const ArticleReaction = {
  upsert: async (user_id, article_id, reaction) => {
    return await db.query(
      `INSERT INTO article_reaction (user_id, article_id, reaction)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), created_at = CURRENT_TIMESTAMP`,
      [user_id, article_id, reaction]
    );
  },

  delete: async (user_id, article_id) => {
    return await db.query(
      'DELETE FROM article_reaction WHERE user_id = ? AND article_id = ?',
      [user_id, article_id]
    );
  },

  countByArticle: async (article_id) => {
    const [rows] = await db.query(
      `SELECT reaction, COUNT(*) AS count
       FROM article_reaction
       WHERE article_id = ?
       GROUP BY reaction`,
      [article_id]
    );
    return rows;
  }
};

module.exports = ArticleReaction;
