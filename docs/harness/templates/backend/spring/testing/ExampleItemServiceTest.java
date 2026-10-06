package com.example.template.exampleitem.testing;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.persistence.ExampleItem;
import com.example.template.exampleitem.persistence.ExampleItemRepository;
import com.example.template.exampleitem.service.ExampleItemService;
import com.example.template.support.EnStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ExampleItemServiceTest {

    @InjectMocks
    ExampleItemService exampleItemService;

    @Mock
    ExampleItemRepository exampleItemRepository;

    @Test
    @DisplayName("ExampleItemService - save success")
    void save_success() {
        // given
        ExampleItemReq.Create create = new ExampleItemReq.Create();
        create.setName("sample");
        create.setDescription("desc");
        create.setStatus("A");

        ExampleItem saved = new ExampleItem();
        saved.setId(1L);
        saved.setName("sample");
        saved.setStatus(EnStatus.ACTIVE);
        given(exampleItemRepository.save(any(ExampleItem.class))).willReturn(saved);

        // when
        ExampleItemRes.Id result = exampleItemService.save(create);

        // then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(exampleItemRepository).save(any(ExampleItem.class));
    }

    @Test
    @DisplayName("ExampleItemService - findById success")
    void findById_success() {
        // given
        ExampleItem entity = new ExampleItem();
        entity.setId(1L);
        entity.setName("sample");
        entity.setStatus(EnStatus.ACTIVE);
        given(exampleItemRepository.findById(1L)).willReturn(Optional.of(entity));

        // when
        ExampleItemRes.Item result = exampleItemService.findById(1L);

        // then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(exampleItemRepository).findById(1L);
    }

    @Test
    @DisplayName("ExampleItemService - deleteByIds soft deactivate")
    void deleteByIds_success() {
        // given
        ExampleItem entity = new ExampleItem();
        entity.setId(1L);
        entity.setStatus(EnStatus.ACTIVE);
        given(exampleItemRepository.findByIdIn(List.of(1L))).willReturn(List.of(entity));

        // when
        exampleItemService.deleteByIds(List.of(1L));

        // then
        assertEquals(EnStatus.DEACTIVATED, entity.getStatus());
        verify(exampleItemRepository).findByIdIn(List.of(1L));
    }
}
