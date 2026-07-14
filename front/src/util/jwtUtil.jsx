import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/healthGoalApi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;

  const header = { headers: { Authorization: `Bearer ${accessToken}` } };

  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header,
  );

  console.log("----------------------");
  console.log(res.data);

  return res.data;
};

const beforeReq = (config) => {
  console.log("before request.............");
  const memberInfo = getCookie("member");

  if (!memberInfo) {
    console.log("Member NOT FOUND");
    return Promise.reject({ response: { data: { error: "REQUIRE_LOGIN" } } });
  }

  const { accessToken } = memberInfo;
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

const requestFail = (err) => {
  console.log("request error............");
  return Promise.reject(err);
};

const beforeRes = async (res) => {
  console.log("before return response...........");
  console.log(res);

  const data = res.data;

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    return await retryWithRefresh(res.config);
  }

  return res;
};

const retryWithRefresh = async (originalConfig) => {
  const memberCookieValue = getCookie("member");

  const result = await refreshJWT(
    memberCookieValue.accessToken,
    memberCookieValue.refreshToken,
  );
  console.log("refreshJWT RESULT", result);

  memberCookieValue.accessToken = result.accessToken;
  memberCookieValue.refreshToken = result.refreshToken;

  setCookie("member", JSON.stringify(memberCookieValue), 1);

  if (originalConfig._retry) {
    console.log("이미 재시도했음. 중단.");
    throw new Error("Token refresh failed - already retried");
  }

  // Content-Type 헤더 제거 (multipart는 axios가 자동으로 설정)
  return await axios({
    method: originalConfig.method,
    url: originalConfig.url,
    data: originalConfig.data,
    params: originalConfig.params,
    headers: {
      Authorization: `Bearer ${result.accessToken}`,
    },
  });
};

const responseFail = async (err) => {
  console.log("response fail error.............");

  const errorData = err.response?.data;

  if (errorData && errorData.error === "ERROR_ACCESS_TOKEN" && err.config) {
    try {
      return await retryWithRefresh(err.config);
    } catch (refreshError) {
      console.log("토큰 갱신 실패: ", refreshError);
      return Promise.reject(err);
    }
  }

  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);

jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
