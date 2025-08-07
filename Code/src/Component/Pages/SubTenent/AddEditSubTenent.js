import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { 
  Close,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  DeleteOutline,
} from "@mui/icons-material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ColorList,
  ErrorMessage,
  FormatPhoneNumber,
  getHomeUrl,
  SuccessMessage,
} from "../../../helpers/common";
import { PostImage } from "../../../utils/apiCall";

const AddEditSubTenent = ({
  open,
  handleclose,
  SubTenantlistAPI,
  action,
  object,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const defaultState = {
    companyName: "",
    firstName: "",
    primaryColor: "#1d7e8b",
    logo: "",
    lastName: "",
    code: "",
    email: "",
    phoneNumber: "",
    password: "",
    url: getHomeUrl(),
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhoneNumber: "",
    streetAddress: "",
    city: "",
    country: "",
    zipCode: "",
    invoicePrefix: "",
    suffix: "",
  };
  const [value, setValue] = useState(object ? object : defaultState);

  const [loader, setLoader] = useState(false);
  const [eye, setEye] = useState(false);
  const [image, setImage] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  let debounceTimer;
  const handleChange = (e) => {
    if (e.target.name === "companyName" && action !== "edit") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        CodeGenarte(e.target.value);
      }, 500); // 500ms delay
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleChangenumber = (e) => {
    const { name, value } = e.target;
  
    let cleanedValue = value.replace(/\D/g, "").replace(/^1/, "");
  
    // ⛔ Prevent extra digits being stored
    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.slice(0, 10);
    }
  
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: cleanedValue,
        },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    }
  };

  const SubTenantAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        let formBody = new FormData();
        for (var i in value) {
          formBody.append(i, value[i]);
        }
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.SubTenantCreate : apiUrls.SubTenantUpdate,
          {},
          "POST",
          formBody
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await SubTenantlistAPI();
          handleclose();
          setValue(defaultState);
          setImage("");
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
      simpleValidator.current.purgeFields("password");
      setValue(object);
    } else setValue(defaultState);
    // eslint-disable-next-line
  }, [open, action]);

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
  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };

  const CodeGenarte = async (code) => {
    try {
      if (code) {
        const apiResponse = await callAPI(
          apiUrls.GenerateCode,
          { code: code },
          "POST",
          {}
        );
        if (apiResponse?.data?.isSuccess) {
          setValue((val) => {
            return {
              ...val,
              code: apiResponse?.data?.data?.Code,
              invoicePrefix: apiResponse?.data?.data?.InvoicePrefix,
            };
          });
        } else {
        }
      }
    } catch (error) {}
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth={isMobile ? false : "md"}
        fullWidth={!isMobile}
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? "0" : "12px",
            boxShadow: isMobile 
              ? "none" 
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            margin: isMobile ? 0 : "32px",
            maxHeight: isMobile ? "100vh" : "90vh",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? "100%" : "800px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
            pb: isMobile ? 1.5 : 2,
            px: isMobile ? 2 : 3,
            py: isMobile ? 1.5 : 2,
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 600, 
              color: "#1e293b",
              fontSize: isMobile ? '1.125rem' : '1.5rem',
            }}
          >
            {action === "add" ? "Add Partner" : "Update Partner"}
          </Typography>
          <IconButton
            onClick={() => {
              setValue(defaultState);
              handleclose();
              simpleValidator.current.hideMessages();
              forceUpdate();
              setImage("");
            }}
            size={isMobile ? "medium" : "large"}
            sx={{
              color: "#64748b",
              padding: isMobile ? "6px" : "8px",
              "&:hover": { backgroundColor: "#f1f5f9", color: "#ef4444" },
            }}
          >
            <Close fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        </DialogTitle>
        <form onSubmit={SubTenantAddUpdate}>
          <DialogContent 
            sx={{ 
              px: isMobile ? 2 : 3, 
              py: isMobile ? 2 : 3,
              maxHeight: isMobile ? 'calc(100vh - 140px)' : 'none',
              overflowY: 'auto',
            }}
          >
            {/* Logo Upload Section */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "center", 
                gap: isMobile ? 2 : 3, 
                mb: isMobile ? 3 : 4,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <input
                  id="fileInput"
                  type="file"
                  name="logo"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={(e) => {
                    UploadImage(e, [
                      "image/png",
                      "image/jpg",
                      "image/jpeg",
                    ]);
                  }}
                  style={{ display: "none" }}
                />
                <label htmlFor="fileInput">
                  <Avatar
                    src={
                      image
                        ? image
                        : value.logo
                        ? value.logo
                        : undefined
                    }
                    sx={{
                      width: isMobile ? 64 : 80,
                      height: isMobile ? 64 : 80,
                      cursor: "pointer",
                      border: "2px dashed #cbd5e1",
                      backgroundColor: "#f8fafc",
                      "&:hover": {
                        border: "2px dashed #3b82f6",
                        backgroundColor: "#eff6ff",
                      },
                    }}
                  >
                    <PhotoCamera sx={{ color: "#64748b", fontSize: isMobile ? 24 : 32 }} />
                  </Avatar>
                </label>
                {(image || value.logo) && (
                  <IconButton
                    onClick={() => {
                      setValue((val) => ({ ...val, logo: "" }));
                      setImage("");
                    }}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "#ef4444",
                      color: "white",
                      width: isMobile ? 20 : 24,
                      height: isMobile ? 20 : 24,
                      "&:hover": { backgroundColor: "#dc2626" },
                    }}
                  >
                    <DeleteOutline sx={{ fontSize: isMobile ? 12 : 16 }} />
                  </IconButton>
                )}
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: isMobile ? '1rem' : '1.25rem',
                  }}
                >
                  Upload Logo
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#64748b",
                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                    lineHeight: isMobile ? 1.4 : 1.3,
                  }}
                >
                  Please upload right to use image and format like: png, jpg, jpeg
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Company Name"
                  placeholder="Enter Company Name"
                  name="companyName"
                  value={value.companyName}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "companyName",
                    value?.companyName,
                    `required|string`
                  )}
                  helperText={simpleValidator.current.message(
                    "companyName",
                    value?.companyName,
                    `required|string`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Code"
                  placeholder="Enter code"
                  name="code"
                  value={value.code}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "Code",
                    value?.code,
                    `required|alpha_num`
                  )}
                  helperText={simpleValidator.current.message(
                    "Code",
                    value?.code,
                    `required|alpha_num`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Invoice Prefix"
                  placeholder="Enter Invoice Prefix"
                  name="invoicePrefix"
                  value={value.invoicePrefix}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "Invoice Prefix",
                    value?.invoicePrefix,
                    `required|min:3`
                  )}
                  helperText={simpleValidator.current.message(
                    "Invoice Prefix",
                    value?.invoicePrefix,
                    `required|min:3`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="Enter First name"
                  name="firstName"
                  value={value.firstName}
                  onChange={handleChange}
                  required
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Enter Last name"
                  name="lastName"
                  value={value.lastName}
                  onChange={handleChange}
                  required
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Suffix"
                  placeholder="Enter Suffix"
                  name="suffix"
                  value={value.suffix}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter email"
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "email",
                    value?.email,
                    `required|email|max:50`
                  )}
                  helperText={simpleValidator.current.message(
                    "email",
                    value?.email,
                    `required|email|max:50`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  name="phoneNumber"
                  value={FormatPhoneNumber(value.phoneNumber || "")}
                  onChange={handleChangenumber}
                  required
                  error={!!simpleValidator.current.message(
                    "phoneNumber",
                    value?.phoneNumber,
                    `required|integer|min:10|max:10`
                  )}
                  helperText={simpleValidator.current.message(
                    "phoneNumber",
                    value?.phoneNumber,
                    `required|integer|min:10|max:10`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl 
                  fullWidth 
                  required
                  error={!!simpleValidator.current.message(
                    "Site Color",
                    value?.primaryColor,
                    `required`
                  )}
                >
                  <InputLabel>Site Color</InputLabel>
                  <Select
                    name="primaryColor"
                    value={value.primaryColor}
                    onChange={handleChange}
                    label="Site Color"
                    sx={{
                      borderRadius: "8px",
                    }}
                  >
                    {ColorList.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: color.value,
                              borderRadius: "50%",
                              border: "1px solid #e2e8f0",
                            }}
                          />
                          {color.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {simpleValidator.current.message(
                      "Site Color",
                      value?.primaryColor,
                      `required`
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Street Address"
                  placeholder="Enter Street Address"
                  name="streetAddress"
                  value={value.streetAddress}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "streetAddress",
                    value?.streetAddress,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "streetAddress",
                    value?.streetAddress,
                    `required`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  placeholder="Enter City"
                  name="city"
                  value={value.city}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "city",
                    value?.city,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "city",
                    value?.city,
                    `required`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Country"
                  placeholder="Enter country"
                  name="country"
                  value={value.country}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "country",
                    value?.country,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "country",
                    value?.country,
                    `required`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  placeholder="Enter zipCode"
                  name="zipCode"
                  value={value.zipCode}
                  onChange={handleChange}
                  required
                  error={!!simpleValidator.current.message(
                    "zipCode",
                    value?.zipCode,
                    `required`
                  )}
                  helperText={simpleValidator.current.message(
                    "zipCode",
                    value?.zipCode,
                    `required`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              
              {/* User Details Section */}
              <Grid item xs={12}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#1e293b",
                    borderBottom: "1px solid #e2e8f0",
                    pb: isMobile ? 0.5 : 1,
                    mb: isMobile ? 1.5 : 2,
                    mt: isMobile ? 1.5 : 2,
                    fontSize: isMobile ? '1.125rem' : '1.25rem',
                  }}
                >
                  User Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="medium"
                  label="User First Name"
                  placeholder="Enter user first name"
                  name="userFirstName"
                  value={value.userFirstName}
                  onChange={handleChange}
                  required
                  disabled={action === "edit"}
                  error={!!simpleValidator.current.message(
                    "User First Name",
                    value?.userFirstName,
                    `required|min:3|alpha|max:50`
                  )}
                  helperText={simpleValidator.current.message(
                    "User First Name",
                    value?.userFirstName,
                    `required|min:3|alpha|max:50`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="User Last Name"
                  placeholder="Enter user last name"
                  name="userLastName"
                  value={value.userLastName}
                  onChange={handleChange}
                  required
                  disabled={action === "edit"}
                  error={!!simpleValidator.current.message(
                    "User last name",
                    value?.userLastName,
                    `required|min:3|alpha|max:50`
                  )}
                  helperText={simpleValidator.current.message(
                    "User last name",
                    value?.userLastName,
                    `required|min:3|alpha|max:50`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="User Email"
                  placeholder="Enter user email"
                  type="email"
                  name="userEmail"
                  value={value.userEmail}
                  onChange={handleChange}
                  required
                  disabled={action === "edit"}
                  error={!!simpleValidator.current.message(
                    "User email",
                    value?.userEmail,
                    `required|email|max:50`
                  )}
                  helperText={simpleValidator.current.message(
                    "User email",
                    value?.userEmail,
                    `required|email|max:50`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="User Phone Number"
                  placeholder="Enter User phone number"
                  name="userPhoneNumber"
                  value={FormatPhoneNumber(value.userPhoneNumber || "")}
                  onChange={handleChangenumber}
                  required
                  disabled={action === "edit"}
                  error={!!simpleValidator.current.message(
                    "User phone number",
                    value?.userPhoneNumber,
                    `required|integer|min:10|max:10`
                  )}
                  helperText={simpleValidator.current.message(
                    "User phone number",
                    value?.userPhoneNumber,
                    `required|integer|min:10|max:10`
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Enter Password"
                  type={eye ? "text" : "password"}
                  name="password"
                  value={value.password}
                  onChange={handleChange}
                  required={action !== "edit"}
                  error={action !== "edit" && !!simpleValidator.current.message(
                    "password",
                    value?.password,
                    "required|min:8"
                  )}
                  helperText={action !== "edit" && simpleValidator.current.message(
                    "password",
                    value?.password,
                    "required|min:8"
                  )}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={showPassword}
                          edge="end"
                          sx={{ color: "#64748b" }}
                        >
                          {eye ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions 
            sx={{ 
              px: isMobile ? 2 : 3, 
              py: isMobile ? 2 : 2, 
              borderTop: "1px solid #e2e8f0",
              flexDirection: isMobile ? "column-reverse" : "row",
              gap: isMobile ? 1 : 0,
              '& > *': {
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'unset' : '80px',
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setValue(defaultState);
                handleclose();
                simpleValidator.current.hideMessages();
                forceUpdate();
                setImage("");
              }}
              size={isMobile ? "large" : "medium"}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#d1d5db",
                color: "#6b7280",
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
                padding: isMobile ? "12px 24px" : "10px 20px",
                minHeight: isMobile ? "48px" : "40px",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loader}
              size={isMobile ? "large" : "medium"}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: isMobile ? 3 : 3,
                py: isMobile ? 1.5 : 1,
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
                minHeight: isMobile ? "48px" : "40px",
                backgroundColor: "#3b82f6",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                "&:hover": {
                  backgroundColor: "#2563eb",
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.25)",
                  transform: isMobile ? "none" : "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#9ca3af",
                  boxShadow: "none",
                  transform: "none",
                },
              }}
            >
              {action === "add" ? "Submit" : "Update"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddEditSubTenent;
