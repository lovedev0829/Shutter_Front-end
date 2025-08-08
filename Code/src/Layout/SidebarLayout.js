
import React from 'react';
import Sidebar from './Sidebar';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveProvider } from '../Component/Layout/ResponsiveLayout';

export default function SidebarLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ResponsiveProvider>
     
        {/* Sidebar */}
        <Sidebar />
          {/* Content Container */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
    </ResponsiveProvider>
  );
}
