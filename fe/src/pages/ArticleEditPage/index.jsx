// src/pages/ArticleEditPage/index.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const ArticleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 글 정보 불러오기
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error("글 불러오기 실패:", err);
        alert("글 정보를 불러오지 못했습니다.");
      }
    };

    fetchArticle();
  }, [id]);

  // 수정 제출
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/articles/${id}`, {
        title,
        content,
      });
      alert("수정 완료!");
      navigate(`/articles/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold mb-4">게시글 수정</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="border px-3 py-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows="10"
          className="border px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default ArticleEditPage;
