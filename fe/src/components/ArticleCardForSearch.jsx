import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCardForSearch = ({
  article_id,
  userNickname,
  hashtags = [],
  title,
  content,
  reactionCount,
  commentCount,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/${article_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-2 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-400" /> {/* 사용자 프사 */}
        <div>
          <div className="text-sm font-medium">{userNickname}</div>
          <div className="text-xs text-gray-600">
            {
              hashtags.map(tag => {
                const name = typeof tag === "string" ? tag : tag.tag_name;
                return name.startsWith("#") ? name : `#${name}`;
              }).join(" ")
            }
          </div>
        </div>
      </div>
      <div>
        <div className="font-bold text-base">{title}</div>
        <div className="text-sm text-gray-700 line-clamp-2">{content}</div>
      </div>
      <div className="text-right text-xs text-gray-500">
        공감 {reactionCount} · 댓글 {commentCount}
      </div>
    </div>
  );
};

export default ArticleCardForSearch;
