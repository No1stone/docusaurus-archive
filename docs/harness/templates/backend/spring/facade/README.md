# Facade template

> **개요:** Facade 예제. Controller와 Service 사이 오케스트레이션.

Facade between controller and service — orchestration only, thin.

## Files

- [`ExampleItemFacade.java`](./ExampleItemFacade.java)

## Source

### `ExampleItemFacade.java`

```java
package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.persistence.ExampleItemSpecs;
import com.example.template.exampleitem.service.ExampleItemService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Transactional(readOnly = true)
public class ExampleItemFacade {

    private final ExampleItemService exampleItemService;

    public ExampleItemFacade(ExampleItemService exampleItemService) {
        this.exampleItemService = exampleItemService;
    }

    public Page<ExampleItemRes.Item> searchForWeb(ExampleItemReq.WebListQuery query) {
        return exampleItemService.search(
                ExampleItemSpecs.forWebList(query),
                query.toPageable()
        );
    }

    @Transactional
    public ExampleItemRes.WebCreated createForWeb(ExampleItemReq.WebCreate body) {
        ExampleItemRes.Id saved = exampleItemService.save(body.toCreate());
        ExampleItemRes.WebCreated created = new ExampleItemRes.WebCreated();
        created.setId(saved.getId());
        return created;
    }

    @Transactional
    public ExampleItemRes.WebUpdated updateForWeb(Long id, ExampleItemReq.WebUpdate body) {
        ExampleItemRes.Id saved = exampleItemService.saveById(id, body.toUpdate());
        ExampleItemRes.WebUpdated updated = new ExampleItemRes.WebUpdated();
        updated.setId(saved.getId());
        return updated;
    }

    public ExampleItemRes.Item findById(Long id) {
        return exampleItemService.findById(id);
    }

    @Transactional
    public void deactivateByIdsForWeb(List<Long> ids) {
        exampleItemService.deleteByIds(ids);
    }
}
```
