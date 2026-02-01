package com.jpdictionary.demo.repository;

import com.jpdictionary.demo.models.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExampleRepository extends JpaRepository<Example, Long> {
    @Query(value = "SELECT * FROM examples WHERE word_id = :wordId", nativeQuery = true)
    List<Example> findByWordId(Long wordId);
}