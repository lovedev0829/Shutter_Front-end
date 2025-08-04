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
  CircularProgress
} from "@mui/material";
import {
  Delete as DeleteIcon
} from "@mui/icons-material";


export default function Stripe() {
  const [loder, setLoader] = useState(false);
   const [ghl, setGhl] = useState(false);
  const [value, setValue] = useState({
    secretKey: "",
    publishableKey: "",
    cancelUrl: "",
    successUrl: "",
    webhookSecret: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetStripeConfiguration,
        {},
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if(!apiResponse?.data?.data?.secretKey){
          setGhl(true)
        }
        else{
          setGhl(false)
        }
        setValue(apiResponse?.data?.data);
      } else {
        setGhl(true)
        setValue({});
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setGhl(true)
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

    const handleDelte = async () => {
      const isConfirmed = window.confirm("Are you sure you want to delete Stripe?");
      if (isConfirmed) {
        setLoader(true);
        try {
          const response = await callAPI(
            apiUrls.DeleteConfiguration,
            {deleteType:0,configurationId:value?.id},
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
          apiUrls.AddStripeConfiguration,
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
          Manage Stripe Configuration
        </Typography>
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Secret Key"
                  placeholder="Enter Secret Key"
                  type="text"
                  onChange={handleChange}
                  id="secretKey"
                  name="secretKey"
                  value={value.secretKey || ''}
                  required
                  size="small"
                  error={!!simpleValidator.current.message(
                    "secretKey",
                    value?.secretKey,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "secretKey",
                    value?.secretKey,
                    `required`
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Publishable Key"
                  placeholder="Enter Publishable Key"
                  type="text"
                  onChange={handleChange}
                  id="publishableKey"
                  name="publishableKey"
                  value={value.publishableKey || ''}
                  required
                  size="small"
                  error={!!simpleValidator.current.message(
                    "publishableKey",
                    value?.publishableKey,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "publishableKey",
                    value?.publishableKey,
                    `required`
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Webhook Secret"
                  placeholder="Enter Webhook Secret"
                  type="text"
                  onChange={handleChange}
                  id="webhookSecret"
                  name="webhookSecret"
                  value={value.webhookSecret || ''}
                  required
                  size="small"
                  error={!!simpleValidator.current.message(
                    "webhookSecret",
                    value?.webhookSecret,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "webhookSecret",
                    value?.webhookSecret,
                    `required`
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                  {HasPermission("StripeEdit") && (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loder}
                      sx={{ textTransform: 'none' }}
                    >
                      Submit
                    </Button>
                  )}
                  {!ghl && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelte}
                      startIcon={<DeleteIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Unlink Stripe
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
