package com.healthapi.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthapi.domain.Product;
import com.healthapi.domain.ProductImage;
import com.healthapi.dto.PageRequestDTO;
import com.healthapi.dto.PageResponseDTO;
import com.healthapi.dto.ProductDTO;
import com.healthapi.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;
  private final AIService aiService;

  @Override
  public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO) {
    log.info("getList..............");
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize(),
        Sort.by("pno").descending());
    Page<Object[]> result = productRepository.selectList(pageable);
    return getPageResponseDTO(result, pageRequestDTO);
  }

  @Override
  public PageResponseDTO<ProductDTO> search(String keyword, PageRequestDTO pageRequestDTO) {
    log.info("search keyword: " + keyword);
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize(),
        Sort.by("pno").descending());
    Page<Object[]> result = productRepository.selectListByKeyword(keyword, pageable);
    return getPageResponseDTO(result, pageRequestDTO);
  }

  @Override
  public PageResponseDTO<ProductDTO> getListByCategory(String category, PageRequestDTO pageRequestDTO) {
    log.info("getListByCategory: " + category);
    Pageable pageable = PageRequest.of(
        pageRequestDTO.getPage() - 1,
        pageRequestDTO.getSize(),
        Sort.by("pno").descending());
    Page<Object[]> result = productRepository.selectListByCategory(category, pageable);
    return getPageResponseDTO(result, pageRequestDTO);
  }

  private PageResponseDTO<ProductDTO> getPageResponseDTO(Page<Object[]> result, PageRequestDTO pageRequestDTO) {
    List<ProductDTO> dtoList = result.get().map(arr -> {
      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];
      ProductDTO productDTO = ProductDTO.builder()
          .pno(product.getPno())
          .pname(product.getPname())
          .pdesc(product.getPdesc())
          .price(product.getPrice())
          .delFlag(product.isDelFlag())
          .category(product.getCategory())
          .aiDescription(product.getAiDescription())
          .build();
      if (productImage != null) {
        productDTO.setUploadFileNames(List.of(productImage.getFileName()));
      }
      return productDTO;
    }).collect(Collectors.toList());

    return PageResponseDTO.<ProductDTO>withAll()
        .dtoList(dtoList)
        .totalCount(result.getTotalElements())
        .pageRequestDTO(pageRequestDTO)
        .build();
  }

  @Override
  public Long register(ProductDTO productDTO) {
    // AI 설명 자동 생성
    String aiDescription = aiService.generateProductDescription(
        productDTO.getPname(),
        productDTO.getPdesc(),
        productDTO.getCategory()
    );
    productDTO.setAiDescription(aiDescription);

    Product product = dtoToEntity(productDTO);
    Product result = productRepository.save(product);
    return result.getPno();
  }

  private Product dtoToEntity(ProductDTO productDTO) {
    Product product = Product.builder()
        .pno(productDTO.getPno())
        .pname(productDTO.getPname())
        .pdesc(productDTO.getPdesc())
        .price(productDTO.getPrice())
        .category(productDTO.getCategory())
        .aiDescription(productDTO.getAiDescription())
        .build();
    List<String> uploadFileNames = productDTO.getUploadFileNames();
    if (uploadFileNames == null) {
      return product;
    }
    uploadFileNames.stream().forEach(uploadName -> {
      product.addImageString(uploadName);
    });
    return product;
  }

  @Override
  public ProductDTO get(Long pno) {
    Optional<Product> result = productRepository.selectOne(pno);
    Product product = result.orElseThrow();
    return entityToDTO(product);
  }

  private ProductDTO entityToDTO(Product product) {
    ProductDTO productDTO = ProductDTO.builder()
        .pno(product.getPno())
        .pname(product.getPname())
        .pdesc(product.getPdesc())
        .price(product.getPrice())
        .category(product.getCategory())
        .aiDescription(product.getAiDescription())
        .build();
    List<ProductImage> imageList = product.getImageList();
    if (imageList == null || imageList.size() == 0) {
      return productDTO;
    }
    List<String> fileNameList = imageList.stream()
        .map(productImage -> productImage.getFileName()).toList();
    productDTO.setUploadFileNames(fileNameList);
    return productDTO;
  }

  @Override
  public void modify(ProductDTO productDTO) {
    Optional<Product> result = productRepository.findById(productDTO.getPno());
    Product product = result.orElseThrow();
    product.changeName(productDTO.getPname());
    product.changeDesc(productDTO.getPdesc());
    product.changePrice(productDTO.getPrice());
    product.changeCategory(productDTO.getCategory());
    product.clearList();
    List<String> uploadFileNames = productDTO.getUploadFileNames();
    if (uploadFileNames != null && uploadFileNames.size() > 0) {
      uploadFileNames.stream().forEach(uploadName -> {
        product.addImageString(uploadName);
      });
    }
    productRepository.save(product);
  }

  @Override
  public void remove(Long pno) {
    productRepository.updateToDelete(pno, true);
  }
}