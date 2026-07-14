import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNotice, deleteNotice } from "../../api/noticeApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const ReadPage = () => {
  const { nno } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  useEffect(() => {
    getNotice(nno).then((data) => setNotice(data));
  }, [nno]);

  const handleDelete = () => {
    if (window.confirm("공지사항을 삭제하시겠습니까?")) {
      deleteNotice(nno).then(() => navigate("/notice"));
    }
  };

  if (!notice) return <div>Loading...</div>;

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">공지사항</h1>
      </div>

      <div className="px-16 py-8 max-w-3xl">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs px-2 py-1 rounded-lg font-medium"
              style={{ background: "#e1f5ee", color: "#0f6e56" }}
            >
              공지
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {notice.title}
          </h2>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-400">{notice.nickname}</span>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{new Date(notice.regDate).toLocaleDateString()}</span>
              <span>조회 {notice.viewCount}</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/notice")}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
          >
            목록
          </button>
          {loginState.roleNames?.includes("MANAGER") && (
            <>
              <button
                onClick={() => navigate(`/notice/modify/${nno}`)}
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
        </div>
      </div>
    </BasicLayout>
  );
};

export default ReadPage;
