import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useResponsiveContext } from './ResponsiveLayout';

// Responsive header component that adapts to different screen sizes
export default function ResponsiveHeader({
  title,
  subtitle,
  onMenuClick,
  leftActions,
  rightActions,
  showMenuButton = true,
  position = "static",
  backgroundColor = "#fff",
  elevation = 1,
  sx = {}
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const responsive = useResponsiveContext();

  return (
    <AppBar
      position={position}
      elevation={elevation}
      sx={{
        backgroundColor,
        color: '#333',
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...sx
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          gap: 1,
          minHeight: { xs: 56, sm: 64 },
          justifyContent: 'space-between'
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            minWidth: 0
          }}
        >
          {/* Mobile Menu Button */}
          {showMenuButton && isMobile && onMenuClick && (
            <IconButton
              onClick={onMenuClick}
              edge="start"
              sx={{
                color: 'text.secondary',
                mr: 1
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Left Actions */}
          {leftActions && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mr: 1
              }}
            >
              {leftActions}
            </Box>
          )}

          {/* Title Section */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right Section */}
        {rightActions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              flexShrink: 0
            }}
          >
            {rightActions}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Responsive header with built-in spacing
export function ResponsiveHeaderSpaced(props) {
  return (
    <>
      <ResponsiveHeader {...props} position="sticky" />
      <Box sx={{ height: { xs: 56, sm: 64 } }} />
    </>
  );
}

// Mobile-optimized header for overlay usage
export function ResponsiveMobileHeader({
  title,
  onBackClick,
  onMenuClick,
  actions,
  sx = {}
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        backgroundColor: '#fff',
        color: '#333',
        zIndex: theme.zIndex.appBar,
        ...sx
      }}
    >
      <Toolbar
        sx={{
          px: 2,
          minHeight: 56,
          gap: 1
        }}
      >
        {/* Back/Menu Button */}
        {(onBackClick || onMenuClick) && (
          <IconButton
            onClick={onBackClick || onMenuClick}
            edge="start"
            sx={{ color: 'text.secondary', mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Title */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flex: 1,
            fontWeight: 600,
            fontSize: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Typography>

        {/* Actions */}
        {actions && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {actions}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}