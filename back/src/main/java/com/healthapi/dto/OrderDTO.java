package com.healthapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {

  private Long ono;
  private String email;
  private LocalDateTime orderDate;
  private String status;
  private List<OrderItemDTO> orderItems;
  private int totalPrice;

  // 배송 정보
  private String receiver;
  private String phone;
  private String zipcode;
  private String address;
  private String addressDetail;
  private String deliveryRequest;
}