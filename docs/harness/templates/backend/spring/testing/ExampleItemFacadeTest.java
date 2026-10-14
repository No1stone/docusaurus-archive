package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.service.ExampleItemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * 테이블 파사드의 단위 골격입니다.
 * Service를 대체하고, 파사드가 돌려주는 결과를 확인합니다.
 * 이 아카이브에서 실행하지 않았습니다.
 */
@ExtendWith(MockitoExtension.class)
class ExampleItemFacadeTest {

    @Mock
    private ExampleItemService exampleItemService;

    @InjectMocks
    private ExampleItemFacade exampleItemFacade;

    @Test
    @DisplayName("저장 결과는 서비스가 돌려준 아이디다")
    void saveReturnsIdFromService() {
        ExampleItemReq.Create create = new ExampleItemReq.Create();
        ExampleItemRes.Id expected = new ExampleItemRes.Id();
        expected.setId(10L);
        when(exampleItemService.save(create)).thenReturn(expected);

        ExampleItemRes.Id actual = exampleItemFacade.save(create);

        assertEquals(10L, actual.getId());
    }
}
