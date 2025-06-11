const db = require('../db');

const Tag = {
  saveTags: async (article_id, tags) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    console.log('article_id:', article_id, 'tags:', tags);

    for (const tag of tags) {
      if (!tag || typeof tag !== 'string') {
        console.warn('잘못된 태그:', tag);
        continue;
      }

      const [existing] = await conn.query('SELECT tag_id FROM tag WHERE name = ?', [tag]);
      let tagId;

      if (existing.length > 0) {
        tagId = existing[0].tag_id;
        console.log(`기존 태그 사용: ${tag} → ID ${tagId}`);
      } else {
        const [insertResult] = await conn.query('INSERT INTO tag (name) VALUES (?)', [tag]);
        tagId = insertResult.insertId;
        console.log(`새 태그 생성: ${tag} → ID ${tagId}`);
      }

      await conn.query(
        'INSERT IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)',
        [article_id, tagId]
      );
      await conn.query(
        'UPDATE tag SET usage_count = usage_count + 1 WHERE tag_id = ?',
        [tagId]
      );
      console.log(`article_tag 연결 완료: ${article_id}, ${tagId}`);
    }

    await conn.commit();
    console.log('태그 저장 완료');
  } catch (err) {
    await conn.rollback();
    console.error('태그 저장 중 오류:', err);
    throw err;
  } finally {
    conn.release();
  }
},
};

module.exports = Tag;
