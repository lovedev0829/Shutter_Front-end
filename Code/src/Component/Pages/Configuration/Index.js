import React, { useEffect, useRef } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  CustomMessages,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { EmailSvg, GhlSvg, StripeSvg } from "../../../SvgFile/Index";
import SimpleReactValidator from "simple-react-validator";
import Stripe from "./Stripe";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import Stages from "./Stages";
import Email from "./Email";
// Material UI imports
import {
  Box,
  Container,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
  IconButton,
  Chip,
  Alert
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Sync as SyncIcon,
  Link as LinkIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";

export default function Index() {
  const [loder, setLoader] = useState(false);
  const [open, setopen] = useState(false);
  const [ghl, setGhl] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState({
    pipelineId: "",
    locationId: "",
    calendarName: "",
    generatedToken: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetGHLConfiguration,
        { code: code },
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if (code) {
          SuccessMessage(apiResponse.data?.message);
          navigate("/configuration");
        }
        if (!apiResponse?.data?.data) {
          setGhl(true);
        } else {
          setGhl(false);
        }
        setValue(apiResponse?.data?.data);
      } else {
        setValue({
          apIkey: "",
          pipelineId: "",
          locationId: "",
          calendarName: "",
          generatedToken: "",
        });
        setGhl(true);
      }
    } catch (error) {
      setGhl(true);
      setLoader(false);
    }
  };
  useEffect(() => {
    if(HasPermission("GHLView") && !loginuser.isGHLConfigSameAsTenant){
 TenantlistAPI();
    }
   
    // eslint-disable-next-line
  }, [code]);

  // const GetAccessToken = async () => {
  //   try {
  //     await callAPI(apiUrls.GetAccessToken, { code: code }, "GET");
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   if (code) {
  //     GetAccessToken();
  //   }
  // }, [code]);
  const loginuser = JSON.parse(localStorage.getItem("userData"));

 const Tablist = [
  HasPermission("GHLView") && !loginuser.isGHLConfigSameAsTenant && {
    status: true,
    id: 0,
    svg: <GhlSvg />,
    title: "GHL Configuration",
  },
  HasPermission("StripeView") && {
    status: false,
    id: 1,
    svg: <StripeSvg />,
    title: "Stripe Configuration",
  },
  HasPermission("EmailConfigurationView") && {
    status: false,
    id: 2,
    svg: <EmailSvg />,
    title: "Email Configuration",
  },
].filter(Boolean);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("activeTab2", newValue.toString());
  };
  const initialActiveTab = parseInt(localStorage.getItem("activeTab2") || "0");

  useEffect(() => {
    setTabValue(initialActiveTab < Tablist.length ? initialActiveTab : 0);
  }, [Tablist.length]);

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setValue((val) => {
      return { ...val, [name]: value };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.AddGHLConfiguration,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  const handleChnage = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to sync Ghl Configuration?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.ghlsync, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleghluser = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to sync Ghl Users?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.UserSync, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleChnages = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Generate Token?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.GenerateToken, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          setValue((val) => {
            return { ...val, generatedToken: response?.data?.data };
          });
          SuccessMessage(response.data.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleChnagess = async () => {
    const isConfirmed = window.confirm("Are you sure you want to go to Link?");
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.GoHighLevelAuthorization,
          {},
          "GET"
        );
        setLoader(false);

        if (response.data.isSuccess) {
          window.open(response?.data?.data, "_blank", "noopener,noreferrer");
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };


  const handlesyccustom = async () => {
    const isConfirmed = window.confirm("Are you sure you want to Sync Custom Field?");
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.SyncCustomField,
          {},
          "GET"
        );
        setLoader(false);

        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleDelte = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete GHL?");
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.DeleteConfiguration,
          { deleteType: 1, configurationId: value?.id },
          "POST",
          {}
        );
        setLoader(false);

        if (response.data.isSuccess) {
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const expirationTime = value?.refreshExpirationtime;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expirationTime) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = moment();
      const expiry = moment(expirationTime);
      const diff = expiry.diff(now);

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        // Check if today is the same day as expiration
        if (now.isSame(expiry, "day")) {
          const duration = moment.duration(diff);
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const seconds = duration.seconds();

          setTimeLeft(
            `Expires in ${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          const daysLeft = expiry
            .startOf("day")
            .diff(now.startOf("day"), "days");
          setTimeLeft(`${daysLeft} days left`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

 

  return (
    <div className="intersight_content">  
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header title="Configuration" />
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                  {Tablist.map((tab, index) => (
                    <Tab
                      key={index}
                      icon={tab.svg}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginLeft: '10px' }}>{tab.title}</span>
                        </Box>
                      }
                      iconPosition="start"
                      sx={{
                        textTransform: 'none',
                        minHeight: 'auto',
                        '& .MuiTab-iconWrapper': {
                          marginRight: 2,
                          marginBottom: 0
                        }
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
              {HasPermission("GHLView") && !loginuser.isGHLConfigSameAsTenant && tabValue === 0 && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                    Manage GHL Configuration
                  </Typography>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                          {/* <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <InputField
                                labelName={"Api Key"}
                                placeholderName={"Enter Api Key"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"apIkey"}
                                name={"apIkey"}
                                value={value.apIkey}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "apIkey",
                                  value?.apIkey,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div> */}
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Location Id"
                            placeholder="Enter LocationId"
                            type="text"
                            onChange={handleChange}
                            id="locationId"
                            name="locationId"
                            value={value.locationId || ''}
                            required
                            size="small"
                            error={!!simpleValidator.current.message(
                              "Location Id",
                              value?.locationId,
                              `required`
                            )}
                            helperText={simpleValidator.current.message(
                              "Location Id",
                              value?.locationId,
                              `required`
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Pipe line Info"
                            placeholder="Enter Pipe line Info"
                            type="text"
                            onChange={handleChange}
                            id="pipelineId"
                            name="pipelineId"
                            value={value.pipelineId || ''}
                            required
                            size="small"
                            error={!!simpleValidator.current.message(
                              "pipelineInfo",
                              value?.pipelineId,
                              `required`
                            )}
                            helperText={simpleValidator.current.message(
                              "pipelineInfo",
                              value?.pipelineId,
                              `required`
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Calendar Name"
                            placeholder="Enter Calendar Name"
                            type="text"
                            onChange={handleChange}
                            id="calendarName"
                            name="calendarName"
                            value={value.calendarName || ''}
                            required
                            size="small"
                            error={!!simpleValidator.current.message(
                              "Calendar Name",
                              value?.calendarName,
                              `required`
                            )}
                            helperText={simpleValidator.current.message(
                              "Calendar Name",
                              value?.calendarName,
                              `required`
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Generated Token"
                            placeholder="Enter Generated Token"
                            type="text"
                            onChange={handleChange}
                            id="generatedToken"
                            name="generatedToken"
                            value={value.generatedToken || ''}
                            size="small"
                            InputProps={{
                              endAdornment: value.generatedToken && (
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard
                                      .writeText(value?.generatedToken)
                                      .then(() => {
                                        SuccessMessage(
                                          "Token copied to clipboard!"
                                        );
                                      })
                                      .catch((err) => {
                                        console.error("Failed to copy: ", err);
                                      });
                                  }}
                                  sx={{ color: 'grey.500' }}
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              )
                            }}
                          />
                        </Grid>
                        {!ghl && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', mt: 1 }}>
                              <Button
                                variant="contained"
                                onClick={handleChnages}
                                sx={{ textTransform: 'none' }}
                              >
                                Generate Webhook Token
                              </Button>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Last Sync: {" "}
                              <Typography component="span" sx={{ fontWeight: 600 }}>
                                {value?.lastSync
                                  ? `${moment(value?.lastSync).format(
                                      "MM-DD-YYYY"
                                    )} | ${moment(value?.lastSync).format(
                                      "hh:mm A"
                                    )}`
                                  : "N/A"}
                              </Typography>
                            </Typography>
                            {value.isConnected && timeLeft && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Expiration Date/time: {" "}
                                <Typography component="span" sx={{ fontWeight: 600 }}>
                                  {timeLeft}
                                </Typography>
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        {HasPermission("GHLEdit") && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                              <Button
                                type="submit"
                                variant="contained"
                                disabled={loder}
                                sx={{ textTransform: 'none' }}
                              >
                                Submit
                              </Button>
                              {!ghl && (
                                <>
                                  {value.access_Token && value.refresh_Token && (
                                    <Button
                                      variant="contained"
                                      onClick={handleChnage}
                                      startIcon={<SyncIcon />}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Sync GHL
                                    </Button>
                                  )}
                                  {value.access_Token && value.refresh_Token && (
                                    <Button
                                      variant="contained"
                                      onClick={handleghluser}
                                      startIcon={<SyncIcon />}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Sync GHL Users
                                    </Button>
                                  )}
                                  {!value?.isConnected && (
                                    <Button
                                      variant="contained"
                                      onClick={handleChnagess}
                                      startIcon={<LinkIcon />}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Link to Ghl
                                    </Button>
                                  )}
                                  {value.access_Token && value.refresh_Token && (
                                    <Button
                                      variant="contained"
                                      onClick={() => setopen(true)}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      GHL Stages Mapping
                                    </Button>
                                  )}
                                  {value.access_Token && value.refresh_Token && (
                                    <Button
                                      variant="contained"
                                      onClick={handlesyccustom}
                                      startIcon={<SyncIcon />}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Sync Custom Field
                                    </Button>
                                  )}
                                  {value?.isConnected && (
                                    <Button
                                      variant="contained"
                                      color="error"
                                      onClick={handleDelte}
                                      startIcon={<DeleteIcon />}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Unlink GHL
                                    </Button>
                                  )}
                                </>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
              )}
              {/* Tab content rendered based on current tab value */}

              {HasPermission("StripeView") && tabValue === (HasPermission("GHLView") && !loginuser.isGHLConfigSameAsTenant ? 1 : 0) && (
                <Box>
                  <Stripe />
                </Box>
              )}

              {HasPermission("EmailConfigurationView") && tabValue === (Tablist.length - 1) && (
                <Box>
                  <Email />
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Stages open={open} handleclose={() => setopen(false)} action={open} />
    </div>
  );
}
