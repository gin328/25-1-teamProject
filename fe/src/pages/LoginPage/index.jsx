// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("로그인 성공!");
      navigate("/"); // 메인페이지로 이동
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 px-6 py-8 border rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            로그인
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="hover:underline cursor-pointer"
          >
            회원가입하기
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
