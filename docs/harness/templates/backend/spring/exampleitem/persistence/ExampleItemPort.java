package com.example.template.exampleitem.persistence;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * ExampleItem 데이터 접근 계약입니다.
 * 애플리케이션은 이 Port만 의존합니다.
 */
public interface ExampleItemPort {

    Page<ExampleItemRes.Item> search(ExampleItemReq.Filter filter, Pageable pageable);

    ExampleItemRes.Id save(ExampleItemReq.Create create);

    List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList);

    ExampleItemRes.Item findById(Long id);

    ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update);

    void deleteById(Long id);

    List<ExampleItemRes.Item> findAll(ExampleItemReq.Filter filter);

    List<ExampleItemRes.Item> findByIds(List<Long> ids);

    Page<ExampleItemRes.Name> searchName(ExampleItemReq.Filter filter, Pageable pageable);

    List<ExampleItemRes.Name> findAllName(ExampleItemReq.Filter filter);

    void deleteByIds(List<Long> ids);
}
