// src/components/CommentList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const emojis = ["♥", "☺", "✌", "☹", "☠"];

const CommentList = ({ article_id }) => {
  const currentUserId = 1; // TODO: 로그인 연동 시 교체

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?article_id=${article_id}&user_id=${currentUserId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 로딩 실패:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [article_id]);

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post("/api/comments", {
        user_id: currentUserId,
        article_id,
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        data: { user_id: currentUserId },
      });
      fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  // 댓글 수정 시작
  const handleEdit = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditContent(comment.content);
  };

  // 댓글 수정 완료
  const handleUpdate = async () => {
    try {
      await axios.put(`/api/comments/${editingCommentId}`, {
        user_id: currentUserId,
        content: editContent,
      });
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  // 공감 등록/취소
  const handleReact = async (comment, emoji) => {
    const alreadyReacted = comment.user_reaction === emoji;

    try {
      if (alreadyReacted) {
        // 취소
        await axios.delete("/api/comment-reactions", {
          data: {
            user_id: currentUserId,
            comment_id: comment.comment_id,
          },
        });
      } else {
        // 등록 또는 변경
        await axios.post("/api/comment-reactions", {
          user_id: currentUserId,
          comment_id: comment.comment_id,
          reaction: emoji,
        });
      }
      fetchComments(); // 공감 수 및 상태 갱신
    } catch (err) {
      console.error("공감 처리 실패:", err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">댓글</h2>

      {/* 댓글 작성 */}
      <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          작성
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{comment.nickname || "사용자"}</span>
              {comment.user_id === currentUserId && (
                <div className="flex gap-2 text-sm text-gray-500">
                  <button onClick={() => handleEdit(comment)}>✎ 수정</button>
                  <button onClick={() => handleDelete(comment.comment_id)}>🗑 삭제</button>
                </div>
              )}
            </div>

            {editingCommentId === comment.comment_id ? (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="border rounded p-2"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="text-blue-500">저장</button>
                  <button onClick={() => setEditingCommentId(null)} className="text-gray-500">취소</button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1">{comment.content}</p>
                <div className="flex gap-2 mt-2 items-center">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(comment, emoji)}
                      className={`text-lg px-1 rounded 
                        ${comment.user_reaction === emoji ? "bg-yellow-200 font-bold" : "hover:bg-gray-100"}
                      `}
                    >
                      {emoji} {comment.reactions?.[emoji] ?? 0}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
