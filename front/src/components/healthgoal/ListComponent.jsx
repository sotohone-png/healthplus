import { useEffect, useState } from "react";
import { getList } from "../../api/healthGoalApi";
import useCustomMove from "../../hooks/useCustomMove";

const ListComponent = () => {
  const [healthGoals, setHealthGoals] = useState([]);
  const { moveToPath } = useCustomMove();

  useEffect(() => {
    getList({ page: 1, size: 10 }).then((data) => {
      setHealthGoals(data.dtoList);
    });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">건강 목표 목록</h2>
        <button
          onClick={() => moveToPath("/healthgoal/add")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          목표 추가
        </button>
      </div>
      <ul className="space-y-2">
        {healthGoals && healthGoals.map((goal) => (
          <li
            key={goal.tno}
            onClick={() => moveToPath(`/healthgoal/read/${goal.tno}`)}
            className="border p-3 rounded cursor-pointer hover:bg-gray-100"
          >
            <div className="flex justify-between">
              <span className={goal.complete ? "line-through text-gray-400" : ""}>
                {goal.title}
              </span>
              <span className="text-sm text-gray-500">{goal.dueDate}</span>
            </div>
            <div className="text-sm text-gray-500">{goal.writer}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;