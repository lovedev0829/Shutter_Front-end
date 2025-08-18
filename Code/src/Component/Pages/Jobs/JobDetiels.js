import { useNavigate, useParams } from "react-router-dom";
import {
  ApiLoder,
  BackButton,
  ErrorMessage,
  HasPermission,
  JobUi,
} from "../../../helpers/common";
import Header from "../../../Layout/header";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import WindowTable from "../Window/WindowTable";
import EstimateList from "../Estimate/EstimateList";
import OrderList from "../Orders/OrderList";
import JobTab from "../../Form/JobTab";
import InvoiceList from "../Invoice/InvoiceList";
import Jobschedulelist from "../Jobschedule/Jobschedulelist";
import JobContactList from "../JobContact/JobContactList";
import AllDocumentlist from "../Documentupload/AllDocumentlist";
// Material UI Imports
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Grid,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Fade,
  Slide,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ViewModule as WindowIcon,
  Receipt as EstimateIcon,
  ShoppingCart as OrderIcon,
  Payment as InvoiceIcon,
  Schedule as ScheduleIcon,
  People as ContactsIcon,
  Description as DocumentsIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";

export default function JobDetiels() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [tabdata, setTabdata] = useState("#window-measurement");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const navigate = useNavigate();
  const param = useParams();

  const TenantlistAPI = async () => {
    setLoader(true);
    let query = {
      tenantId: "",
      searchValue: param.JobId,
      pageNo: 1,
      recordPerPage: 10,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
    };
    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if (apiResponse?.data?.data?.length>0) {
          setTenantList(apiResponse?.data?.data);
        } else {
          navigate("/contacts");
        }
      } else {
        navigate("/contacts");
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      navigate("/contacts");
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const getTabIcon = (id) => {
    switch (id) {
      case "#window-measurement": return <WindowIcon />;
      case "#estimate": return <EstimateIcon />;
      case "#orders": return <OrderIcon />;
      case "#invoice": return <InvoiceIcon />;
      case "#jobscheduletab": return <ScheduleIcon />;
      case "#contacttab": return <ContactsIcon />;
      case "#documenttab": return <DocumentsIcon />;
      default: return null;
    }
  };

  const Tablist = [
    HasPermission("WindowView") && {
      status: true,
      id: "#window-measurement",
      title: "Window Measurements",
      icon: getTabIcon("#window-measurement"),
    },
    HasPermission("EstimateView") && {
      status: false,
      id: "#estimate",
      title: "Estimate",
      icon: getTabIcon("#estimate"),
    },
    HasPermission("OrderView") && {
      status: false,
      id: "#orders",
      title: "Orders",
      icon: getTabIcon("#orders"),
    },
    HasPermission("InvoiceView") && {
      status: false,
      id: "#invoice",
      title: "Invoice",
      icon: getTabIcon("#invoice"),
    },
    HasPermission("JobScheduleView") && {
      status: false,
      id: "#jobscheduletab",
      title: "Job Schedule",
      icon: getTabIcon("#jobscheduletab"),
    },
    HasPermission("JobContactView") && {
      status: false,
      id: "#contacttab",
      title: "Contacts",
      icon: getTabIcon("#contacttab"),
    },
    HasPermission("JobContactView") && {
      status: false,
      id: "#documenttab",
      title: "Documents",
      icon: getTabIcon("#documenttab"),
    },
  ].filter(Boolean);

  const initialActiveTab = localStorage.getItem("activeTab") || Tablist[0].id;

  const handleGettab = (value) => {
    setTabdata(value || Tablist[0].id);
  };

  const handleTabChange = (event, newValue) => {
    const selectedTab = Tablist[newValue];
    setTabdata(selectedTab.id);
    localStorage.setItem("activeTab", selectedTab.id);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileTabSelect = (tabId) => {
    setTabdata(tabId);
    localStorage.setItem("activeTab", tabId);
    setMobileMenuOpen(false);
  };

  const getCurrentTabIndex = () => {
    return Tablist.findIndex(tab => tab.id === tabdata);
  };

  const getCurrentTabTitle = () => {
    const currentTab = Tablist.find(tab => tab.id === tabdata);
    return currentTab?.title || 'Details';
  };

  return (
    <>
      <ApiLoder open={loder} />
      <Box className="intersight_content">  
          <Header
            title={`Contacts / ${
              tenantList[0]?.contactFirstName +
              " " +
              tenantList[0]?.contactLasttName +
              " " +
              (tenantList[0]?.suffix ?? "")
            }`}
          />

          <Container 
            maxWidth="xl" 
            sx={{ 
              mt: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 4 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            {/* Responsive Header Card */}
            <Card 
              elevation={0}
              sx={{ 
                mb: { xs: 2, sm: 3 },
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: { xs: 2, sm: 3 },
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, sm: 3, md: 4 }
              }}>
                {/* Job Tab Navigation - Responsive across all devices */}
                <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                  <JobTab contactId={tenantList[0]?.contactId} />
                </Box>

                {/* Responsive Back Button */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: { xs: 3, sm: 4 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <IconButton
                    onClick={() => navigate(`/contacts/detail/${tenantList[0]?.contactId}`)}
                    sx={{
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 2, sm: 0 },
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      width: { xs: 35, sm: 35 },
                      height: { xs: 35, sm: 35 },
                      alignSelf: { xs: 'flex-start', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateX(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: { xs: '18px', sm: '24px' } }} />
                  </IconButton>
                  <Box>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"}
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                        fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      Back to Contact Details
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: { xs: 'none', sm: 'block' },
                        fontSize: { sm: '0.875rem', md: '0.875rem' }
                      }}
                    >
                      Return to main contact information
                    </Typography>
                  </Box>
                </Box>

                {/* Enhanced Job Info Card */}
                <Card 
                  elevation={0}
                  sx={{ 
                    backgroundColor: 'white',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: { xs: 1, sm: 2 },
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <JobUi tenantList={tenantList[0]} />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Main Content Card */}
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: { xs: 2, sm: 3 },
                overflow: 'hidden',
                background: 'white'
              }}
            >
              {/* Mobile Tab Header with Drawer */}
              {isMobile ? (
                <AppBar 
                  position="static" 
                  elevation={0}
                  sx={{ 
                    backgroundColor: `${theme.palette.primary.main}08`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary
                  }}
                >
                  <Toolbar sx={{ px: 2, minHeight: '56px !important' }}>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => setMobileMenuOpen(true)}
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Avatar 
                      sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                        width: 24,
                        height: 24
                      }}
                    >
                      {getTabIcon(tabdata)}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {getCurrentTabTitle()}
                    </Typography>
                  </Toolbar>
                </AppBar>
              ) : (
                /* Desktop/Tablet Tab Header */
                <Box 
                  sx={{ 
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}04 100%)`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    px: { sm: 2, md: 3 },
                    pt: 2
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 0 }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: theme.palette.primary.main,
                          mr: 2,
                          width: { sm: 28, md: 32 },
                          height: { sm: 28, md: 32 }
                        }}
                      >
                        {getTabIcon(tabdata)}
                      </Avatar>
                      <Typography 
                        variant={isTablet ? "h6" : "h5"}
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: { sm: '1.15rem', md: '1.25rem', lg: '1.5rem' }
                        }}
                      >
                        {getCurrentTabTitle()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${Tablist.length} Sections`}
                      size="small"
                      sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>

                  {/* Enhanced Material UI Tabs - Desktop/Tablet */}
                  <Tabs
                    value={getCurrentTabIndex()}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: { sm: '0.75rem', md: '0.875rem', lg: '0.9rem' },
                        minHeight: { sm: 56, md: 64 },
                        px: { sm: 2, md: 3 },
                        borderRadius: '12px 12px 0 0',
                        mx: 0.5,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: `${theme.palette.primary.main}08`,
                          color: theme.palette.primary.main,
                        },
                        '&.Mui-selected': {
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          backgroundColor: 'white',
                          boxShadow: `0 -2px 8px ${theme.palette.primary.main}15`,
                        },
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: theme.palette.primary.main,
                      },
                      '& .MuiTabs-scrollButtons': {
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    {Tablist.map((tab, index) => (
                      <Tab
                        key={index}
                        icon={tab.icon}
                        label={isTablet ? undefined : tab.title}
                        iconPosition="start"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: { sm: '16px', md: '18px', lg: '20px' },
                            mr: { sm: 0, md: 1 }
                          }
                        }}
                      />
                    ))}
                  </Tabs>
                </Box>
              )}

              {/* Mobile Navigation Drawer */}
              <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                PaperProps={{
                  sx: {
                    width: 280,
                    backgroundColor: theme.palette.background.paper,
                  }
                }}
              >
                                  <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Navigation
                      </Typography>
                      <IconButton onClick={() => setMobileMenuOpen(false)}>
                        <CloseIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                    </Box>
                  </Box>
                <List>
                  {Tablist.map((tab, index) => (
                    <ListItemButton
                      key={index}
                      selected={tab.id === tabdata}
                      onClick={() => handleMobileTabSelect(tab.id)}
                      sx={{
                        py: 2,
                        '&.Mui-selected': {
                          backgroundColor: `${theme.palette.primary.main}15`,
                          borderRight: `3px solid ${theme.palette.primary.main}`,
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                          '& .MuiListItemText-primary': {
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={tab.title}
                        primaryTypographyProps={{
                          fontWeight: tab.id === tabdata ? 600 : 400,
                          fontSize: '0.95rem'
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Drawer>

              {/* Enhanced Tab Content */}
              <CardContent sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                '& .MuiTable-root': {
                  overflowX: 'auto'
                }
              }}>
                <Fade in={true} timeout={300}>
                  <Box>
                    {/* Window Measurements tab content */}
                    {HasPermission("WindowView") && tabdata === "#window-measurement" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <WindowTable listdata={tenantList[0]} />
                        </Box>
                      </Slide>
                    )}

                    {/* Estimate tab */}
                    {HasPermission("EstimateView") && tabdata === "#estimate" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <EstimateList listdata={tenantList[0]} />
                        </Box>
                      </Slide>
                    )}

                    {/* Order tab */}
                    {HasPermission("OrderView") && tabdata === "#orders" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <OrderList JobId={param.JobId} listdata={tenantList[0]}/>
                        </Box>
                      </Slide>
                    )}

                    {/* Invoice tab */}
                    {HasPermission("InvoiceView") && tabdata === "#invoice" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <InvoiceList
                            JobId={param.JobId}
                            contactId={tenantList[0]?.contactId}
                            listdata={tenantList[0]}
                          />
                        </Box>
                      </Slide>
                    )}

                    {/* Job Schedule tab */}
                    {HasPermission("JobScheduleView") && tabdata === "#jobscheduletab" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <Jobschedulelist listdata={tenantList[0]}/>
                        </Box>
                      </Slide>
                    )}

                    {/* Contact tab */}
                    {HasPermission("JobContactView") && tabdata === "#contacttab" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <JobContactList listdata={tenantList[0]}/>
                        </Box>
                      </Slide>
                    )}

                    {/* Document tab */}
                    {HasPermission("JobContactView") && tabdata === "#documenttab" && (
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Box>
                          <AllDocumentlist listdata={tenantList[0]}/>
                        </Box>
                      </Slide>
                    )}
                  </Box>
                </Fade>
              </CardContent>
            </Card>
          </Container>
      </Box>
    </>
  );
}
