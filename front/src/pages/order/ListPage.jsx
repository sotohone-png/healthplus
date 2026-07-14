import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderList, cancelOrder } from "../../api/orderApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import BasicLayout from "../../layouts/BasicLayout";

const ListPage = () => {
  const [orders, setOrders] = useState([]);
  const { loginState } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginState.email) {
      getOrderList(loginState.email).then((data) => setOrders(data));
    }
  }, [loginState.email]);

  const handleCancel = (ono) => {
    if (window.confirm("주문을 취소하시겠습니까?")) {
      cancelOrder(ono).then(() => {
        getOrderList(loginState.email).then((data) => setOrders(data));
      });
    }
  };

  const statusLabel = (status) => {
    if (status === "PENDING") return { text: "주문완료", color: "#7ec8a0", bg: "#e1f5ee" };
    if (status === "PAID") return { text: "결제완료", color: "#378ADD", bg: "#e6f1fb" };
    if (status === "CANCELLED") return { text: "취소됨", color: "#e74c3c", bg: "#fcebeb" };
    return { text: status, color: "#555", bg: "#f0f0f0" };
  };

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">주문 내역</h1>
        <p className="text-gray-400 text-sm">내 주문 목록을 확인하세요</p>
      </div>

      <div className="px-16 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📦</div>
            <p>주문 내역이 없습니다</p>
            <button
              onClick={() => navigate("/products/")}
              className="mt-4 px-6 py-3 rounded-xl text-sm text-white"
              style={{ background: "#1a1a2e" }}>
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const s = statusLabel(order.status);
              return (
                <div key={order.ono}
                  className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-400">주문번호 </span>
                      <span className="font-medium">#{order.ono}</span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ color: s.color, background: s.bg }}>
                      {s.text}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.oino} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.pname} x {item.qty}</span>
                        <span className="font-medium">{(item.price * item.qty).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="font-bold text-lg">{order.totalPrice.toLocaleString()}원</span>
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order.ono)}
                        className="text-xs px-4 py-2 rounded-xl border border-red-200 text-red-500">
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
    </BasicLayout>
  );
};

export default ListPage;