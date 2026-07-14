package com.healthapi.service;

import com.healthapi.domain.HealthGoal;
import com.healthapi.dto.HealthGoalDTO;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.repository.HealthGoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class HealthGoalServiceImpl implements HealthGoalService {

  private final HealthGoalRepository healthGoalRepository;
  private final ModelMapper modelMapper;

  @Override
  public HealthGoalDTO get(Long tno) {
    Optional<HealthGoal> result = healthGoalRepository.findById(tno);
    HealthGoal healthGoal = result.orElseThrow();
    return modelMapper.map(healthGoal, HealthGoalDTO.class);
  }

  @Override
  public Long register(HealthGoalDTO healthGoalDTO) {
    log.info(".........");
    HealthGoal healthGoal = modelMapper.map(healthGoalDTO, HealthGoal.class);
    HealthGoal saved = healthGoalRepository.save(healthGoal);
    return saved.getTno();
  }

  @Override
  public void modify(HealthGoalDTO healthGoalDTO) {
    Optional<HealthGoal> result = healthGoalRepository.findById(healthGoalDTO.getTno());
    HealthGoal healthGoal = result.orElseThrow();
    healthGoal.changeTitle(healthGoalDTO.getTitle());
    healthGoal.changeDueDate(healthGoalDTO.getDueDate());
    healthGoal.changeComplete(healthGoalDTO.isComplete());
    healthGoalRepository.save(healthGoal);
  }

  @Override
  public void remove(Long tno) {
    healthGoalRepository.deleteById(tno);
  }

  @Override
  public PageResponseDTO<HealthGoalDTO> list(PageRequestDTO pageRequestDTO) {
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize(),
        Sort.by("tno").descending());
    Page<HealthGoal> result = healthGoalRepository.findAll(pageable);
    List<HealthGoalDTO> dtoList = result.getContent().stream()
        .map(hg -> modelMapper.map(hg, HealthGoalDTO.class))
        .collect(Collectors.toList());
    return PageResponseDTO.<HealthGoalDTO>withAll()
        .pageRequestDTO(pageRequestDTO)
        .dtoList(dtoList)
        .totalCount((int) result.getTotalElements())
        .build();
  }

  @Override
  public PageResponseDTO<HealthGoalDTO> listByWriter(String writer, PageRequestDTO pageRequestDTO) {
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize(),
        Sort.by("tno").descending());
    Page<HealthGoal> result = healthGoalRepository.findByWriterOrderByTnoDesc(writer, pageable);
    List<HealthGoalDTO> dtoList = result.getContent().stream()
        .map(hg -> modelMapper.map(hg, HealthGoalDTO.class))
        .collect(Collectors.toList());
    return PageResponseDTO.<HealthGoalDTO>withAll()
        .pageRequestDTO(pageRequestDTO)
        .dtoList(dtoList)
        .totalCount((int) result.getTotalElements())
        .build();
  }
}