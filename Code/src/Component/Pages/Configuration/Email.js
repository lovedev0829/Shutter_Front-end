import React, { useEffect, useRef } from "react";
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

import SimpleReactValidator from "simple-react-validator";
import GetEmailTypeConfiguration from "../../../helpers/GetEmailTypeConfiguration";
import moment from "moment";
// Material UI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";

export default function Email() {
  const [loder, setLoader] = useState(false);
  const [ghl, setGhl] = useState(false);
   const [isdata, setisdata] = useState(false);
  const [value, setValue] = useState({
    smtpServer: "",
    port: "",
    username: "",
    password: "",
    useSsl: true,
    replyTo: "",
    emailType: null,
    from: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetEmailConfiguration,
        {},
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        if (
          apiResponse?.data?.data?.emailType !==
          "d4efb2c6-a9cb-4433-9698-29ad10cc87a1"
        ) {
          simpleValidator.current.purgeFields(["smtpServer", "port", "useSsl"]);
        }

        if (!apiResponse?.data?.data?.emailType) {
          setGhl(true);
        } else {
          setGhl(false);
           setisdata(true)
        }
      } else {
        setGhl(true);
        setValue({});
      }
    } catch (error) {
      setGhl(true);
      setLoader(false);
     
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    if (name === "emailType") {
      if (value !== "d4efb2c6-a9cb-4433-9698-29ad10cc87a1") {
        simpleValidator.current.purgeFields(["smtpServer", "port", "useSsl"]);
      }
       setisdata(false)
        setGhl(true);
    }
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
        const sanitizedValue = {
          ...value,
          useSsl: value.useSsl === "false" ? false : true,
          port: value.port ? value.port : 0,
        };
        const response = await callAPI(
          apiUrls.AddOrUpdateEmailConfiguration,
          {},
          "POST",
          sanitizedValue
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

  const handleDelte = async (type) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to Connect to  ${type}?`
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.EmailOAuth,
          { OauthType: type },
          "GET",
          {}
        );
        setLoader(false);

        if (response?.data?.isSuccess) {
          window.open(
            response?.data?.data,
            "_blank",
            "noopener,noreferrer"
          );
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
  const emailType = value?.emailType;
  const emailTypeName = value?.emailTypeName;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (
      !expirationTime ||
      emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1"
    ) {
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
  }, [expirationTime, emailType]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
          Manage Email Configuration
        </Typography>
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <GetEmailTypeConfiguration
                  value={value.emailType}
                  fn={handleChange}
                  error={!!simpleValidator.current.message(
                    "Method Type",
                    value?.emailType,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "Method Type",
                    value?.emailType,
                    `required`
                  )}
                />
              </Grid>
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="SMTP Server"
                    placeholder="Enter SMTP Server"
                    type="text"
                    onChange={handleChange}
                    id="smtpServer"
                    name="smtpServer"
                    value={value.smtpServer || ''}
                    required
                    size="small"
                    error={!!simpleValidator.current.message(
                      "SMTP Server",
                      value?.smtpServer,
                      `required`
                    )}
                    helperText={simpleValidator.current.message(
                      "SMTP Server",
                      value?.smtpServer,
                      `required`
                    )}
                  />
                </Grid>
              )}
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Port"
                    placeholder="Enter Port"
                    type="text"
                    onChange={handleChange}
                    id="port"
                    name="port"
                    value={value.port || ''}
                    required
                    size="small"
                    error={!!simpleValidator.current.message(
                      "Port",
                      value?.port,
                      `required|integer`
                    )}
                    helperText={simpleValidator.current.message(
                      "Port",
                      value?.port,
                      `required|integer`
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="User Name"
                  placeholder="Enter User Name"
                  type="text"
                  onChange={handleChange}
                  id="username"
                  name="username"
                  value={value.username || ''}
                  size="small"
                />
              </Grid>
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    onChange={handleChange}
                    id="password"
                    name="password"
                    value={value.password || ''}
                    size="small"
                  />
                </Grid>
              )}
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small" required error={!!simpleValidator.current.message("SSL/TLS", value?.useSsl, `required`)}>
                    <InputLabel>SSL/TLS</InputLabel>
                    <Select
                      value={value.useSsl || ''}
                      label="SSL/TLS"
                      onChange={handleChange}
                      name="useSsl"
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                    {simpleValidator.current.message("SSL/TLS", value?.useSsl, `required`) && (
                      <FormHelperText>{simpleValidator.current.message("SSL/TLS", value?.useSsl, `required`)}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="From"
                  placeholder="Enter From"
                  type="text"
                  onChange={handleChange}
                  id="from"
                  name="from"
                  value={value.from || ''}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Reply To"
                  placeholder="Enter Reply To"
                  type="text"
                  onChange={handleChange}
                  id="replyTo"
                  name="replyTo"
                  value={value.replyTo || ''}
                  size="small"
                />
              </Grid>
              {value.isConnected && isdata && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {timeLeft && "Expiration Date/time: "}
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      {timeLeft && `${timeLeft}`} (Connected with {emailTypeName})
                    </Typography>
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                  {HasPermission("EmailConfigurationEdit") && (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loder}
                      sx={{ textTransform: 'none' }}
                    >
                      Submit
                    </Button>
                  )}

                  {!ghl &&
                    value?.emailType !==
                      "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleDelte(
                            value?.emailType ===
                              "16b6b079-5e5b-44d8-8cb4-1b7aa6143d87"
                              ? "Google"
                              : "Microsoft365"
                          )
                        }
                        sx={{ textTransform: 'none' }}
                      >
                        Connect to{" "}
                        {value?.emailType ===
                        "16b6b079-5e5b-44d8-8cb4-1b7aa6143d87"
                          ? "Google"
                          : "Microsoft365"}
                      </Button>
                    )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
