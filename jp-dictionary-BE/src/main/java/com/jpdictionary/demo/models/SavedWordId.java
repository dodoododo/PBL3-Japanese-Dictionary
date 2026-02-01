package com.jpdictionary.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class SavedWordId implements Serializable {
    
    @Column(name = "user_id", nullable = false)
    @JsonProperty("userId")
    private Long userId;
    
    @Column(name = "word_id", nullable = false)
    @JsonProperty("wordId")
    private String wordId;

    public SavedWordId() {
    }

    public SavedWordId(Long userId, String wordId) {
        this.userId = userId;
        this.wordId = wordId;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedWordId that = (SavedWordId) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(wordId, that.wordId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(userId, wordId);
    }
}