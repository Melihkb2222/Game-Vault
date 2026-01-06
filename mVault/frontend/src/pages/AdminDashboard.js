import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Box
} from '@mui/material';
import {
  Delete as DeleteIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import api from '../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleOpenDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/orders/${orderToDelete}`);
      setOrders(orders.filter(order => order.id !== orderToDelete));
      handleCloseDeleteDialog();
    } catch (error) {
      alert("Failed to delete order.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING': return 'warning';
      case 'PREPARING': return 'info';
      case 'READY': return 'primary';
      case 'FINISHED': return 'success';
      default: return 'default';
    }
  };

  // Helper function to safely handle the stringified items from the database
  const renderOrderItems = (itemsData) => {
    if (!itemsData) return "No items";
    try {
      const parsedItems = typeof itemsData === 'string' ? JSON.parse(itemsData) : itemsData;
      return parsedItems.map((item, idx) => (
        <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#00e676', lineHeight: 1.2, mb: 0.5 }}>
          • {item.name} (x{item.quantity || 1})
        </Typography>
      ));
    } catch (e) {
      console.error("Error parsing items:", e);
      return "Format error";
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Order Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, mt: 3, boxShadow: 3, bgcolor: '#1a1a1c', backgroundImage: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#2d2d30' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Contents</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Steam User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover sx={{ '& td': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                <TableCell sx={{ color: '#b0b0b0' }}>#{order.id}</TableCell>

                <TableCell sx={{ color: 'white' }}>
                  {order.customerName || "Guest"}
                </TableCell>

                <TableCell sx={{ minWidth: 180 }}>
                  <Box sx={{ py: 1 }}>
                    {renderOrderItems(order.items)}
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                    {order.steamUsername || 'N/A'}
                  </Typography>
                </TableCell>

                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    ${Number(order.totalAmount || order.total || 0).toFixed(2)}
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: '#9c27b0', borderColor: 'rgba(156, 39, 176, 0.5)' }}
                      onClick={() => updateStatus(order.id, 'PREPARING')}
                    >
                      Prep
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => updateStatus(order.id, 'READY')}
                    >
                      Ready
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => updateStatus(order.id, 'FINISHED')}
                    >
                      Finish
                    </Button>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(order.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: 'grey', py: 4 }}>
                  No orders found in the database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Website-Integrated Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{ sx: { bgcolor: '#1a1a1c', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete <strong>Order #{orderToDelete}</strong>? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}