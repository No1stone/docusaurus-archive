package com.example.template.exampleitem.testing;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.facade.ExampleItemFacade;
import com.example.template.exampleitem.service.ExampleItemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ExampleItemFacadeTest {

    @InjectMocks
    ExampleItemFacade exampleItemFacade;

    @Mock
    ExampleItemService exampleItemService;

    @Test
    @DisplayName("ExampleItemFacade - createForWeb success")
    void createForWeb_success() {
        // given
        ExampleItemReq.WebCreate body = new ExampleItemReq.WebCreate();
        body.setName("sample");
        body.setStatus("A");

        ExampleItemRes.Id id = new ExampleItemRes.Id();
        id.setId(10L);
        given(exampleItemService.save(any(ExampleItemReq.Create.class))).willReturn(id);

        // when
        ExampleItemRes.WebCreated result = exampleItemFacade.createForWeb(body);

        // then
        assertNotNull(result);
        assertEquals(10L, result.getId());
        verify(exampleItemService).save(any(ExampleItemReq.Create.class));
    }
}
