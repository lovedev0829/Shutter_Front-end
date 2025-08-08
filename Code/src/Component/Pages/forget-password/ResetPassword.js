import React, { useEffect, useRef, useState } from 'react';
import { callAPIWithoutAuth } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ErrorMessage, SuccessMessage, CustomMessages, ApiLoder } from '../../../helpers/common';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate, useParams } from 'react-router-dom';
import Loginsidebar from '../Auth/Loginsidebar';
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from "react-router-dom";

const ResetPassword = ({ email }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
    const [, forceUpdate] = useState();
    const param = useParams();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const updatePassword = async () => {
        setLoader(true);
        try {
            const response = await callAPIWithoutAuth(apiUrls.VerifyForgetPassword, {}, 'POST', { 
                token: param.token, 
                password: password 
            });
            setLoader(false);
            if (response.data.isSuccess) {
                SuccessMessage(response.data.message);
                navigate(`/${param.type}`);
            } else {
                ErrorMessage(response.data.message);
            }
        } catch (error) {
            setLoader(false);
        }
    };

    function handleSubmission(e) {
        e.preventDefault();
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        } else {
            updatePassword();
        }
    }

    function changeFavicon(users) {
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }
        favicon.href = users?.logo || "/image/logo.svg";
        document.title = users?.companyName
            ? `${users?.companyName} ${''}`.trim()
            : document.title;
    }

    const GetData = async () => {
        setLoader(true);
        try {
            const response = await callAPIWithoutAuth(
                apiUrls.HomePageContent,
                { CompanyCode: param.type },
                "GET"
            );
            setLoader(false);
            if (response.data.isSuccess) {
                let datas = response?.data?.data;
                setData(datas);
                changeFavicon(datas);
                localStorage.setItem("code", JSON.stringify(param.type));
            } else {
                navigate("/404");
                ErrorMessage(response.data.message);
            }
        } catch (e) {
            navigate("/404");
            setLoader(false);
        }
    };

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            GetData();
        }
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
                        {/* Reset Password Form Section */}
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
                                        {/* Back Link */}
                                        <Box sx={{ mb: 2 }}>
                                            <Link 
                                                to={`/login`}
                                                style={{ 
                                                    textDecoration: 'none',
                                                    color: data?.primaryColor || '#0e0d32',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                <ArrowBackIosIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                Back to Sign In
                                            </Link>
                                        </Box>

                                        {/* Header */}
                                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                                            <Typography 
                                                variant="h3" 
                                                component="h1" 
                                                gutterBottom
                                                sx={{ 
                                                    fontWeight: 700,
                                                    color: data?.primaryColor || '#0e0d32',
                                                    fontSize: { xs: '1.75rem', md: '2.25rem' }
                                                }}
                                            >
                                                Reset Password
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary"
                                                sx={{ fontWeight: 400, lineHeight: 1.6 }}
                                            >
                                                Please enter your new password below.
                                            </Typography>
                                        </Box>

                                        {/* Form */}
                                        <Box component="form" onSubmit={handleSubmission} sx={{ mt: 2 }}>
                                            {/* New Password Field */}
                                            <Box sx={{ mb: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="New Password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter new password"
                                                    error={Boolean(simpleValidator.current.message("password", password, "required|min:8"))}
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
                                                {simpleValidator.current.message("password", password, "required|min:8") && (
                                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                                                        {simpleValidator.current.message("password", password, "required|min:8")}
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Confirm Password Field */}
                                            <Box sx={{ mb: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    error={Boolean(simpleValidator.current.message("confirm password", confirmPassword, `required|in:${password}`))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockResetOutlinedIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle confirm password visibility"
                                                                    onClick={handleToggleConfirmPasswordVisibility}
                                                                    edge="end"
                                                                >
                                                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                                                {simpleValidator.current.message("confirm password", confirmPassword, `required|in:${password}`) && (
                                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                                                        Password Not Match
                                                    </Box>
                                                )}
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
                                                {loader ? 'Updating...' : 'Update Password'}
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
};

export default ResetPassword;