import React, { createContext, useContext } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Create responsive context
const ResponsiveContext = createContext({});

// Responsive provider component
export function ResponsiveProvider({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const contextValue = {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

// Hook to use responsive context
export function useResponsiveContext() {
  return useContext(ResponsiveContext);
}

// Responsive page header component
export function ResponsivePageHeader({ 
  title, 
  subtitle, 
  actions, 
  breadcrumbs, 
  backButton 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        mb: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 1, sm: 2 },
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          sx={{
            mb: 1,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {breadcrumbs.map((crumb, index) => (
            crumb.href ? (
              <Link
                key={index}
                href={crumb.href}
                color="inherit"
                underline="hover"
                sx={{ fontSize: 'inherit' }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography
                key={index}
                color="text.primary"
                sx={{ fontSize: 'inherit' }}
              >
                {crumb.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}

      {/* Header content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 3 }
        }}
      >
        {/* Title section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            minWidth: 0
          }}
        >
          {/* Back button */}
          {backButton && (
            <IconButton
              onClick={backButton.onClick}
              size="small"
              sx={{
                mr: 1,
                color: 'text.secondary'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Title and subtitle */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                fontWeight: 600,
                color: 'text.primary',
                mb: subtitle ? 0.5 : 0,
                wordBreak: 'break-word'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  wordBreak: 'break-word'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'stretch', sm: 'flex-end' },
              '& .MuiButton-root': {
                minWidth: { xs: '100%', sm: 'auto' }
              }
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Main responsive layout wrapper component
export function ResponsiveContainer({ children, maxWidth = "xl", disableGutters = false }) {
  return (
    <Container 
      maxWidth={maxWidth} 
      disableGutters={disableGutters}
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}
    >
      {children}
    </Container>
  );
}

// Responsive grid wrapper for forms and content
export function ResponsiveGrid({ children, spacing = { xs: 1, sm: 2, md: 3 } }) {
  return (
    <Grid container spacing={spacing}>
      {children}
    </Grid>
  );
}

// Responsive form field wrapper
export function ResponsiveFormField({ 
  children, 
  xs = 12, 
  sm = 6, 
  md = 4, 
  lg = 3,
  xl = 3 
}) {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      {children}
    </Grid>
  );
}

// Responsive card layout
export function ResponsiveCard({ children, spacing = 2 }) {
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: spacing },
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'background.paper',
        mb: { xs: 1, sm: 2 }
      }}
    >
      {children}
    </Box>
  );
}

// Responsive action buttons container
export function ResponsiveActionBar({ children, justifyContent = "flex-end" }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
        justifyContent: { xs: 'stretch', sm: justifyContent },
        alignItems: { xs: 'stretch', sm: 'center' },
        mt: { xs: 2, sm: 3 },
        '& .MuiButton-root': {
          minWidth: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      {children}
    </Box>
  );
}

// Responsive section divider
export function ResponsiveSection({ 
  title, 
  children, 
  headerActions = null,
  spacing = { xs: 2, sm: 3, md: 4 }
}) {
  return (
    <Box sx={{ mb: spacing }}>
      {title && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: { xs: 1, sm: 2 },
            gap: { xs: 1, sm: 2 }
          }}
        >
          <Box
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              color: 'text.primary',
              m: 0
            }}
          >
            {title}
          </Box>
          {headerActions && (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {headerActions}
            </Box>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}

// Hook for responsive breakpoint detection
export function useResponsive() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen
  };
}

// Responsive table container
export function ResponsiveTableContainer({ children }) {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        '& .MuiTable-root': {
          minWidth: { xs: 700, md: 'auto' }
        },
        '& .MuiTableCell-root': {
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
          whiteSpace: { xs: 'nowrap', md: 'normal' }
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          fontWeight: 600,
          backgroundColor: 'grey.50'
        }
      }}
    >
      {children}
    </Box>
  );
}

// Default export for backwards compatibility
export default ResponsiveContainer;