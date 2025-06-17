const db = require('../db');

const Article = {
  create: async ({ user_id, title, question, content, img }) => {
    const [result] = await db.query(
      `INSERT INTO article (user_id, title, question, content, img)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, question, content, img]
    );
    return result.insertId;
  },

  update: async (id, { title, content, img }) => {
    const [result] = await db.query(
      'UPDATE article SET title = ?, content = ?, img = ? WHERE article_id = ?',
      [title, content, img, id]
    );
    return result.affectedRows;
  },

  // ✅ 수정됨: question 조건 제거
  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM article WHERE article_id = ?',
      [id]
    );
    return result.affectedRows;
  },

  findAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM article ORDER BY created_at DESC');
      console.log('조회된 게시글:', rows);
      return rows;
    } catch (err) {
      console.error('findAll 오류 발생:', err);
      throw err;
    }
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT a.*, u.nickname 
       FROM article a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE a.article_id = ?`,
      [id]
    );
    return rows[0];
  },

  findByIds: async (ids) => {
    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT * FROM article WHERE article_id IN (${placeholders}) ORDER BY created_at DESC`,
      ids
    );
    return rows;
  },

  // ✅ 사용자별 게시글 조회
  findByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT * FROM article WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },
};

module.exports = Article;
