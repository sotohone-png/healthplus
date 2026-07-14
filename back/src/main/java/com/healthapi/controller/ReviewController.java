package com.healthapi.controller;

import com.healthapi.dto.MemberDTO;
import com.healthapi.dto.ReviewDTO;
import com.healthapi.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/review")
public class ReviewController {

  private final ReviewService reviewService;

  @PostMapping("/")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public Map<String, Long> register(@RequestBody ReviewDTO reviewDTO) {
    log.info("review register: " + reviewDTO);
    Long rno = reviewService.register(reviewDTO);
    return Map.of("rno", rno);
  }

  @GetMapping("/list/{pno}")
  public List<ReviewDTO> getList(@PathVariable Long pno) {
    return reviewService.getListByProduct(pno);
  }

  @PutMapping("/{rno}")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public Map<String, String> modify(@PathVariable Long rno,
                                     @RequestBody ReviewDTO reviewDTO) {
    reviewDTO.setRno(rno);
    reviewService.modify(reviewDTO);
    return Map.of("result", "success");
  }

 @DeleteMapping("/{rno}")
@PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
public Map<String, String> remove(@PathVariable Long rno,
                                   Authentication authentication) {
  // 보안 수정: 클라이언트가 보낸 email 쿼리 파라미터를 그대로 신뢰하면
  // 요청자가 email 값만 바꿔서 타인의 리뷰를 삭제할 수 있는 취약점이 있었음(BUG-021).
  // 대신 JWT 토큰으로 인증된 실제 로그인 사용자의 이메일을 사용함.
  MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
  reviewService.remove(rno, memberDTO.getEmail());
  return Map.of("result", "success");
}
}