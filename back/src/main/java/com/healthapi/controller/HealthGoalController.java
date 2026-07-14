package com.healthapi.controller;

import com.healthapi.dto.HealthGoalDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.service.HealthGoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/healthgoal")
public class HealthGoalController {

  private final HealthGoalService healthGoalService;

  @GetMapping("/list")
  public PageResponseDTO<HealthGoalDTO> list(PageRequestDTO pageRequestDTO) {
    log.info(pageRequestDTO);
    return healthGoalService.list(pageRequestDTO);
  }

  @GetMapping("/list/{writer}")
  public PageResponseDTO<HealthGoalDTO> listByWriter(
      @PathVariable String writer,
      PageRequestDTO pageRequestDTO) {
    log.info("writer: " + writer);
    return healthGoalService.listByWriter(writer, pageRequestDTO);
  }

  @PostMapping("/")
  public Long register(@RequestBody HealthGoalDTO healthGoalDTO) {
    log.info("HealthGoalDTO: " + healthGoalDTO);
    return healthGoalService.register(healthGoalDTO);
  }

  @GetMapping("/{tno}")
  public HealthGoalDTO get(@PathVariable Long tno) {
    return healthGoalService.get(tno);
  }

  @PutMapping("/{tno}")
  public HealthGoalDTO modify(@PathVariable Long tno, @RequestBody HealthGoalDTO healthGoalDTO) {
    log.info("Modify: " + healthGoalDTO);
    healthGoalDTO.setTno(tno);
    healthGoalService.modify(healthGoalDTO);
    return healthGoalDTO;
  }

  @DeleteMapping("/{tno}")
  public void remove(@PathVariable Long tno) {
    log.info("Remove: " + tno);
    healthGoalService.remove(tno);
  }
}