package com.healthapi.service;

import com.healthapi.dto.HealthGoalDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;

public interface HealthGoalService {
  HealthGoalDTO get(Long tno);
  Long register(HealthGoalDTO healthGoalDTO);
  void modify(HealthGoalDTO healthGoalDTO);
  void remove(Long tno);
  PageResponseDTO<HealthGoalDTO> list(PageRequestDTO pageRequestDTO);
  PageResponseDTO<HealthGoalDTO> listByWriter(String writer, PageRequestDTO pageRequestDTO);
}