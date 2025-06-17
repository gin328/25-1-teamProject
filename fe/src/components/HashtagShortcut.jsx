import React from "react";
import { useNavigate } from "react-router-dom";

const HashtagShortcut = () => {
  const navigate = useNavigate();
  const tags = ["사료", "산책", "동물병원", "질문", "긴급"];

  const region = localStorage.getItem("village");
  const encodedRegion =
    region && region !== "없습니다" ? encodeURIComponent(region) : null;

  return (
    <div className="text-center my-10">
      <h3 className="font-semibold text-lg mb-4">
        당신을 위한 추천 <span className="text-blue-500">#해시태그</span>
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag) => {
          const encodedTag = encodeURIComponent(tag);

          const searchUrl = `/search?${[
            encodedRegion ? `tag=${encodedRegion}` : null,
            `tag=${encodedTag}`,
          ]
            .filter(Boolean)
            .join("&")}`;

          console.log("이동할 URL:", searchUrl); // ✅ URL 확인용
          return (
            <button
              key={tag}
              onClick={() => navigate(searchUrl)}
              className={`px-4 py-2 rounded-full text-sm shadow-sm transition 
                ${tag === "긴급" ? "bg-red-200 text-red-800" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HashtagShortcut;
