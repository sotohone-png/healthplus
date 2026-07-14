import jwtAxios from "../util/jwtUtil";
import axios from "axios";

const host = `/api/notice`;

export const getNoticeList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(`${host}/list`, { params: { page, size } });
  return res.data;
};

export const getNotice = async (nno) => {
  const res = await jwtAxios.get(`${host}/${nno}`);
  return res.data;
};

export const postNotice = async (noticeDTO) => {
  const res = await jwtAxios.post(`${host}/`, noticeDTO);
  return res.data;
};

export const putNotice = async (noticeDTO) => {
  const res = await jwtAxios.put(`${host}/${noticeDTO.nno}`, noticeDTO);
  return res.data;
};

export const deleteNotice = async (nno) => {
  const res = await jwtAxios.delete(`${host}/${nno}`);
  return res.data;
};