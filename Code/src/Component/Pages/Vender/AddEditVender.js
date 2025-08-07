import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, FormatPhoneNumber, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { 
  Button, 
  Stack, 
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Allstate from "../../../helpers/Allstate";

const AddEditVender = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      stateId: null,
      zipCode: "",
      companyName: "",
    }),
    []
  );

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
  
      if (e.target.name === "phoneNumber") {
        let cleanedValue = newValue.replace(/\D/g, "").replace(/^1/, "");
        if (cleanedValue.length > 10) {
          cleanedValue = cleanedValue.slice(0, 10);
        }
        newValue = cleanedValue;
      }
  
      return {
        ...val,
        [e.target.name]: newValue,
      };
    });
  };
  

  const VendorAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const sanitizedValue = {
          ...value,
          stateId: !value.stateId ? null : value.stateId,
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.VendorCreate : apiUrls.VendorUpdate,
          {},
          "POST",
          sanitizedValue
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue(defaultState);
          simpleValidator.current.hideMessages();
          forceUpdate();
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    if (action === "edit") {
      setValue(object);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);



  return (
    <>
      <Dialog
        open={open}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : '12px',
            margin: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)',
            width: isMobile ? '100vw' : 'auto',
          },
        }}
        aria-labelledby="vendor-dialog-title"
      >
        <DialogTitle 
          id="vendor-dialog-title"
          sx={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: '#1e293b',
            }}
          >
            {action === "add" ? "Add Vendor" : "Update Vendor"}
          </Typography>
          <IconButton
            onClick={() => {
              setValue(defaultState);
              handleclose();
              simpleValidator.current.hideMessages();
              forceUpdate();
            }}
            sx={{ 
              color: '#64748b',
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={VendorAddUpdate}>
          <DialogContent 
            sx={{ 
              p: { xs: 2, sm: 3 },
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
            }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Company Name"
                  placeholder="Enter Company Name"
                  name="companyName"
                  value={value.companyName}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={!!simpleValidator.current.message("Company Name", value?.companyName, "required")}
                  helperText={simpleValidator.current.message("Company Name", value?.companyName, "required")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={value.firstName}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={!!simpleValidator.current.message("First Name", value?.firstName, "required")}
                  helperText={simpleValidator.current.message("First Name", value?.firstName, "required")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Enter Last Name"
                  name="lastName"
                  value={value.lastName}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={!!simpleValidator.current.message("Last Name", value?.lastName, "required")}
                  helperText={simpleValidator.current.message("Last Name", value?.lastName, "required")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter Email"
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={!!simpleValidator.current.message("Email", value?.email, "required|email|max:50")}
                  helperText={simpleValidator.current.message("Email", value?.email, "required|email|max:50")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  name="phoneNumber"
                  value={FormatPhoneNumber(value.phoneNumber||"")}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={!!simpleValidator.current.message("Phone Number", value?.phoneNumber, "required|integer|min:10|max:10")}
                  helperText={simpleValidator.current.message("Phone Number", value?.phoneNumber, "required|integer|min:10|max:10")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Street Address"
                  placeholder="Enter Street Address"
                  name="streetAddress"
                  value={value.streetAddress}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                  <Allstate
                    name="stateId"
                    value={value.stateId || ""}
                    fn={handleChange}
                    load={action}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  placeholder="Enter City"
                  name="city"
                  value={value.city}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="ZipCode"
                  placeholder="Enter ZipCode"
                  name="zipCode"
                  value={value.zipCode}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  error={!!simpleValidator.current.message("zipCode", value?.zipCode, "integer|min:5|max:6")}
                  helperText={simpleValidator.current.message("zipCode", value?.zipCode, "integer|min:5|max:6")}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />
          
          <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setValue(defaultState);
                handleclose();
                simpleValidator.current.hideMessages();
                forceUpdate();
              }}
              sx={{
                textTransform: 'none',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Cancel
            </Button>
            <SubmitButton
              type="submit"
              buttonName={action === "add" ? "Submit" : "Update"}
              disabled={loader}
              loading={loader}
            />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddEditVender;
