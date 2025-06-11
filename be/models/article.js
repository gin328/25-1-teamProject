const db = require('../db');

const Article = {
  create: async ({ user_id, title, question, content, img, community_type }) => {
    const [result] = await db.query(
      `INSERT INTO article (user_id, title, question, content, img, community_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, question, content, img, community_type]
    );
    return result.insertId;
  },

  update: async (id, { title, content, img }) => {
    const [result] = await db.query(
      'UPDATE article SET title = ?, content = ?, img = ? WHERE article_id = ? AND question = FALSE',
      [title, content, img, id]
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM article WHERE article_id = ? AND question = FALSE',
      [id]
    );
    return result.affectedRows;
  },

    findAll: async () => {
    const [rows] = await db.query('SELECT * FROM article ORDER BY created_at DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM article WHERE article_id = ?', [id]);
    return rows[0];
  }
};

module.exports = Article;
