package com.healthapi.controller;

import com.healthapi.dto.MemberJoinDTO;
import com.healthapi.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/member")
public class MemberController {

  private final MemberService memberService;

  @PostMapping("/join")
  public ResponseEntity<Map<String, String>> join(@RequestBody MemberJoinDTO memberJoinDTO) {
    log.info("join: " + memberJoinDTO);
    try {
      memberService.join(memberJoinDTO);
      return ResponseEntity.ok(Map.of("result", "success"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }
}  