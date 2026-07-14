import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBoardList } from "../../api/boardApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const ListPage = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  useEffect(() => {
    getBoardList({ page: 1, size: 10 }).then((data) => {
  setBoards(data.dtoList || []);
});
  }, []);

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">커뮤니티</h1>
        <p className="text-gray-400 text-sm">건강 정보를 자유롭게 나눠보세요</p>
      </div>

      <div className="px-16 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-400">총 {boards.length}개</p>
      <div className="flex justify-between items-center mb-6">
  <div></div>
  <button
    onClick={() => {
      if (!loginState.email) {
        alert("로그인이 필요합니다");
        navigate("/member/login");
        return;
      }
      navigate("/board/add");
    }}
    className="px-4 py-2 rounded-xl text-sm text-white"
    style={{ background: "#1a1a2e" }}>
    글쓰기
  </button>
</div>
          
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p>등록된 게시글이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {boards.map((board) => (
              <div
                key={board.bno}
                onClick={() => navigate(`/board/${board.bno}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">#{board.bno}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(board.regDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-medium text-gray-800 mb-1">{board.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{board.nickname}</span>
                  <span className="text-xs text-gray-400">조회 {board.viewCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default ListPage;