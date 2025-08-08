import React from "react";
import { NavLink } from "react-router-dom";
import { HasPermission } from "../helpers/common";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: '#fff',
  borderRadius: '6px',
  margin: '2px 8px',
  padding: '8px 12px',
  '&.active': {
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    borderLeft: '3px solid #1976d2',
    '& .MuiListItemIcon-root': {
      color: '#1976d2',
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: '#fff',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  minWidth: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 18,
    height: 18,
    fill: 'currentColor',
  },
}));

export default function SideBarLink({ href, name, icon, handleClosemenu }) {
  const loginuser = JSON.parse(localStorage.getItem("userData"));

  const Tablist = [
    HasPermission("GHLView") &&
      !loginuser.isGHLConfigSameAsTenant && {
        id: "#ghl",
      },
    HasPermission("StripeView") && {
      id: "#Stripe",
    },
    HasPermission("EmailConfigurationView") && {
      id: "#Email",
    },
  ].filter(Boolean);

  const handleNavClick = () => {
    let activeTab;
    switch (href) {
      case "/contacts":
        activeTab = "#pills-overview";
        break;
      case "/users":
        activeTab = "#manageapplication";
        break;
      case "/reports":
        activeTab = "#FinanceReports";
        break;
      case "/configuration":
        const preference = ["#ghl", "#Stripe", "#Email"];
        activeTab =
          preference.find((id) => Tablist.some((t) => t.id === id)) ||
          "#ghl";
        break;
      default:
        activeTab = "#vendorlisttabd";
    }
    handleClosemenu();
    localStorage.setItem("activeTab2", activeTab);
  };

  return (
    <ListItem disablePadding>
      <StyledListItemButton
        component={NavLink}
        to={href}
        onClick={handleNavClick}
      >
        <ListItemIcon>
          <IconContainer dangerouslySetInnerHTML={{ __html: icon }} />
        </ListItemIcon>
        <ListItemText 
          primary={name}
          primaryTypographyProps={{
            fontSize: '13px',
            fontWeight: 500,
            noWrap: true
          }}
        />
      </StyledListItemButton>
    </ListItem>
  );
}
