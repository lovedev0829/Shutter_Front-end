import { 
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress
} from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";

export default function ArchivePopup({
  open,
  handleClose,
  handlestatus,
  title = "",
  subtitle = "",
  loder,
  object
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className="intersight_content">
      <div className="body_content">
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="xs"
          aria-labelledby="archive-dialog-title"
          aria-describedby="archive-dialog-description"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: isMobile ? '16px 16px 0 0' : '12px',
              margin: isMobile ? '0' : '32px',
              maxHeight: isMobile ? '90vh' : '85vh',
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 0 : 'auto',
              top: isMobile ? 'auto' : '50%',
              transform: isMobile ? 'none' : 'translateY(-50%)',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '500px',
              boxShadow: isMobile 
                ? '0 -8px 32px rgba(0, 0, 0, 0.12)' 
                : '0 20px 60px rgba(0, 0, 0, 0.15)',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          {/* Header with close button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: isMobile ? '12px 16px 8px' : '16px 20px 12px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#fafbfc',
            }}
          >
            <IconButton
              onClick={handleClose}
              size={isMobile ? 'medium' : 'large'}
              sx={{
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  color: '#374151',
                },
                padding: isMobile ? '6px' : '8px',
              }}
            >
              <Close fontSize={isMobile ? 'medium' : 'large'} />
            </IconButton>
          </Box>

          {/* Content */}
          <DialogContent
            sx={{
              padding: isMobile ? '20px 16px' : '32px 24px',
              textAlign: 'center',
              backgroundColor: 'white',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? 2 : 3,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: isMobile ? '48px' : '64px',
                  height: isMobile ? '48px' : '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <img
                  src="/image/shareimg.svg"
                  alt="Archive confirmation"
                  loading="lazy"
                  style={{
                    width: isMobile ? '24px' : '32px',
                    height: isMobile ? '24px' : '32px',
                  }}
                />
              </Box>

              {/* Title */}
              <Typography
                id="archive-dialog-title"
                variant={isMobile ? 'h6' : 'h5'}
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                  lineHeight: isMobile ? 1.4 : 1.3,
                  textAlign: 'center',
                  mb: 1,
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </Typography>

              {/* Subtitle */}
              <Typography
                id="archive-dialog-description"
                variant="body1"
                sx={{
                  color: '#6b7280',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  lineHeight: isMobile ? 1.5 : 1.4,
                  textAlign: 'center',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </DialogContent>

          {/* Actions */}
          <DialogActions
            sx={{
              padding: isMobile ? '16px' : '20px 24px 24px',
              backgroundColor: '#fafbfc',
              borderTop: '1px solid #e5e7eb',
              gap: isMobile ? 1 : 2,
              flexDirection: isMobile ? 'column-reverse' : 'row',
              '& > *': {
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'unset' : '100px',
              },
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              size={isMobile ? 'large' : 'medium'}
              sx={{
                color: '#374151',
                borderColor: '#d1d5db',
                backgroundColor: 'white',
                fontWeight: 600,
                fontSize: isMobile ? '0.875rem' : '0.9375rem',
                padding: isMobile ? '12px 24px' : '10px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                minHeight: isMobile ? '48px' : '40px',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#9ca3af',
                  color: '#111827',
                },
                '&:focus': {
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => handlestatus(object ? 0 : 1)}
              disabled={loder}
              variant="contained"
              size={isMobile ? 'large' : 'medium'}
              sx={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
                fontSize: isMobile ? '0.875rem' : '0.9375rem',
                padding: isMobile ? '12px 24px' : '10px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                minHeight: isMobile ? '48px' : '40px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                },
                '&:focus': {
                  boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                  color: 'white',
                  boxShadow: 'none',
                },
              }}
            >
              Confirm
              {loder && (
                <CircularProgress
                  size={isMobile ? 18 : 16}
                  sx={{
                    color: 'white',
                    marginLeft: '8px',
                  }}
                />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
