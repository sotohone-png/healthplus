package com.healthapi.service;

import com.healthapi.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
  Long register(ReviewDTO reviewDTO);
  List<ReviewDTO> getListByProduct(Long pno);
  void modify(ReviewDTO reviewDTO);
  void remove(Long rno, String email);
}