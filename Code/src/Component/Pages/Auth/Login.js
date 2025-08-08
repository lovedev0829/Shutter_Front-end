import React, { useEffect, useRef, useState } from "react";
import Loginsidebar from "./Loginsidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage, CustomMessages, ApiLoder } from "../../../helpers/common";
import { Profile } from "../../../Redux/Redux/Action/Action";
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const [data, setData] = useState({ username: "", password: "", companyCode: "" });
  const [loader, setloader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
  const [, forceUpdate] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const param = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const loginToApp = async (data) => {
    try {
      setloader(true);
      const response = await callAPIWithoutAuth(
        apiUrls.login,
        {},
        "POST",
        data
      );
      setloader(false);
      if (response.data.isSuccess) {
        let res = response?.data?.data;

        dispatch(Profile(res));
        localStorage.setItem("accessToken", res?.token);
        localStorage.setItem("code", JSON.stringify(data.companyCode));
        localStorage.setItem("userData", JSON.stringify(res));
         localStorage.setItem("accessTokenold", res?.token);
        localStorage.setItem("userDataold", JSON.stringify(res));
        SuccessMessage(response.data.message);
        navigate("/dashboard");
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (e) {
      setloader(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      loginToApp(data);
    }
  };

  useEffect(() => {
    setData((prev) => ({ ...prev, 'companyCode': param.type ?? "login" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.type]);

  return (
    <>
      <ApiLoder open={loader} />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={0} sx={{ minHeight: '100vh', width: '100%' }}>
            {/* Login Form Section */}
            <Grid item xs={12} md={7} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: { xs: 2, md: 4 }
            }}>
              <Box sx={{ width: '100%', maxWidth: 480 }}>
                <Card elevation={isMobile ? 0 : 3} sx={{ 
                  borderRadius: 3,
                  backgroundColor: isMobile ? 'transparent' : 'white',
                  boxShadow: isMobile ? 'none' : '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <CardContent sx={{ padding: { xs: 3, md: 5 } }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          color: data?.primaryColor || '#0e0d32',
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        Sign In
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ fontWeight: 400 }}
                      >
                        {t("Welcome")} back! Please sign in to your account.
                      </Typography>
                    </Box>

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                      <Box sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="username"
                          type="email"
                          value={data.username}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          error={Boolean(simpleValidator.current.message("username", data?.username, "required|email"))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: data?.primaryColor || '#0e0d32',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: data?.primaryColor || '#0e0d32',
                              },
                            },
                          }}
                        />
                        {simpleValidator.current.message("username", data?.username, "required|email") && (
                          <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                            {simpleValidator.current.message("username", data?.username, "required|email")}
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={data.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          error={Boolean(simpleValidator.current.message("password", data?.password, "required"))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleTogglePasswordVisibility}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: data?.primaryColor || '#0e0d32',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: data?.primaryColor || '#0e0d32',
                              },
                            },
                          }}
                        />
                        {simpleValidator.current.message("password", data?.password, "required") && (
                          <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                            {simpleValidator.current.message("password", data?.password, "required")}
                          </Box>
                        )}
                      </Box>

                      {/* Forgot Password Link */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Link 
                          to="/forget-password" 
                          style={{ 
                            textDecoration: 'none',
                            color: data?.primaryColor || '#0e0d32',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          Forgot Password?
                        </Link>
                      </Box>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loader}
                        sx={{
                          mt: 2,
                          mb: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          py: 1.5,
                          backgroundColor: data?.primaryColor || '#0e0d32',
                          boxShadow: '0 4px 14px rgba(14, 13, 50, 0.3)',
                          '&:hover': {
                            backgroundColor: data?.primaryColor ? `${data.primaryColor}CC` : '#0a0928',
                            boxShadow: '0 6px 20px rgba(14, 13, 50, 0.4)',
                            transform: 'translateY(-1px)',
                          },
                          '&:disabled': {
                            backgroundColor: '#ccc',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                        startIcon={loader && <CircularProgress size={20} color="inherit" />}
                      >
                        {loader ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Sidebar Section */}
            <Grid item xs={12} md={5} sx={{ 
              display: { xs: 'none', md: 'block' },
              padding: 0,
              margin: 0
            }}>
              <Loginsidebar
                title={"Shutter Management and Estimation System"}
                descrption={
                  "You'd like to work with, and I'll help you with the title or any other tasks you have in mind."
                }
                users={data}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
