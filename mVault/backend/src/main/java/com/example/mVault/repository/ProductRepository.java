package com.example.mVault.repository;

import com.example.mVault.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFeaturedTrueOrderByIdDesc();
    List<Product> findByCategory(String category);

}
