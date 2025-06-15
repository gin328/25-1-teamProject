import React from "react";

const HashtagFilterSidebar = ({ regionTag, otherTags }) => {
  const sortedTags = [...otherTags].sort((a, b) => a.localeCompare(b, "ko"));

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="mb-4 text-gray-700 font-semibold text-base">지역 해시태그</div>
      <div className="mb-6">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {regionTag}
        </span>
      </div>
      {sortedTags.length > 0 && (
        <>
          <div className="mb-2 text-gray-700 font-semibold text-base">기타 해시태그</div>
          <div className="flex flex-col gap-2">
            {sortedTags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HashtagFilterSidebar;
