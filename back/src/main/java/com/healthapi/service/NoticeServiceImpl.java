package com.healthapi.service;

import com.healthapi.domain.Notice;
import com.healthapi.dto.NoticeDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

  private final NoticeRepository noticeRepository;

  @Override
  public Long register(NoticeDTO noticeDTO) {
    Notice notice = Notice.builder()
        .title(noticeDTO.getTitle())
        .content(noticeDTO.getContent())
        .email(noticeDTO.getEmail())
        .nickname(noticeDTO.getNickname())
        .regDate(LocalDateTime.now())
        .viewCount(0)
        .build();
    return noticeRepository.save(notice).getNno();
  }

  @Override
  public NoticeDTO get(Long nno) {
    Notice notice = noticeRepository.findById(nno).orElseThrow();
    notice.increaseViewCount();
    return entityToDTO(notice);
  }

  @Override
  public void modify(NoticeDTO noticeDTO) {
    Notice notice = noticeRepository.findById(noticeDTO.getNno()).orElseThrow();
    notice.changeTitle(noticeDTO.getTitle());
    notice.changeContent(noticeDTO.getContent());
  }

  @Override
  public void remove(Long nno) {
    noticeRepository.deleteById(nno);
  }

  @Override
  public PageResponseDTO<NoticeDTO> getList(PageRequestDTO pageRequestDTO) {
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize());
    Page<Notice> result = noticeRepository.findByOrderByRegDateDesc(pageable);
    List<NoticeDTO> dtoList = result.getContent().stream()
        .map(this::entityToDTO)
        .collect(Collectors.toList());
    return PageResponseDTO.<NoticeDTO>withAll()
        .dtoList(dtoList)
        .totalCount(result.getTotalElements())
        .pageRequestDTO(pageRequestDTO)
        .build();
  }

  private NoticeDTO entityToDTO(Notice notice) {
    return NoticeDTO.builder()
        .nno(notice.getNno())
        .title(notice.getTitle())
        .content(notice.getContent())
        .email(notice.getEmail())
        .nickname(notice.getNickname())
        .regDate(notice.getRegDate())
        .viewCount(notice.getViewCount())
        .build();
  }
}