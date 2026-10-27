package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.persistence.ExampleItemPort;
import com.example.template.exampleitem.persistence.enums.EnHttpMethod;
import com.example.template.exampleitem.support.display.DisplayNameResolver;
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
    private final DisplayNameResolver displayNameResolver;

    public Page<ExampleItemRes.Item> search(ExampleItemReq.Filter filter, Pageable pageable) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        Page<ExampleItemRes.Item> page = exampleItemPort.search(filter, pageable);
        displayNameResolver.applyCreatedByDisplayNames(
                page.getContent(),
                ExampleItemRes.Item::getCreatedBy,
                ExampleItemRes.Item::setCreatedBy
        );
        return page;
    }

    @Transactional
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        create.setHttpMethod(EnHttpMethod.of(create.getHttpMethod()).getCode());
        return exampleItemPort.save(create);
    }

    @Transactional
    public List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList) {
        if (createList != null) {
            createList.forEach(create -> create.setHttpMethod(EnHttpMethod.of(create.getHttpMethod()).getCode()));
        }
        return exampleItemPort.saveAll(createList);
    }

    public ExampleItemRes.Item findById(Long id) {
        ExampleItemRes.Item item = exampleItemPort.findById(id);
        displayNameResolver.applyCreatedByDisplayNames(
                List.of(item),
                ExampleItemRes.Item::getCreatedBy,
                ExampleItemRes.Item::setCreatedBy
        );
        return item;
    }

    @Transactional
    public ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update) {
        if (update != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(update.getHttpMethod());
            update.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return exampleItemPort.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        exampleItemPort.deleteById(id);
    }

    public List<ExampleItemRes.Item> findAll(ExampleItemReq.Filter filter) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        List<ExampleItemRes.Item> items = exampleItemPort.findAll(filter);
        displayNameResolver.applyCreatedByDisplayNames(
                items,
                ExampleItemRes.Item::getCreatedBy,
                ExampleItemRes.Item::setCreatedBy
        );
        return items;
    }

    public List<ExampleItemRes.Item> findByIds(List<Long> ids) {
        List<ExampleItemRes.Item> items = exampleItemPort.findByIds(ids);
        displayNameResolver.applyCreatedByDisplayNames(
                items,
                ExampleItemRes.Item::getCreatedBy,
                ExampleItemRes.Item::setCreatedBy
        );
        return items;
    }

    public Page<ExampleItemRes.Name> searchName(ExampleItemReq.Filter filter, Pageable pageable) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return exampleItemPort.searchName(filter, pageable);
    }

    public List<ExampleItemRes.Name> findAllName(ExampleItemReq.Filter filter) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return exampleItemPort.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        exampleItemPort.deleteByIds(ids);
    }
}
