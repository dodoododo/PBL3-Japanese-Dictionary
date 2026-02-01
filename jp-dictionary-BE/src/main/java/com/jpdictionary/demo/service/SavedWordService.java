package com.jpdictionary.demo.service;

import com.jpdictionary.demo.models.SavedWord;
import com.jpdictionary.demo.models.SavedWordId;
import com.jpdictionary.demo.repository.SavedWordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SavedWordService {
    
    private static final Logger logger = LoggerFactory.getLogger(SavedWordService.class);
    
    @Autowired
    private SavedWordRepository savedWordRepository;
    
    private final ThreadLocal<String> lastMessage = new ThreadLocal<>();
    
    public List<SavedWord> getSavedWordsByUser(Long userId) {
        logger.info("Fetching saved words for userId: {}", userId);
        if (userId == null) {
            logger.error("UserId is null");
            throw new IllegalArgumentException("User ID cannot be null");
        }
        List<SavedWord> savedWords = savedWordRepository.findByUserId(userId);
        return savedWords != null ? savedWords : Collections.emptyList();
    }
    
    public SavedWord saveWord(Long userId, String wordId, Map<String, Object> wordData) {
        logger.info("Saving wordId: {} for userId: {}", wordId, userId);
        if (userId == null || wordId == null) {
            logger.error("Invalid userId: {} or wordId: {}", userId, wordId);
            throw new IllegalArgumentException("User ID and Word ID cannot be null");
        }
        Optional<SavedWord> existing = savedWordRepository.findByUserIdAndWordId(userId, wordId);
        if (existing.isPresent()) {
            logger.info("WordId: {} already saved for userId: {}", wordId, userId);
            lastMessage.set("Word already saved");
            return null;
        }
        
        SavedWord savedWord = new SavedWord(userId, wordId);
        return savedWordRepository.save(savedWord);
    }
    
    public void deleteSavedWord(Long userId, String wordId) {
        logger.info("Deleting wordId: {} for userId: {}", wordId, userId);
        if (userId == null || wordId == null) {
            logger.error("Invalid userId: {} or wordId: {}", userId, wordId);
            throw new IllegalArgumentException("User ID and Word ID cannot be null");
        }
        savedWordRepository.deleteByUserIdAndWordId(userId, wordId);
    }
    
    public long countSavedWords(Long userId) {
        logger.info("Counting saved words for userId: {}", userId);
        if (userId == null) {
            logger.error("UserId is null");
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return savedWordRepository.countByUserId(userId);
    }
    
    public String getLastMessage() {
        return lastMessage.get() != null ? lastMessage.get() : "Unknown error";
    }
}