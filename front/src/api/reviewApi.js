import jwtAxios from "../util/jwtUtil";
import axios from "axios";

const host = `/api/review`;

export const postReview = async (reviewDTO) => {
  const res = await jwtAxios.post(`${host}/`, reviewDTO);
  return res.data;
};

export const getReviewList = async (pno) => {
  const res = await axios.get(`${host}/list/${pno}`);
  return res.data;
};

export const putReview = async (reviewDTO) => {
  const res = await jwtAxios.put(`${host}/${reviewDTO.rno}`, reviewDTO);
  return res.data;
};

export const deleteReview = async (rno, email) => {
  const res = await jwtAxios.delete(`${host}/${rno}?email=${email}`);
  return res.data;
};