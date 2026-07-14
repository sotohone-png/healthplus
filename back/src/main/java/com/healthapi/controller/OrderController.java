package com.healthapi.controller;

import com.healthapi.dto.OrderDTO;
import com.healthapi.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/order")
public class OrderController {

  private final OrderService orderService;

  @PostMapping("/")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public Map<String, Long> register(@RequestBody OrderDTO orderDTO) {
    log.info("order register: " + orderDTO);
    Long ono = orderService.register(orderDTO);
    return Map.of("ono", ono);
  }

  @GetMapping("/list/{email}")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public List<OrderDTO> getList(@PathVariable String email) {
    return orderService.getListByEmail(email);
  }

  @GetMapping("/{ono}")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public OrderDTO get(@PathVariable Long ono) {
    return orderService.get(ono);
  }

  @PutMapping("/cancel/{ono}")
  @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
  public Map<String, String> cancel(@PathVariable Long ono) {
    orderService.cancel(ono);
    return Map.of("result", "cancelled");
  }
}