import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const BasicMenu = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className="flex items-center justify-between px-8 py-4"
      style={{ background: "#1a1a2e" }}
    >
      {/* 로고 */}
      <div className="text-xl font-bold">
        <Link to="/">
          <span className="text-white">Health</span>
          <span style={{ color: "#7ec8a0" }}>Plus</span>
        </Link>
      </div>
      {/* 메뉴 */}
      <ul className="flex items-center gap-8">
        <li>
          <Link to="/" className="text-gray-300 hover:text-white text-sm">
            홈
          </Link>
        </li>
        <li>
          <Link
            to="/products/"
            className="text-gray-300 hover:text-white text-sm"
          >
            상품
          </Link>
        </li>
        <li>
          <Link to="/notice" className="text-gray-300 hover:text-white text-sm">
            공지사항
          </Link>
        </li>
        <li>
          <Link to="/board" className="text-gray-300 hover:text-white text-sm">
            커뮤니티
          </Link>
        </li>
        {loginState.email && (
          <>
            <li>
              <Link to="/ai" className="text-gray-300 hover:text-white text-sm">
                AI 상담
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* 우측 */}
      <div className="flex items-center gap-4">
        {loginState.email ? (
          <>
            <button
              onClick={() => navigate("/cart")}
              className="relative text-white text-xl px-2"
            >
              🛒
            </button>

            {/* 드롭다운 */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 text-sm text-white px-3 py-2 rounded-full border border-white/20 hover:bg-white/10"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ background: "#7ec8a0", color: "#0f3d2a" }}
                >
                  {loginState.nickname?.charAt(0) ||
                    loginState.email?.charAt(0)}
                </div>
                {loginState.nickname || loginState.email?.split("@")[0]}
                <span className="text-xs text-gray-400">
                  {dropOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* 드롭다운 메뉴 */}
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <Link
                    to="/mypage"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    👤 마이페이지
                  </Link>
                  <Link
                    to="/order/list"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    📦 주문 내역
                  </Link>
                  <Link
                    to="/mypage"
                    state={{ tab: "health" }}
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    🎯 건강 목표
                  </Link>
                  {loginState.roleNames?.includes("MANAGER") && (
                    <Link
                      to="/products/add"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                    >
                      ⚙️ 상품 등록 (관리자)
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* 로그아웃 */}
            <Link
              to="/member/logout"
              className="text-sm px-4 py-2 rounded-full text-white border border-white/30 hover:bg-white/10"
            >
              로그아웃
            </Link>
          </>
        ) : (
          <Link
            to="/member/login"
            className="text-sm px-4 py-2 rounded-full font-medium"
            style={{ background: "#7ec8a0", color: "#0f3d2a" }}
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
