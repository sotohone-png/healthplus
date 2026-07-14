import jwtAxios from "../util/jwtUtil";

const host = `/api/ai`;

export const postConsult = async (message) => {
  const res = await jwtAxios.post(`${host}/consult`, { message });
  return res.data;
};
