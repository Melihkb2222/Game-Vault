package com.example.mVault.controller;

import com.example.mVault.dto.ProductDTO;
import com.example.mVault.model.Product;
import com.example.mVault.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // New Endpoint for Category Filtering
    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable String category) {
        return repository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/top")
    public List<ProductDTO> getTopFeatured() {
        return repository.findByFeaturedTrueOrderByIdDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<ProductDTO> getAll() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProductDTO getOne(@PathVariable Long id) {
        Product p = repository.findById(id).orElseThrow();
        return convertToDTO(p);
    }

    // Helper method to keep code clean
    private ProductDTO convertToDTO(Product p) {
        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getImageUrl(),
                p.getDetails(),
                p.getCategory() // Ensure this is added to your DTO constructor
        );
    }
}