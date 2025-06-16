// models/commentReactionModel.js
const db = require('../db');

// 댓글별 이모지 공감 수 집계
exports.countByCommentId = async (comment_id) => {
  const [rows] = await db.query(
    `SELECT reaction, COUNT(*) as count
     FROM comment_reaction
     WHERE comment_id = ?
     GROUP BY reaction`,
    [comment_id]
  );

  const result = { "♥": 0, "☺": 0, "✌": 0, "☹": 0, "☠": 0 };
  rows.forEach(({ reaction, count }) => {
    result[reaction] = count;
  });
  return result;
};

// 특정 유저가 해당 댓글에 남긴 이모지
exports.findUserReaction = async (user_id, comment_id) => {
  const [rows] = await db.query(
    `SELECT reaction FROM comment_reaction
     WHERE user_id = ? AND comment_id = ? LIMIT 1`,
    [user_id, comment_id]
  );
  return rows[0]?.reaction || null;
};
