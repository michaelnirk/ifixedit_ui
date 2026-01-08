import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/header/AppHeader';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const AppLayout = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;