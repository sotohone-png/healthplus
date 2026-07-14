package com.healthapi.repository;

import com.healthapi.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByEmailOrderByOrderDateDesc(String email);
}