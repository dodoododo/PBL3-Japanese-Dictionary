package com.jpdictionary.demo.repository;

import com.jpdictionary.demo.models.SavedWord;
import com.jpdictionary.demo.models.SavedWordId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedWordRepository extends JpaRepository<SavedWord, SavedWordId> {
    
    @Query(value = "SELECT * FROM saved_words WHERE user_id = :userId ORDER BY saved_at DESC", 
           nativeQuery = true)
    List<SavedWord> findByUserId(@Param("userId") Long userId);
    
    @Query(value = "SELECT * FROM saved_words WHERE user_id = :userId AND word_id = :wordId", 
           nativeQuery = true)
    Optional<SavedWord> findByUserIdAndWordId(@Param("userId") Long userId, 
                                             @Param("wordId") String wordId);
    
    @Query(value = "SELECT COUNT(*) > 0 FROM saved_words WHERE user_id = :userId AND word_id = :wordId", 
           nativeQuery = true)
    boolean existsByUserIdAndWordId(@Param("userId") Long userId, 
                                   @Param("wordId") String wordId);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM saved_words WHERE user_id = :userId AND word_id = :wordId", 
           nativeQuery = true)
    void deleteByUserIdAndWordId(@Param("userId") Long userId, 
                                @Param("wordId") String wordId);
    
    @Query(value = "SELECT COUNT(*) FROM saved_words WHERE user_id = :userId", 
           nativeQuery = true)
    long countByUserId(@Param("userId") Long userId);
}