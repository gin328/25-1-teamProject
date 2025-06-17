import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [articles, setArticles] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [showDogForm, setShowDogForm] = useState(false);
  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    birth: "",
    gender: "",
    weight: "",
    neutered: "",
    note: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto p-6 text-center text-red-500">
          로그인 후 이용해 주세요.
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`/api/articles?user_id=${userId}`);
        setArticles(res.data);
      } catch (err) {
        console.error("글 목록 로딩 실패:", err);
      }
    };

    const fetchDogs = async () => {
      try {
        const res = await axios.get(`/api/dogs?user_id=${userId}`);
        setDogs(res.data);
      } catch (err) {
        console.error("반려견 목록 로딩 실패:", err);
      }
    };

    fetchArticles();
    fetchDogs();
  }, [userId]);

  const handleDogChange = (e) => {
    const { name, value } = e.target;
    setNewDog((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDog = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/dogs", {
        user_id: userId,
        dog_name: newDog.name,
        dog_type: newDog.breed,
        dog_age: null,
        dog_gender: newDog.gender,
        dog_weight: parseFloat(newDog.weight),
        dog_desexed: newDog.neutered === "예",
        dog_char: newDog.note,
        dog_img: null,
        is_public: true,
        is_representative: false,
      });

      setNewDog({
        name: "",
        breed: "",
        birth: "",
        gender: "",
        weight: "",
        neutered: "",
        note: "",
      });
      setShowDogForm(false);
      const res = await axios.get(`/api/dogs?user_id=${userId}`);
      setDogs(res.data);
    } catch (err) {
      console.error("반려견 등록 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        {/* 내가 쓴 글 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">📄 내가 쓴 글</h2>
          <ul className="space-y-2">
            {Array.isArray(articles) && articles.length > 0 ? (
              articles.map((article) => (
                <li
                  key={article.article_id}
                  onClick={() => navigate(`/articles/${article.article_id}`)}
                  className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-semibold">{article.title}</div>
                  <div className="text-sm text-gray-500">
                    {
                      article.tags
                        ?.map((tag) => {
                          const name = typeof tag === "string" ? tag : tag.tag_name;
                          return name.startsWith("#") ? name : `#${name}`;
                        })
                        .join(" ")
                    }{" "}
                    | ❤️ {article.likes} | 💬 {article.comments}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">작성한 글이 없습니다.</p>
            )}
          </ul>
        </section>

        {/* 내 반려견 목록 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">🐶 내 반려견</h2>
          <ul className="space-y-2">
            {Array.isArray(dogs) && dogs.length > 0 ? (
              dogs.map((dog) => (
                <li key={dog.dog_id} className="p-3 border rounded bg-gray-50">
                  <div className="font-medium">
                    {dog.dog_name} ({dog.dog_type || "품종 미입력"})
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">등록된 반려견이 없습니다.</p>
            )}
          </ul>
        </section>

        {/* 반려견 추가 폼 */}
        <section>
          <button
            onClick={() => setShowDogForm(!showDogForm)}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            {showDogForm ? "➖ 반려견 추가 닫기" : "➕ 반려견 추가"}
          </button>

          {showDogForm && (
            <form onSubmit={handleAddDog} className="space-y-3 p-4 border rounded bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">*이 붙은 문항은 필수 입력 요소입니다.</p>

              <div>
                <label className="block font-medium">
                  1. 반려견 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDog.name}
                  onChange={handleDogChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">2. 품종</label>
                <input
                  type="text"
                  name="breed"
                  value={newDog.breed}
                  onChange={handleDogChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">3. 생년월일</label>
                <input
                  type="date"
                  name="birth"
                  value={newDog.birth}
                  onChange={handleDogChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">4. 성별</label>
                <select
                  name="gender"
                  value={newDog.gender}
                  onChange={handleDogChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">선택</option>
                  <option value="암컷">암컷</option>
                  <option value="수컷">수컷</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">5. 몸무게 (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={newDog.weight}
                  onChange={handleDogChange}
                  step="0.1"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">6. 중성화 여부</label>
                <select
                  name="neutered"
                  value={newDog.neutered}
                  onChange={handleDogChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">선택</option>
                  <option value="예">예</option>
                  <option value="아니오">아니오</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">7. 특이사항</label>
                <textarea
                  name="note"
                  value={newDog.note}
                  onChange={handleDogChange}
                  rows={3}
                  className="w-full border p-2 rounded"
                  placeholder="예: 낯가림 있음, 병력 등"
                />
              </div>

              <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
                반려견 등록
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyPage;
