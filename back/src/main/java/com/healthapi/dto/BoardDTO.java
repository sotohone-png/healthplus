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
public class BoardDTO {

  private Long bno;
  private String title;
  private String content;
  private String email;
  private String nickname;
  private LocalDateTime regDate;
  private int viewCount;
}