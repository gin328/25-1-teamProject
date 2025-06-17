import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState({});
  const [currentUserReaction, setCurrentUserReaction] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`/api/articles/${id}`);
      setArticle(res.data);
    } catch (err) {
      console.error("게시글 로딩 실패:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?article_id=${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 로딩 실패:", err);
    }
  };

  const fetchReactions = async () => {
    try {
      const res = await axios.get(`/api/articles/${id}/reactions`, {
        params: { user_id: userId },
      });
      setReactions(res.data.counts);
      setCurrentUserReaction(res.data.userReaction);
    } catch (err) {
      console.error("공감 수 로딩 실패:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post("/api/comments", {
        user_id: userId,
        article_id: id,
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  const handleReactionClick = async (emoji) => {
    try {
      const newReaction = currentUserReaction === emoji ? null : emoji;
      if (!userId) return;

      await axios.post(`/api/articles/${id}/reactions`, {
        user_id: userId,
        reaction: newReaction,
      });

      setCurrentUserReaction(newReaction);
      fetchReactions();
    } catch (err) {
      console.error("공감 등록 실패:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/articles/${id}`);
      alert("글이 삭제되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("글 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/articles/edit/${id}`);
  };

  useEffect(() => {
    fetchArticle();
    fetchComments();
    fetchReactions();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="p-6 max-w-2xl mx-auto">
        {article && (
          <div>
            <div className="text-xl font-bold mb-2">{article.title}</div>
            <div className="text-gray-600 mb-2">{article.hashtags?.join(" ")}</div>
            <div className="mb-4">{article.content}</div>

            {/* ✨ 수정/삭제 버튼 (작성자만 노출) */}
            {article.user_id === userId && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-yellow-400 rounded text-white"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 rounded text-white"
                >
                  삭제
                </button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {["♥", "☺", "✌", "☹", "☠"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  disabled={!userId}
                  className={`text-xl px-2 py-1 rounded ${
                    currentUserReaction === emoji
                      ? "text-black font-bold"
                      : "text-gray-400"
                  } ${!userId ? "cursor-not-allowed opacity-50" : "hover:text-black"}`}
                >
                  {emoji} {reactions[emoji] || 0}
                </button>
              ))}
            </div>

            {/* 댓글 영역 */}
            <div className="mt-8">
              <div className="font-semibold mb-2">댓글 {comments.length}개</div>
              {comments.map((comment) => (
                <div key={comment.comment_id} className="border-b py-2">
                  <div className="text-sm text-gray-600">{comment.nickname}</div>
                  <div>{comment.content}</div>
                </div>
              ))}
              <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  작성
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
