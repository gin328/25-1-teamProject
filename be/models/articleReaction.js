const db = require('../db');

const ArticleReaction = {
  // 공감 등록 or 수정
  upsert: async (user_id, article_id, reaction) => {
    return await db.query(
      `INSERT INTO article_reaction (user_id, article_id, reaction)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), created_at = CURRENT_TIMESTAMP`,
      [user_id, article_id, reaction]
    );
  },

  // 공감 삭제
  delete: async (user_id, article_id) => {
    return await db.query(
      'DELETE FROM article_reaction WHERE user_id = ? AND article_id = ?',
      [user_id, article_id]
    );
  },

  // 공감 수 집계
  countByArticle: async (article_id) => {
    const [rows] = await db.query(
      `SELECT reaction, COUNT(*) AS count
       FROM article_reaction
       WHERE article_id = ?
       GROUP BY reaction`,
      [article_id]
    );
    return rows;
  },

  // 전체 반응 수 (숫자만)
  countByArticleId: async (article_id) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM article_reaction WHERE article_id = ?',
      [article_id]
    );
    return rows[0].count;
  },

  // ✅ 현재 유저가 누른 이모지 1개 조회
  findByUserAndArticle: async (user_id, article_id) => {
    const [rows] = await db.query(
      `SELECT reaction FROM article_reaction WHERE user_id = ? AND article_id = ?`,
      [user_id, article_id]
    );
    return rows[0]; // 없으면 undefined
  }
};

module.exports = ArticleReaction;
