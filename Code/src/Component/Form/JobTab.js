import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Box,
  useTheme,
  Paper,
  useMediaQuery
} from '@mui/material';
import {
  Person as ProfileIcon,
  LocationOn as AddressIcon,
  Work as JobsIcon
} from '@mui/icons-material';

export default function JobTab({ contactId }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(2); // Jobs tab is active (index 2)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    switch (newValue) {
      case 0: // Profile
        localStorage.setItem("activeTab2", "#pills-overview");
        navigate(`/contacts/detail/${contactId}`);
        break;
      case 1: // Address
        localStorage.setItem("activeTab2", "#pills-playbook");
        navigate(`/contacts/detail/${contactId}`);
        break;
      case 2: // Jobs - stays on current page
        localStorage.setItem("activeTab2", "#pills-playbook-job");
        break;
      default:
        break;
    }
  };

  const tabsData = [
    {
      label: 'Profile',
      icon: <ProfileIcon />,
      active: false
    },
    {
      label: 'Address', 
      icon: <AddressIcon />,
      active: false
    },
    {
      label: 'Jobs',
      icon: <JobsIcon />,
      active: true
    }
  ];

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile={isMobile}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: isMobile ? 56 : 48,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            px: isMobile ? 1.5 : 3,
            '&.Mui-selected': {
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            '&:hover': {
              color: theme.palette.primary.main,
              opacity: 0.8,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
            height: 3,
          },
          '& .MuiTabs-scrollButtons': {
            color: theme.palette.primary.main,
          }
        }}
      >
        {tabsData.map((tab, index) => (
          <Tab
            key={index}
            label={isMobile ? undefined : tab.label}
            icon={tab.icon}
            iconPosition={isMobile ? "top" : "start"}
            sx={{ 
              gap: isMobile ? 0.5 : 1,
              minWidth: isMobile ? 60 : 90,
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '18px', sm: '20px', md: '22px' },
              }
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
