import { useEffect, useState } from "react";
import { getOne, putOne, deleteOne } from "../../api/healthGoalApi";
import { useNavigate } from "react-router-dom";

const ModifyComponent = ({ tno }) => {
  const [healthGoal, setHealthGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOne(tno).then((data) => setHealthGoal(data));
  }, [tno]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHealthGoal({
      ...healthGoal,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleModify = () => {
    if (!healthGoal.title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }
    putOne(healthGoal).then(() => {
      alert("수정되었습니다!");
      navigate("/mypage");
    });
  };

  const handleDelete = () => {
    if (window.confirm("건강 목표를 삭제하시겠습니까?")) {
      deleteOne(tno).then(() => navigate("/mypage"));
    }
  };

  if (!healthGoal) return <div>Loading...</div>;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            건강 목표 수정
          </h2>
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
            <div className="flex items-center gap-3 py-3">
              <input
                name="complete"
                type="checkbox"
                checked={healthGoal.complete}
                onChange={handleChange}
                className="w-5 h-5 rounded"
              />
              <label className="text-sm text-gray-700">완료 처리</label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              disabled
              className="flex-1 py-3 rounded-xl text-gray-400 font-medium text-sm bg-gray-100 cursor-not-allowed"
            >
              수정 (준비중)
            </button>
            <button
              type="button"
              disabled
              className="flex-1 py-3 rounded-xl text-gray-400 text-sm bg-gray-100 cursor-not-allowed"
            >
              삭제 (준비중)
            </button>
            <button
              type="button"
              onClick={() => moveToList({ page: 1 })}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
