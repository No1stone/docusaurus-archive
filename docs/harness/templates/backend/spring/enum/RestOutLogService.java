package com.example.template.restoutlog.service;

import com.example.template.support.BizErrorException;
import com.example.template.support.BeanUtils;
import com.example.template.support.ResponseType;
import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.entity.RestOutLog;
import com.example.template.restoutlog.repository.RestOutLogRepository;
import com.example.template.restoutlog.spec.RestOutLogSpecs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.template.support.ModelMapperUtil.map;
import static com.example.template.support.ModelMapperUtil.mapAll;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class RestOutLogService {

    private final RestOutLogRepository restOutLogRepository;

    public Page<RestOutLogRes.Item> search(RestOutLogReq.Filter filter, Pageable pageable) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), pageable);
        return mapAll(page, RestOutLogRes.Item.class);
    }

    @Transactional
    public RestOutLogRes.Id save(RestOutLogReq.Create create) {
        RestOutLog entity = map(create, RestOutLog.class);
        entity = restOutLogRepository.save(entity);
        return map(entity, RestOutLogRes.Id.class);
    }

    @Transactional
    public List<RestOutLogRes.Id> saveAll(List<RestOutLogReq.Create> createList) {
        if (createList == null || createList.isEmpty()) {
            return List.of();
        }
        List<RestOutLog> saveList = createList.stream()
                .map(item -> map(item, RestOutLog.class))
                .toList();
        return mapAll(restOutLogRepository.saveAll(saveList), RestOutLogRes.Id.class);
    }

    public RestOutLogRes.Item findById(Long id) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        return map(entity, RestOutLogRes.Item.class);
    }

    @Transactional
    public RestOutLogRes.Id saveById(Long id, RestOutLogReq.Update update) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        BeanUtils.map(update, entity);
        return map(entity, RestOutLogRes.Id.class);
    }

    @Transactional
    public void deleteById(Long id) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.UNDEFINED));
        entity.delete();
    }

    public List<RestOutLogRes.Item> findAll(RestOutLogReq.Filter filter) {
        return search(filter, Pageable.unpaged()).getContent();
    }

    public List<RestOutLogRes.Item> findByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        RestOutLogReq.Filter filter = new RestOutLogReq.Filter();
        filter.setIds(ids);
        return mapAll(restOutLogRepository.findAll(RestOutLogSpecs.of(filter)), RestOutLogRes.Item.class);
    }

    public Page<RestOutLogRes.Name> searchName(RestOutLogReq.Filter filter, Pageable pageable) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), pageable);
        return mapAll(page, RestOutLogRes.Name.class);
    }

    public List<RestOutLogRes.Name> findAllName(RestOutLogReq.Filter filter) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), Pageable.unpaged());
        return mapAll(page.stream().toList(), RestOutLogRes.Name.class);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        RestOutLogReq.Filter filter = new RestOutLogReq.Filter();
        filter.setIds(ids);
        restOutLogRepository.findAll(RestOutLogSpecs.of(filter)).forEach(RestOutLog::delete);
    }
}
