import { useEffect } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin();

  useEffect(() => {
    doLogout();
  }, []);

  const handleClickConfirm = () => {
    moveToPath("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
          style={{ background: "#eaf6f0" }}
        >
          👋
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a2e" }}>
          로그아웃 되었습니다
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Health<span style={{ color: "#2f9e64" }}>Plus</span>를 이용해주셔서
          감사합니다
        </p>

        <button
          onClick={handleClickConfirm}
          className="w-full rounded-full py-3 text-sm font-semibold transition"
          style={{ background: "#7ec8a0", color: "#0f3d2a" }}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LogoutComponent;
