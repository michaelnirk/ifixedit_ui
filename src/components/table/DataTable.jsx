import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  TableCell,
  TableRow,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';

const DataTable = ({ columnLabels, rows }) => {
    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 'calc(100vh - 140px)', // Subtracts AppBar (64px) + title section (~76px)
          overflow: 'auto'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnLabels.map((label) => (
                <TableCell key={label} sx={{ fontWeight: 'bold' }}>
                    {label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {rows}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default DataTable;