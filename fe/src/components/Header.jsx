// src/components/Header.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // 검색 아이콘 import

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50 w-full">
      {/* 왼쪽: 로고 */}
      <div
        className="text-2xl font-bold whitespace-nowrap cursor-pointer"
        onClick={() => navigate("/")}
      >
        🐾 도그뮤티
      </div>

      {/* 오른쪽: 검색창 + 버튼 묶음 */}
      <div className="flex items-center gap-4 min-w-0">
        {/* 검색창 */}
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="검색하고 싶은 해시태그가 있나요?"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query) {
                  navigate(`/search?tag=${encodeURIComponent(query)}`);
                }
              }
            }}
          />
        </div>

        {/* 버튼들 */}
        <button
          className="hover:underline text-sm whitespace-nowrap"
          onClick={() => navigate("/login")}
        >
          로그인
        </button>
        <button
          className="hover:underline text-sm whitespace-nowrap"
          onClick={() => navigate("/mypage")}
        >
          마이페이지
        </button>
        <button
          className="hover:underline text-sm whitespace-nowrap"
          onClick={() => navigate("/articles/new")}
        >
          글쓰기
        </button>
      </div>
    </header>
  );
};

export default Header;
