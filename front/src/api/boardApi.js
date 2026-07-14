import jwtAxios from "../util/jwtUtil";
import axios from "axios";

const host = `/api/board`;

export const getBoardList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(`${host}/list`, { params: { page, size } });
  return res.data;
};

export const getBoard = async (bno) => {
  const res = await jwtAxios.get(`${host}/${bno}`);
  return res.data;
};

export const postBoard = async (boardDTO) => {
  const res = await jwtAxios.post(`${host}/`, boardDTO);
  return res.data;
};

export const putBoard = async (boardDTO) => {
  const res = await jwtAxios.put(`${host}/${boardDTO.bno}`, boardDTO);
  return res.data;
};

export const deleteBoard = async (bno, email) => {
  const res = await jwtAxios.delete(`${host}/${bno}?email=${email}`);
  return res.data;
};

export const deleteBoardByManager = async (bno) => {
  const res = await jwtAxios.delete(`${host}/manager/${bno}`);
  return res.data;
};
