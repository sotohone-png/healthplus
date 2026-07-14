import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticeList } from "../../api/noticeApi";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const ListPage = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  useEffect(() => {
    getNoticeList({ page: 1, size: 10 }).then((data) => {
      setNotices(data.dtoList || []);
    });
  }, []);

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">공지사항</h1>
        <p className="text-gray-400 text-sm">
          HealthPlus의 새로운 소식을 알려드립니다
        </p>
      </div>

      <div className="px-16 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-400">총 {notices.length}개</p>
          {loginState.roleNames?.includes("MANAGER") && (
            <button
              onClick={() => navigate("/notice/add")}
              className="px-4 py-2 rounded-xl text-sm text-white"
              style={{ background: "#1a1a2e" }}
            >
              공지 작성
            </button>
          )}
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📢</p>
            <p>등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.nno}
                onClick={() => navigate(`/notice/${notice.nno}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs px-2 py-1 rounded-lg font-medium"
                    style={{ background: "#e1f5ee", color: "#0f6e56" }}
                  >
                    공지
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(notice.regDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-medium text-gray-800 mb-1">{notice.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {notice.nickname}
                  </span>
                  <span className="text-xs text-gray-400">
                    조회 {notice.viewCount}
                  </span>
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
