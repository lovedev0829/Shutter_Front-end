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
  Slide
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ViewModule as WindowIcon,
  Receipt as EstimateIcon,
  ShoppingCart as OrderIcon,
  Payment as InvoiceIcon,
  Schedule as ScheduleIcon,
  People as ContactsIcon,
  Description as DocumentsIcon
} from "@mui/icons-material";

export default function JobDetiels() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [tabdata, setTabdata] = useState("#window-measurement");
  const theme = useTheme();

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
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header
          title={`Contacts / ${
            tenantList[0]?.contactFirstName +
            " " +
            tenantList[0]?.contactLasttName +
            " " +
            (tenantList[0]?.suffix ?? "")
          }`}
        />

        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          {/* Modern Header Card */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
                             {/* Job Tab Navigation */}
               <Box sx={{ mb: 4 }}>
                 <JobTab contactId={tenantList[0]?.contactId} />
               </Box>

              {/* Modern Back Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton
                  onClick={() => navigate(`/contacts/detail/${tenantList[0]?.contactId}`)}
                  sx={{
                    mr: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateX(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 0.5
                    }}
                  >
                    Back to Contact Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
              borderRadius: 3,
              overflow: 'hidden',
              background: 'white'
            }}
          >
            {/* Modern Tab Header */}
            <Box 
              sx={{ 
                background: `linear-gradient(90deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}04 100%)`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                px: 3,
                pt: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      mr: 2,
                      width: 32,
                      height: 32
                    }}
                  >
                    {getTabIcon(tabdata)}
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary
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

              {/* Enhanced Material UI Tabs */}
              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    minHeight: 64,
                    px: 3,
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
                    label={tab.title}
                    iconPosition="start"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: '20px',
                        mr: 1
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Enhanced Tab Content */}
            <CardContent sx={{ p: 4 }}>
              <Fade in={true} timeout={300}>
                <Box>
                  {/* Window Measurements tab content */}
                  {HasPermission("WindowView") && tabdata === "#window-measurement" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <WindowTable listdata={tenantList[0]} />
                    </Box>
                  )}

                  {/* Estimate tab */}
                  {HasPermission("EstimateView") && tabdata === "#estimate" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <EstimateList listdata={tenantList[0]} />
                    </Box>
                  )}

                  {/* Order tab */}
                  {HasPermission("OrderView") && tabdata === "#orders" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <OrderList JobId={param.JobId} />
                    </Box>
                  )}

                  {/* Invoice tab */}
                  {HasPermission("InvoiceView") && tabdata === "#invoice" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <InvoiceList
                        JobId={param.JobId}
                        contactId={tenantList[0]?.contactId}
                      />
                    </Box>
                  )}

                  {/* Job Schedule tab */}
                  {HasPermission("JobScheduleView") && tabdata === "#jobscheduletab" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <Jobschedulelist />
                    </Box>
                  )}

                  {/* Contact tab */}
                  {HasPermission("JobContactView") && tabdata === "#contacttab" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <JobContactList />
                    </Box>
                  )}

                  {/* Document tab */}
                  {HasPermission("JobContactView") && tabdata === "#documenttab" && (
                    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                      <AllDocumentlist />
                    </Box>
                  )}
                </Box>
              </Fade>
            </CardContent>
          </Card>
        </Container>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
