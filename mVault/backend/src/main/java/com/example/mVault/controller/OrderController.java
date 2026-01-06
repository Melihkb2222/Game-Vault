package com.example.mVault.controller;

import com.example.mVault.model.Order;
import com.example.mVault.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> payload) {
        try {
            Order newOrder = new Order();

            String customerName = payload.get("customerName") != null ?
                    payload.get("customerName").toString() : "Guest Customer";
            newOrder.setCustomerName(customerName);

            if (payload.get("steamUsername") != null) {
                newOrder.setSteamUsername(payload.get("steamUsername").toString());
            }

            if (payload.get("items") != null) {
                newOrder.setItems(payload.get("items").toString());
            }

            newOrder.setOrderTime(LocalDateTime.now());
            newOrder.setStatus("WAITING");
            newOrder.setTotalAmount(Double.parseDouble(payload.get("total").toString()));

            // Save to PostgreSQL
            Order savedOrder = orderRepository.save(newOrder);

            return ResponseEntity.ok(Map.of(
                    "message", "Order placed successfully",
                    "orderId", savedOrder.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/admin/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(statusUpdate.get("status"));
            orderRepository.save(order);
            return ResponseEntity.ok("Order status updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            if (orderRepository.existsById(id)) {
                orderRepository.deleteById(id);
                return ResponseEntity.ok("Deleted successfully");
            }
            return ResponseEntity.status(404).body("Order not found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}