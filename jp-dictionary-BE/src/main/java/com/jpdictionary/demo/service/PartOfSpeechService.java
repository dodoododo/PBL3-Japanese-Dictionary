package com.jpdictionary.demo.service;

import com.jpdictionary.demo.models.PartOfSpeech;
import com.jpdictionary.demo.repository.PartOfSpeechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartOfSpeechService {

    @Autowired
    private PartOfSpeechRepository partOfSpeechRepository;

    public List<PartOfSpeech> getAllPartsOfSpeech() {
        return partOfSpeechRepository.findAllPartsOfSpeech();
    }

    public PartOfSpeech getPartOfSpeechById(Long id) {
        return partOfSpeechRepository.findPartOfSpeechById(id);
    }
}