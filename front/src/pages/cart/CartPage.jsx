import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";
import BasicLayout from "../../layouts/BasicLayout";
import { postOrder } from "../../api/orderApi";
import { API_SERVER_HOST } from "../../api/healthGoalApi";

const host = API_SERVER_HOST;

const CartPage = () => {
  const { cartItems, refreshCart, changeCart } = useCustomCart();
  const { loginState, isLogin } = useCustomLogin();
  const navigate = useNavigate();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    receiver: "",
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
    deliveryRequest: "",
  });

  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요합니다");
      navigate("/member/login");
      return;
    }
    refreshCart();
  }, [isLogin]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) return;
    changeCart({ email: loginState.email, pno: item.pno, qty: newQty });
  };

  const handleRemove = (item) => {
    if (!window.confirm("장바구니에서 삭제하시겠습니까?")) return;
    changeCart({
      email: loginState.email,
      cino: item.cino,
      pno: item.pno,
      qty: 0,
    });
  };

  const handleClickOrderButton = () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다");
      return;
    }
    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  };

  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddressInfo((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  const handleSubmitOrder = () => {
    if (!addressInfo.receiver.trim()) {
      alert("수령인을 입력해주세요");
      return;
    }
    if (!addressInfo.phone.trim()) {
      alert("연락처를 입력해주세요");
      return;
    }
    if (!addressInfo.zipcode.trim() || !addressInfo.address.trim()) {
      alert("배송 주소를 입력해주세요");
      return;
    }

    const orderDTO = {
      email: loginState.email,
      orderItems: cartItems.map((item) => ({
        pno: item.pno,
        qty: item.qty,
      })),
      ...addressInfo,
    };

    postOrder(orderDTO).then((data) => {
      navigate(`/order/complete?ono=${data.ono}`);
    });
  };

  return (
    <BasicLayout>
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">
          {showAddressForm ? "배송 정보 입력" : "장바구니"}
        </h1>
        <p className="text-gray-400 text-sm">
          {showAddressForm
            ? "상품을 받으실 정보를 입력해주세요"
            : "담은 상품을 확인하고 주문해보세요"}
        </p>
      </div>

      <div className="px-16 py-8">
        {!showAddressForm ? (
          cartItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p>장바구니가 비어있습니다</p>
              <button
                onClick={() => navigate("/products/")}
                className="mt-4 px-6 py-3 rounded-xl text-sm text-white"
                style={{ background: "#1a1a2e" }}
              >
                쇼핑하러 가기
              </button>
            </div>
          ) : (
            <div className="flex gap-8">
              <div className="flex-1 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.cino}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.imageFile ? (
                        <img
                          alt={item.pname}
                          className="w-full h-full object-cover"
                          src={`${host}/api/products/view/s_${item.imageFile}`}
                        />
                      ) : (
                        <span className="text-3xl">💊</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.pname}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.price?.toLocaleString()}원
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1">
                      <button
                        onClick={() => handleQtyChange(item, item.qty - 1)}
                        className="text-gray-500 font-bold"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item, item.qty + 1)}
                        className="text-gray-500 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p
                      className="font-bold w-24 text-right"
                      style={{ color: "#1a1a2e" }}
                    >
                      {(item.price * item.qty).toLocaleString()}원
                    </p>

                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-400 hover:text-red-500 text-sm px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="w-80 flex-shrink-0">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-4">
                  <h3 className="font-medium text-gray-800 mb-4">주문 요약</h3>
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>상품 수</span>
                      <span>{cartItems.length}개</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>상품 금액</span>
                      <span>{total.toLocaleString()}원</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>총 결제금액</span>
                    <span style={{ color: "#1a1a2e" }}>
                      {total.toLocaleString()}원
                    </span>
                  </div>
                  <button
                    onClick={handleClickOrderButton}
                    className="w-full py-3 rounded-xl text-white font-medium text-sm"
                    style={{ background: "#1a1a2e" }}
                  >
                    주문하기
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    수령인
                  </label>
                  <input
                    name="receiver"
                    value={addressInfo.receiver}
                    onChange={handleAddressChange}
                    placeholder="이름 입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    연락처
                  </label>
                  <input
                    name="phone"
                    value={addressInfo.phone}
                    onChange={handleAddressChange}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    name="zipcode"
                    value={addressInfo.zipcode}
                    onChange={handleAddressChange}
                    placeholder="우편번호"
                    readOnly
                    className="w-32 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-gray-50"
                  />
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600"
                    onClick={handleSearchAddress}
                  >
                    주소 검색
                  </button>
                </div>
                <div>
                  <input
                    name="address"
                    value={addressInfo.address}
                    onChange={handleAddressChange}
                    placeholder="기본 주소"
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <input
                    name="addressDetail"
                    value={addressInfo.addressDetail}
                    onChange={handleAddressChange}
                    placeholder="상세 주소 입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    배송 요청사항
                  </label>
                  <textarea
                    name="deliveryRequest"
                    value={addressInfo.deliveryRequest}
                    onChange={handleAddressChange}
                    rows={3}
                    placeholder="예: 부재시 경비실에 맡겨주세요"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-4">
                <h3 className="font-medium text-gray-800 mb-4">주문 요약</h3>
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.cino}
                      className="flex justify-between text-sm text-gray-500"
                    >
                      <span>
                        {item.pname} x {item.qty}
                      </span>
                      <span>{(item.price * item.qty).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>총 결제금액</span>
                  <span style={{ color: "#1a1a2e" }}>
                    {total.toLocaleString()}원
                  </span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  className="w-full py-3 rounded-xl text-white font-medium text-sm mb-2"
                  style={{ background: "#1a1a2e" }}
                >
                  결제하기
                </button>
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
                >
                  뒤로 가기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default CartPage;
