package com.healthapi.controller;

import com.healthapi.dto.NoticeDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/notice")
public class NoticeController {

  private final NoticeService noticeService;

  @GetMapping("/list")
  public PageResponseDTO<NoticeDTO> list(PageRequestDTO pageRequestDTO) {
    return noticeService.getList(pageRequestDTO);
  }

  @GetMapping("/{nno}")
  public NoticeDTO get(@PathVariable Long nno) {
    return noticeService.get(nno);
  }

  @PostMapping("/")
  @PreAuthorize("hasRole('MANAGER')")
  public Map<String, Long> register(@RequestBody NoticeDTO noticeDTO) {
    Long nno = noticeService.register(noticeDTO);
    return Map.of("nno", nno);
  }

  @PutMapping("/{nno}")
  @PreAuthorize("hasRole('MANAGER')")
  public Map<String, String> modify(@PathVariable Long nno,
                                     @RequestBody NoticeDTO noticeDTO) {
    noticeDTO.setNno(nno);
    noticeService.modify(noticeDTO);
    return Map.of("result", "success");
  }

  @DeleteMapping("/{nno}")
  @PreAuthorize("hasRole('MANAGER')")
  public Map<String, String> remove(@PathVariable Long nno) {
    noticeService.remove(nno);
    return Map.of("result", "success");
  }
}