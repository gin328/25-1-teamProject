import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import HashtagFilterSidebar from "../../components/HashtagFilterSidebar";
import ArticleListForSearch from "../../components/ArticleListForSearch";

const SearchResultPage = () => {
  const [regionTag, setRegionTag] = useState("#지역없음");
  const [otherTags, setOtherTags] = useState([]);
  const [articles, setArticles] = useState([]);

  // ✅ 로그인한 유저의 지역명 받아오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.village) {
            setRegionTag(`#${data.village}`);
            localStorage.setItem("village", data.village);
          }
        })
        .catch((err) => console.error("유저 지역 정보 조회 실패:", err));
    }
  }, []);

  // ✅ URL 태그 파라미터 처리 및 게시글 검색
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tagParams = searchParams.getAll("tag");

    const filteredTags = tagParams
      .map((t) => t.trim())
      .filter((t) => t && t !== "undefined" && t !== "없습니다");

    // ✅ 기타 해시태그: 지역 태그 제외
    const region = localStorage.getItem("village");
    const regionTagStr = region ? `#${region}` : null;

    const finalOtherTags = filteredTags
      .map((t) => `#${t}`)
      .filter((tag) => tag !== regionTagStr);

    setOtherTags(finalOtherTags);

    // ✅ 게시글 검색 API 요청
    if (filteredTags.length > 0) {
      const queryString = filteredTags
        .map((tag) => `tag=${encodeURIComponent(tag)}`)
        .join("&");

      fetch(`http://localhost:3000/api/articles/search?${queryString}`)
        .then((res) => res.json())
        .then((data) => setArticles(data))
        .catch((err) => console.error("게시글 검색 실패:", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex px-8 py-6 max-w-6xl mx-auto">
        {/* 왼쪽: 해시태그 필터 */}
        <div className="w-1/4 pr-6 sticky top-24 h-fit">
          <HashtagFilterSidebar regionTag={regionTag} otherTags={otherTags} />
        </div>

        {/* 오른쪽: 글 목록 */}
        <div className="w-3/4">
          {articles.length > 0 ? (
            <ArticleListForSearch articles={articles} />
          ) : (
            <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;

