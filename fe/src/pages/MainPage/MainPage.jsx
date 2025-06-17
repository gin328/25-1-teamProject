// src/pages/MainPage/MainPage.jsx
import React from "react";
import Header from "../../components/Header";
import AdBannerGroup from "../../components/AdBannerGroup";
import HashtagShortcut from "../../components/HashtagShortcut";
import ArticleList from "../../components/ArticleList";


const MainPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-8 py-6 max-w-6xl mx-auto">
        <AdBannerGroup />
        <HashtagShortcut />
        <ArticleList />
      </main>
    </div>
  );
};

export default MainPage;
