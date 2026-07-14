import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getOrderList, cancelOrder } from "../../api/orderApi";
import { getListByWriter } from "../../api/healthGoalApi";
import BasicLayout from "../../layouts/BasicLayout";

const IndexPage = () => {
  const { loginState, doLogout } = useCustomLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (loginState.email) {
      getOrderList(loginState.email).then((data) => setOrders(data));
      getListByWriter(loginState.nickname, { page: 1, size: 10 }).then((data) =>
        setHealthGoals(data.dtoList || []),
      );
    }
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [loginState.email, location.state]);

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  const handleCancelOrder = (ono) => {
    if (window.confirm("주문을 취소하시겠습니까?")) {
      cancelOrder(ono).then(() => {
        getOrderList(loginState.email).then((data) => setOrders(data));
      });
    }
  };

  const statusLabel = (status) => {
    if (status === "PENDING")
      return { text: "주문완료", color: "#7ec8a0", bg: "#e1f5ee" };
    if (status === "PAID")
      return { text: "결제완료", color: "#378ADD", bg: "#e6f1fb" };
    if (status === "CANCELLED")
      return { text: "취소됨", color: "#e74c3c", bg: "#fcebeb" };
    return { text: status, color: "#555", bg: "#f0f0f0" };
  };

  const tabs = [
    { id: "profile", label: "내 프로필" },
    { id: "order", label: "주문 관리" },
    { id: "health", label: "건강 관리" },
    { id: "account", label: "계정 설정" },
  ];

  return (
    <BasicLayout>
      {/* 프로필 헤더 */}
      <div className="px-16 py-10" style={{ background: "#1a1a2e" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: "#7ec8a0", color: "#0f3d2a" }}
          >
            {loginState.nickname?.charAt(0) || loginState.email?.charAt(0)}
          </div>
          <div>
            <p className="text-white text-xl font-medium">
              {loginState.nickname || loginState.email?.split("@")[0]}
            </p>
            <p className="text-gray-400 text-sm">{loginState.email}</p>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-2xl font-bold text-white">{orders.length}</p>
            <p className="text-gray-400 text-sm mt-1">전체 주문</p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#7ec8a0" }}>
              {orders.filter((o) => o.status === "PENDING").length}
            </p>
            <p className="text-gray-400 text-sm mt-1">진행중</p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "CANCELLED").length}
            </p>
            <p className="text-gray-400 text-sm mt-1">취소</p>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200 px-16 bg-white">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="py-4 text-sm font-medium border-b-2 transition-all"
              style={
                activeTab === tab.id
                  ? { borderColor: "#1a1a2e", color: "#1a1a2e" }
                  : { borderColor: "transparent", color: "#9ca3af" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="px-16 py-8">
        {/* 내 프로필 */}
        {activeTab === "profile" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-800">
              내 프로필
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-gray-500">닉네임</span>
                <span className="text-sm font-medium text-gray-800">
                  {loginState.nickname || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-gray-500">이메일</span>
                <span className="text-sm font-medium text-gray-800">
                  {loginState.email}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-gray-500">소셜 로그인</span>
                <span className="text-sm font-medium text-gray-800">
                  {loginState.social ? "카카오" : "일반"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 주문 관리 */}
        {activeTab === "order" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-800">
                주문 내역 ({orders.length}건)
              </h2>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p>주문 내역이 없습니다</p>
                <button
                  onClick={() => navigate("/products/")}
                  className="mt-4 px-6 py-2 rounded-xl text-sm text-white"
                  style={{ background: "#1a1a2e" }}
                >
                  쇼핑하러 가기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const s = statusLabel(order.status);
                  return (
                    <div
                      key={order.ono}
                      className="bg-white border border-gray-100 rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">
                          주문번호 #{order.ono}
                        </span>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ color: s.color, background: s.bg }}
                        >
                          {s.text}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.oino}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {item.pname} x {item.qty}
                            </span>
                            <span className="font-medium">
                              {(item.price * item.qty).toLocaleString()}원
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="font-bold">
                          {order.totalPrice.toLocaleString()}원
                        </span>
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => handleCancelOrder(order.ono)}
                            className="text-xs px-4 py-2 rounded-xl border border-red-200 text-red-500"
                          >
                            주문 취소
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 건강 관리 */}
        {activeTab === "health" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-800">
                건강 목표 ({healthGoals.length}개)
              </h2>
              <button
                onClick={() => navigate("/healthgoal/add")}
                className="px-4 py-2 rounded-xl text-sm text-white"
                style={{ background: "#1a1a2e" }}
              >
                목표 추가
              </button>
            </div>
            {healthGoals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🎯</p>
                <p>등록된 건강 목표가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {healthGoals.map((goal) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDate = new Date(goal.dueDate);

                  const getStatus = () => {
                    if (goal.complete)
                      return {
                        text: "✅ 완료",
                        bg: "bg-green-100",
                        color: "text-green-600",
                      };
                    if (dueDate < today)
                      return {
                        text: "🔴 기간 초과",
                        bg: "bg-red-100",
                        color: "text-red-500",
                      };
                    if (dueDate.getTime() === today.getTime())
                      return {
                        text: "🟡 오늘 마감",
                        bg: "bg-yellow-100",
                        color: "text-yellow-600",
                      };
                    return {
                      text: "🟢 진행중",
                      bg: "bg-gray-100",
                      color: "text-gray-500",
                    };
                  };

                  const status = getStatus();

                  return (
                    <div
                      key={goal.tno}
                      onClick={() => navigate(`/healthgoal/read/${goal.tno}`)}
                      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${
                            goal.complete
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {goal.title}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${status.bg} ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        목표일: {goal.dueDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* AI 상담 버튼 */}
            <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => navigate("/ai")}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#e1f5ee" }}
                  >
                    🤖
                  </div>
                  <span className="text-sm text-gray-700">AI 건강 상담</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        )}

        {/* 계정 설정 */}
        {activeTab === "account" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-800">
              계정 설정
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#faeeda" }}
                  >
                    🔒
                  </div>
                  <span className="text-sm text-gray-700">비밀번호 변경</span>
                </div>
                <span className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-lg">
                  준비중
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#fcebeb" }}
                  >
                    🚪
                  </div>
                  <span className="text-sm text-red-500">로그아웃</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default IndexPage;
