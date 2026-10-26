package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.port.ExampleItemPort;
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

    private final ExampleItemPort exampleItemPort;

    public Page<ExampleItemRes.Item> search(ExampleItemReq.Filter filter, Pageable pageable) {
        return exampleItemPort.search(filter, pageable);
    }

    @Transactional
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        return exampleItemPort.save(create);
    }

    @Transactional
    public List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList) {
        return exampleItemPort.saveAll(createList);
    }

    public ExampleItemRes.Item findById(Long id) {
        return exampleItemPort.findById(id);
    }

    @Transactional
    public ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update) {
        return exampleItemPort.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        exampleItemPort.deleteById(id);
    }

    public List<ExampleItemRes.Item> findAll(ExampleItemReq.Filter filter) {
        return exampleItemPort.findAll(filter);
    }

    public List<ExampleItemRes.Item> findByIds(List<Long> ids) {
        return exampleItemPort.findByIds(ids);
    }

    public Page<ExampleItemRes.Name> searchName(ExampleItemReq.Filter filter, Pageable pageable) {
        return exampleItemPort.searchName(filter, pageable);
    }

    public List<ExampleItemRes.Name> findAllName(ExampleItemReq.Filter filter) {
        return exampleItemPort.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        exampleItemPort.deleteByIds(ids);
    }
}
