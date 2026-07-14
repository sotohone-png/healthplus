package com.healthapi.service;

import com.healthapi.domain.Board;
import com.healthapi.dto.BoardDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.repository.BoardRepository;
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
public class BoardServiceImpl implements BoardService {

  private final BoardRepository boardRepository;

  @Override
  public Long register(BoardDTO boardDTO) {
    Board board = Board.builder()
        .title(boardDTO.getTitle())
        .content(boardDTO.getContent())
        .email(boardDTO.getEmail())
        .nickname(boardDTO.getNickname())
        .regDate(LocalDateTime.now())
        .viewCount(0)
        .build();
    return boardRepository.save(board).getBno();
  }

  @Override
  public BoardDTO get(Long bno) {
    Board board = boardRepository.findById(bno).orElseThrow();
    board.increaseViewCount();
    return entityToDTO(board);
  }

  @Override
  public void modify(BoardDTO boardDTO) {
    Board board = boardRepository.findById(boardDTO.getBno()).orElseThrow();
    if (!board.getEmail().equals(boardDTO.getEmail())) {
      throw new RuntimeException("수정 권한이 없습니다.");
    }
    board.changeTitle(boardDTO.getTitle());
    board.changeContent(boardDTO.getContent());
  }

  @Override
  public void remove(Long bno, String email) {
    Board board = boardRepository.findById(bno).orElseThrow();
    if (!board.getEmail().equals(email)) {
      throw new RuntimeException("삭제 권한이 없습니다.");
    }
    boardRepository.deleteById(bno);
  }

  @Override
  public PageResponseDTO<BoardDTO> getList(PageRequestDTO pageRequestDTO) {
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize());
    Page<Board> result = boardRepository.findByOrderByRegDateDesc(pageable);
    List<BoardDTO> dtoList = result.getContent().stream()
        .map(this::entityToDTO)
        .collect(Collectors.toList());
    return PageResponseDTO.<BoardDTO>withAll()
        .dtoList(dtoList)
        .totalCount(result.getTotalElements())
        .pageRequestDTO(pageRequestDTO)
        .build();
  }

  private BoardDTO entityToDTO(Board board) {
    return BoardDTO.builder()
        .bno(board.getBno())
        .title(board.getTitle())
        .content(board.getContent())
        .email(board.getEmail())
        .nickname(board.getNickname())
        .regDate(board.getRegDate())
        .viewCount(board.getViewCount())
        .build();
  }
  @Override
public void removeByManager(Long bno) {
  boardRepository.deleteById(bno);
}
  }
  