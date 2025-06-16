// controllers/commentReactionController.js
const db = require('../db');

exports.addOrUpdateReaction = async (req, res) => {
  const { user_id, comment_id, reaction } = req.body;

  try {
    await db.query(
      `INSERT INTO comment_reaction (user_id, comment_id, reaction)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reaction = ?`,
      [user_id, comment_id, reaction, reaction]
    );
    res.status(200).json({ message: "댓글 공감 등록 완료" });
  } catch (err) {
    console.error("댓글 공감 오류:", err);
    res.status(500).json({ error: "댓글 공감 실패" });
  }
};

exports.deleteReaction = async (req, res) => {
  const { user_id, comment_id } = req.body;

  try {
    const [result] = await db.query(
      `DELETE FROM comment_reaction WHERE user_id = ? AND comment_id = ?`,
      [user_id, comment_id]
    );

    res.status(200).json({ message: "공감 삭제 완료" });
  } catch (err) {
    console.error("공감 삭제 오류:", err);
    res.status(500).json({ error: "공감 삭제 실패" });
  }
};