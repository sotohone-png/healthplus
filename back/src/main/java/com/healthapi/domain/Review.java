package com.healthapi.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_review")
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long rno;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_pno")
  private Product product;

  private String email;
  private String nickname;
  private String content;
  private int rating;
  private LocalDateTime regDate;

  public void changeContent(String content) { this.content = content; }
  public void changeRating(int rating) { this.rating = rating; }
}