package com.healthapi.service;

import com.healthapi.dto.NoticeDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;

public interface NoticeService {
  Long register(NoticeDTO noticeDTO);
  NoticeDTO get(Long nno);
  void modify(NoticeDTO noticeDTO);
  void remove(Long nno);
  PageResponseDTO<NoticeDTO> getList(PageRequestDTO pageRequestDTO);
}