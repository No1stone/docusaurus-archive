# Service template

> **개요:** Service 예제. 비즈니스 로직 위치.

Application service for ExampleItem — business rules live here.

## Files

- [`ExampleItemService.java`](./ExampleItemService.java)

## Source

### `ExampleItemService.java`

```java
package com.example.template.exampleitem.service;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.persistence.ExampleItem;
import com.example.template.exampleitem.persistence.ExampleItemRepository;
import com.example.template.support.BizErrorException;
import com.example.template.support.EnStatus;
import com.example.template.support.MapperSupport;
import com.example.template.support.ResponseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ExampleItemService {

    private final ExampleItemRepository exampleItemRepository;

    public ExampleItemService(ExampleItemRepository exampleItemRepository) {
        this.exampleItemRepository = exampleItemRepository;
    }

    public Page<ExampleItemRes.Item> search(Specification<ExampleItem> spec, Pageable pageable) {
        return MapperSupport.mapAll(exampleItemRepository.findAll(spec, pageable), ExampleItemRes.Item.class);
    }

    @Transactional
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        ExampleItem entity = new ExampleItem();
        entity.setName(create.getName());
        entity.setDescription(create.getDescription());
        entity.setStatus(EnStatus.of(create.getStatus()));
        entity = exampleItemRepository.save(entity);
        ExampleItemRes.Id id = new ExampleItemRes.Id();
        id.setId(entity.getId());
        return id;
    }

    public ExampleItemRes.Item findById(Long id) {
        ExampleItem entity = exampleItemRepository.findById(id)
                .orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        return MapperSupport.map(entity, ExampleItemRes.Item.class);
    }

    /** Partial update — null fields mean "leave unchanged". */
    @Transactional
    public ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update) {
        ExampleItem entity = exampleItemRepository.findById(id)
                .orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        if (update.getName() != null) {
            entity.setName(update.getName());
        }
        if (update.getDescription() != null) {
            entity.setDescription(update.getDescription());
        }
        if (update.getStatus() != null) {
            entity.setStatus(EnStatus.of(update.getStatus()));
        }
        ExampleItemRes.Id res = new ExampleItemRes.Id();
        res.setId(entity.getId());
        return res;
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        List<ExampleItem> list = exampleItemRepository.findByIdIn(ids);
        for (ExampleItem entity : list) {
            entity.delete();
        }
    }
}
```
