const commentModel = require('../models/commentModel');
const reactionModel = require('../models/commentReactionModel');

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

    res.status(201).json({ comment_id: newCommentId });
  } catch (err) {
    console.error('댓글 등록 오류:', err);
    res.status(500).json({ message: '댓글 등록 중 오류가 발생했습니다.' });
  }
};

// 댓글 수 반환 처리 함수
exports.getCommentCount = async (req, res) => {
  try {
    const article_id = parseInt(req.query.article_id, 10);
    if (!article_id) {
      return res.status(400).json({ message: 'article_id가 필요합니다.' });
    }

    const count = await commentModel.countByArticleId(article_id);
    res.status(200).json({ count });
  } catch (err) {
    console.error('댓글 수 조회 오류:', err);
    res.status(500).json({ message: '댓글 수 조회 중 오류가 발생했습니다.' });
  }
};

exports.getCommentsByArticle = async (req, res) => {
  try {
    const article_id = parseInt(req.query.article_id, 10);
    const user_id = parseInt(req.query.user_id, 10);

    if (!article_id) {
      return res.status(400).json({ message: 'article_id가 필요합니다.' });
    }

    const comments = await commentModel.findByArticleId(article_id);

    // 댓글별로 공감 수, 유저 공감 붙이기
    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const reactions = await reactionModel.countByCommentId(comment.comment_id);
        const userReaction = await reactionModel.findUserReaction(user_id, comment.comment_id);

        return {
          ...comment,
          reactions,
          user_reaction: userReaction,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error('댓글 목록 조회 오류:', err);
    res.status(500).json({ message: '댓글 목록 조회 실패' });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE comment SET content = ? WHERE comment_id = ? AND user_id = ?`,
      [content, id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: '수정 권한 없음 또는 존재하지 않는 댓글' });
    }

    res.status(200).json({ message: '댓글 수정 완료' });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ error: '댓글 수정 실패' });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const [result] = await db.query(
      `DELETE FROM comment WHERE comment_id = ? AND user_id = ?`,
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: '삭제 권한 없음 또는 존재하지 않는 댓글' });
    }

    res.status(200).json({ message: '댓글 삭제 완료' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
};
