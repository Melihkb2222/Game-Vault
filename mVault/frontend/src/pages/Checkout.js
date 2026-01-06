import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { resolveImageUrl } from "../config";
import {
  Container, Typography, Box, Grid, Button, Divider,
  CardMedia, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, TextField, InputAdornment
} from "@mui/material";
import {
  Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon,
  CheckCircleOutline as SuccessIcon, CreditCard as CardIcon,
  Event as EventIcon, Lock as LockIcon
} from "@mui/icons-material";

export default function Checkout() {
  const { items, add, decrement, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);
  const [steamUsername, setSteamUsername] = useState('');

  // New Payment States
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const totalPrice = items.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0);

  // Formatting helper for Card Number and Expiry
  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").substring(0, 16);
      value = value.match(/.{1,4}/g)?.join(" ") || "";
    } else if (name === "expiry") {
      value = value.replace(/\D/g, "").substring(0, 4);
      if (value.length >= 3) value = value.substring(0, 2) + "/" + value.substring(2);
    } else if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }

    setCardInfo({ ...cardInfo, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: false });
  };

  const handleProceed = async () => {
    // Basic Validation
    const newErrors = {};
    if (!steamUsername.trim()) newErrors.steam = true;
    if (cardInfo.number.length < 19) newErrors.number = true;
    if (cardInfo.expiry.length < 5) newErrors.expiry = true;
    if (cardInfo.cvv.length < 3) newErrors.cvv = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const displayName = user?.username || user?.name || "Guest Customer";

      const payload = {
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        }))),
        total: totalPrice,
        customerName: displayName,
        customerEmail: user?.email || "Guest Email",
        steamUsername: steamUsername.trim(),
        paymentStatus: "PAID_MOCK" // We tell backend payment was "processed"
      };

      const response = await api.post("/orders/checkout", payload);
      if (response.status === 200) setOpenPopup(true);
    } catch (error) {
      console.error("Order error:", error);
      alert("Checkout failed. Check your connection.");
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    clear();
    navigate("/", { replace: true });
  };

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Your Cart is Empty</Typography>
        <Button variant="contained" component={Link} to="/">Back to Store</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: "800px !important" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Checkout</Typography>

      {/* 1. ORDER SUMMARY */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>Order Summary</Typography>
        {items.map((item) => (
          <Box key={item.id} sx={{ mb: 2, p: 1, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 1 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <CardMedia component="img" image={resolveImageUrl(item.imageUrl)} sx={{ height: 50, borderRadius: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">${item.price.toFixed(2)} x {item.quantity || 1}</Typography>
              </Grid>
              <Grid item xs={4} textAlign="right">
                <Typography variant="body1">${(item.price * (item.quantity || 1)).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
           <Typography variant="h5" fontWeight="bold">Total: ${totalPrice.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* 2. DELIVERY INFO */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, height: '100%', bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(156, 39, 176, 0.3)' }}>
            <Typography variant="h6" gutterBottom color="secondary">Delivery Info</Typography>
            <TextField
              fullWidth
              label="Steam Username"
              variant="filled"
              value={steamUsername}
              error={errors.steam}
              helperText={errors.steam ? "Required for gift delivery" : ""}
              onChange={(e) => setSteamUsername(e.target.value)}
              placeholder="e.g. SteamGamer_99"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        {/* 3. PAYMENT INFO */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(0, 230, 118, 0.3)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00e676' }}>Payment Method</Typography>
            <TextField
              fullWidth
              label="Card Number"
              name="number"
              variant="filled"
              value={cardInfo.number}
              onChange={handleCardChange}
              error={errors.number}
              placeholder="0000 0000 0000 0000"
              InputProps={{ startAdornment: <InputAdornment position="start"><CardIcon /></InputAdornment> }}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  label="Expiry"
                  name="expiry"
                  variant="filled"
                  value={cardInfo.expiry}
                  onChange={handleCardChange}
                  error={errors.expiry}
                  placeholder="MM/YY"
                  InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  type="password"
                  variant="filled"
                  value={cardInfo.cvv}
                  onChange={handleCardChange}
                  error={errors.cvv}
                  placeholder="123"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 2 }}
          onClick={handleProceed}
        >
          CONFIRM AND PAY ${totalPrice.toFixed(2)}
        </Button>
      </Box>

      {/* SUCCESS DIALOG */}
      <Dialog open={openPopup} onClose={handleClosePopup} PaperProps={{ sx: { borderRadius: 3, p: 2, textAlign: 'center' } }}>
        <DialogTitle>
          <SuccessIcon sx={{ fontSize: 60, color: '#4caf50', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">Payment Successful!</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your order is being processed. The game will be gifted to <strong>{steamUsername}</strong> soon.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClosePopup} variant="contained" sx={{ px: 4 }}>Back to Store</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}