import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBoard,
  deleteBoard,
  deleteBoardByManager,
} from "../../api/boardApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const ReadPage = () => {
  const { bno } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  useEffect(() => {
    getBoard(bno).then((data) => setBoard(data));
  }, [bno]);

  const handleDelete = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deleteBoard(bno, loginState.email).then(() => navigate("/board"));
    }
  };

  const handleDeleteByManager = () => {
    if (window.confirm("관리자 권한으로 게시글을 삭제하시겠습니까?")) {
      deleteBoardByManager(bno).then(() => navigate("/board"));
    }
  };

  if (!board) return <div>Loading...</div>;

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">커뮤니티</h1>
      </div>

      <div className="px-16 py-8 max-w-3xl">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {board.title}
          </h2>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-400">{board.nickname}</span>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{new Date(board.regDate).toLocaleDateString()}</span>
              <span>조회 {board.viewCount}</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {board.content}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/board")}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
          >
            목록
          </button>
          {loginState.email === board.email && (
            <>
              <button
                onClick={() => navigate(`/board/modify/${bno}`)}
                className="px-6 py-3 rounded-xl text-white text-sm"
                style={{ background: "#1a1a2e" }}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl text-white text-sm bg-red-500"
              >
                삭제
              </button>
            </>
          )}
          {loginState.roleNames?.includes("MANAGER") &&
            loginState.email !== board.email && (
              <button
                onClick={handleDeleteByManager}
                className="px-6 py-3 rounded-xl text-white text-sm bg-red-500"
              >
                삭제
              </button>
            )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default ReadPage;
