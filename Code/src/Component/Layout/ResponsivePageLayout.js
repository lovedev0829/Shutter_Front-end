import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveProvider, ResponsiveContainer, ResponsivePageHeader } from './ResponsiveLayout';
import BaseLayout from '../../Layout/BaseLayout';

// Main responsive page wrapper
export default function ResponsivePageLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  backButton,
  enableScrollToTop = true,
  mobileFullWidth = false,
  maxWidth = "xl",
  disableGutters = false,
  sx = {}
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ResponsiveProvider>
      <BaseLayout>
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: 'grey.50',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            ...sx
          }}
        >
          {/* Main content area with proper mobile margins */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              marginLeft: { xs: 0, md: '280px' }, // Account for sidebar
              transition: 'margin-left 0.3s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <ResponsiveContainer
              maxWidth={maxWidth}
              disableGutters={disableGutters}
              enableScrollToTop={enableScrollToTop}
              mobileFullWidth={mobileFullWidth}
            >
              {/* Page Header */}
              {title && (
                <ResponsivePageHeader
                  title={title}
                  subtitle={subtitle}
                  actions={actions}
                  breadcrumbs={breadcrumbs}
                  backButton={backButton}
                />
              )}

              {/* Page Content */}
              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                  '& .MuiPaper-root': {
                    borderRadius: { xs: 1, sm: 2 },
                    boxShadow: { xs: 1, sm: 2 }
                  },
                  '& .MuiCard-root': {
                    borderRadius: { xs: 1, sm: 2 },
                    boxShadow: { xs: 1, sm: 2 }
                  }
                }}
              >
                {children}
              </Box>
            </ResponsiveContainer>
          </Box>
        </Box>
      </BaseLayout>
    </ResponsiveProvider>
  );
}

// Simplified wrapper for pages that don't need full layout features
export function SimpleResponsivePage({ children, title, sx = {} }) {
  return (
    <ResponsivePageLayout
      title={title}
      maxWidth="lg"
      enableScrollToTop={true}
      sx={sx}
    >
      {children}
    </ResponsivePageLayout>
  );
}

// Wrapper for full-width mobile pages (like dashboards)
export function FullWidthResponsivePage({ children, title, sx = {} }) {
  return (
    <ResponsivePageLayout
      title={title}
      mobileFullWidth={true}
      enableScrollToTop={true}
      sx={sx}
    >
      {children}
    </ResponsivePageLayout>
  );
}