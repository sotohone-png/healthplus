import { Link } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";

const MainPage = () => {
  return (
    <BasicLayout>
      {/* 히어로 섹션 */}
      <div
        className="flex items-center justify-between px-16"
        style={{ background: "#1a1a2e", minHeight: "400px" }}
      >
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            내 건강에 맞는 <br />
            <span style={{ color: "#7ec8a0" }}>맞춤 영양제</span>를 찾아보세요
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            AI가 건강 고민을 분석하고 최적의 제품을 추천해드려요
          </p>
          <div className="flex gap-4">
            <Link
              to="/products/"
              className="px-6 py-3 rounded-full font-medium text-sm"
              style={{ background: "#7ec8a0", color: "#0f3d2a" }}
            >
              상품 둘러보기
            </Link>
            <Link
              to="/ai"
              className="px-6 py-3 rounded-full font-medium text-sm border text-white"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              AI 상담 시작
            </Link>
          </div>
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="px-16 py-16 bg-white">
        <h2
          className="text-2xl font-bold text-center mb-12"
          style={{ color: "#1a1a2e" }}
        >
          HealthPlus의 특별함
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-gray-800 mb-2">AI 건강 상담</h3>
            <p className="text-gray-400 text-sm">
              건강 고민을 말씀해주시면 AI가 맞춤 제품을 추천해드려요
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-gray-100">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="font-bold text-gray-800 mb-2">
              다양한 건강기능식품
            </h3>
            <p className="text-gray-400 text-sm">
              비타민, 오메가3, 홍삼 등 다양한 제품을 한곳에서
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-gray-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">건강 목표 관리</h3>
            <p className="text-gray-400 text-sm">
              나만의 건강 목표를 설정하고 꾸준히 관리해보세요
            </p>
          </div>
        </div>
      </div>

      {/* 공지사항 / 커뮤니티 바로가기 */}
      <div className="px-16 py-10" style={{ background: "#f8fafb" }}>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">📢 공지사항</h3>
            <p className="text-gray-400 text-sm mb-4">
              HealthPlus의 새로운 소식을 확인하세요
            </p>
            <Link
              to="/notice"
              className="text-sm font-medium"
              style={{ color: "#1a1a2e" }}
            >
              공지사항 보러가기 →
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">💬 커뮤니티</h3>
            <p className="text-gray-400 text-sm mb-4">
              건강 정보를 자유롭게 나눠보세요
            </p>
            <Link
              to="/board"
              className="text-sm font-medium"
              style={{ color: "#1a1a2e" }}
            >
              커뮤니티 보러가기 →
            </Link>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
