import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, FormatPhoneNumber, HasPermission, SuccessMessage } from "../../../helpers/common";
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
  InputAdornment,
  Divider,
  Paper,
} from "@mui/material";
import { 
  Close,
  Visibility,
  VisibilityOff,
  Add,
} from "@mui/icons-material";
import { Eyeclose, Eyeopen } from "../../../SvgFile/Index";
import RoleDropdown from "../../../helpers/RoleDropdown";
import JobtitleDropdown from "../../../helpers/JobtitleDropdown";
import AddEditRole from "../Role/AddEditRole";
import GetAllGHLUsers from "../../../helpers/GetAllGHL_Users";
import AddEditJobTitle from "../Jobtitle/AddEditJobTitle";

const AddEditUser = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    jobTitle: "",
    roleId: "",
    ghlUserId:"",
    suffix:""
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
   const [user, setuser] = useState(false);
  const [userlist, setuserlist] = useState(false);
  const [loader, setLoader] = useState(false);
  const [eye, setEye] = useState(false);
   const [permission, setPermission] = useState([]);
  const simpleValidator = useRef(new SimpleReactValidator());
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
  

  const UserAddEdit = async (e) => {
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
          action === "add" ? apiUrls.UserCreate : apiUrls.UserUpdate,
          {},
          "POST",
          formBody
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

 const PermissionlistAPI = async () => {
        try {
        const apiResponse = await callAPI(apiUrls.permissionlist,{},"GET");
        if (apiResponse?.data?.isSuccess) {
             setPermission(apiResponse?.data?.data)
        } else {
          setPermission([])
        }
      } catch (error) {
        
       }
    }
  


  useEffect(() => {
    PermissionlistAPI();
    if (action === "edit") {
      simpleValidator.current.purgeFields("password")
      setValue(object);
    } else {setValue(defaultState);} 
    setvendorlist(false)
    setuserlist(false)
    // eslint-disable-next-line
  }, [open, action]);

  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };
  const handleapi = () => {
    setvendorlist((prev) => !prev)
  }
   const handleapi2 = () => {
    setuserlist((prev) => !prev)
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
            margin: isMobile ? 0 : '32px',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '100%' : '800px',
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '90vh',
          },
        }}
        aria-labelledby="user-dialog-title"
      >
        <DialogTitle
          id="user-dialog-title"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: { xs: '12px 16px', sm: '16px 24px' },
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
            }}
          >
            {action === "add" ? "Add User" : "Update User"}
          </Typography>
          <IconButton
            onClick={() => {
              setValue(defaultState);
              handleclose();
              simpleValidator.current.hideMessages();
              forceUpdate();
            }}
            sx={{
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#374151',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={UserAddEdit}>
          <DialogContent
            sx={{
              padding: { xs: '16px', sm: '24px' },
              '&.MuiDialogContent-root': {
                paddingTop: { xs: '16px', sm: '24px' },
              },
            }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* First Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    First Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter First name"
                    name="firstName"
                    value={value.firstName}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {simpleValidator.current.message(
                      "firstName",
                      value?.firstName,
                      `required|min:3|alpha|max:50`
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Last Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Last name"
                    name="lastName"
                    value={value.lastName}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {simpleValidator.current.message(
                      "lastName",
                      value?.lastName,
                      `required|min:3|alpha|max:50`
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Suffix */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Suffix
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Suffix"
                    name="suffix"
                    value={value.suffix}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Email *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter email"
                    name="email"
                    type="email"
                    value={value.email}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {simpleValidator.current.message(
                      "email",
                      value?.email,
                      `required|email|max:50`
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Phone Number *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={FormatPhoneNumber(value.phone||"")}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {simpleValidator.current.message(
                      "phone",
                      value?.phone,
                      `required|integer|min:10|max:10`
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Job Title */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      Job Title
                    </Typography>
                    {HasPermission("JobTitleAdd") && (
                      <IconButton
                        size="small"
                        onClick={() => setuser(true)}
                        sx={{
                          color: '#3b82f6',
                          backgroundColor: '#eff6ff',
                          width: { xs: 24, sm: 28 },
                          height: { xs: 24, sm: 28 },
                          '&:hover': {
                            backgroundColor: '#dbeafe',
                          },
                        }}
                      >
                        <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      </IconButton>
                    )}
                  </Box>
                  <JobtitleDropdown
                    value={value.jobTitle}
                    fn={handleChange}
                    load={userlist}
                  />
                </Box>
              </Grid>

              {/* Select Role */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      Select Role *
                    </Typography>
                    {HasPermission("RolesAdd") && (
                      <IconButton
                        size="small"
                        onClick={() => setvendor(true)}
                        sx={{
                          color: '#3b82f6',
                          backgroundColor: '#eff6ff',
                          width: { xs: 24, sm: 28 },
                          height: { xs: 24, sm: 28 },
                          '&:hover': {
                            backgroundColor: '#dbeafe',
                          },
                        }}
                      >
                        <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      </IconButton>
                    )}
                  </Box>
                  <RoleDropdown
                    value={value.roleId}
                    fn={handleChange}
                    load={vendorlist}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {simpleValidator.current.message(
                      "Role",
                      value?.roleId,
                      `required`
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* GHL Users */}
              <Grid item xs={12} sm={6} md={4} sx={{ mt: 1 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    GHL Users
                  </Typography>
                  <GetAllGHLUsers
                    name="ghlUserId"
                    value={value.ghlUserId}
                    fn={handleChange}
                    load={action}
                  />
                </Box>
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Password {action === "add" && "*"}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Password"
                    name="password"
                    type={eye ? "text" : "password"}
                    value={value.password}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={showPassword}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {eye ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ef4444',
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {action !== "edit" && simpleValidator.current.message("password", value?.password, "required|min:8")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              padding: { xs: '16px', sm: '16px 24px' },
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setValue(defaultState);
                handleclose();
                simpleValidator.current.hideMessages();
                forceUpdate();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderColor: '#d1d5db',
                color: '#6b7280',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loader}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#3b82f6',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                },
              }}
            >
              {action === "add" ? "Submit" : "Update"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {vendor && (
        <AddEditRole 
          open={vendor} 
          handleclose={() => setvendor(false)} 
          action={"add"} 
          LanguageListAPI={handleapi} 
          object={""} 
          permission={permission}
        />
      )}

      {user && (
        <AddEditJobTitle
          open={user}
          handleclose={() => setuser(false)}
          action={"add"}
          LanguageListAPI={handleapi2}
          object={""}
        />
      )}
    </>
  );
};

export default AddEditUser;
