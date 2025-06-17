import React, { useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    village: "",
    dog_name: "",
    dog_gender: "",
    dog_desexed: "",
    dog_type: "",
    dog_weight: "",
    dog_age: "",
    dog_char: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patchedFormData = {
        ...formData,
        dog_desexed: parseInt(formData.dog_desexed),
        dog_weight: formData.dog_weight === "" ? null : parseInt(formData.dog_weight),
        dog_age: formData.dog_age === "" ? null : parseInt(formData.dog_age),
        dog_char: formData.dog_char === "" ? null : formData.dog_char,
      };

      const res = await axios.post("/api/auth/register", patchedFormData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("회원가입이 완료되었습니다!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 실패");
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">회원가입</h1>
        <p className="text-sm text-gray-600 mb-6">
          <span className="text-red-500">*</span>이 붙은 문항은 필수입력 요소입니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사용자 정보 섹션 */}
          <div className="border p-4 rounded-md space-y-4">
            <h2 className="text-lg font-semibold mb-2">사용자 정보</h2>
            <div>
              <label className="block text-sm font-medium">
                1. 이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                2. 비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                3. 닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                4. 거주 지역 <span className="text-red-500">*</span>
              </label>
              <input
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* 반려견 정보 섹션 */}
          <div className="border p-4 rounded-md space-y-4">
            <h2 className="text-lg font-semibold mb-2 mt-6">반려견 정보</h2>

            <div>
              <label className="block text-sm font-medium">
                1. 반려견 이름 <span className="text-red-500">*</span>
              </label>
              <input
                name="dog_name"
                value={formData.dog_name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">2. 성별</label>
              <select
                name="dog_gender"
                value={formData.dog_gender}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- 선택하세요 --</option>
                <option value="수컷">수컷</option>
                <option value="암컷">암컷</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">3. 중성화 여부</label>
              <select
                name="dog_desexed"
                value={formData.dog_desexed}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- 선택하세요 --</option>
                <option value="1">예 (중성화 완료)</option>
                <option value="0">아니오 (미중성화)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">4. 견종</label>
              <input
                name="dog_type"
                value={formData.dog_type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">5. 몸무게 (kg)</label>
              <input
                type="number"
                name="dog_weight"
                value={formData.dog_weight}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min="0"
                step="0.1"
                placeholder="예: 5.3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">6. 나이 (살)</label>
              <input
                type="number"
                name="dog_age"
                value={formData.dog_age}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min="0"
                placeholder="예: 3"
              />
            </div>


            <div>
              <label className="block text-sm font-medium">7. 성격</label>
              <input
                name="dog_char"
                value={formData.dog_char}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
