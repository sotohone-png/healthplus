package com.healthapi.service;

import com.healthapi.domain.Order;
import com.healthapi.domain.OrderItem;
import com.healthapi.domain.Product;
import com.healthapi.dto.OrderDTO;
import com.healthapi.dto.OrderItemDTO;
import com.healthapi.repository.OrderRepository;
import com.healthapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;

  @Override
  public Long register(OrderDTO orderDTO) {
    Order order = Order.builder()
        .email(orderDTO.getEmail())
        .orderDate(LocalDateTime.now())
        .status("PENDING")
        .receiver(orderDTO.getReceiver())
        .phone(orderDTO.getPhone())
        .zipcode(orderDTO.getZipcode())
        .address(orderDTO.getAddress())
        .addressDetail(orderDTO.getAddressDetail())
        .deliveryRequest(orderDTO.getDeliveryRequest())
        .build();

    orderDTO.getOrderItems().forEach(itemDTO -> {
      Product product = productRepository.findById(itemDTO.getPno()).orElseThrow();
      OrderItem orderItem = OrderItem.builder()
          .order(order)
          .product(product)
          .qty(itemDTO.getQty())
          .price(product.getPrice())
          .build();
      order.addOrderItem(orderItem);
    });

    return orderRepository.save(order).getOno();
  }

  @Override
  public List<OrderDTO> getListByEmail(String email) {
    return orderRepository.findByEmailOrderByOrderDateDesc(email)
        .stream()
        .map(this::entityToDTO)
        .collect(Collectors.toList());
  }

  @Override
  public OrderDTO get(Long ono) {
    Order order = orderRepository.findById(ono).orElseThrow();
    return entityToDTO(order);
  }

  @Override
  public void cancel(Long ono) {
    Order order = orderRepository.findById(ono).orElseThrow();
    order.changeStatus("CANCELLED");
  }

  private OrderDTO entityToDTO(Order order) {
    List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
        .map(item -> OrderItemDTO.builder()
            .oino(item.getOino())
            .pno(item.getProduct().getPno())
            .pname(item.getProduct().getPname())
            .qty(item.getQty())
            .price(item.getPrice())
            .build())
        .collect(Collectors.toList());

    int totalPrice = itemDTOs.stream()
        .mapToInt(item -> item.getPrice() * item.getQty())
        .sum();

    return OrderDTO.builder()
        .ono(order.getOno())
        .email(order.getEmail())
        .orderDate(order.getOrderDate())
        .status(order.getStatus())
        .orderItems(itemDTOs)
        .totalPrice(totalPrice)
        .receiver(order.getReceiver())
        .phone(order.getPhone())
        .zipcode(order.getZipcode())
        .address(order.getAddress())
        .addressDetail(order.getAddressDetail())
        .deliveryRequest(order.getDeliveryRequest())
        .build();
  }
}