package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.port.ExampleItemPort;
import com.example.template.support.BizErrorException;
import com.example.template.support.ResponseType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * ExampleItem 파사드 단위 테스트입니다.
 * Port를 대체하고, 파사드가 돌려주는 결과와 실패를 확인합니다.
 * ExampleItem / 패키지 / 필드명은 치환 토큰입니다.
 */
@ExtendWith(MockitoExtension.class)
class ExampleItemFacadeTest {

    @Mock
    private ExampleItemPort exampleItemPort;

    @InjectMocks
    private ExampleItemFacade exampleItemFacade;

    @Test
    @DisplayName("정상: 저장 결과는 Port가 돌려준 아이디다")
    void saveReturnsIdFromPort() {
        ExampleItemReq.Create create = new ExampleItemReq.Create();
        create.setHttpMethod("GET");
        create.setUrl("/demo");
        ExampleItemRes.Id expected = new ExampleItemRes.Id();
        expected.setId(10L);
        when(exampleItemPort.save(create)).thenReturn(expected);

        ExampleItemRes.Id actual = exampleItemFacade.save(create);

        assertEquals(10L, actual.getId());
        verify(exampleItemPort).save(create);
    }

    @Test
    @DisplayName("정상: 단건 조회는 Port Item을 그대로 반환한다")
    void findByIdReturnsItem() {
        ExampleItemRes.Item item = new ExampleItemRes.Item();
        item.setId(10L);
        item.setHttpMethod("GET");
        item.setUrl("/demo");
        when(exampleItemPort.findById(10L)).thenReturn(item);

        ExampleItemRes.Item actual = exampleItemFacade.findById(10L);

        assertEquals(10L, actual.getId());
        assertEquals("GET", actual.getHttpMethod());
        assertEquals("/demo", actual.getUrl());
    }

    @Test
    @DisplayName("경계: 아이디 목록이 비면 빈 목록을 반환한다")
    void findByIdsEmptyReturnsEmpty() {
        when(exampleItemPort.findByIds(List.of())).thenReturn(List.of());

        List<ExampleItemRes.Item> actual = exampleItemFacade.findByIds(List.of());

        assertTrue(actual.isEmpty());
    }

    @Test
    @DisplayName("실패: 없는 아이디 조회는 NOT_FOUND_RESOURCE다")
    void findByIdMissingThrows() {
        when(exampleItemPort.findById(99L))
                .thenThrow(new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));

        BizErrorException thrown = assertThrows(
                BizErrorException.class,
                () -> exampleItemFacade.findById(99L));

        assertEquals(ResponseType.NOT_FOUND_RESOURCE, thrown.getType());
    }
}
