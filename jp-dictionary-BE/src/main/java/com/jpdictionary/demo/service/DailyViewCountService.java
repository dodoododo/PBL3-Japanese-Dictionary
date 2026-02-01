package com.jpdictionary.demo.service;

import com.jpdictionary.demo.models.DailyViewCount;
import com.jpdictionary.demo.repository.DailyViewCountRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyViewCountService {

    @Autowired
    private DailyViewCountRepository dailyViewCountRepository;

    @Transactional
    public DailyViewCount incrementTodayViewCount() {
        LocalDate today = LocalDate.now();
        DailyViewCount existing = dailyViewCountRepository.findByViewDate(today);

        if (existing == null) {
            DailyViewCount newCount = new DailyViewCount(today, 1);
            return dailyViewCountRepository.save(newCount);
        } else {
            existing.setViewCount(existing.getViewCount() + 1);
            return dailyViewCountRepository.save(existing);
        }
    }

    public DailyViewCount getTodayViewCount() {
        return dailyViewCountRepository.findByViewDate(LocalDate.now());
    }

    public List<DailyViewCount> getAllViewCounts() {
        return dailyViewCountRepository.findAllDailyViewCounts();
    }

}
