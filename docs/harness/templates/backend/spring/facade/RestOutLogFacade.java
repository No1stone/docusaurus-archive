package com.example.template.restoutlog.facade;

import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.service.RestOutLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class RestOutLogFacade {

    private final RestOutLogService restOutLogService;

    public Page<RestOutLogRes.Item> search(RestOutLogReq.Filter filter, Pageable pageable) {
        return restOutLogService.search(filter, pageable);
    }

    @Transactional
    public RestOutLogRes.Id save(RestOutLogReq.Create create) {
        return restOutLogService.save(create);
    }

    @Transactional
    public List<RestOutLogRes.Id> saveAll(List<RestOutLogReq.Create> createList) {
        return restOutLogService.saveAll(createList);
    }

    public RestOutLogRes.Item findById(Long id) {
        return restOutLogService.findById(id);
    }

    @Transactional
    public RestOutLogRes.Id saveById(Long id, RestOutLogReq.Update update) {
        return restOutLogService.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        restOutLogService.deleteById(id);
    }

    public List<RestOutLogRes.Item> findAll(RestOutLogReq.Filter filter) {
        return restOutLogService.findAll(filter);
    }

    public List<RestOutLogRes.Item> findByIds(List<Long> ids) {
        return restOutLogService.findByIds(ids);
    }

    public Page<RestOutLogRes.Name> searchName(RestOutLogReq.Filter filter, Pageable pageable) {
        return restOutLogService.searchName(filter, pageable);
    }

    public List<RestOutLogRes.Name> findAllName(RestOutLogReq.Filter filter) {
        return restOutLogService.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        restOutLogService.deleteByIds(ids);
    }
}
