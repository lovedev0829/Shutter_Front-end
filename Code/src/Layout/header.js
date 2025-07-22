import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MuiMenuItem,
  Box,
  Divider,
  ListItemText,
  Chip,
  Paper,
  ClickAwayListener,
  Popper
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '1px solid #e0e0e0',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
  },
}));

const NotificationPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 400,
  maxHeight: 400,
  overflow: 'auto',
  marginTop: 8,
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  border: '1px solid #e0e0e0',
}));

const NotificationItem = styled(Box)(({ theme, isread }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #f5f5f5',
  cursor: 'pointer',
  backgroundColor: isread === 'true' ? '#f9f9f9' : '#fff',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export default function Header(props) {
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setnotifications] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const userName = user?.username;
  const currentTenantId = user?.tenantId;

  const NotificationlistAPI = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllNotification, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setnotifications(apiResponse?.data?.data);
      } else {
        setnotifications([]);
      }
    } catch (error) {}
  };

  const getTenantsListByUsername = async () => {
    const apiResponse = await callAPI(apiUrls.GetTenantsListByUsername, {UserName: userName}, "GET");
    if (apiResponse?.data?.isSuccess) {
      setTenantList(apiResponse?.data?.data);
    }
  }

  useEffect(() => {
    NotificationlistAPI();
    getTenantsListByUsername();
  }, []);

  const navigate = useNavigate();

  const NotificationType = (notification) => {
    switch (notification.type) {
      case "Job":
        localStorage.setItem("activeTab", "#window-measurement");
        localStorage.setItem("activeTab2", "#pills-overview");
        navigate(`/contacts/job/${notification?.typeId}`);
        break;
      case "Contact":
        localStorage.setItem("activeTab", "#window-measurement");
        localStorage.setItem("activeTab2", "#pills-overview");
        navigate(`/contacts/detail/${notification?.typeId}`);
        break;
      case "Estimate":
        localStorage.setItem("activeTab", "#estimate");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/estimate/preview/${notification?.typeId}`);
        break;
      case "Tenant":
        navigate(`/tenant`);
        break;
      case "SubTenant":
        navigate(`/subtenant`);
        break;
      case "User":
        localStorage.setItem("activeTab2", "#manageapplication");
        navigate(`/users`);
        break;
      case null:
      case "":
        console.log(`Unknown Type Notification: ${notification.body}`);
        break;
      default:
        console.log(`Other Type (${notification.type}): ${notification.body}`);
    }
  };

  const handlestatus = async (data) => {
    NotificationType(data);
    setAnchorEl(null);
    try {
      const response = await callAPI(
        apiUrls.UpdateNotification,
        { id: data.id },
        "POST",
        {}
      );

      if (response.data.isSuccess) {
        
      } else {
      }
    } catch (error) {}
  };

  const handleTenantChange = async (e) => {
    const tenantId = e.target.value;
    try {
        const apiResponse = await callAPI(apiUrls.GetUserDataForTenantSwitch, {
            UserName: userName,
            TenantId: tenantId
        }, "GET");
      
        if (apiResponse?.data?.isSuccess) {

            const completeUserData = apiResponse.data.data;

            localStorage.setItem("userData", JSON.stringify(completeUserData));
            localStorage.setItem("accessToken", completeUserData.token);
            
            window.location.reload();
        } 
    } catch (error) {
        console.error("Error switching tenant:", error);
    }
  }

  const handleNotificationClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = notifications?.filter((notif) => !notif?.isReaded)?.length || 0;

  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 2 }}>
        {/* Tenant Selector */}
        <Box sx={{ minWidth: 150, maxWidth: 280, flexShrink: 0 }}>
          <FormControl size="small" fullWidth>
            <InputLabel 
              id="tenant-select-label"
              sx={{ 
                fontSize: '13px',
                display: { xs: 'none', md: 'block' }
              }}
            >
              Tenant
            </InputLabel>
            <StyledSelect
              labelId="tenant-select-label"
              value={currentTenantId || ''}
              onChange={handleTenantChange}
              label="Tenant"
              size="small"
              sx={{ 
                fontSize: '13px',
                '& .MuiSelect-select': {
                  py: 1
                }
              }}
            >
              {tenantList?.map((tenant) => (
                <MenuItem key={tenant?.tenantId} value={tenant?.tenantId}>
                  {tenant?.code}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </Box>

        {/* Header Title */}
        <Typography 
          variant="h6" 
          component="h1"
          sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.2rem', lg: '1.5rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mx: 2
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
            {users?.companyName ? users?.companyName : user?.companyName} -{" "}
          </Box>
          {props.title}
        </Typography>

        {/* Notifications */}
        <Box sx={{ flexShrink: 0 }}>
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              p: 1,
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '11px',
                  height: 18,
                  minWidth: 18,
                  fontWeight: 'bold'
                }
              }}
            >
              <NotificationsIcon sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>

          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="bottom-end"
            sx={{ zIndex: 1300 }}
          >
            <ClickAwayListener onClickAway={handleNotificationClose}>
              <NotificationPaper>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      color: '#333'
                    }}
                  >
                    NOTIFICATIONS
                  </Typography>
                </Box>
                
                <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
                  {notifications?.length > 0 ? (
                    notifications.map((notif, i) => (
                      <NotificationItem
                        key={i}
                        isread={notif?.isReaded?.toString()}
                        onClick={() => handlestatus(notif)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {!notif?.isReaded && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                mt: 0.5,
                                flexShrink: 0
                              }}
                            />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle2"
                              sx={{ 
                                fontWeight: notif?.isReaded ? 400 : 600,
                                fontSize: '14px',
                                color: '#333',
                                mb: 0.5
                              }}
                            >
                              {notif?.subject}
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                color: '#666',
                                fontSize: '13px',
                                mb: 1,
                                lineHeight: 1.4
                              }}
                            >
                              {notif?.body}
                            </Typography>
                            <Typography 
                              variant="caption"
                              sx={{ 
                                color: '#999',
                                fontSize: '12px'
                              }}
                            >
                              {moment(notif?.createdDate).format("MM-DD-YYYY || hh:mm A")}
                            </Typography>
                          </Box>
                        </Box>
                      </NotificationItem>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        No notifications
                      </Typography>
                    </Box>
                  )}
                </Box>
              </NotificationPaper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
