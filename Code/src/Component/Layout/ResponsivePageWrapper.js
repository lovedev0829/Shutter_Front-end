import React from 'react';
import { Box } from '@mui/material';
import { ResponsiveProvider, ResponsiveContainer } from './ResponsiveLayout';
import ResponsiveHeader from './ResponsiveHeader';

// Complete responsive page wrapper that provides a consistent layout structure
export default function ResponsivePageWrapper({
  children,
  title,
  subtitle,
  header = null,
  showHeader = true,
  headerProps = {},
  containerProps = {},
  fullWidth = false,
  sx = {}
}) {
  return (
    <ResponsiveProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'grey.50',
          ...sx
        }}
      >
        {/* Header Section */}
        {showHeader && (
          header ? header : (
            <ResponsiveHeader
              title={title}
              subtitle={subtitle}
              position="sticky"
              {...headerProps}
            />
          )
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {fullWidth ? (
            <Box sx={{ flex: 1, width: '100%' }}>
              {children}
            </Box>
          ) : (
            <ResponsiveContainer {...containerProps}>
              {children}
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </ResponsiveProvider>
  );
}

// Specialized wrapper for dashboard pages
export function ResponsiveDashboardWrapper({
  children,
  title,
  actions,
  sx = {}
}) {
  return (
    <ResponsivePageWrapper
      title={title}
      fullWidth={true}
      headerProps={{
        rightActions: actions,
        sx: {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiTypography-root': {
            color: 'inherit'
          }
        }
      }}
      sx={{
        backgroundColor: 'grey.100',
        ...sx
      }}
    >
      {children}
    </ResponsivePageWrapper>
  );
}

// Wrapper for form pages
export function ResponsiveFormWrapper({
  children,
  title,
  subtitle,
  actions,
  backButton,
  sx = {}
}) {
  return (
    <ResponsivePageWrapper
      title={title}
      subtitle={subtitle}
      headerProps={{
        rightActions: actions,
        leftActions: backButton
      }}
      containerProps={{
        maxWidth: "lg"
      }}
      sx={sx}
    >
      {children}
    </ResponsivePageWrapper>
  );
}

// Wrapper for table/list pages
export function ResponsiveTableWrapper({
  children,
  title,
  subtitle,
  actions,
  filters,
  sx = {}
}) {
  return (
    <ResponsivePageWrapper
      title={title}
      subtitle={subtitle}
      headerProps={{
        rightActions: actions
      }}
      containerProps={{
        maxWidth: "xl",
        disableGutters: false
      }}
      sx={sx}
    >
      {/* Filters section if provided */}
      {filters && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          {filters}
        </Box>
      )}
      
      {/* Main table content */}
      {children}
    </ResponsivePageWrapper>
  );
}