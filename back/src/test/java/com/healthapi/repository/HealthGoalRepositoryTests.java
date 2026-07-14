package com.healthapi.repository;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.healthapi.domain.HealthGoal;
import com.healthapi.repository.HealthGoalRepository;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class HealthGoalRepositoryTests {

    @Autowired
    private HealthGoalRepository todoRepository;

    @Test
    public void test1(){

        log.info("----------------------------");   
        log.info(todoRepository);
    }

  @Test
  public void testInsert() {

    for (int i = 1; i <= 100; i++) {

      HealthGoal todo = HealthGoal.builder()
      .title("Title..." + i)
      .dueDate(LocalDate.of(2024,12,31))
      .writer("user00")
      .build();

      todoRepository.save(todo);
    }
  }

    @Test
  public void testModify() {

    Long tno = 100L;

    java.util.Optional<HealthGoal> result = todoRepository.findById(tno); //java.util 패키지의 Optional

    HealthGoal todo = result.orElseThrow();
    todo.changeTitle("Modified 100...");
    todo.changeComplete(true);
    todo.changeDueDate(LocalDate.of(2026,06,23));

    todoRepository.save(todo);

  }

  
      @Test
  public void testPaging() {

    //import org.springframework.data.domain.Pageable;

    Pageable pageable = PageRequest.of(0,10, Sort
        .by("tno").descending());

    Page<HealthGoal> result = todoRepository.findAll(pageable);

    log.info(result.getTotalElements());

    result.getContent().stream().forEach(todo -> log.info(todo));

  }
}
