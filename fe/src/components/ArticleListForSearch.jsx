import React from "react";
import ArticleCardForSearch from "./ArticleCardForSearch";

const ArticleListForSearch = ({ articles }) => {
  return (
    <div className="flex flex-col gap-6">
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <ArticleCardForSearch key={index} {...article} />
        ))
      ) : (
        <div className="text-sm text-gray-500">표시할 글이 없습니다.</div>
      )}
    </div>
  );
};

export default ArticleListForSearch;
