import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate

// Material UI Theme imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components & Layout
import Header from "./components/Header";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from './context/AuthContext'; // Added useAuth

// 1. PROTECTION COMPONENT
// This component checks if the user is an ADMIN.
const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for the AuthContext to check if the user is logged in
  if (loading) return null;

  // If no user is logged in, or the user is NOT an ADMIN, kick them to home page
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const gamingTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Deep Purple
      light: '#d05ce3',
      dark: '#6a0080',
    },
    secondary: {
      main: '#00e676', // Neon Green
    },
    background: {
      default: '#0a0a0b',
      paper: 'rgba(22, 22, 24, 0.9)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 'bold',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 0 10px #9c27b0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={gamingTheme}>
          <CssBaseline />

          <div className="vault-background">
            <img
              src="/logo.png"
              alt="Vault Watermark"
              className="vault-logo-watermark"
            />
          </div>

          <Router>
            <Box className="page-content">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 2. UPDATED ADMIN ROUTE */}
                {/* We wrap the AdminDashboard in our protection component */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
              </Routes>
            </Box>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;