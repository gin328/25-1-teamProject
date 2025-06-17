const db = require('../db');
const Tag = require('../models/tag');

const getTagsByArticleId = async (article_id) => {
  const [rows] = await db.query(
    `SELECT t.tag_id, t.name AS tag_name
     FROM article_tag at
     JOIN tag t ON at.tag_id = t.tag_id
     WHERE at.article_id = ?`,
    [article_id]
  );
  return rows;
};

const tagService = {
  getTagsByArticleId,

  saveTags: async (articleId, tags) => {
    // 해시(#)가 붙어 있으면 제거 후 저장
    const cleaned = tags.map(t => t.replace(/^#/, ''));
    await Tag.saveTags(articleId, cleaned);
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
      // 1. 대표 반려견 태그
      const [rows] = await db.query(
        'SELECT dog_type FROM dogs WHERE user_id = ? AND is_representative = TRUE',
        [user_id]
      );
      const dogType = rows[0]?.dog_type;
      if (dogType) tags.add(dogType); // 해시 없이 추가

      // 2. 사용자 지역 태그
      const [userRows] = await db.query(
        'SELECT village FROM users WHERE user_id = ?',
        [user_id]
      );
      const village = userRows[0]?.village;
      if (village) tags.add(village); // 해시 없이 추가

      // 3. 키워드 기반 태그
      const keywords = ['산책', '사료', '간식', '병원', '수술', '목욕'];
      const keywordToTag = {
        '산책': ['산책'],
        '사료': ['사료'],
        '간식': ['간식'],
        '병원': ['동물병원'],
        '수술': ['수술'],
        '목욕': ['목욕']
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

  getArticleIdsByTag: async (tagName) => {
    const cleanTag = tagName.startsWith('#') ? tagName.slice(1) : tagName;

    const [rows] = await db.query(
      `SELECT article_id FROM article_tag at
       JOIN tag t ON at.tag_id = t.tag_id
       WHERE t.name = ?`,
      [cleanTag]
    );
    return rows.map(row => row.article_id);
  },

  // ✅ AND 조건 기반 다중 태그 포함 게시글 조회
  getArticleIdsByTags: async (tags) => {
    const cleanTags = tags.map(tag => tag.replace(/^#/, ''));

    const [rows] = await db.query(
      `
      SELECT at.article_id
      FROM article_tag at
      JOIN tag t ON at.tag_id = t.tag_id
      WHERE t.name IN (?)
      GROUP BY at.article_id
      HAVING COUNT(DISTINCT t.name) = ?
      `,
      [cleanTags, cleanTags.length]
    );

    return rows.map(row => row.article_id);
  }
};

module.exports = tagService;
