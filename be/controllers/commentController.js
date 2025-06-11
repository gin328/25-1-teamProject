const commentModel = require('../models/commentModel');

// 댓글 등록 처리 함수
exports.createComment = async (req, res) => {
  try {
    const { user_id, article_id, content, parent_comment_id } = req.body;

    // 필수값 확인
    if (!user_id || !article_id || !content) {
      return res.status(400).json({ message: '필수 항목이 빠졌습니다.' });
    }

    // DB에 댓글 저장
    const newCommentId = await commentModel.createComment(
      user_id,
      article_id,
      content,
      parent_comment_id
    );

    // 성공 응답
    res.status(201).json({ comment_id: newCommentId });
  } catch (err) {
    console.error('댓글 등록 오류:', err);
    res.status(500).json({ message: '댓글 등록 중 오류가 발생했습니다.' });
  }
};
