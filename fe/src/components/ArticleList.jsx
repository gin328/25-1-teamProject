import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "./ArticleCard";

const ArticleList = () => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        console.warn("⚠️ 로그인 정보 없음: user_id가 없습니다.");
        setError(true);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/articles?user_id=${userId}`);
        console.log("✅ 받아온 글 목록:", response.data);

        const sorted = [...response.data]; // 정렬은 필요 시 추가
        const topThree = sorted.slice(0, 3);

        while (topThree.length < 3) {
          topThree.push({
            article_id: -1,
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
      title: "가져올 수 있는 글이 없습니다.",
      content: "가져올 수 있는 글이 없습니다.",
    },
    {
      article_id: -2,
      tag: "",
      location: "",
      user: "",
      title: "가져올 수 있는 글이 없습니다.",
      content: "가져올 수 있는 글이 없습니다.",
    },
    {
      article_id: -3,
      tag: "",
      location: "",
      user: "",
      title: "가져올 수 있는 글이 없습니다.",
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
