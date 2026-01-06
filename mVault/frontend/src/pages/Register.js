import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.post('/auth/register', { email, password });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">Register</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Email Address" type="email" margin="normal" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField fullWidth label="Confirm Password" type="password" margin="normal" required
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3 }}>
              Sign Up
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account? <MuiLink component={Link} to="/login">Login here</MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}