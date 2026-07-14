package com.healthapi.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_board")
public class Board {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bno;

  private String title;

  @Column(length = 2000)
  private String content;

  private String email;

  private String nickname;

  private LocalDateTime regDate;

  private int viewCount;

  public void changeTitle(String title) { this.title = title; }
  public void changeContent(String content) { this.content = content; }
  public void increaseViewCount() { this.viewCount++; }
}