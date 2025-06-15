import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가

const HashtagShortcut = () => {
  const navigate = useNavigate(); // ✅ 훅 사용
  const tags = ["일상", "산책", "병원", "질문", "긴급"];

  return (
    <div className="text-center my-10">
      <h3 className="font-semibold text-lg mb-4">
        당신을 위한 추천 <span className="text-blue-500">#해시태그</span>
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => navigate(`/search?tag=${encodeURIComponent(tag)}`)} // ✅ 클릭 시 이동
            className={`px-4 py-2 rounded-full text-sm shadow-sm transition 
              ${tag === "긴급" ? "bg-red-200 text-red-800" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HashtagShortcut;

