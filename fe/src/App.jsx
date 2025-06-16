import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import SearchResultPage from './pages/SearchResultPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticleCreatePage from "./pages/ArticleCreatePage";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from "./pages/MyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/new" element={<ArticleCreatePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
