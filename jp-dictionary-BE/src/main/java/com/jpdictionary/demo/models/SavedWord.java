package com.jpdictionary.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Entity
@Table(name = "saved_words")
public class SavedWord {
    
    @EmbeddedId
    @JsonProperty("id")
    private SavedWordId id;
    
    @Column(name = "saved_at", nullable = false)
    @JsonProperty("savedAt")
    private LocalDateTime savedAt;

    public SavedWord() {
    }
    
    public SavedWord(Long userId, String wordId) {
        this.id = new SavedWordId(userId, wordId);
        this.savedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        if (savedAt == null) {
            savedAt = LocalDateTime.now();
        }
    }
}