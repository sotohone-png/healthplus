import { API_SERVER_HOST } from "../../api/healthGoalApi";

const Rest_api_key = "카카오REST_API키"; 
const redirect_uri = `${API_SERVER_HOST}/member/kakao`;
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
const access_token_url = `https://kauth.kakao.com/oauth/token`;

const KakaoLoginComponent = () => {
  const kakaoURL = `${auth_code_path}?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div>
      <button
        onClick={handleKakaoLogin}
        className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        style={{ background: "#fee500", color: "#3c1e1e" }}>
        카카오로 로그인
      </button>
    </div>
  );
};

export default KakaoLoginComponent;