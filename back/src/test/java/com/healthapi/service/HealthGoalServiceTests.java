package com.healthapi.service;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.dto.HealthGoalDTO;
import com.healthapi.service.HealthGoalService;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class HealthGoalServiceTests {
  
  @Autowired
  private HealthGoalService todoService;

  @Test
  public void testRegister() {

    HealthGoalDTO todoDTO = HealthGoalDTO.builder()
    .title("서비스 테스트")
    .writer("tester")
    .dueDate(LocalDate.of(2026,10,10))
    .build();

    Long tno = todoService.register(todoDTO);

    log.info("TNO: " + tno);
    
  }

   @Test
  public void testList() {
    PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
    .page(2)
    .size(10)
    .build();
    PageResponseDTO<HealthGoalDTO> response = todoService.list(pageRequestDTO);
    log.info(response);
  }
}