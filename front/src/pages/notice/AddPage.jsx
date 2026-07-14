import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postNotice } from "../../api/noticeApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const AddPage = () => {
  const [noticeParam, setNoticeParam] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  const handleChange = (e) => {
    setNoticeParam({ ...noticeParam, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!noticeParam.title.trim()) { alert("제목을 입력해주세요"); return; }
    if (!noticeParam.content.trim()) { alert("내용을 입력해주세요"); return; }
    postNotice({
      ...noticeParam,
      email: loginState.email,
      nickname: loginState.nickname,
    }).then(() => navigate("/notice"));
  };

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white">공지사항 작성</h1>
      </div>
      <div className="px-16 py-8 max-w-3xl">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">제목</label>
            <input
              name="title"
              value={noticeParam.title}
              onChange={handleChange}
              placeholder="제목 입력"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">내용</label>
            <textarea
              name="content"
              value={noticeParam.content}
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
              onClick={() => navigate("/notice")}
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