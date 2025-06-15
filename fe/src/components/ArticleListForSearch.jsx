import React, { useEffect, useState } from "react";
import ArticleCardForSearch from "./ArticleCardForSearch";
import axios from "axios";

const ArticleListForSearch = ({ regionTag, otherTags }) => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams();
        params.append("tag", regionTag.replace("#", ""));
        otherTags.forEach(tag => params.append("tag", tag.replace("#", "")));

        const response = await axios.get(`/api/articles/search?${params.toString()}`);
        console.log("✅ 검색된 글 목록:", response.data);
        setArticles(response.data);
      } catch (err) {
        console.error("❌ 검색된 글 목록 가져오기 실패:", err);
        setError(true);
      }
    };

    fetchArticles();
  }, [regionTag, otherTags]);

  // 백엔드 연결 안 됐을 경우 예시용 더미 데이터
  const dummyArticles = [
    {
      id: 1,
      userNickname: "사용자1",
      hashtags: ["성북구", "산책", "푸들"],
      title: "글제목 1234",
      content: "산책 다녀온 이야기예요. 푸들과 함께 성북천을 따라 걸었어요!",
      reactionCount: 5,
      commentCount: 1,
    },
    {
      id: 2,
      userNickname: "사용자2",
      hashtags: ["성북구", "산책", "푸들"],
      title: "글제목 5678",
      content: "오늘은 조용한 공원을 골라 푸들과 시간을 보냈어요.",
      reactionCount: 2,
      commentCount: 0,
    },
    {
      id: 3,
      userNickname: "사용자3",
      hashtags: ["성북구", "산책", "푸들"],
      title: "글제목 9012",
      content: "푸들이 다른 강아지랑 잘 지냈던 산책기!",
      reactionCount: 7,
      commentCount: 2,
    },
  ];

  const listToRender = error ? dummyArticles : articles;

  return (
    <div className="flex flex-col gap-6">
      {listToRender.length > 0 ? (
        listToRender.map((article, index) => (
          <ArticleCardForSearch key={index} {...article} />
        ))
      ) : (
        <div className="text-sm text-gray-500">표시할 글이 없습니다.</div>
      )}
    </div>
  );
};

export default ArticleListForSearch;

