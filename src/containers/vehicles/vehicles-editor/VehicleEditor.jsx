import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { format } from "date-fns";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from '@mui/material/Tooltip';
import InputRow from '@/components/InputRow';
import { ArrowBack } from '@mui/icons-material';
import {
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
} from '@/state/vehicles/slice';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen, setVehicleId } from './slice';

const VehicleEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector(selectUserId);
  const isOpen = useSelector(selectIsOpen);
  const { data: vehicle, error, isError, isLoading } = useReadQuery(
    id && userId ? { id, userId } : skipToken
  );

  useEffect(() => {
    dispatch(setIsOpen(true));
    dispatch(setVehicleId(id));
  }, [dispatch, id]);

  const [vehicleData, setVehicleData] = useState({
    name: '',
    year: '',
    make: '',
    model: '',
    datePurchased: '',
    mileageAtPurchase: '',
    purchasePrice: '',
    vin: '',
    licensePlate: '',
    notes: []
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateMutation();

  // Populate form when vehicle data is loaded (edit mode)
  useEffect(() => {
    if (vehicle && id) {
      setVehicleData({
        name: vehicle.name || '',
        year: vehicle.year || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        date_purchased: vehicle.date_purchased || '',
        km_at_purchase: vehicle.km_at_purchase || '',
        purchase_price: vehicle.purchase_price || '',
        vin: vehicle.vin || '',
        license_plate: vehicle.license_plate || '',
        notes: vehicle.notes || []
      });
    }
  }, [vehicle, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateVehicle({
          id: id,
          vehicleData
        }).unwrap();
      } else {
        await createVehicle({
          vehicleData,
          userId
        }).unwrap();
      }
      navigate('..');
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const onBack = () => {
    navigate('..');
  };
  
  const onCloseModal = () => {
    dispatch(setIsOpen(false));
    dispatch(setVehicleId(null));
    navigate('..');
  };

  const onInputChange = (field) => (e) => {
    setVehicleData({ ...vehicleData, [field]: e.target.value });
  };

  if (!userId) {
    return <Alert severity="warning">Please log in to manage vehicles.</Alert>;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading vehicle: {error.message}
        <Button onClick={onBack} sx={{ ml: 1 }}>
          Back to List
        </Button>
      </Alert>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={onCloseModal}
      maxWidth="md"
      fullWidth
    >

      <DialogTitle>
        {id ? 'Edit Vehicle' : 'Create New Vehicle'}
        <IconButton
          onClick={onCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }} />        
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              autoFocus
              margin="normal"
              label="Name"
              fullWidth
              variant="outlined"
              size="small"
              required
              value={vehicleData.name || ''}
              onChange={onInputChange('name')}
            />
            <InputRow>
              <TextField
                margin="normal"
                label="Year"
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                value={vehicleData.year || ''}
                onChange={onInputChange('year')}
              />
              
              <TextField
                margin="normal"
                label="Make"
                fullWidth
                variant="outlined"
                size="small"
                value={vehicleData.make || ''}
                onChange={onInputChange('make')}
              />
            </InputRow>      
            <InputRow>
              <TextField
                style={{ flex: 5 }}
                margin="normal"
                label="Model"
                fullWidth
                variant="outlined"
                size="small"
                value={vehicleData.model || ''}
                onChange={onInputChange('model')}
              />
              <TextField
                style={{ flex: 3 }}
                margin="normal"
                label="Purchase Price"
                variant="outlined"
                size="small"  
                type="number"
                step="0.01"
                value={vehicleData.purchase_price || ''}
                onChange={onInputChange('purchase_price')}
              />
              <TextField
                style={{ flex: 2 }}
                margin="normal"
                label="Purchase Currency"
                variant="outlined"
                size="small"  
                type="number"
                step="0.01"
                value={vehicleData.purchase_price || ''}
                onChange={onInputChange('purchase_price')}
              />
            </InputRow>
            <InputRow>
              <TextField
                margin="normal"
                label="Date Purchased"
                fullWidth
                variant="outlined"
                size="small"
                value={vehicleData.date_purchased ? format(new Date(vehicleData.date_purchased), "yyyy-MM-dd") : ''}
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={onInputChange('date_purchased')}
              />
              
              <TextField
                margin="normal"
                label="Mileage at Purchase"
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                value={vehicleData.km_at_purchase || ''}
                onChange={onInputChange('km_at_purchase')}
              />
            </InputRow>            
            <InputRow>
              <TextField
                style={{ flex: 1 }}
                margin="normal"
                label="VIN"
                variant="outlined"
                size="small"
                value={vehicleData.vin || ''}
                onChange={onInputChange('vin')}
              />
              
              <TextField
                style={{ flex: 1 }}
                margin="normal"
                label="License Plate"
                variant="outlined"
                size="small"
                value={vehicleData.license_plate || ''}
                onChange={onInputChange('license_plate')}
              />
            </InputRow>

            <fieldset style={{ marginTop: '10px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
              <legend style={{ fontWeight: '400', fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)', fontFamily: ("Roboto", "Helvetica", "Arial", "sans-serif"), paddingRight: '4px', paddingLeft: '4px' }}>Notes</legend>
              {vehicleData.notes.map((note, index) => (
                <div key={note.note_id} style={{ position: 'relative' }}>
                  <TextareaAutosize
                    id={`note-${note.note_id}`}
                    minRows={3}
                    style={{ width: '100%', padding: '8px 20px 8px 8px', borderColor: 'rgb(204, 204, 204)', borderRadius: '4px', fontFamily: ("Roboto", "Helvetica", "Arial", "sans-serif"), fontSize: '14px' }}
                    value={note.note_text}
                    onChange={(e) => {
                      const newNotes = [...vehicleData.notes];
                      newNotes[index] = e.target.value;
                      setVehicleData({ ...vehicleData, notes: newNotes });
                    }}
                  />
                  <Tooltip arrow placement="top" title="Delete note">
                    <IconButton
                      onClick={onCloseModal}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: (theme) => theme.palette.grey[500],
                      }}>     
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  </div>
              ))}
            </fieldset>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                type="button"
                variant="outlined"
                onClick={onBack}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Saving...' : (id ? 'Update Vehicle' : 'Create Vehicle')}
              </Button>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleEditor;