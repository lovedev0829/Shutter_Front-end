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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  ClickAwayListener,
  useTheme,
  useMediaQuery
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
export default function Header(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState(false);
  const [notifications, setnotifications] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
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
    try {
      setTenantsLoading(true);
      const apiResponse = await callAPI(apiUrls.GetTenantsListByUsername, {UserName: userName}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      }
    } catch (error) {
      console.error("Error loading tenants:", error);
      setTenantList([]);
    } finally {
      setTenantsLoading(false);
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
        case "Order":
        localStorage.setItem("activeTab", "#orders");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/order/preview/${notification?.typeId}`);
        break;
         case "Payment":
        localStorage.setItem("activeTab", "#invoice");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/payment/${notification?.typeId}`);
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

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef(null);

  const handleNotificationClose = () => {
    setOpen(false);
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          gap: 2,
          minHeight: '60px !important',
          px: { xs: 1, sm: 2 }
        }}
      >
        {/* Tenant Selector */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            minWidth: { xs: 120, sm: 150 },
            maxWidth: { xs: 200, sm: 280 },
            flexShrink: 0
          }}
        >
          <FormControl 
            size="small" 
            fullWidth
            variant="outlined"
          >
            <InputLabel 
              id="tenant-select-label"
              sx={{ 
                fontSize: '0.875rem',
                display: { xs: 'none', md: 'block' }
              }}
            >
              Tenant
            </InputLabel>
            <Select
              labelId="tenant-select-label"
              value={currentTenantId || ''}
              onChange={handleTenantChange}
              label={isSmallScreen ? '' : 'Tenant'}
              sx={{
                fontSize: '0.875rem',
                '& .MuiSelect-select': {
                  py: 0.75
                }
              }}
            >
              {tenantList?.map((tenant) => (
                <MenuItem 
                  key={tenant?.tenantId} 
                  value={tenant?.tenantId}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {tenant?.code}
                </MenuItem>
              ))}
            </Select>
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
            mx: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: { xs: '1rem', sm: '1.25rem', lg: '1.5rem' }
          }}
        >
          <Box 
            component="span" 
            sx={{ display: { xs: 'none', lg: 'inline' } }}
          >
            {users?.companyName ? users?.companyName : user?.companyName} -{" "}
          </Box>
          {props.title}
        </Typography>

        {/* Notifications */}
        <Box sx={{ flexShrink: 0 }}>
          <IconButton
            ref={anchorRef}
            onClick={() => setOpen(!open)}
            sx={{
              width: 40,
              height: 40,
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
            aria-label="notifications"
          >
            <Badge 
              badgeContent={notifications?.filter((notif) => !notif?.isReaded)?.length}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  height: 18,
                  minWidth: 18
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Notifications Dropdown */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-end"
            style={{ zIndex: 1300 }}
          >
            <ClickAwayListener onClickAway={handleNotificationClose}>
              <Paper
                elevation={8}
                sx={{
                  width: { xs: 300, sm: 400 },
                  maxHeight: 400,
                  overflow: 'hidden',
                  mt: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    NOTIFICATIONS
                  </Typography>
                </Box>
                
                <List 
                  sx={{ 
                    p: 0, 
                    maxHeight: 320, 
                    overflow: 'auto' 
                  }}
                >
                  {notifications?.length > 0 ? (
                    notifications.map((notif, i) => (
                      <Box key={i}>
                        <ListItemButton
                          onClick={() => handlestatus(notif)}
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            py: 1.5,
                            px: 2,
                            backgroundColor: notif?.isReaded 
                              ? 'transparent' 
                              : 'action.hover',
                            '&:hover': {
                              backgroundColor: 'action.selected'
                            }
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notif?.isReaded ? 400 : 600,
                              color: 'text.primary',
                              mb: 0.5
                            }}
                          >
                            {notif?.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              mb: 0.5,
                              wordBreak: 'break-word'
                            }}
                          >
                            {notif?.body}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.disabled',
                              fontSize: '0.75rem'
                            }}
                          >
                            {moment(notif?.createdDate).format("MM-DD-YYYY || hh:mm A")}
                          </Typography>
                        </ListItemButton>
                        {i < notifications.length - 1 && <Divider />}
                      </Box>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No notifications"
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
