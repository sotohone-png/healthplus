package com.healthapi.service;

import com.healthapi.dto.BoardDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;

public interface BoardService {
  Long register(BoardDTO boardDTO);
  BoardDTO get(Long bno);
  void modify(BoardDTO boardDTO);
  void remove(Long bno, String email);
  void removeByManager(Long bno);
  PageResponseDTO<BoardDTO> getList(PageRequestDTO pageRequestDTO);
}