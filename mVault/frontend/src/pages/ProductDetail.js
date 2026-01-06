import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config";

import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  CardMedia,
  Divider,
  Stack
} from "@mui/material";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Error loading product");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: '#66c0f4' }} />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>Could not load product.</Typography>
        <Button variant="contained" component={Link} to="/">Back to Home</Button>
      </Container>
    );
  }

  // 1. SAFE JSON PARSING
  let details = {};
  try {
    details = typeof product.details === "string"
      ? JSON.parse(product.details)
      : (product.details || {});
  } catch (e) {
    console.error("JSON Parse Error", e);
  }

  const priceText = typeof product.price === "number" ? product.price.toFixed(2) : product.price;

  return (
    <Container sx={{ py: 6 }}>
      <Grid container spacing={6}>
        {/* Left: Product Image */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={resolveImageUrl(product.imageUrl)}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 1,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              border: '1px solid #2a3f5a'
            }}
          />
        </Grid>

        {/* Right: Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1, textTransform: 'uppercase' }}>
            {product.name}
          </Typography>

          <Typography variant="h4" sx={{ color: '#66c0f4', mb: 3, fontWeight: 'bold' }}>
            ${priceText}
          </Typography>

          <Typography variant="body1" sx={{ color: '#acb2b8', fontSize: '1.1rem', mb: 4, lineHeight: 1.6 }}>
            {product.description}
          </Typography>

          <Divider sx={{ bgcolor: '#2a3f5a', mb: 4 }} />

          {/* 2. BEAUTIFIED SPECIFICATIONS BLOCK */}
          <Box sx={{ bgcolor: '#16202d', p: 3, borderRadius: 1, border: '1px solid #2a3f5a' }}>
            <Typography variant="h6" sx={{ color: '#54a5d4', fontSize: '0.85rem', fontWeight: 'bold', mb: 2, letterSpacing: 1 }}>
              PRODUCT SPECIFICATIONS
            </Typography>

            <Stack spacing={1.5}>
              {details.dev && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#8f98a0', fontSize: '0.9rem' }}>Developer</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'medium' }}>{details.dev}</Typography>
                </Box>
              )}
              {details.ram && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#8f98a0', fontSize: '0.9rem' }}>Memory</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'medium' }}>{details.ram} RAM</Typography>
                </Box>
              )}
              {details.gpu && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#8f98a0', fontSize: '0.9rem' }}>Graphics</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'medium' }}>{details.gpu}</Typography>
                </Box>
              )}
              {product.category && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#8f98a0', fontSize: '0.9rem' }}>Genre</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'medium' }}>{product.category}</Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => add(product)}
              sx={{
                bgcolor: '#4c6b22',
                color: '#c1d35d',
                fontWeight: 'bold',
                px: 6,
                '&:hover': { bgcolor: '#5a7e2a' }
              }}
            >
              Add to cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/"
              sx={{ color: '#67c1f5', borderColor: '#2a3f5a' }}
            >
              Back to Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}