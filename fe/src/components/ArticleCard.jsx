import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({
  article_id,
  title,
  content,
  created_at,
  hashtags = [],
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!article_id || article_id < 0) return;
    navigate(`/articles/${article_id}`);
  };

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString()
    : "작성일 없음";

  const tagString = hashtags
    .map((tag) => {
      const name = typeof tag === "string" ? tag : tag.tag_name;
      return name.startsWith("#") ? name : `#${name}`;
    })
    .join(" ");

  return (
    <div
      className={`bg-gray-200 rounded-xl p-4 shadow transition min-h-[200px] flex flex-col justify-between ${
        article_id > 0 ? "cursor-pointer hover:shadow-lg" : "opacity-70"
      }`}
      onClick={handleClick}
    >
      <div>
        {tagString && (
          <div className="text-sm text-gray-600 mb-1">{tagString}</div>
        )}
        <div className="font-semibold text-base mb-1">{title}</div>
        <p className="text-sm text-gray-700 leading-snug line-clamp-3">
          {content}
        </p>
      </div>
      <div className="text-xs text-right text-gray-500 mt-2">
        {formattedDate}
      </div>
    </div>
  );
};

export default ArticleCard;
