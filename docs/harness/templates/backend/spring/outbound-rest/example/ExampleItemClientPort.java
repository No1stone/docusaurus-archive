package com.example.template.outbound.exampleitem;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;

import java.util.List;

/**
 * 원셋 ExampleItem Controller를 서버투서버로 호출하는 outbound Port.
 * 인증 헤더 없음. DB Port({@code ExampleItemPort})와 별개.
 */
public interface ExampleItemClientPort {

    ExampleItemRes.Item findById(Long id);

    ExampleItemRes.Id save(ExampleItemReq.Create create);

    List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList);
}
