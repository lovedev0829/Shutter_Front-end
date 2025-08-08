
import { 
  Dialog,
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { 
  ExitToApp as LogoutIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SuccessMessage} from "../../../helpers/common";
import { Profile } from "../../../Redux/Redux/Action/Action";
import { removeAuth } from '../../../helpers/auth';

export default function Logout({ open, handleClose}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const handleLogout = async () => {
    handleClose();
    dispatch(Profile({}));
    navigate(`/login`);
    SuccessMessage('Logout Successfully!');
    removeAuth();
  };

  
  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            mx: 'auto',
            mb: 3,
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogoutIcon sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 2, 
            color: theme.palette.text.primary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '-0.01em'
          }}
        >
          Logout
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: theme.palette.text.secondary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: 1.6
          }}
        >
          Are you sure you want to logout?
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.secondary,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '&:hover': {
                borderColor: theme.palette.grey[400],
                backgroundColor: theme.palette.grey[50],
              }
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: '#ef4444',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '&:hover': {
                backgroundColor: '#dc2626',
              }
            }}
            startIcon={<LogoutIcon />}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
