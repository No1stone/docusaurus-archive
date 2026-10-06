package com.example.template.support;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/** List query base — replace with host PageQuery if present. */
public class PageQuery {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;

    private int page = 0;
    private int size = DEFAULT_SIZE;

    public int getPage() {
        return Math.max(page, 0);
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Pageable toPageable() {
        return PageRequest.of(getPage(), getSize(), Sort.by(Sort.Direction.DESC, "id"));
    }
}
