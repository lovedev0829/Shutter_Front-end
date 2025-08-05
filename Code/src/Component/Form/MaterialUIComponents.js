import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

// Card Component with Material UI styling using sx prop
export function CustomCard({ title, children, actions, variant = "outlined" }) {
  return (
    <Card
      variant={variant}
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      {title && (
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </CardContent>
      )}
      <CardContent sx={{ pt: title ? 1 : 2 }}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
}

// Page Header Component
export function PageHeader({ title, subtitle, actions, breadcrumbs }) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {breadcrumbs && (
        <Box sx={{ mb: 2 }}>
          {breadcrumbs}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Alert Component with different variants
export function CustomAlert({ type = "info", message, title, onClose, action }) {
  return (
    <Alert 
      severity={type}
      onClose={onClose}
      action={action}
      sx={{
        borderRadius: 2,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      {title && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
      )}
      <Typography variant="body2">
        {message}
      </Typography>
    </Alert>
  );
}

// Modal/Dialog Component
export function CustomDialog({ 
  open, 
  onClose, 
  title, 
  children, 
  actions, 
  maxWidth = "sm",
  fullWidth = true 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}

// Loading Component
export function LoadingSpinner({ size = 40, color = "primary", text }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={size} color={color} />
      {text && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {text}
        </Typography>
      )}
    </Box>
  );
}

// Stats/Metrics Card
export function StatsCard({ title, value, subtitle, icon, color = "primary", trend }) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {title}
        </Typography>
        {icon && (
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
          }}>
            {icon}
          </Box>
        )}
      </Box>
      
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        {value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
      
      {trend && (
        <Box sx={{ mt: 1 }}>
          {trend}
        </Box>
      )}
    </Card>
  );
}

// Custom Tabs Component
export function CustomTabs({ tabs, value, onChange, variant = "standard" }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant={variant}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            '&.Mui-selected': {
              fontWeight: 600,
            },
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </Tabs>
    </Box>
  );
}

// Form Section Component
export function FormSection({ title, children, collapsible = false, defaultExpanded = true }) {
  if (collapsible) {
    return (
      <Accordion 
        defaultExpanded={defaultExpanded}
        sx={{
          mb: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 2,
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: 'background.default',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

// Action Button Group
export function ActionButtonGroup({ buttons, orientation = "horizontal" }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || 'contained'}
          color={button.color || 'primary'}
          size={button.size || 'medium'}
          disabled={button.disabled}
          onClick={button.onClick}
          startIcon={button.startIcon}
          endIcon={button.endIcon}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
            ...button.sx,
          }}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
}

// Empty State Component
export function EmptyState({ icon, title, description, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary', fontSize: 48 }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      
      {action && action}
    </Box>
  );
} 