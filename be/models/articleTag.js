const db = require('../db');

const ArticleTag = {
  addArticleTag: async (article_id, tagId) => {
    try {
      await db.query(
        'INSERT IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)',
        [article_id, tagId]
      );
    } catch (err) {
      throw new Error(`addArticleTag 실패: ${err.message}`);
    }
  },

  getTagsByArticleId: async (article_id) => {
    try {
      const [rows] = await db.query(
        'SELECT t.* FROM tag t JOIN article_tag at ON t.tag_id = at.tag_id WHERE at.article_id = ?',
        [article_id]
      );
      return rows;
    } catch (err) {
      throw new Error(`getTagsByArticleId 실패: ${err.message}`);
    }
  }
};

module.exports = ArticleTag;
