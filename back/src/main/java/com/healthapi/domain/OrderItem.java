package com.healthapi.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_order_item")
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long oino;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_ono")
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_pno")
  private Product product;

  private int qty;

  private int price;
}