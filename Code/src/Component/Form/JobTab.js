import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Box,
  useTheme,
  Paper
} from '@mui/material';
import {
  Person as ProfileIcon,
  LocationOn as AddressIcon,
  Work as JobsIcon
} from '@mui/icons-material';

export default function JobTab({ contactId }) {
  const navigate = useNavigate();
  const theme = useTheme();
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
        // Already on jobs page, no navigation needed
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
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
            '&.Mui-selected': {
              fontWeight: 600,
            },
          },
        }}
      >
        {tabsData.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            sx={{ gap: 1 }}
          />
        ))}
      </Tabs>
    </>
  );
}
