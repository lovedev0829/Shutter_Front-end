import React from 'react';
import { 
  Box, 
  Paper, 
  Stack, 
  Grid, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import Header from '../../Layout/header';
import { ResponsiveContainer } from './ResponsiveLayout';
import { ResponsivePageTitle } from './ResponsiveTypography';

// Main responsive page template with mobile-first design
export default function ResponsivePageTemplate({
  title,
  children,
  headerActions,
  showPaper = true,
  containerProps = {},
  paperProps = {},
  sx = {}
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        ...sx
      }}
    >
      <Box className="intersight_content">
        <Header title={title} />
        <Box className="body_content">
          <ResponsiveContainer
            maxWidth="xl"
            disableGutters={false}
            sx={{
              py: { xs: 1, sm: 2, md: 3 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
            {...containerProps}
          >
            {showPaper ? (
              <Paper
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: 2,
                  boxShadow: 1,
                  backgroundColor: 'background.paper',
                  width: '100%',
                  overflow: 'hidden',
                  ...paperProps.sx
                }}
                {...paperProps}
              >
                {children}
              </Paper>
            ) : (
              children
            )}
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}

// Responsive List Page Template
export function ResponsiveListPageTemplate({
  title,
  children,
  headerActions,
  filters,
  showSearch = true,
  searchComponent,
  ...props
}) {
  return (
    <ResponsivePageTemplate title={title} {...props}>
      {/* Page Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <ResponsivePageTitle>{title}</ResponsivePageTitle>
        {headerActions && (
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {headerActions}
          </Box>
        )}
      </Stack>

      {/* Filters Section */}
      {(filters || searchComponent) && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          {searchComponent && (
            <Box sx={{ mb: 2 }}>
              {searchComponent}
            </Box>
          )}
          {filters && (
            <Grid container spacing={2}>
              {filters}
            </Grid>
          )}
        </Box>
      )}

      {/* Main Content */}
      {children}
    </ResponsivePageTemplate>
  );
}

// Responsive Form Page Template
export function ResponsiveFormPageTemplate({
  title,
  children,
  headerActions,
  maxWidth = "md",
  ...props
}) {
  return (
    <ResponsivePageTemplate 
      title={title} 
      containerProps={{ maxWidth }}
      {...props}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <ResponsivePageTitle>{title}</ResponsivePageTitle>
        {headerActions && (
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {headerActions}
          </Box>
        )}
      </Stack>

      {/* Form Content */}
      {children}
    </ResponsivePageTemplate>
  );
}

// Responsive Dashboard Page Template
export function ResponsiveDashboardTemplate({
  title,
  children,
  headerActions,
  showWelcomeCard = false,
  welcomeContent,
  ...props
}) {
  return (
    <ResponsivePageTemplate title={title} showPaper={false} {...props}>
      {/* Welcome Card */}
      {showWelcomeCard && welcomeContent && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          {welcomeContent}
        </Box>
      )}

      {/* Dashboard Content */}
      {children}
    </ResponsivePageTemplate>
  );
}

// Responsive Card Grid Template
export function ResponsiveCardGrid({ 
  children, 
  spacing = 2, 
  breakpoints = { xs: 12, sm: 6, md: 4, lg: 3 },
  sx = {} 
}) {
  return (
    <Grid 
      container 
      spacing={spacing} 
      sx={{ width: '100%', ...sx }}
    >
      {React.Children.map(children, (child, index) => (
        <Grid item {...breakpoints} key={index}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}

// Responsive Table Wrapper with mobile optimizations for page templates
export function ResponsivePageTableWrapper({ children, sx = {} }) {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: { xs: 'auto', md: 'visible' },
        '& .MuiTable-root': {
          minWidth: { xs: 700, md: 'auto' },
          width: '100%'
        },
        '& .MuiTableCell-root': {
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
          whiteSpace: { xs: 'nowrap', md: 'normal' }
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          fontWeight: 600,
          backgroundColor: 'grey.50',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}