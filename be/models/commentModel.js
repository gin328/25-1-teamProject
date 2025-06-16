const db = require('../db'); // DB 연결 모듈 불러오기

// 댓글 저장 함수
exports.createComment = async (user_id, article_id, content, parent_comment_id = null) => {
  const [result] = await db.query(
    `INSERT INTO comment (user_id, article_id, content, parent_comment_id, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [user_id, article_id, content, parent_comment_id]
  );

  return result.insertId; // 저장된 댓글의 ID 반환
};

exports.countByArticleId = async (article_id) => {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS count FROM comment WHERE article_id = ?',
    [article_id]
  );
  return rows[0].count;
};

exports.findByArticleId = async (article_id) => {
  const [rows] = await db.query(
    'SELECT * FROM comment WHERE article_id = ? ORDER BY created_at ASC',
    [article_id]
  );
  return rows;
};

