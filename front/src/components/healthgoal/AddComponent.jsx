import { useState } from "react";
import { postAdd } from "../../api/healthGoalApi";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const AddComponent = () => {
  const [healthGoal, setHealthGoal] = useState({
    title: "",
    dueDate: "",
    complete: false,
  });
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  const handleChange = (e) => {
    setHealthGoal({ ...healthGoal, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!healthGoal.title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!healthGoal.dueDate) {
      alert("목표 날짜를 입력해주세요");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(healthGoal.dueDate);
    if (dueDate < today) {
      alert("목표 날짜는 오늘 이후로 설정해주세요");
      return;
    }

    postAdd({
      ...healthGoal,
      writer: loginState.nickname, // 닉네임 자동 입력
    }).then(() => {
      navigate("/mypage");
    });
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                목표 제목
              </label>
              <input
                name="title"
                value={healthGoal.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                placeholder="예: 매일 오메가3 먹기"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                목표 날짜
              </label>
              <input
                name="dueDate"
                type="date"
                value={healthGoal.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl text-white font-medium text-sm"
                style={{ background: "#1a1a2e" }}
              >
                추가
              </button>
              <button
                onClick={() => navigate("/mypage")}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
