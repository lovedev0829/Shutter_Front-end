import React from 'react';
import { Typography } from '@mui/material';

// Responsive Typography Components with mobile-optimized font sizes

// Page Title - Large heading for page titles
export function ResponsivePageTitle({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="h4"
      component="h1"
      sx={{
        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.125rem' },
        fontWeight: 600,
        lineHeight: { xs: 1.3, sm: 1.2 },
        color: 'text.primary',
        mb: { xs: 1, sm: 2 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Section Title - Medium heading for sections
export function ResponsiveSectionTitle({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
        fontWeight: 600,
        lineHeight: { xs: 1.3, sm: 1.2 },
        color: 'text.primary',
        mb: { xs: 1, sm: 1.5 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Card Title - For card headers
export function ResponsiveCardTitle({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="h6"
      component="h3"
      sx={{
        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
        fontWeight: 600,
        lineHeight: 1.3,
        color: 'text.primary',
        mb: { xs: 0.5, sm: 1 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Body Text - Regular content text
export function ResponsiveBodyText({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="body1"
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem' },
        lineHeight: { xs: 1.4, sm: 1.5 },
        color: 'text.primary',
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Caption Text - Small text for captions, labels
export function ResponsiveCaptionText({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        lineHeight: 1.3,
        color: 'text.secondary',
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Subtitle - Secondary text under titles
export function ResponsiveSubtitle({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="subtitle1"
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
        lineHeight: { xs: 1.4, sm: 1.5 },
        color: 'text.secondary',
        mb: { xs: 1, sm: 1.5 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Button Text - For button labels that need responsive sizing
export function ResponsiveButtonText({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="button"
      sx={{
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        fontWeight: 500,
        textTransform: 'none',
        lineHeight: 1.2,
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// List Item Text - For list items and table cells
export function ResponsiveListText({ children, sx = {}, ...props }) {
  return (
    <Typography
      variant="body2"
      sx={{
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        lineHeight: { xs: 1.3, sm: 1.4 },
        color: 'text.primary',
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Helper function for responsive font sizing in sx prop
export const responsiveFontSizes = {
  // Page titles
  pageTitle: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.125rem' },
  // Section headers
  sectionTitle: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
  // Card titles
  cardTitle: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
  // Regular body text
  bodyText: { xs: '0.875rem', sm: '1rem' },
  // Small text/captions
  captionText: { xs: '0.75rem', sm: '0.875rem' },
  // Button text
  buttonText: { xs: '0.75rem', sm: '0.875rem' },
  // List/table text
  listText: { xs: '0.75rem', sm: '0.875rem' },
  // Subtitle text
  subtitleText: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
};

// Helper for responsive line heights
export const responsiveLineHeights = {
  tight: { xs: 1.2, sm: 1.3 },
  normal: { xs: 1.3, sm: 1.4 },
  relaxed: { xs: 1.4, sm: 1.5 },
  loose: { xs: 1.5, sm: 1.6 },
};

// Export all components as named exports
export default {
  ResponsivePageTitle,
  ResponsiveSectionTitle,
  ResponsiveCardTitle,
  ResponsiveBodyText,
  ResponsiveCaptionText,
  ResponsiveSubtitle,
  ResponsiveButtonText,
  ResponsiveListText,
  responsiveFontSizes,
  responsiveLineHeights,
};