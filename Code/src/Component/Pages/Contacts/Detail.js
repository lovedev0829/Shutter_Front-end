import React, { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Button,
  Chip,
  Divider,
  IconButton,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Assignment as NotesIcon,
  Description as DocumentIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  ContactMail as ContactTypeIcon,
  LocationCity as CityIcon,
  Map as StateIcon,
  MarkunreadMailbox as ZipcodeIcon,
  Schedule as EffectiveDateIcon,
  EventBusy as ExpiryDateIcon,
  AccountCircle as FullNameIcon,
  Home as StreetAddressIcon,
} from "@mui/icons-material";
import Header from "../../../Layout/header";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, BackButton, ErrorMessage, FormatPhoneNumber, HasPermission, PreviewFiles } from "../../../helpers/common";
import AddEditContact from "./AddEditContact";
import Addresslist from "../Address/Addresslist";
import moment from "moment";
import Joblist from "../Jobs/Joblist";
import { ResponsiveContainer } from "../../Layout/ResponsiveLayout";

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`contact-tabpanel-${index}`}
      aria-labelledby={`contact-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </Box>
  );
}

// Info Item Component
function InfoItem({ icon, label, value, variant = "default" }) {
  if (!value && variant !== "document") return null;
  
  return (
    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 0.25, sm: 0.5 } }}>
        {icon && (
          <Box sx={{ 
            mr: { xs: 0.75, sm: 1 }, 
            color: "primary.main", 
            display: "flex",
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}>
            {icon}
          </Box>
        )}
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 600, 
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: { xs: '0.6875rem', sm: '0.75rem' }
          }}
        >
          {label}
        </Typography>
      </Box>
      {variant === "document" ? (
        value && <PreviewFiles file={value} />
      ) : (
        <Typography 
          variant="body1" 
          sx={{ 
            color: "text.primary",
            fontWeight: 500,
            pl: icon ? { xs: 2.5, sm: 3 } : 0,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: { xs: 1.4, sm: 1.5 }
          }}
        >
          {value || "—"}
        </Typography>
      )}
    </Box>
  );
}

export default function Detail() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const param = useParams();
  const navigate = useNavigate();

  // Define tabs with permissions
  const tabs = [
    {
      label: "Profile",
      icon: <PersonIcon />,
      show: true,
    },
    {
      label: "Address",
      icon: <LocationIcon />,
      show: HasPermission("AddressView"),
    },
    {
      label: "Jobs", 
      icon: <WorkIcon />,
      show: HasPermission("JobView"),
    },
  ].filter(tab => tab.show);

  const TenantlistAPI = async () => {
    let query = {
      searchValue: param.contactId,
      pageNo: 1,
      recordPerPage: 10,
      tenantId: "",
      status: "2"
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Contact, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        const tenants = apiResponse?.data?.data;
        if (tenants?.length > 0) {
          if (tenants[0]?.isActive) {
            setTenantList(tenants);
          } else {
            navigate("/contacts");
          }
        } else {
          navigate("/contacts");
        }
      } else {
        setTenantList([]);
        navigate("/contacts");
        ErrorMessage(apiResponse?.data?.message)
      }
    } catch (error) {
      navigate("/contacts");
      setLoader(false)
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [param.contactId, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const contact = tenantList[0] || {};
  const billingAddress = contact?.billingAddressVm || {};

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <ApiLoder open={loder} />
      <Box className="intersight_content">
        <Header title={`Contacts / ${contact?.firstName + " " + contact?.lastName + " " + (contact?.suffix ?? "")}`} />

        <ResponsiveContainer 
            maxWidth="xl"
            disableGutters={false}
            sx={{ 
              py: { xs: 1, sm: 2, md: 3 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
          {/* Header Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between', 
              mb: { xs: 3, sm: 2 },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1.5, sm: 2 },
                width: { xs: '100%', sm: 'auto' }
              }}>
                                <IconButton 
                  onClick={() => navigate('/contacts')}
                  sx={{ 
                    backgroundColor: 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' },
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 }
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </IconButton>
                
                <Avatar 
                  sx={{ 
                    width: { xs: 48, sm: 56 }, 
                    height: { xs: 48, sm: 56 }, 
                    backgroundColor: 'primary.main',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 600
                  }}
                >
                  {contact?.firstName?.[0]}{contact?.lastName?.[0]}
                </Avatar>
                
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      lineHeight: { xs: 1.3, sm: 1.4 }
                    }}
                  >
                    {contact?.firstName} {contact?.lastName} {contact?.suffix}
                  </Typography>
                  <Chip 
                    icon={<ContactTypeIcon />}
                    label={contact?.contactType || "Contact"} 
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      mt: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      height: { xs: 24, sm: 28 }
                    }}
                  />
                </Box>
              </Box>

              {HasPermission("ContactEdit") && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setOpen(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    width: { xs: '100%', sm: 'auto' },
                    mt: { xs: 2, sm: 0 }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 40, sm: 48 },
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: 160 },
                  px: { xs: 1, sm: 2 },
                  '&.Mui-selected': {
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{ 
                    gap: { xs: 0.5, sm: 1 },
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: '1.125rem', sm: '1.25rem' }
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box>
          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            {HasPermission("ContactView") && (
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} lg={6}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: 'fit-content'
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                        <PersonIcon sx={{ 
                          mr: { xs: 0.75, sm: 1 }, 
                          color: 'primary.main',
                          fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.125rem' }
                          }}
                        >
                          Personal Information
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

                      <Grid container spacing={{ xs: 2, sm: 3 }}>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<FullNameIcon fontSize="small" />}
                            label="Full Name"
                            value={`${contact?.firstName} ${contact?.lastName} ${contact?.suffix ?? ""}`.trim()}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<ContactTypeIcon fontSize="small" />}
                            label="Contact Type"
                            value={contact?.contactType}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<PhoneIcon fontSize="small" />}
                            label="Phone Number"
                            value={FormatPhoneNumber(contact?.phoneNumber || "")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<EmailIcon fontSize="small" />}
                            label="Email Address"
                            value={contact?.email}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<BusinessIcon fontSize="small" />}
                            label="Referral Source"
                            value={contact?.referral}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<WebsiteIcon fontSize="small" />}
                            label="Website"
                            value={contact?.website}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InfoItem
                            icon={<NotesIcon fontSize="small" />}
                            label="Notes"
                            value={contact?.notes}
                          />
                        </Grid>
                        
                        {/* Tax Document */}
                        {contact?.taxExemptionVm?.exemptionCertificate && (
                          <Grid item xs={12}>
                            <InfoItem
                              icon={<DocumentIcon fontSize="small" />}
                              label="Tax Document"
                              value={contact?.taxExemptionVm?.exemptionCertificate}
                              variant="document"
                            />
                          </Grid>
                        )}

                        {/* Tax Dates */}
                        {contact?.taxExemptionVm?.effectiveDate && (
                          <Grid item xs={12} sm={6}>
                            <InfoItem
                              icon={<EffectiveDateIcon fontSize="small" />}
                              label="Effective Date"
                              value={moment(contact?.taxExemptionVm?.effectiveDate).format("MM-DD-YYYY")}
                            />
                          </Grid>
                        )}
                        {contact?.taxExemptionVm?.expiryDate && (
                          <Grid item xs={12} sm={6}>
                            <InfoItem
                              icon={<ExpiryDateIcon fontSize="small" />}
                              label="Expiry Date"
                              value={moment(contact?.taxExemptionVm?.expiryDate).format("MM-DD-YYYY")}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Billing Address */}
                <Grid item xs={12} lg={6}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: 'fit-content'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Primary/Billing Address
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={{ xs: 2, sm: 3 }}>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<FullNameIcon fontSize="small" />}
                            label="Full Name"
                            value={`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""}`.trim()}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<PhoneIcon fontSize="small" />}
                            label="Phone Number"
                            value={FormatPhoneNumber(billingAddress?.phoneNumber || "")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InfoItem
                            icon={<EmailIcon fontSize="small" />}
                            label="Email Address"
                            value={billingAddress?.email}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InfoItem
                            icon={<StreetAddressIcon fontSize="small" />}
                            label="Street Address"
                            value={billingAddress?.streetAddress}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <InfoItem
                            icon={<CityIcon fontSize="small" />}
                            label="City"
                            value={billingAddress?.city}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <InfoItem
                            icon={<StateIcon fontSize="small" />}
                            label="State"
                            value={billingAddress?.stateName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <InfoItem
                            icon={<ZipcodeIcon fontSize="small" />}
                            label="Zipcode"
                            value={billingAddress?.zipCode}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </TabPanel>

          {/* Address Tab */}
          <TabPanel value={tabValue} index={tabs.findIndex(tab => tab.label === "Address")}>
            {HasPermission("AddressView") && tabValue === tabs.findIndex(tab => tab.label === "Address") && (
              <Addresslist />
            )}
          </TabPanel>

          {/* Jobs Tab */}
          <TabPanel value={tabValue} index={tabs.findIndex(tab => tab.label === "Jobs")}>
            {HasPermission("JobView") && tabValue === tabs.findIndex(tab => tab.label === "Jobs") && (
              <Joblist initialActiveTab="#pills-content" />
            )}
          </TabPanel>
          </Box>
        </ResponsiveContainer>

      {/* Edit Contact Modal */}
      {open && (
        <AddEditContact
          open={open}
          handleclose={() => setOpen(false)}
          action={"edit"}
          LanguageListAPI={TenantlistAPI}
          object={contact}
        />
      )}
      </Box>
    </Box>
  );
}
