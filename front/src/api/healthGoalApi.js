import jaxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}/api/healthgoal`;

export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jaxios.get(`${host}/list`, { params: { page, size } });
  return res.data;
};

export const getOne = async (tno) => {
  const res = await jaxios.get(`${host}/${tno}`);
  return res.data;
};

export const postAdd = async (healthGoal) => {
  const res = await jaxios.post(`${host}/`, healthGoal);
  return res.data;
};

export const putOne = async (healthGoal) => {
  const res = await jaxios.put(`${host}/${healthGoal.tno}`, healthGoal);
  return res.data;
};

export const deleteOne = async (tno) => {
  const res = await jaxios.delete(`${host}/${tno}`);
  return res.data;
};

export const getListByWriter = async (writer, pageParam) => {
  const { page, size } = pageParam;
  const res = await jaxios.get(`${host}/list/${writer}`, {
    params: { page, size },
  });
  return res.data;
};
