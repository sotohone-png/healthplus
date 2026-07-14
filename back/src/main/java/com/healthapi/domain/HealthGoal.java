package com.healthapi.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_health_goal")
public class HealthGoal {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long tno;

  private String title;
  private String writer;
  private boolean complete;
  private LocalDate dueDate;

  public void changeTitle(String title) { this.title = title; }
  public void changeDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
  public void changeComplete(boolean complete) { this.complete = complete; }
}