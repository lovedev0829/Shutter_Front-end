import { Link, NavLink } from "react-router-dom";
import SideBarLink from "./SideBarLink";
import { Dashboardsvg } from "../SvgFile/Index";
import { useEffect, useRef, useState } from "react";
import Logout from "../Component/Pages/Auth/Logout";
import { useSelector } from "react-redux";
import { HasPermission } from "../helpers/common";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
  ClickAwayListener,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme, primarycolor }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: primarycolor || '#1e1e2d',
    color: '#fff',
    borderRight: 'none',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  },
}));

const StyledAccordion = styled(Accordion)(({ theme, primarycolor }) => ({
  backgroundColor: 'transparent',
  color: '#fff',
  boxShadow: 'none',
  border: 'none',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'transparent',
    padding: '8px 16px',
    minHeight: 'auto',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: '0 0 8px 0',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: 'rgba(0,0,0,0.1)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const UserSection = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.2)',
  borderTop: '1px solid rgba(255,255,255,0.1)',
}));

const MenuToggle = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255,255,255,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const WorkspaceLabel = styled(Typography)(({ theme }) => ({
  padding: '16px 16px 8px 16px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '1px',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  '& .MuiSvgIcon-root': {
    marginRight: '12px',
    fontSize: '20px',
    color: theme.palette.text.secondary,
  },
}));

const LogoutMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: 'rgba(244, 67, 54, 0.04)',
  },
  '& .MuiSvgIcon-root': {
    marginRight: '12px',
    fontSize: '20px',
    color: theme.palette.error.main,
  },
}));

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState('panel0'); // First panel expanded by default
  
  const admin_links = JSON.parse(localStorage.getItem("userData"))?.menu;
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));

  // Get dynamic primary color from user data
  const primaryColor = users?.primaryColor || user?.primaryColor || "#0e0d32";

  // Helper function to darken color
  const darkenColor = (color, percentage) => {
    color = color.replace("#", "");
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percentage / 100))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percentage / 100))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percentage / 100))));
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const handleDrawerToggle = (event) => {
    // Prevent event bubbling which might interfere with ClickAwayListener
    if (event) {
      event.stopPropagation();
    }
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogoutClick = () => {
    setUserMenuAnchor(null);
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleMobileNavigation = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      if (mobileOpen) {
        document.body.classList.add('mobile-menu-open');
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        const scrollY = document.body.style.top;
        document.body.classList.remove('mobile-menu-open');
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
    };
  }, [mobileOpen, isMobile]);

  const parentCategories = {
    Contact: "Order management",
    Job: "Order management",
    Order: "Order management",
    ArchiveCustomer: "Order management",
    Reports: "Order management",
    EstimationBreakdown: "Order management",
    Tenant: "User management",
    Partners: "User management",
    ManageProduct: "User management",
    Users: "User management",
    Vendors: "User management",
    Material: "Master",
    Component: "Master",
    Products: "Master",
    Options: "Master",
    Expression: "Master",
    PowderCoatColor: "Master",
    OptionExpression: "Master",
    ProductType: "Settings",
    JobType: "Settings",
    JobTitle: "Settings",
    Tax: "Settings",
    Discount: "Settings",
    Setting: "Settings",
  };

  const excludedRoles = [
    "Roles",
    "Address",
    "Estimate",
    "Window",
    "Invoice",
    "JobSchedule",
    "VendorOrder",
    "Stripe",
    "GHL",
    "PartnerContact",
    "EmailConfiguration",
    "ProductMarkup",
    "JobContact",
  ];

  const groupLinksByCategory = (links) => {
    const grouped = {};

    // Group links by category, excluding some roles
    links?.forEach((item) => {
      if (excludedRoles.includes(item.roleName)) return;
      const category = parentCategories[item.roleName] || "Other";
      
      if (category === "Other") {
        console.log(`Menu item "${item.roleDisplayName}" (${item.roleName}) is being placed in "Other" category`);
      }
      
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });

    if (grouped["Other"]) {
      delete grouped["Other"];
    }

    if (
      HasPermission("GHLView") ||
      HasPermission("StripeView") ||
      HasPermission("EmailConfigurationView")
    ) {
      if (!grouped["Settings"]) grouped["Settings"] = [];
      grouped["Settings"].push({
        roleDisplayName: "Configuration",
        roleName: "Configuration", // Add this field
        url: "/configuration",
        icon: `<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.445 1.78772C4.30061 1.02129 5.30557 0.440215 6.39667 0.0810547C6.70857 0.47206 7.1046 0.787723 7.55532 1.00457C8.00603 1.22141 8.49983 1.33386 9 1.33355C9.5001 1.33396 9.99386 1.22164 10.4446 1.00494C10.8953 0.788245 11.2914 0.472741 11.6033 0.081888C12.6944 0.441048 13.6994 1.02212 14.555 1.78855C14.3729 2.25393 14.298 2.75434 14.3358 3.25263C14.3736 3.75092 14.5231 4.2343 14.7733 4.66689C15.023 5.1003 15.3672 5.47185 15.7802 5.75391C16.1933 6.03596 16.6646 6.22127 17.1592 6.29606C17.3931 7.42013 17.3931 8.58032 17.1592 9.70439C16.1925 9.85272 15.3008 10.4211 14.7733 11.3336C14.523 11.7662 14.3734 12.2498 14.3356 12.7482C14.2978 13.2467 14.3728 13.7472 14.555 14.2127C13.6993 14.9789 12.6944 15.5597 11.6033 15.9186C11.2914 15.5277 10.8953 15.2122 10.4446 14.9955C9.99386 14.7788 9.5001 14.6665 9 14.6669C8.49983 14.6666 8.00603 14.779 7.55532 14.9959C7.1046 15.2127 6.70857 15.5284 6.39667 15.9194C5.30555 15.5603 4.30058 14.9792 3.445 14.2127C3.62727 13.7472 3.70229 13.2467 3.66449 12.7482C3.62669 12.2498 3.47704 11.7662 3.22667 11.3336C2.97691 10.9003 2.63271 10.5289 2.21965 10.247C1.8066 9.96509 1.33531 9.77991 0.840834 9.70522C0.606929 8.58087 0.606929 7.42041 0.840834 6.29606C1.33539 6.22127 1.80672 6.03596 2.21978 5.75391C2.63284 5.47185 2.977 5.1003 3.22667 4.66689C3.47686 4.2343 3.6264 3.75092 3.6642 3.25263C3.702 2.75434 3.62708 2.2531 3.445 1.78772ZM10.25 10.1644C10.5366 10.0014 10.7882 9.78339 10.9902 9.52282C11.1922 9.26225 11.3406 8.9643 11.427 8.64612C11.5134 8.32794 11.536 7.99581 11.4935 7.66886C11.451 7.34191 11.3443 7.0266 11.1794 6.74107C11.0146 6.45554 10.7949 6.20544 10.5329 6.00517C10.271 5.8049 9.97211 5.65841 9.65337 5.57414C9.33462 5.48987 9.00235 5.46948 8.67569 5.51414C8.34903 5.55881 8.03443 5.66764 7.75 5.83439C7.18048 6.16827 6.76615 6.71385 6.59741 7.35209C6.42867 7.99033 6.51922 8.66941 6.84931 9.24113C7.17941 9.81284 7.72223 10.2308 8.35934 10.4038C8.99645 10.5767 9.67611 10.4907 10.25 10.1644Z" fill="white"></path></svg>`,
        isVirtual: true,
      });
    } else {
      console.log("No permissions found for Configuration menu");
    }

    // Convert object to array with Order management first
    const ordered = [];

    if (grouped["Order management"]) {
      ordered.push({
        category: "Order management",
        items: grouped["Order management"],
      });
      delete grouped["Order management"];
    }
    
    // Push remaining categories in any order, but exclude empty "Other" category
    Object.entries(grouped).forEach(([category, items]) => {
      if (category === "Other" && items.length === 0) {
        return; // Skip empty "Other" category
      }
      ordered.push({ category, items });
    });

    return ordered;
  };

  // Usage:
  const groupedLinks = groupLinksByCategory(admin_links);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Logo Section */}
      <LogoContainer>
        <MenuToggle 
          onClick={(e) => {
            e.stopPropagation();
            handleDrawerToggle(e);
          }}
          data-toggle-button="true"
          sx={{
            display: { xs: 'flex', md: 'none' },
          }}
        >
          <MenuIcon />
        </MenuToggle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 1
          }}>
            <img
              src={users?.logo ? users?.logo : user?.logo}
              alt="Company Logo"
              loading="lazy"
              style={{ maxHeight: '32px', maxWidth: '100%' }}
            />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>
            {users?.companyName ? users?.companyName : user?.companyName}
          </Typography>
        </Box>
      </LogoContainer>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: '80px' }}>
        {/* Dashboard */}
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/dashboard"
              onClick={handleMobileNavigation}
              sx={{
                color: '#fff',
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRight: '3px solid #1976d2',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Workspace Label */}
        <WorkspaceLabel variant="overline">
          Workspace
        </WorkspaceLabel>

        {/* Menu Sections */}
        <Box sx={{ px: 1 }}>
          {groupedLinks.map(({ category, items }, index) => {
            const isFirst = index === 0; // check if first item

            return (
              <StyledAccordion
                key={index}
                expanded={expandedAccordion === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                primarycolor={primaryColor}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                    {category}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ py: 0 }}>
                    {items.map((item, i) => (
                      <SideBarLink
                        key={i}
                        href={item?.url}
                        name={item.roleDisplayName}
                        icon={item.icon}
                        handleClosemenu={handleMobileNavigation}
                      />
                    ))}
                  </List>
                </AccordionDetails>
              </StyledAccordion>
            );
          })}
        </Box>
      </Box>

      {/* User Section */}
      <UserSection>
        <ListItem disablePadding>
          <ListItemButton onClick={handleUserMenuClick} sx={{ color: '#fff' }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                <PersonIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={`${users?.firstName || user?.firstName} ${users?.lastName || user?.lastName} ${users?.suffix || user?.suffix || ''}`}
              secondary={users?.email || user?.email}
              primaryTypographyProps={{ 
                fontSize: '14px', 
                fontWeight: 500,
                color: '#fff',
                noWrap: true 
              }}
              secondaryTypographyProps={{ 
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                noWrap: true 
              }}
            />
          </ListItemButton>
        </ListItem>

        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{
            sx: { 
              mt: -1,
              minWidth: 220,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: 2,
            }
          }}
        >
          <StyledMenuItem 
            component={Link} 
            to="/update-profile" 
            onClick={() => {
              handleUserMenuClose();
              handleMobileNavigation();
            }}
          >
            <AccountCircleIcon />
            Profile Info
          </StyledMenuItem>
          <StyledMenuItem 
            component={Link} 
            to="/chnage-password" 
            onClick={() => {
              handleUserMenuClose();
              handleMobileNavigation();
            }}
          >
            <LockIcon />
            Change Password
          </StyledMenuItem>
          <Divider sx={{ my: 1 }} />
          <LogoutMenuItem onClick={handleLogoutClick}>
            <ExitToAppIcon />
            Logout
          </LogoutMenuItem>
        </Menu>
      </UserSection>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Drawer */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ 
          keepMounted: true,
        }}
        BackdropProps={{
          onClick: () => setMobileOpen(false)
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        }}
        primarycolor={primaryColor}
      >
        <Box>{drawerContent}</Box>
      </StyledDrawer>

      {/* Desktop Drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
        open
        primarycolor={primaryColor}
      >
        {drawerContent}
      </StyledDrawer>

      {/* Mobile Menu Button - only show when drawer is closed */}
      {isMobile && !mobileOpen && (
        <IconButton
          onClick={handleDrawerToggle}
          data-toggle-button="true"
          aria-label="Open navigation menu"
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: 1400, // Higher than Material UI's modal z-index
            bgcolor: primaryColor,
            color: '#fff',
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            '&:hover': { 
              bgcolor: darkenColor(primaryColor, 15),
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      )}

      <Logout open={logoutOpen} handleClose={handleLogoutClose} />
    </Box>
  );
}
