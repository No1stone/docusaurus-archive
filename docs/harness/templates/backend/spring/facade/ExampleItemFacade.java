package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.service.ExampleItemService;
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
public class ExampleItemFacade {

    private final ExampleItemService exampleItemService;

    public Page<ExampleItemRes.Item> search(ExampleItemReq.Filter filter, Pageable pageable) {
        return exampleItemService.search(filter, pageable);
    }

    @Transactional
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        return exampleItemService.save(create);
    }

    @Transactional
    public List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList) {
        return exampleItemService.saveAll(createList);
    }

    public ExampleItemRes.Item findById(Long id) {
        return exampleItemService.findById(id);
    }

    @Transactional
    public ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update) {
        return exampleItemService.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        exampleItemService.deleteById(id);
    }

    public List<ExampleItemRes.Item> findAll(ExampleItemReq.Filter filter) {
        return exampleItemService.findAll(filter);
    }

    public List<ExampleItemRes.Item> findByIds(List<Long> ids) {
        return exampleItemService.findByIds(ids);
    }

    public Page<ExampleItemRes.Name> searchName(ExampleItemReq.Filter filter, Pageable pageable) {
        return exampleItemService.searchName(filter, pageable);
    }

    public List<ExampleItemRes.Name> findAllName(ExampleItemReq.Filter filter) {
        return exampleItemService.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        exampleItemService.deleteByIds(ids);
    }
}
