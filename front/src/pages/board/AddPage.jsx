import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postBoard } from "../../api/boardApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const AddPage = () => {
  const [boardParam, setBoardParam] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  // 비로그인 접근 차단
  useEffect(() => {
    if (!loginState.email) {
      alert("로그인이 필요합니다");
      navigate("/member/login");
    }
  }, [loginState.email]);

  const handleChange = (e) => {
    setBoardParam({ ...boardParam, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!boardParam.title.trim()) { alert("제목을 입력해주세요"); return; }
    if (!boardParam.content.trim()) { alert("내용을 입력해주세요"); return; }
    postBoard({
      ...boardParam,
      email: loginState.email,
      nickname: loginState.nickname,
    }).then(() => navigate("/board"))
    .catch((err) => console.log("에러: ", err));
  };

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white">게시글 작성</h1>
      </div>
      <div className="px-16 py-8 max-w-3xl">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">제목</label>
            <input
              name="title"
              value={boardParam.title}
              onChange={handleChange}
              placeholder="제목 입력"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">내용</label>
            <textarea
              name="content"
              value={boardParam.content}
              onChange={handleChange}
              placeholder="내용 입력"
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{ background: "#1a1a2e" }}>
              등록
            </button>
            <button
              onClick={() => navigate("/board")}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm">
              취소
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default AddPage;