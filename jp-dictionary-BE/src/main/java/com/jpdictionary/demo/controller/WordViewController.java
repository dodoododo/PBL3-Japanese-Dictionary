package com.jpdictionary.demo.controller;

import com.jpdictionary.demo.models.WordView;
import com.jpdictionary.demo.service.WordViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/word-views")
public class WordViewController {

    @Autowired
    private WordViewService wordViewService;

    @GetMapping("/{wordId}")
    public WordView getWordView(@PathVariable Long wordId) {
        return wordViewService.getWordView(wordId);
    }

    @PostMapping("/{wordId}/increment")
    public WordView incrementViewCount(@PathVariable Long wordId) {
        return wordViewService.incrementViewCount(wordId);
    }

    @GetMapping("/all")
    public List<WordView> getAllWordViewsSorted() {
        return wordViewService.getAllWordViewsSorted();
    }

    @GetMapping("/top")
    public List<WordView> getTop12WordViews() {
        return wordViewService.getTop12WordViews();
    }
}