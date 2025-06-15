// src/pages/ArticleCreatePage/ArticleCreatePage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const ArticleCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");

  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // 해시태그 문자열 → 배열로 파싱
  const parseHashtags = (input) => {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const fetchRecommendedTags = async (userId, contentText) => {
    try {
      const res = await fetch("http://localhost:3000/api/articles/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content: contentText }),
      });
      const data = await res.json();
      const recommended = data.recommendedTags.map((tag) => tag.replace("#", ""));
      const current = parseHashtags(hashtags);
      const merged = Array.from(new Set([...current, ...recommended]));
      setHashtags(merged.join(", "));
    } catch (err) {
      console.error("❌ 해시태그 추천 실패:", err);
    }
  };

  // ⏱ 입력 멈춤 후 자동 해시태그 추천
  useEffect(() => {
    const delay = setTimeout(() => {
      if (userId && (title || content)) {
        fetchRecommendedTags(userId, `${title} ${content}`);
      }
    }, 800);
    return () => clearTimeout(delay);
  }, [title, content]);

  // ✅ 글 등록 API 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagArray = parseHashtags(hashtags);

    try {
      const res = await fetch("http://localhost:3000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title,
          content,
          tags: tagArray,
        }),
      });

      if (res.ok) {
        console.log("✅ 글 등록 성공");
        navigate(-1); // ✅ 이전 페이지로 돌아가기
      } else {
        const error = await res.json();
        console.error("❌ 글 등록 실패:", error);
        alert("글 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("❌ 네트워크 오류:", err);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">글 작성하기</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="제목"
            className="border rounded px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="내용"
            className="border rounded px-4 py-2 h-40 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="해시태그 (쉼표로 구분)"
            className="border rounded px-4 py-2"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleCreatePage;
