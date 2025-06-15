import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "./ArticleCard";

const ArticleList = () => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles");
        console.log("✅ 받아온 글 목록:", response.data);

        const sorted = [...response.data]
          .filter((a) => a.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const topThree = sorted.slice(0, 3);

        while (topThree.length < 3) {
          topThree.push({
            article_id: -1, // ✅ 더미 카드 구분용
            tag: "",
            location: "",
            user: "",
            title: "현재 표시할 글이 없습니다.",
            content: "가져올 수 있는 글이 없습니다.",
          });
        }

        setArticles(topThree);
      } catch (err) {
        console.error("❌ API 호출 실패:", err);
        setError(true);
      }
    };

    fetchArticles();
  }, []);

  const fallbackCards = [
    {
      article_id: -1,
      tag: "",
      location: "",
      user: "",
      title: "아직 백엔드 연결이 안됨.",
      content: "가져올 수 있는 글이 없습니다.",
    },
    {
      article_id: -2,
      tag: "",
      location: "",
      user: "",
      title: "아직 백엔드 연결이 안됨.",
      content: "가져올 수 있는 글이 없습니다.",
    },
    {
      article_id: -3,
      tag: "",
      location: "",
      user: "",
      title: "아직 백엔드 연결이 안됨.",
      content: "가져올 수 있는 글이 없습니다.",
    },
  ];

  const listToShow = error || !articles ? fallbackCards : articles;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {listToShow.map((article, i) => (
        <ArticleCard
          key={i}
          article_id={article.article_id}
          {...article}
        />
      ))}
    </div>
  );
};

export default ArticleList;
