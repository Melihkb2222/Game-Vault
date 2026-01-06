import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Box, Chip, Stack,
  CircularProgress, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';

// Your current active categories + trending expansion ones
const categories = ["All", "Simulation", "Arcade", "Action", "RPG", "Racing", "Shooter", "Indie", "Horror"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setFilteredProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Filter logic: Handles both Category selection AND Search text simultaneously
  useEffect(() => {
    let result = products;

    // Filter by Genre
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  return (
    <Container sx={{ py: 6 }}>
      {/* HEADER & SEARCH SECTION */}
      <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Melih's Vault
        </Typography>

        <TextField
          placeholder="Search for a game..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: '100%', md: '300px' },
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: '#2a3f5a' },
              '&:hover fieldset': { borderColor: '#9c27b0' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#b0b0b0' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* CATEGORY SELECTOR */}
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                borderRadius: '4px',
                fontWeight: 'bold',
                px: 1,
                py: 2.5,
                bgcolor: selectedCategory === cat ? '#9c27b0' : 'rgba(156, 39, 176, 0.05)',
                color: selectedCategory === cat ? 'white' : '#b0b0b0',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#9c27b0' : '#2a3f5a',
                '&:hover': {
                  bgcolor: 'rgba(156, 39, 176, 0.2)',
                  borderColor: '#9c27b0',
                  boxShadow: '0 0 12px rgba(156, 39, 176, 0.4)',
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* PRODUCT GRID */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={p} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                <Typography variant="h6" color="textSecondary">
                  {searchQuery
                    ? `No matches for "${searchQuery}" in ${selectedCategory} vault.`
                    : `The "${selectedCategory}" section is currently being stocked.`}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}