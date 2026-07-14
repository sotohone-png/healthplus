package com.healthapi.service;

import org.springframework.transaction.annotation.Transactional;

import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.dto.ProductDTO;

@Transactional
public interface ProductService {
    PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO);
    PageResponseDTO<ProductDTO> search(String keyword, PageRequestDTO pageRequestDTO);
    PageResponseDTO<ProductDTO> getListByCategory(String category, PageRequestDTO pageRequestDTO);
    Long register(ProductDTO productDTO);
    ProductDTO get(Long pno);
    void modify(ProductDTO productDTO);
    void remove(Long pno);
}