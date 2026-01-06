import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Chip } from "@mui/material";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { add } = useCart();

  // 1. Safely Parse the details JSON
  let details = {};
  try {
    details = typeof product.details === "string"
      ? JSON.parse(product.details)
      : (product.details || {});
  } catch (e) {
    console.error("Error parsing product details:", e);
  }

  return (
    <Card sx={{
      maxWidth: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#1e2837', // Dark Steam-like background
      color: 'white',
      '&:hover': { transform: 'scale(1.02)', transition: '0.3s' }
    }}>
      <CardMedia
        component="img"
        height="160"
        image={resolveImageUrl(product.imageUrl)}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
          {product.name}
          {product.name.includes('(DLC)') && (
            <Chip label="DLC" size="small" sx={{ ml: 1, bgcolor: '#4e148c', color: 'white', fontSize: '0.6rem' }} />
          )}
        </Typography>

        {/* 2. BEAUTIFIED DETAILS SECTION */}
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {details.dev && (
            <Chip
              label={`Dev: ${details.dev}`}
              size="small"
              variant="outlined"
              sx={{ color: '#66c0f4', borderColor: '#66c0f4', fontSize: '0.7rem' }}
            />
          )}
          {details.ram && (
            <Chip
              label={`RAM: ${details.ram}`}
              size="small"
              sx={{ bgcolor: '#2a3f5a', color: '#c1d35d', fontSize: '0.7rem' }}
            />
          )}
          {details.gpu && (
            <Chip
              label={`GPU: ${details.gpu}`}
              size="small"
              sx={{ bgcolor: '#2a3f5a', color: '#a3a3a3', fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <Typography variant="body2" sx={{ color: '#acb2b8', mb: 1, minHeight: '3em' }}>
          {product.description}
        </Typography>

        <Typography variant="h6" sx={{ color: '#66c0f4', fontWeight: 'bold' }}>
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => add(product)}
          sx={{ bgcolor: '#4c6b22', '&:hover': { bgcolor: '#5a7e2a' } }}
        >
          Add to cart
        </Button>
        <Button
          variant="outlined"
          size="small"
          component={Link}
          to={`/products/${product.id}`}
          sx={{ borderColor: '#67c1f5', color: '#67c1f5' }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}