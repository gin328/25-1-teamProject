import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article_id, tag, location, user, title, content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (article_id === -1 || article_id === -2 || article_id === -3) return;
    navigate(`/articles/${article_id}`);
  };

  return (
    <div
      className="bg-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition min-h-[200px] flex flex-col justify-between cursor-pointer"
      onClick={handleClick}
    >
      <div>
        {tag && <div className="text-sm text-gray-600">#{tag}</div>}
        {location && <div className="text-sm text-gray-600">#{location}</div>}
        {user && <div className="text-sm text-gray-700 font-medium">{user}</div>}
        {user && <div className="w-10 h-10 bg-gray-400 rounded-full my-2" />}
        <div className="font-semibold text-base mb-1">{title}</div>
        <p className="text-sm text-gray-700 leading-snug line-clamp-3">{content}</p>
      </div>
    </div>
  );
};

export default ArticleCard;

