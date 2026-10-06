package com.example.template.exampleitem.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ExampleItemRepository
        extends JpaRepository<ExampleItem, Long>, JpaSpecificationExecutor<ExampleItem> {

    List<ExampleItem> findByIdIn(List<Long> ids);
}
