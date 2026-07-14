import { useEffect, useState } from "react";
import { getOne } from "../../api/productsApi";
import { API_SERVER_HOST } from "../../api/healthGoalApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import { useNavigate } from "react-router-dom";
import ReviewComponent from "./ReviewComponent";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

// AI가 생성한 설명(간단한 마크다운 형식: #, ** )을 가볍게 렌더링
const renderAiDescription = (text) => {
  if (!text) return null;

  return text.split("\n").map((line, idx) => {
    if (line.trim() === "") {
      return <div key={idx} className="h-2" />;
    }

    if (line.startsWith("# ")) {
      return (
        <h4 key={idx} className="font-bold text-base text-gray-800 mt-3 mb-1">
          {line.slice(2)}
        </h4>
      );
    }

    // **굵게** 표시 처리
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

    return (
      <p key={idx} className="text-sm text-gray-600 leading-relaxed">
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="text-gray-800">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    );
  });
};

const ReadComponent = ({ pno }) => {
  const [product, setProduct] = useState(initState);
  const { moveToList, moveToModify } = useCustomMove();
  const [fetching, setFetching] = useState(false);
  const [qty, setQty] = useState(1);
  const { changeCart, cartItems } = useCustomCart();
  const { loginState } = useCustomLogin();
  const navigate = useNavigate();

  // 장바구니 담기 공통 로직 ("장바구니 담기", "바로 구매" 버튼이 함께 사용)
  const addToCart = () => {
    let addQty = qty;
    const addedItem = cartItems.filter((item) => item.pno === parseInt(pno))[0];
    if (addedItem) {
      if (
        window.confirm("이미 추가된 상품입니다. 추가하시겠습니까?") === false
      ) {
        return false;
      }
      addQty = addedItem.qty + qty;
    }
    changeCart({ email: loginState.email, pno: pno, qty: addQty });
    return true;
  };

  const handleClickAddCart = () => {
    const added = addToCart();
    if (!added) return;
    alert("장바구니에 추가되었습니다!");
    navigate("/cart");
  };

  const handleClickOrder = () => {
    const added = addToCart();
    if (!added) return;
    navigate("/cart");
  };

  useEffect(() => {
    setFetching(true);
    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false);
    });
  }, [pno]);

  return (
    <div>
      {fetching ? <FetchingModal /> : <></>}

      {/* 상품 이미지 */}
      <div className="w-full h-72 bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.uploadFileNames && product.uploadFileNames.length > 0 ? (
          <img
            alt={product.pname}
            className="h-full object-cover"
            src={`${host}/api/products/view/${product.uploadFileNames[0]}`}
          />
        ) : (
          <span className="text-8xl">💊</span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="px-16 py-8">
        <p className="text-2xl font-bold text-gray-800 mb-2">{product.pname}</p>
        <p className="text-gray-400 text-sm mb-6">{product.pdesc}</p>
        <p className="text-3xl font-bold mb-8" style={{ color: "#1a1a2e" }}>
          {product.price?.toLocaleString()}원
        </p>

        {/* AI 건강 정보 */}
        {product.aiDescription && (
          <div className="mb-8 p-5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <p className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-1">
              🤖 AI 건강 정보
            </p>
            {renderAiDescription(product.aiDescription)}
          </div>
        )}

        {/* 수량 선택 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-gray-600">수량</span>
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="text-lg font-bold text-gray-600"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="text-lg font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleClickAddCart}
            className="flex-1 py-3 rounded-xl border font-medium text-sm"
            style={{ borderColor: "#1a1a2e", color: "#1a1a2e" }}
          >
            장바구니 담기
          </button>
          <button
            onClick={handleClickOrder}
            className="flex-1 py-3 rounded-xl text-white font-medium text-sm"
            style={{ background: "#1a1a2e" }}
          >
            바로 구매
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 mt-4">
          {loginState.roleNames?.includes("MANAGER") && (
            <button
              onClick={() => moveToModify(pno)}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm"
            >
              수정
            </button>
          )}
          <button
            onClick={moveToList}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm"
          >
            목록
          </button>
        </div>
      </div>

      {/* 리뷰 */}
      <ReviewComponent pno={pno} />
    </div>
  );
};

export default ReadComponent;
