import { useEffect, useState } from "react";
import { getOne, deleteOne } from "../../api/healthGoalApi";
import { useNavigate } from "react-router-dom";

const ReadComponent = ({ tno }) => {
  const [healthGoal, setHealthGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOne(tno).then((data) => setHealthGoal(data));
  }, [tno]);

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
          <h2 className="text-xl font-bold mb-6 text-gray-800">건강 목표 상세</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">제목</span>
              <span className="text-sm font-medium text-gray-800">{healthGoal.title}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">작성자</span>
              <span className="text-sm font-medium text-gray-800">{healthGoal.writer}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">목표 날짜</span>
              <span className="text-sm font-medium text-gray-800">{healthGoal.dueDate}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">완료 여부</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
  healthGoal.complete
    ? "bg-green-100 text-green-600"
    : new Date(healthGoal.dueDate) < new Date().setHours(0,0,0,0)
      ? "bg-red-100 text-red-500"
      : new Date(healthGoal.dueDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
        ? "bg-yellow-100 text-yellow-600"
        : "bg-gray-100 text-gray-500"
}`}>
  {healthGoal.complete
    ? "✅ 완료"
    : new Date(healthGoal.dueDate) < new Date().setHours(0,0,0,0)
      ? "🔴 기간 초과"
      : new Date(healthGoal.dueDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
        ? "🟡 오늘 마감"
        : "🟢 진행중"}
</span>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => navigate(`/healthgoal/modify/${tno}`)}
              className="flex-1 py-3 rounded-xl text-white font-medium text-sm"
              style={{ background: "#1a1a2e" }}>
              수정
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-xl text-white text-sm bg-red-500">
              삭제
            </button>
            <button
              onClick={() => navigate("/mypage")}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm">
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;