// src/pages/ArticleDetailPage/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import CommentList from "../../components/CommentList";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [reactions, setReactions] = useState({});
  const [commentCount, setCommentCount] = useState(0);

  // 게시글 정보
  const fetchArticle = async () => {
    try {
      const res = await axios.get(`/api/articles/${id}`);
      setArticle(res.data);
    } catch (err) {
      console.error("게시글 로딩 실패:", err);
    }
  };

  // 공감 이모지 수
  const fetchReactions = async () => {
    try {
      const res = await axios.get(`/api/articles/${id}/reactions`);
      setReactions(res.data);
    } catch (err) {
      console.error("공감 수 로딩 실패:", err);
    }
  };

  // 댓글 수
  const fetchCommentCount = async () => {
    try {
      const res = await axios.get(`/api/comments/count?article_id=${id}`);
      setCommentCount(res.data.count);
    } catch (err) {
      console.error("댓글 수 로딩 실패:", err);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchReactions();
    fetchCommentCount();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6">
        {article ? (
          <>
            {/* 게시글 정보 */}
            <div className="mb-6 border-b pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <span className="font-medium">{article.user_id}</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
              <div className="flex gap-2 mb-4">
                {article.tags?.map((tag, idx) => (
                  <span key={idx} className="text-sm text-blue-500">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-800 whitespace-pre-line">{article.content}</p>
            </div>

            {/* 공감 & 댓글 수 */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex gap-4 text-xl">
                {["♥", "☺", "✌", "☹", "☠"].map((emoji) => (
                  <span key={emoji}>
                    {emoji} {reactions[emoji] ?? 0}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600">댓글 {commentCount}</div>
            </div>

            {/* 댓글 리스트 (컴포넌트 분리) */}
            <CommentList article_id={id} />
          </>
        ) : (
          <p className="text-gray-500">해당 글을 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
