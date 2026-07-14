import jwtAxios from "../util/jwtUtil";

const host = `/api/order`;

export const postOrder = async (orderDTO) => {
  const res = await jwtAxios.post(`${host}/`, orderDTO);
  return res.data;
};

export const getOrderList = async (email) => {
  const res = await jwtAxios.get(`${host}/list/${email}`);
  return res.data;
};

export const getOrder = async (ono) => {
  const res = await jwtAxios.get(`${host}/${ono}`);
  return res.data;
};

export const cancelOrder = async (ono) => {
  const res = await jwtAxios.put(`${host}/cancel/${ono}`);
  return res.data;
};