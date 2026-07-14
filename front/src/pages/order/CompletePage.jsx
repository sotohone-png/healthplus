import { useNavigate, useSearchParams } from "react-router-dom";

const CompletePage = () => {
  const [searchParams] = useSearchParams();
  const ono = searchParams.get("ono");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: "#f8fafb" }}>
      <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a1a2e" }}>
          주문이 완료되었습니다!
        </h1>
        <p className="text-gray-400 mb-2">주문번호: <span className="font-medium text-gray-700">#{ono}</span></p>
        <p className="text-gray-400 text-sm mb-8">빠른 시일 내에 배송해드리겠습니다.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/products/")}
            className="px-6 py-3 rounded-xl text-sm border border-gray-200 text-gray-600">
            쇼핑 계속하기
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl text-sm text-white font-medium"
            style={{ background: "#1a1a2e" }}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;