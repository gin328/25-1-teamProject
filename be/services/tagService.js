const db = require('../db');
const articleTag = require('../models/articleTag');
const Tag = require('../models/tag');

const tagService = {
  getTagsByArticleId: async (article_id) => {
    return await articleTag.getTagsByArticleId(article_id);
  },
  
  saveTags : async (articleId, tags) => {
    await Tag.saveTags(articleId, tags);
  },

  removeTagsByArticleId: async (article_id) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        'SELECT tag_id FROM article_tag WHERE article_id = ?',
        [article_id]
      );

      for (const row of rows) {
        await conn.query(
          'UPDATE tag SET usage_count = GREATEST(usage_count - 1, 0) WHERE tag_id = ?',
          [row.tag_id]
        );
      }

      await conn.query('DELETE FROM article_tag WHERE article_id = ?', [article_id]);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  getTagRecommend: async (user_id, content) => {
    const tags = new Set();

    try {
      const [rows] = await db.query(
        'SELECT dog_type FROM dogs WHERE user_id = ? AND is_representative = TRUE',
        [user_id]
      );
      const dogType = rows[0]?.dog_type;
      if (dogType) tags.add(`#${dogType}`);

      const keywords = ['산책', '사료', '간식', '병원', '수술', '목욕'];
      const keywordToTag = {
        '산책': ['#산책'],
        '사료': ['#사료'],
        '간식': ['#간식'],
        '병원': ['#동물병원'],
        '수술': ['#수술'],
        '목욕': ['#목욕']
      };

      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          keywordToTag[keyword].forEach(tag => tags.add(tag));
        }
      }

      return Array.from(tags);
    } catch (err) {
      throw err;
    }
  },

  // ✅ 이 부분이 마지막에 정확히 들어가야 함!
  getArticleIdsByTag: async (tagName) => {
    const [rows] = await db.query(
      `SELECT article_id FROM article_tag at
       JOIN tag t ON at.tag_id = t.tag_id
       WHERE t.name = ?`,
      [tagName]
    );
    return rows.map(row => row.article_id);
  }
};

module.exports = tagService;
