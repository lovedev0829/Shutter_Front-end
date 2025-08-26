import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
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
  useMediaQuery,
  Stack,
  Collapse,
  Menu,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ErrorMessage, HasPermission, SuccessMessage } from "../helpers/common";
export default function Header(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState(false);
  const [notifications, setnotifications] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [subtenantList, setsubTenantList] = useState([]);
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
      const apiResponse = await callAPI(
        apiUrls.GetTenantsListByUsername,
        { UserName: userName },
        "GET"
      );
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      }
    } catch (error) {
      console.error("Error loading tenants:", error);
      setTenantList([]);
    } finally {
      setTenantsLoading(false);
    }
  };

  const SubTenantlistAPI = async () => {
    let query = {
      searchValue: "",
      pageNo: 1,
      recordPerPage: 1000,
      tenantId: "",
      status: "2",
    };
    try {
      const apiResponse = await callAPI(apiUrls.SubTenant, {}, "POST", query);
      if (apiResponse?.data?.isSuccess) {
        setsubTenantList(apiResponse?.data?.data);
      } else {
        setsubTenantList([]);
      }
    } catch (error) {
      setsubTenantList([]);
    }
  };

  useEffect(() => {
    NotificationlistAPI();
    getTenantsListByUsername();
    if (HasPermission("SubTenantView")) {
      SubTenantlistAPI();
    }
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
      const apiResponse = await callAPI(
        apiUrls.GetUserDataForTenantSwitch,
        {
          UserName: userName,
          TenantId: tenantId,
        },
        "GET"
      );

      if (apiResponse?.data?.isSuccess) {
        const completeUserData = apiResponse.data.data;

        localStorage.setItem("userData", JSON.stringify(completeUserData));
        localStorage.setItem("accessToken", completeUserData.token);
        localStorage.setItem("userDataold", JSON.stringify(completeUserData));
        localStorage.setItem("accessTokenold", completeUserData.token);

        window.location.reload();
      }
    } catch (error) {
      console.error("Error switching tenant:", error);
    }
  };


  const anchorRef = useRef(null);

  const handleNotificationClose = () => {
    setOpen(false);
  };

  const ImpersonateTenant = localStorage.getItem("ImpersonateTenant");

  const Switchtoparent = () => {
    localStorage.removeItem("ImpersonateTenant");
    localStorage.setItem("accessToken", localStorage.getItem("accessTokenold"));
    localStorage.setItem("userData", localStorage.getItem("userDataold"));
    window.location.href = `/dashboard`;
  };
  const olduser = JSON.parse(localStorage.getItem("userDataold"));


  
    const ImpersonateTenantAcess = async (e) => {
      try {
        const apiResponse = await callAPI(
          apiUrls.ImpersonateTenant,
          {subTenantId:e.target.value},
          "POST",
          {}
        );
  
        if (apiResponse?.data?.isSuccess) {
           let res = apiResponse?.data?.data;
           localStorage.setItem("ImpersonateTenant", "Yes");
          localStorage.setItem("accessToken", res?.token);
          localStorage.setItem("userData", JSON.stringify(res));
          SuccessMessage(apiResponse?.data?.message);
          window.location.href = `/dashboard`;
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {}
    };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        paddingLeft: { xs: 0, md: 2 },
        paddingRight: { xs: 0, md: 2 },
      }}
    >
      {/* Main Toolbar */}
      <Toolbar
        sx={{
          justifyContent: { xs: "center", md: "space-between" },
          gap: { xs: 0.5, sm: 1, md: 2 },
          minHeight: { xs: "56px", sm: "64px" },
          px: { xs: 1, sm: 2 },
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* Left Section - Tenant/Partner Selectors or Back Button */}
        {ImpersonateTenant ? (
          <Link to={`#`} onClick={() => Switchtoparent()}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "center", md: "center" },
                borderRadius: 1,
                backgroundColor: "action.hover",
                minWidth: { xs: "auto", sm: 200 },
              }}
            >
              <img
                src="/image/refresh.svg"
                alt="Back"
                loading="lazy"
                width={20}
                height={20}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                Back to{" "}
                {olduser?.companyName
                  ? olduser?.companyName
                  : `${olduser?.firstName} ${olduser?.lastName}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  display: { xs: "block", sm: "none" },
                }}
              >
                Back
              </Typography>
            </Box>
          </Link>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexDirection: { xs: "column", md: "row" },
              width: { xs: "100%", md: "auto" },
              order: { xs: 2, md: 1 },
            }}
          >
            {/* Tenant Selector */}
            <FormControl 
              size="small" 
              variant="outlined"
              sx={{ 
                marginTop: { xs: 2, md: 0 },
                marginBottom: { xs: 1, md: 0 },
                minWidth: { xs: "50%", sm: 120, md: 150 },
                maxWidth: { xs: "100%", md: 200 }
              }}
            >
              <InputLabel
                id="tenant-select-label"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  display: { xs: "block", md: "block" },
                }}
              >
                {isExtraSmall ? "Tenant" : "Tenant"}
              </InputLabel>
              <Select
                labelId="tenant-select-label"
                value={currentTenantId || ""}
                onChange={handleTenantChange}
                label="Tenant"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "& .MuiSelect-select": {
                    py: { xs: 1, sm: 1 },
                  },
                }}
              >
                {tenantList?.map((tenant) => (
                  <MenuItem
                    key={tenant?.tenantId}
                    value={tenant?.tenantId}
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {tenant?.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Partner Selector */}
            {HasPermission("SubTenantView") && (
              <FormControl 
                size="small" 
                variant="outlined"
                sx={{ 
                  minWidth: { xs: "50%", sm: 120, md: 150 },
                  maxWidth: { xs: "100%", md: 200 }
                }}
              >
                <InputLabel
                  id="subtenant-select-label"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {isExtraSmall ? "Partners" : "Partners"}
                </InputLabel>
                <Select
                  labelId="subtenant-select-label"
                  value=""
                  onChange={ImpersonateTenantAcess}
                  label="Partners"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "& .MuiSelect-select": {
                      py: { xs: 1, sm: 1 },
                    },
                  }}
                >
                  {subtenantList?.map((tenant) => (
                    <MenuItem
                      key={tenant?.tenantId}
                      value={tenant?.tenantId}
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {tenant?.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        )}

        {/* Center Section - Header Title */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: { xs: 1, md: 1 },
            textAlign: { xs: "center", md: "center" },
            fontWeight: 600,
            mx: { xs: 1, sm: 2 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem", lg: "1.5rem" },
            order: { xs: 1, md: 2 },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
            {users?.companyName ? users?.companyName : user?.companyName} -{" "}
          </Box>
          {props.title}
        </Typography>

        {/* Right Section - Notifications */}
        <Box 
          sx={{ 
            display: { xs: "flex", md: "flex" },
            flexShrink: 0,
            marginTop: { xs: 2, md: 0 },
            width: { xs: "100%", md: "auto" },
            order: { xs: 3, md: 3 },
            justifyContent: { xs: "center", md: "center" },
          }}
        >
          <IconButton
            ref={anchorRef}
            onClick={() => setOpen(!open)}
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              color: "text.primary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            aria-label="notifications"
          >
            <Badge
              badgeContent={
                notifications?.filter((notif) => !notif?.isReaded)?.length
              }
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: { xs: "0.625rem", sm: "0.75rem" },
                  height: { xs: 16, sm: 18 },
                  minWidth: { xs: 16, sm: 18 },
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
            </Badge>
          </IconButton>

          {/* Notifications Dropdown */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-end"
            style={{ zIndex: 1300 }}
            modifiers={[
              {
                name: "preventOverflow",
                options: {
                  altAxis: true,
                  altBoundary: true,
                  tether: false,
                  rootBoundary: "viewport",
                },
              },
            ]}
          >
            <ClickAwayListener onClickAway={handleNotificationClose}>
              <Paper
                elevation={8}
                sx={{
                  width: { xs: "calc(100vw - 16px)", sm: 380, md: 400 },
                  maxWidth: { xs: "calc(100vw - 16px)", sm: 400 },
                  maxHeight: { xs: "70vh", sm: 400 },
                  overflow: "hidden",
                  mt: 1,
                  mr: { xs: 1, sm: 0 },
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    NOTIFICATIONS
                  </Typography>
                </Box>

                <List
                  sx={{
                    p: 0,
                    maxHeight: { xs: "calc(70vh - 60px)", sm: 320 },
                    overflow: "auto",
                  }}
                >
                  {notifications?.length > 0 ? (
                    notifications.map((notif, i) => (
                      <Box key={i}>
                        <ListItemButton
                          onClick={() => handlestatus(notif)}
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: { xs: 1, sm: 1.5 },
                            px: { xs: 1.5, sm: 2 },
                            backgroundColor: notif?.isReaded
                              ? "transparent"
                              : "action.hover",
                            "&:hover": {
                              backgroundColor: "action.selected",
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notif?.isReaded ? 400 : 600,
                              color: "text.primary",
                              mb: 0.5,
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            {notif?.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              mb: 0.5,
                              wordBreak: "break-word",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              lineHeight: 1.4,
                            }}
                          >
                            {notif?.body}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              fontSize: { xs: "0.625rem", sm: "0.75rem" },
                            }}
                          >
                            {moment(notif?.createdDate).format(
                              isExtraSmall ? "MM-DD-YY | hh:mm A" : "MM-DD-YYYY || hh:mm A"
                            )}
                          </Typography>
                        </ListItemButton>
                        {i < notifications.length - 1 && <Divider />}
                      </Box>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No notifications"
                        sx={{ 
                          textAlign: "center", 
                          color: "text.secondary",
                          "& .MuiListItemText-primary": {
                            fontSize: { xs: "0.875rem", sm: "1rem" }
                          }
                        }}
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
