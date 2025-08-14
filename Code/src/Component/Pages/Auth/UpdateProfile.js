import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { useNavigate } from "react-router-dom";
import {
  CustomMessages,
  ErrorMessage,
  FormatPhoneNumber,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import Header from "../../../Layout/header";
import { useDispatch } from "react-redux";
import { Profile } from "../../../Redux/Redux/Action/Action";
// Material UI imports
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
  Avatar,
  Divider
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from "@mui/icons-material";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    suffix: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
  
      if (e.target.name === "phone") {
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
  

  const dispatch = useDispatch();

  const handleProfileUpdate = (updatedFields) => {
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    dispatch(Profile(updatedUser));
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
          apiUrls.ProfileUpdate,
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

  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.ProfileDetails, {}, "POST", {});
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        handleProfileUpdate({
          firstName: apiResponse?.data?.data.firstName,
          lastName: apiResponse?.data?.data.lastName,
          suffix:apiResponse?.data?.data.suffix,
          phone: apiResponse?.data?.data.phone,
        });
      } else {
        ErrorMessage(apiResponse.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box className="intersight_content" sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header title="Update Profile" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                  <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Update Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal information and contact details
                  </Typography>
                </Box>
              </Box>

              <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Personal Information Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        Personal Information
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="First Name"
                        placeholder="Enter First name"
                        type="text"
                        onChange={handleChange}
                        id="firstName"
                        name="firstName"
                        value={value.firstName || ''}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "firstName",
                          value?.firstName,
                          `required|min:3|alpha|max:50`
                        )}
                        helperText={simpleValidator.current.message(
                          "firstName",
                          value?.firstName,
                          `required|min:3|alpha|max:50`
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        placeholder="Enter Last name"
                        type="text"
                        onChange={handleChange}
                        id="lastName"
                        name="lastName"
                        value={value.lastName || ''}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "lastName",
                          value?.lastName,
                          `required|min:3|alpha|max:50`
                        )}
                        helperText={simpleValidator.current.message(
                          "lastName",
                          value?.lastName,
                          `required|min:3|alpha|max:50`
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Suffix"
                        placeholder="Enter suffix"
                        type="text"
                        onChange={handleChange}
                        id="suffix"
                        name="suffix"
                        value={value.suffix || ''}
                        size="small"
                      />
                    </Grid>

                    {/* Contact Information Section */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <EmailIcon sx={{ mr: 1 }} />
                        Contact Information
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        placeholder="Enter email"
                        type="email"
                        onChange={handleChange}
                        id="email"
                        name="email"
                        value={value.email || ''}
                        disabled
                        size="small"
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: 'text.secondary',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        placeholder="Enter Phone Number"
                        type="text"
                        onChange={handleChange}
                        id="phone"
                        name="phone"
                        value={FormatPhoneNumber(value.phone || "")}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "phone",
                          value?.phone,
                          `required|integer|min:10|max:10`
                        )}
                        helperText={simpleValidator.current.message(
                          "phone",
                          value?.phone,
                          `required|integer|min:10|max:10`
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          variant="text"
                          onClick={() => navigate("/dashboard")}
                          startIcon={<ArrowBackIcon />}
                          sx={{ 
                            textTransform: 'none',
                            color: 'text.secondary',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loader}
                          startIcon={loader ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                          sx={{ 
                            textTransform: 'none',
                            minWidth: 120,
                            '&:disabled': {
                              opacity: 0.7
                            }
                          }}
                        >
                          {loader ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default UpdateProfile;
