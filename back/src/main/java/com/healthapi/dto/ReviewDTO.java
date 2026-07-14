package com.healthapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

  private Long rno;
  private Long pno;
  private String email;
  private String nickname;
  private String content;
  private int rating;
  private LocalDateTime regDate;
}