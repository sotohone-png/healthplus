import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { useNavigate } from "react-router-dom";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { doLogin, moveToPath } = useCustomLogin();
  const navigate = useNavigate(); // ← 여기로 이동

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = () => {
    doLogin(loginParam).then((data) => {
      // 로그인 실패 시 loginPostAsync가 rejected 되면서 payload가 undefined로 옴
      // (BUG-023 수정으로 백엔드가 401을 정상 반환하게 되면서 이 분기가 실제로 타게 됨)
      if (!data || data.error) {
        alert("이메일과 패스워드를 다시 확인하세요");
      } else {
        alert("로그인 성공");
        moveToPath("/");
      }
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f8fafb" }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">
            <span style={{ color: "#1a1a2e" }}>Health</span>
            <span style={{ color: "#7ec8a0" }}>Plus</span>
          </h1>
          <p className="text-gray-400 text-sm">건강한 삶을 위한 맞춤 영양제</p>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">이메일</label>
          <input
            name="email"
            type="text"
            value={loginParam.email}
            onChange={handleChange}
            placeholder="name@email.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-2">비밀번호</label>
          <input
            name="pw"
            type="password"
            value={loginParam.pw}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-300"
          />
        </div>
        <button
          onClick={handleClickLogin}
          className="w-full py-3 rounded-xl text-white font-medium text-sm mb-4"
          style={{ background: "#1a1a2e" }}
        >
          로그인
        </button>
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <hr className="flex-1 border-gray-200" />
        </div>
        <KakaoLoginComponent />
        <div className="flex justify-center gap-4 mt-6">
          <span
            onClick={() => navigate("/member/join")}
            className="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
          >
            회원가입
          </span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            아이디 찾기
          </span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
