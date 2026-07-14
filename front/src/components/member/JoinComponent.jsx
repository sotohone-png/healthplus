import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initState = {
  email: "",
  pw: "",
  pwConfirm: "",
  nickname: "",
};

const JoinComponent = () => {
  const [joinParam, setJoinParam] = useState({ ...initState });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJoinParam({ ...joinParam, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!joinParam.email) newErrors.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(joinParam.email)) newErrors.email = "올바른 이메일 형식이 아닙니다";
    if (!joinParam.nickname) newErrors.nickname = "닉네임을 입력해주세요";
    if (!joinParam.pw) newErrors.pw = "비밀번호를 입력해주세요";
    else if (joinParam.pw.length < 4) newErrors.pw = "비밀번호는 4자 이상이어야 합니다";
    if (joinParam.pw !== joinParam.pwConfirm) newErrors.pwConfirm = "비밀번호가 일치하지 않습니다";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await axios.post("/api/member/join", {
        email: joinParam.email,
        pw: joinParam.pw,
        nickname: joinParam.nickname,
      });
      alert("회원가입이 완료되었습니다!");
      navigate("/member/login");
    } catch (err) {
  if (err.response?.status === 400) {
    alert(err.response.data.error || "이미 사용중인 이메일입니다");
  } else {
    alert("회원가입 중 오류가 발생했습니다");
  }
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: "#f8fafb" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">
            <span style={{ color: "#1a1a2e" }}>Health</span>
            <span style={{ color: "#7ec8a0" }}>Plus</span>
          </h1>
          <p className="text-gray-400 text-sm">회원가입</p>
        </div>

        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">이메일</label>
          <input
            name="email"
            type="text"
            value={joinParam.email}
            onChange={handleChange}
            placeholder="name@email.com"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: errors.email ? "#e24b4a" : "#e5e7eb" }}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">닉네임</label>
          <input
            name="nickname"
            type="text"
            value={joinParam.nickname}
            onChange={handleChange}
            placeholder="닉네임 입력"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: errors.nickname ? "#e24b4a" : "#e5e7eb" }}
          />
          {errors.nickname && <p className="text-xs text-red-500 mt-1">{errors.nickname}</p>}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">비밀번호</label>
          <input
            name="pw"
            type="password"
            value={joinParam.pw}
            onChange={handleChange}
            placeholder="4자 이상 입력"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: errors.pw ? "#e24b4a" : "#e5e7eb" }}
          />
          {errors.pw && <p className="text-xs text-red-500 mt-1">{errors.pw}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-2">비밀번호 확인</label>
          <input
            name="pwConfirm"
            type="password"
            value={joinParam.pwConfirm}
            onChange={handleChange}
            placeholder="비밀번호 재입력"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: errors.pwConfirm ? "#e24b4a" : "#e5e7eb" }}
          />
          {errors.pwConfirm && <p className="text-xs text-red-500 mt-1">{errors.pwConfirm}</p>}
        </div>

        {/* 가입 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl text-white font-medium text-sm mb-4"
          style={{ background: "#1a1a2e" }}>
          회원가입
        </button>

        {/* 로그인 이동 */}
        <div className="text-center">
          <span className="text-xs text-gray-400">이미 계정이 있으신가요? </span>
          <button
            onClick={() => navigate("/member/login")}
            className="text-xs font-medium"
            style={{ color: "#1a1a2e" }}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinComponent;