package com.healthapi.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_order")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long ono;

  private String email;

  private LocalDateTime orderDate;

  private String status; // PENDING, PAID, CANCELLED

  // 배송 정보
  private String receiver;     // 수령인
  private String phone;        // 연락처
  private String zipcode;      // 우편번호
  private String address;      // 주소
  private String addressDetail; // 상세주소
  private String deliveryRequest; // 배송 요청사항

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<OrderItem> orderItems = new ArrayList<>();

  public void addOrderItem(OrderItem orderItem) {
    orderItems.add(orderItem);
  }

  public void changeStatus(String status) {
    this.status = status;
  }
}