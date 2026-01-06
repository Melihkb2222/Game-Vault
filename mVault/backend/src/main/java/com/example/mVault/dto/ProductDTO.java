package com.example.mVault.dto;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String details;
    private String category;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, String description, Double price,
                      String imageUrl, String details, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.details = details;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}