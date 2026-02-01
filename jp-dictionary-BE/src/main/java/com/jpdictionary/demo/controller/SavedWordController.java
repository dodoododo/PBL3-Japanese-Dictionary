package com.jpdictionary.demo.controller;

import com.jpdictionary.demo.models.SavedWord;
import com.jpdictionary.demo.service.SavedWordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-words")
@CrossOrigin(origins = "http://localhost:3000")
public class SavedWordController {
    
    private static final Logger logger = LoggerFactory.getLogger(SavedWordController.class);
    
    @Autowired
    private SavedWordService savedWordService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedWord>> getSavedWords(@PathVariable Long userId) {
        try {
            logger.info("Fetching saved words for userId: {}", userId);
            List<SavedWord> savedWords = savedWordService.getSavedWordsByUser(userId);
            return ResponseEntity.ok(savedWords != null ? savedWords : Collections.emptyList());
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        } catch (Exception e) {
            logger.error("Error fetching saved words for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    
    @PostMapping("/user/{userId}/word/{wordId}")
    public ResponseEntity<Map<String, Object>> saveWord(@PathVariable Long userId, @PathVariable String wordId, @RequestBody Map<String, Object> wordData) {
        try {
            logger.info("Saving wordId: {} for userId: {}", wordId, userId);
            SavedWord savedWord = savedWordService.saveWord(userId, wordId, wordData);
            if (savedWord == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", savedWordService.getLastMessage()));
            }
            return ResponseEntity.ok(Map.of("success", true, "message", "Word saved successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid word data for userId: {}, wordId: {}", userId, wordId, e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error saving word for userId: {}, wordId: {}", userId, wordId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Failed to save word"));
        }
    }
    
    @DeleteMapping("/user/{userId}/word/{wordId}")
    public ResponseEntity<Map<String, Object>> deleteSavedWord(@PathVariable Long userId, @PathVariable String wordId) {
        try {
            logger.info("Deleting wordId: {} for userId: {}", wordId, userId);
            savedWordService.deleteSavedWord(userId, wordId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Word removed successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid userId: {} or wordId: {}", userId, wordId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Word not found"));
        } catch (Exception e) {
            logger.error("Error deleting saved word for userId: {}, wordId: {}", userId, wordId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Failed to remove word"));
        }
    }
}