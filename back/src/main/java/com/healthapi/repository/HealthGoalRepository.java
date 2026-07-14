package com.healthapi.repository;

import com.healthapi.domain.HealthGoal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthGoalRepository extends JpaRepository<HealthGoal, Long> {
  Page<HealthGoal> findByWriterOrderByTnoDesc(String writer, Pageable pageable);
}