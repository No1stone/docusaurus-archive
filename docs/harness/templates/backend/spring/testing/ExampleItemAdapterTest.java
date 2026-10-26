package com.example.template.exampleitem.adapter;

import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.repository.ExampleItemRepository;
import com.example.template.support.BizErrorException;
import com.example.template.support.ResponseType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * ExampleItem JPA Adapter 단위 테스트입니다.
 * Repository를 대체하고, 빈 목록, 부분 수정, 없는 자원 실패를 확인합니다.
 * 프로젝트의 ModelMapperUtil, BeanUtils가 동작하는 환경에서 실행합니다.
 * ExampleItem / 필드명은 치환 토큰입니다.
 */
@ExtendWith(MockitoExtension.class)
class ExampleItemAdapterTest {

    @Mock
    private ExampleItemRepository exampleItemRepository;

    @InjectMocks
    private JpaExampleItemAdapter jpaExampleItemAdapter;

    @Test
    @DisplayName("경계: findByIds에 null이면 조회하지 않고 빈 목록이다")
    void findByIdsNullSkipsQuery() {
        List<ExampleItemRes.Item> actual = jpaExampleItemAdapter.findByIds(null);

        assertTrue(actual.isEmpty());
        verify(exampleItemRepository, never()).findAll(any(Specification.class));
    }

    @Test
    @DisplayName("경계: findByIds에 빈 목록이면 조회하지 않는다")
    void findByIdsEmptySkipsQuery() {
        List<ExampleItemRes.Item> actual = jpaExampleItemAdapter.findByIds(List.of());

        assertTrue(actual.isEmpty());
        verify(exampleItemRepository, never()).findAll(any(Specification.class));
    }

    @Test
    @DisplayName("경계: saveAll에 빈 목록이면 저장하지 않고 빈 목록이다")
    void saveAllEmptySkipsSave() {
        List<ExampleItemRes.Id> actual = jpaExampleItemAdapter.saveAll(List.of());

        assertTrue(actual.isEmpty());
        verify(exampleItemRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("실패: 없는 아이디 조회는 NOT_FOUND_RESOURCE다")
    void findByIdMissingThrows() {
        when(exampleItemRepository.findById(99L)).thenReturn(Optional.empty());

        BizErrorException thrown = assertThrows(
                BizErrorException.class,
                () -> jpaExampleItemAdapter.findById(99L));

        assertEquals(ResponseType.NOT_FOUND_RESOURCE, thrown.getType());
    }
}
