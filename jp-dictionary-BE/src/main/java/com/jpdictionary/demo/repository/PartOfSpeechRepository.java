package com.jpdictionary.demo.repository;

import com.jpdictionary.demo.models.PartOfSpeech;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartOfSpeechRepository extends JpaRepository<PartOfSpeech, Long> {

    @Query(value = "SELECT * FROM parts_of_speech", nativeQuery = true)
    List<PartOfSpeech> findAllPartsOfSpeech();

    @Query(value = "SELECT * FROM parts_of_speech WHERE id = :id", nativeQuery = true)
    PartOfSpeech findPartOfSpeechById(@Param("id") Long id);
}