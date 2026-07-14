package com.healthapi.repository;

import com.healthapi.domain.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
  Page<Notice> findByOrderByRegDateDesc(Pageable pageable);
}