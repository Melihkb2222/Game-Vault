import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(22, 22, 24, 0.95)", // Slightly transparent for the video background
        backdropFilter: "blur(10px)", // Modern frosted glass effect
        borderBottom: "2px solid #9c27b0", // Purple neon underline
        boxShadow: "0px 4px 20px rgba(156, 39, 176, 0.3)",
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* NEW BRANDED LOGO SECTION */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" }
          }}
        >
          <img
            src="/logo.png"
            alt="Melih's Game Vault Logo"
            style={{
              height: '55px', // Adjusted for visibility
              width: 'auto',
              marginRight: '12px',
              filter: "drop-shadow(0px 0px 8px rgba(156, 39, 176, 0.5))" // Makes logo glow
            }}
          />
          <Typography
            variant="h6"
            sx={{
              display: { xs: 'none', md: 'block' }, // Hide text on small screens to save space
              color: "white",
              fontWeight: "900",
              letterSpacing: "1px",
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(45deg, #ffffff 30%, #9c27b0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MELIH'S VAULT
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Navigation Links */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontWeight: 'bold',
              '&:hover': { color: "#00e676", bgcolor: "transparent" }
            }}
          >
            Store
          </Button>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Button
                  color="secondary"
                  variant="outlined"
                  component={Link}
                  to="/admin"
                  sx={{
                    fontWeight: 'bold',
                    borderColor: "#00e676",
                    color: "#00e676",
                    mx: 1,
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': { bgcolor: "rgba(0, 230, 118, 0.1)", borderColor: "#00e676" }
                  }}
                >
                  Admin
                </Button>
              )}

              <Typography variant="body2" sx={{ ml: 1, color: "#b0b0b0", display: { xs: 'none', lg: 'block' } }}>
                {user.email}
              </Typography>

              <Button
                variant="text"
                sx={{ color: "#ff1744", fontWeight: 'bold' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 'bold' }}>Login</Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: "4px", // Square gaming look
                  bgcolor: "#9c27b0",
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: "#6a0080" }
                }}
              >
                Join
              </Button>
            </>
          )}

          <IconButton color="inherit" component={Link} to="/cart" sx={{ ml: 1 }}>
            <Badge badgeContent={items.length} color="secondary">
              <ShoppingCart sx={{ color: items.length > 0 ? "#00e676" : "inherit" }} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}