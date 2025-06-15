import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import SearchResultPage from './pages/SearchResultPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticleCreatePage from "./pages/ArticleCreatePage/ArticleCreatePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/new" element={<ArticleCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}
