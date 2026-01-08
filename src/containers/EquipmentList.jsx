import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import {
  useListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} from '@/state/api/equipmentApi';
import { selectUser } from '@/state/features/authSlice';

const EquipmentList = () => {
  const user = useSelector(selectUser);
  const userId = user?.id || user?.user_id;
  
  const [open, setOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [equipmentData, setEquipmentData] = useState({
    name: '',
    type: '',
    model: '',
    serialNumber: '',
    description: '',
  });

  // RTK Query hooks
  const {
    data: equipment = [],
    isLoading,
    error,
    refetch
  } = useListQuery(userId, {
    skip: !userId, // Skip if no user ID
  });

  const [createEquipment, { isLoading: isCreating }] = useCreateMutation();
  const [updateEquipment, { isLoading: isUpdating }] = useUpdateMutation();
  const [deleteEquipment, { isLoading: isDeleting }] = useDeleteMutation();

  const handleSubmit = async () => {
    try {
      if (editingEquipment) {
        await updateEquipment({
          id: editingEquipment.id,
          equipmentData
        }).unwrap();
      } else {
        await createEquipment({
          equipmentData,
          userId
        }).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save equipment:', error);
    }
  };

  const handleDelete = async (equipmentId) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(equipmentId).unwrap();
      } catch (error) {
        console.error('Failed to delete equipment:', error);
      }
    }
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setEquipmentData({
      name: equipment.name,
      type: equipment.type,
      model: equipment.model,
      serialNumber: equipment.serialNumber,
      description: equipment.description,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEquipment(null);
    setEquipmentData({
      name: '',
      type: '',
      model: '',
      serialNumber: '',
      description: '',
    });
  };

  if (!userId) {
    return <Alert severity="warning">Please log in to view equipment.</Alert>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading equipment: {error.message}
        <Button onClick={refetch} sx={{ ml: 1 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">My Equipment</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Equipment
        </Button>
      </Box>

      <Grid container spacing={2}>
        {equipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {item.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Type: {item.type}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Model: {item.model}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  S/N: {item.serialNumber}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <IconButton
                    onClick={() => handleEdit(item)}
                    disabled={isUpdating}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={equipmentData.name}
            onChange={(e) =>
              setEquipmentData({ ...equipmentData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            variant="outlined"
            value={equipmentData.type}
            onChange={(e) =>
              setEquipmentData({ ...equipmentData, type: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Model"
            fullWidth
            variant="outlined"
            value={equipmentData.model}
            onChange={(e) =>
              setEquipmentData({ ...equipmentData, model: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Serial Number"
            fullWidth
            variant="outlined"
            value={equipmentData.serialNumber}
            onChange={(e) =>
              setEquipmentData({ ...equipmentData, serialNumber: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={equipmentData.description}
            onChange={(e) =>
              setEquipmentData({ ...equipmentData, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentList;