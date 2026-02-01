package com.jpdictionary.demo.service;

import com.jpdictionary.demo.models.Example;
import com.jpdictionary.demo.models.Word;
import com.jpdictionary.demo.repository.ExampleRepository;
import com.jpdictionary.demo.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExampleService {

    @Autowired
    private ExampleRepository exampleRepository;

    @Autowired
    private WordRepository wordRepository;

    public List<Example> getExamplesByWordId(Long wordId) {
        return exampleRepository.findByWordId(wordId); // Updated to match repository method name
    }

    public Example createExample(Example example) {
        // Ensure the word exists
        Word word = wordRepository.findById(example.getWord().getId())
                .orElseThrow(() -> new IllegalArgumentException("Word not found"));
        example.setWord(word);
        return exampleRepository.save(example);
    }

    public Example updateExample(Long id, Example example) {
        Example existingExample = exampleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Example not found"));
        existingExample.setSentenceJp(example.getSentenceJp());
        existingExample.setSentenceEn(example.getSentenceEn());
        return exampleRepository.save(existingExample);
    }

    public void deleteExample(Long id) {
        Example example = exampleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Example not found"));
        exampleRepository.delete(example);
    }
}