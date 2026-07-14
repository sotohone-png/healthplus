import { API_SERVER_HOST } from "./healthGoalApi";
import jwtAxios from "../util/jwtUtil";
import axios from "axios";

const host = `/api/products`;

export const postAdd = async (product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.post(`${host}/`, product, header);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

export const getOne = async (tno) => {
  const res = await axios.get(`${host}/${tno}`);
  return res.data;
};

export const putOne = async (pno, product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.put(`${host}/${pno}`, product, header);
  return res.data;
};

export const deleteOne = async (pno) => {
  const res = await jwtAxios.delete(`${host}/${pno}`);
  return res.data;
};

export const getSearchList = async (keyword, pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/search`, {
    params: { keyword, page, size },
  });
  return res.data;
};

export const getListByCategory = async (category, pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/category`, {
    params: { category, page, size },
  });
  return res.data;
};
