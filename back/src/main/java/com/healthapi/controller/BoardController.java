package com.healthapi.controller;

import com.healthapi.dto.BoardDTO;
import com.healthapi.dto.MemberDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/board")
public class BoardController {

  private final BoardService boardService;

  @GetMapping("/list")
  public PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO) {
    return boardService.getList(pageRequestDTO);
  }

  @GetMapping("/{bno}")
  public BoardDTO get(@PathVariable Long bno) {
    return boardService.get(bno);
  }

  @PostMapping("/")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MANAGER')")
  public Map<String, Long> register(@RequestBody BoardDTO boardDTO) {
    Long bno = boardService.register(boardDTO);
    return Map.of("bno", bno);
  }

  @PutMapping("/{bno}")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MANAGER')")
  public Map<String, String> modify(@PathVariable Long bno,
                                     @RequestBody BoardDTO boardDTO) {
    boardDTO.setBno(bno);
    boardService.modify(boardDTO);
    return Map.of("result", "success");
  }

  @DeleteMapping("/{bno}")
    public Map<String, String> remove(@PathVariable Long bno,
                                     Authentication authentication) {
    // 보안 수정: 클라이언트가 보낸 email 쿼리 파라미터를 그대로 신뢰하면
    // 요청자가 email 값만 바꿔서 타인의 게시글을 삭제할 수 있는 취약점이 있었음(BUG-021).
    // 대신 JWT 토큰으로 인증된 실제 로그인 사용자의 이메일을 사용함.
    MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
    boardService.remove(bno, memberDTO.getEmail());
    return Map.of("result", "success");
  }

  @DeleteMapping("/manager/{bno}")
  @PreAuthorize("hasRole('MANAGER')")
  public Map<String, String> removeByManager(@PathVariable Long bno) {
    boardService.removeByManager(bno);
    return Map.of("result", "success");
  }
}