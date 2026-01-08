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
} from '@/state/api/structureApi';
import { selectUser } from '@/state/features/authSlice';

const StructuresList = () => {
  const user = useSelector(selectUser);
  const userId = user?.id || user?.user_id;
  
  const [open, setOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [structureData, setStructureData] = useState({
    name: '',
    type: '',
    address: '',
    description: '',
  });

  // RTK Query hooks
  const {
    data: structures = [],
    isLoading,
    error,
    refetch
  } = useListQuery(userId, {
    skip: !userId, // Skip if no user ID
  });

  const [createStructure, { isLoading: isCreating }] = useCreateMutation();
  const [updateStructure, { isLoading: isUpdating }] = useUpdateMutation();
  const [deleteStructure, { isLoading: isDeleting }] = useDeleteMutation();

  const handleSubmit = async () => {
    try {
      if (editingStructure) {
        await updateStructure({
          id: editingStructure.id,
          structureData
        }).unwrap();
      } else {
        await createStructure({
          structureData,
          userId
        }).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save structure:', error);
    }
  };

  const handleDelete = async (structureId) => {
    if (window.confirm('Are you sure you want to delete this structure?')) {
      try {
        await deleteStructure(structureId).unwrap();
      } catch (error) {
        console.error('Failed to delete structure:', error);
      }
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setStructureData({
      name: structure.name,
      type: structure.type,
      address: structure.address,
      description: structure.description,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStructure(null);
    setStructureData({
      name: '',
      type: '',
      address: '',
      description: '',
    });
  };

  if (!userId) {
    return <Alert severity="warning">Please log in to view structures.</Alert>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading structures: {error.message}
        <Button onClick={refetch} sx={{ ml: 1 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">My Structures</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Structure
        </Button>
      </Box>

      <Grid container spacing={2}>
        {structures.map((structure) => (
          <Grid item xs={12} sm={6} md={4} key={structure.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {structure.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Type: {structure.type}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Address: {structure.address}
                </Typography>
                <Typography variant="body2">
                  {structure.description}
                </Typography>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <IconButton
                    onClick={() => handleEdit(structure)}
                    disabled={isUpdating}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(structure.id)}
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
          {editingStructure ? 'Edit Structure' : 'Add New Structure'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={structureData.name}
            onChange={(e) =>
              setStructureData({ ...structureData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            variant="outlined"
            value={structureData.type}
            onChange={(e) =>
              setStructureData({ ...structureData, type: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={structureData.address}
            onChange={(e) =>
              setStructureData({ ...structureData, address: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={structureData.description}
            onChange={(e) =>
              setStructureData({ ...structureData, description: e.target.value })
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

export default StructuresList;