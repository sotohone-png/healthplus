package com.healthapi.service;

import com.healthapi.domain.Product;
import com.healthapi.domain.Review;
import com.healthapi.dto.ReviewDTO;
import com.healthapi.repository.ProductRepository;
import com.healthapi.repository.ReviewRepository;
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
public class ReviewServiceImpl implements ReviewService {

  private final ReviewRepository reviewRepository;
  private final ProductRepository productRepository;

  @Override
  public Long register(ReviewDTO reviewDTO) {
    Product product = productRepository.findById(reviewDTO.getPno()).orElseThrow();

    Review review = Review.builder()
        .product(product)
        .email(reviewDTO.getEmail())
        .nickname(reviewDTO.getNickname())
        .content(reviewDTO.getContent())
        .rating(reviewDTO.getRating())
        .regDate(LocalDateTime.now())
        .build();

    return reviewRepository.save(review).getRno();
  }

  @Override
  public List<ReviewDTO> getListByProduct(Long pno) {
    return reviewRepository.findByProductPnoOrderByRegDateDesc(pno)
        .stream()
        .map(this::entityToDTO)
        .collect(Collectors.toList());
  }

  @Override
  public void modify(ReviewDTO reviewDTO) {
    Review review = reviewRepository.findById(reviewDTO.getRno()).orElseThrow();
    review.changeContent(reviewDTO.getContent());
    review.changeRating(reviewDTO.getRating());
  }

  @Override
public void remove(Long rno, String email) {
  Review review = reviewRepository.findById(rno).orElseThrow();
  if (!review.getEmail().equals(email)) {
    throw new RuntimeException("삭제 권한이 없습니다.");
  }
  reviewRepository.deleteById(rno);
}
  private ReviewDTO entityToDTO(Review review) {
    return ReviewDTO.builder()
        .rno(review.getRno())
        .pno(review.getProduct().getPno())
        .email(review.getEmail())
        .nickname(review.getNickname())
        .content(review.getContent())
        .rating(review.getRating())
        .regDate(review.getRegDate())
        .build();
  }
}