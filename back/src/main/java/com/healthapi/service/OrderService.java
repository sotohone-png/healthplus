package com.healthapi.service;

import com.healthapi.dto.OrderDTO;
import java.util.List;

public interface OrderService {
  Long register(OrderDTO orderDTO);
  List<OrderDTO> getListByEmail(String email);
  OrderDTO get(Long ono);
  void cancel(Long ono);
}