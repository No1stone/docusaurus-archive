package com.example.template.exampleitem.adapter;

import com.example.template.support.BizErrorException;
import com.example.template.support.BeanUtils;
import com.example.template.support.ResponseType;
import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.entity.ExampleItem;
import com.example.template.exampleitem.port.ExampleItemPort;
import com.example.template.exampleitem.repository.ExampleItemRepository;
import com.example.template.exampleitem.spec.ExampleItemSpecs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.template.support.ModelMapperUtil.map;
import static com.example.template.support.ModelMapperUtil.mapAll;

/**
 * ExampleItem JPA Adapter입니다.
 * 과거 템플릿의 Service와 같은 책임입니다.
 * 코드 수준 CQRS 적용점이다. 조회와 변경을 나눌 때는 Facade가 아니라
 * 이 클래스 아래에서 Read Provider와 Command Provider로 Repository를 나눈다.
 * 원셋은 Repository 하나를 직접 쓰며, Provider 분리는 필요할 때 추가한다.
 */
@Component
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class JpaExampleItemAdapter implements ExampleItemPort {

    private final ExampleItemRepository exampleItemRepository;

    @Override
    public Page<ExampleItemRes.Item> search(ExampleItemReq.Filter filter, Pageable pageable) {
        ExampleItem entity = map(filter, ExampleItem.class);
        Page<ExampleItem> page = exampleItemRepository.findAll(ExampleItemSpecs.of(filter), pageable);
        return mapAll(page, ExampleItemRes.Item.class);
    }

    @Override
    @Transactional
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        ExampleItem entity = map(create, ExampleItem.class);
        entity = exampleItemRepository.save(entity);
        return map(entity, ExampleItemRes.Id.class);
    }

    @Override
    @Transactional
    public List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList) {
        if (createList == null || createList.isEmpty()) {
            return List.of();
        }
        List<ExampleItem> saveList = createList.stream()
                .map(item -> map(item, ExampleItem.class))
                .toList();
        return mapAll(exampleItemRepository.saveAll(saveList), ExampleItemRes.Id.class);
    }

    @Override
    public ExampleItemRes.Item findById(Long id) {
        ExampleItem entity = exampleItemRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        return map(entity, ExampleItemRes.Item.class);
    }

    @Override
    @Transactional
    public ExampleItemRes.Id saveById(Long id, ExampleItemReq.Update update) {
        ExampleItem entity = exampleItemRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        BeanUtils.map(update, entity);
        return map(entity, ExampleItemRes.Id.class);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        ExampleItem entity = exampleItemRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.UNDEFINED));
        entity.delete();
    }

    @Override
    public List<ExampleItemRes.Item> findAll(ExampleItemReq.Filter filter) {
        return search(filter, Pageable.unpaged()).getContent();
    }

    @Override
    public List<ExampleItemRes.Item> findByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        ExampleItemReq.Filter filter = new ExampleItemReq.Filter();
        filter.setIds(ids);
        return mapAll(exampleItemRepository.findAll(ExampleItemSpecs.of(filter)), ExampleItemRes.Item.class);
    }

    @Override
    public Page<ExampleItemRes.Name> searchName(ExampleItemReq.Filter filter, Pageable pageable) {
        ExampleItem entity = map(filter, ExampleItem.class);
        Page<ExampleItem> page = exampleItemRepository.findAll(ExampleItemSpecs.of(filter), pageable);
        return mapAll(page, ExampleItemRes.Name.class);
    }

    @Override
    public List<ExampleItemRes.Name> findAllName(ExampleItemReq.Filter filter) {
        ExampleItem entity = map(filter, ExampleItem.class);
        Page<ExampleItem> page = exampleItemRepository.findAll(ExampleItemSpecs.of(filter), Pageable.unpaged());
        return mapAll(page.stream().toList(), ExampleItemRes.Name.class);
    }

    @Override
    @Transactional
    public void deleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        ExampleItemReq.Filter filter = new ExampleItemReq.Filter();
        filter.setIds(ids);
        exampleItemRepository.findAll(ExampleItemSpecs.of(filter)).forEach(ExampleItem::delete);
    }
}
