package com.jpdictionary.demo.controller;

import com.jpdictionary.demo.models.Example;
import com.jpdictionary.demo.service.ExampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examples")
public class ExampleController {

    @Autowired
    private ExampleService exampleService;

    // GET /api/examples/{wordId} — return all examples for a word
    @GetMapping("/{wordId}")
    public List<Example> getExamplesByWordId(@PathVariable Long wordId) {
        return exampleService.getExamplesByWordId(wordId);
    }

    // POST /api/examples — create a new example for a word
    @PostMapping
    public ResponseEntity<Example> createExample(@RequestBody Example example) {
        Example createdExample = exampleService.createExample(example);
        return ResponseEntity.ok(createdExample);
    }

    // PUT /api/examples/{id} — update an existing example
    @PutMapping("/{id}")
    public ResponseEntity<Example> updateExample(@PathVariable Long id, @RequestBody Example example) {
        Example updatedExample = exampleService.updateExample(id, example);
        return ResponseEntity.ok(updatedExample);
    }

    // DELETE /api/examples/{id} — delete an existing example
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExample(@PathVariable Long id) {
        exampleService.deleteExample(id);
        return ResponseEntity.noContent().build();
    }
}