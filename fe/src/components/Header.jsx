import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("village"); // ✅ 수정됨
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSearch = () => {
    const query = searchInput.trim();
    const village = localStorage.getItem("village");

    const tags = [
      village && village !== "없습니다" ? `tag=${encodeURIComponent(village)}` : null,
      query ? `tag=${encodeURIComponent(query)}` : null,
    ]
      .filter(Boolean)
      .join("&");

    if (tags) {
      navigate(`/search?${tags}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50 w-full">
      <div
        className="text-2xl font-bold whitespace-nowrap cursor-pointer"
        onClick={() => navigate("/")}
      >
        🐾 도그뮤티
      </div>

      <div className="flex items-center gap-4 min-w-0">
        {/* 검색창 */}
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="검색하고 싶은 해시태그가 있나요?"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(); // ✅ 지역 + 검색어 포함
              }
            }}
          />
        </div>

        {/* 로그인 / 로그아웃 버튼 */}
        {isLoggedIn ? (
          <button
            className="hover:underline text-sm whitespace-nowrap"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <button
            className="hover:underline text-sm whitespace-nowrap"
            onClick={handleLogin}
          >
            로그인
          </button>
        )}

        {/* 마이페이지, 글쓰기 */}
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
