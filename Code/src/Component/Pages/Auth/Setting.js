import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { useNavigate } from "react-router-dom";
import {
  ApiLoder,
  ColorList,
  CustomMessages,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import Header from "../../../Layout/header";
import { useDispatch } from "react-redux";
import { Profile } from "../../../Redux/Redux/Action/Action";
import { PostImage } from "../../../utils/apiCall";
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const Setting = () => {
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState({
    logo: "",
    primaryColor: "#1d7e8b",
    phoneNumber: "",
    email: "",
    companyName: "",
    streetAddress: "",
    city: "",
    country: "",
    zipCode: "",
    markup: null,
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const [image, setImage] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setValue((val) => {
      return { ...val, [name]: value };
    });
  };

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
          apiUrls.UpdateSettingById,
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
      const apiResponse = await callAPI(apiUrls.SettingById, {}, "POST", {});
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        handleProfileUpdate({
          primaryColor: apiResponse?.data?.data.primaryColor,
          logo: apiResponse?.data?.data.logo,
          companyName: apiResponse?.data?.data.companyName,
          streetAddress: apiResponse?.data?.data.streetAddress,
          city: apiResponse?.data?.data.city,
          country: apiResponse?.data?.data.country,
          zipCode: apiResponse?.data?.data.zipCode,
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

  const UploadImage = async (e, allowedFileTypes) => {
    let file = [...e.target.files];
    let name = e?.target?.name;
    if (
      allowedFileTypes.includes(file[0]?.type) ||
      allowedFileTypes.includes(file[0]?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      if (path) {
        setValue((val) => {
          return { ...val, [name]: path[0] };
        });
        setImage(URL.createObjectURL(file[0]));
      } else {
        setValue((val) => {
          return { ...val, [name]: "" };
        });
      }
      e.target.value = null;
    } else {
      ErrorMessage("Invalid file Format");
      setValue((val) => {
        return { ...val, [name]: "" };
      });
      e.target.value = null;
      return false;
    }
  };

  return (
    <div className="intersight_content">
      <ApiLoder open={loader} />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header title="Setting" />
        
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <Card 
            elevation={0}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 4,
                  textAlign: 'center'
                }}
              >
                Company Settings
              </Typography>

              <form onSubmit={handleSubmit}>
                {/* Logo Upload Section */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar
                      src={image || value.logo || "/image/camera (1) 1.png"}
                      sx={{ 
                        width: 200, 
                        height: 200, 
                        mx: 'auto',
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                      }}
                    />
                    
                    <input
                      id="fileInput"
                      type="file"
                      name="logo"
                      accept="image/png,image/jpg,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        UploadImage(e, [
                          "image/png",
                          "image/jpg",
                          "image/jpeg",
                        ]);
                      }}
                    />
                    
                    <IconButton
                      component="label"
                      htmlFor="fileInput"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                        width: 36,
                        height: 36
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>

                    {(image || value.logo) && (
                      <IconButton
                        onClick={() => {
                          setValue((val) => ({ ...val, logo: "" }));
                          setImage("");
                        }}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: theme.palette.error.main,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: theme.palette.error.dark,
                          },
                          width: 32,
                          height: 32
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Upload Logo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please upload right to use image and format like: png, jpg, jpeg
                  </Typography>
                </Box>

                {/* Form Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      placeholder="Enter Company Name"
                      name="companyName"
                      value={value.companyName}
                      onChange={handleChange}
                      error={!!simpleValidator.current.message("companyName", value?.companyName, "required|string")}
                      helperText={simpleValidator.current.message("companyName", value?.companyName, "required|string")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>

                  {value.isSubtenant && (
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Markup"
                        placeholder="Enter Markup"
                        name="markup"
                        value={value.markup || ''}
                        onChange={handleChange}
                        error={!!simpleValidator.current.message("markup", value?.markup, "numeric")}
                        helperText={simpleValidator.current.message("markup", value?.markup, "numeric")}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Street Address *"
                      placeholder="Enter Street Address"
                      name="streetAddress"
                      value={value.streetAddress}
                      onChange={handleChange}
                      error={!!simpleValidator.current.message("streetAddress", value?.streetAddress, "required")}
                      helperText={simpleValidator.current.message("streetAddress", value?.streetAddress, "required")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City *"
                      placeholder="Enter City"
                      name="city"
                      value={value.city}
                      onChange={handleChange}
                      error={!!simpleValidator.current.message("city", value?.city, "required")}
                      helperText={simpleValidator.current.message("city", value?.city, "required")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Country *"
                      placeholder="Enter Country"
                      name="country"
                      value={value.country}
                      onChange={handleChange}
                      error={!!simpleValidator.current.message("country", value?.country, "required")}
                      helperText={simpleValidator.current.message("country", value?.country, "required")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Zip Code *"
                      placeholder="Enter Zip Code"
                      name="zipCode"
                      value={value.zipCode}
                      onChange={handleChange}
                      error={!!simpleValidator.current.message("zipCode", value?.zipCode, "required")}
                      helperText={simpleValidator.current.message("zipCode", value?.zipCode, "required")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth 
                      error={!!simpleValidator.current.message("Site Color", value?.primaryColor, "required")}
                    >
                      <InputLabel>Site Color *</InputLabel>
                      <Select
                        name="primaryColor"
                        value={value.primaryColor}
                        onChange={handleChange}
                        label="Site Color *"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: selected,
                                borderRadius: '50%',
                                border: '1px solid #ccc'
                              }}
                            />
                            {ColorList.find(color => color.value === selected)?.label || selected}
                          </Box>
                        )}
                      >
                        {ColorList.map((color) => (
                          <MenuItem key={color.value} value={color.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  backgroundColor: color.value,
                                  borderRadius: '50%',
                                  border: '1px solid #ccc'
                                }}
                              />
                              {color.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {simpleValidator.current.message("Site Color", value?.primaryColor, "required") && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                          {simpleValidator.current.message("Site Color", value?.primaryColor, "required")}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loader}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[500],
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: theme.palette.grey[300],
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

export default Setting;
