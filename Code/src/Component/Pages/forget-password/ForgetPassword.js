import React, { useState, useRef, useEffect } from "react";
import Loginsidebar from "../Auth/Loginsidebar";
import SimpleReactValidator from "simple-react-validator";
import { ApiLoder, CustomMessages, ErrorMessage, SuccessMessage } from "../../../helpers/common";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
import { EmailOutlined, BusinessOutlined, ArrowBackIos } from "@mui/icons-material";
import { Link } from "react-router-dom";

function ForgetPassword() {
    const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
    const [, forceUpdate] = useState();
    const [email, setEmail] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [companyCodes, setCompanyCodes] = useState([]);
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({});
    const param = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Function to fetch company codes for the specific email
    const fetchCompanyCodeByEmail = async (emailValue) => {
        if (!emailValue || !emailValue.includes('@')) {
            setCompanyCodes([]);
            setCompanyCode('');
            return;
        }

        try {
            const response = await callAPIWithoutAuth(
                `${apiUrls.GetCompanyCodesByEmail}?email=${encodeURIComponent(emailValue)}`, 
                {}, 
                'GET'
            );
            
            if (response.data.isSuccess) {
                const companyCodes = response.data.data || [];
                
                const formattedCodes = companyCodes.map(code => ({ 
                    value: code.code,
                    tenantId: code.tenantId,
                    label: code.name ? `${code.code} - ${code.name}` : code.code
                }));
                
                setCompanyCodes(formattedCodes);
                
                if (formattedCodes.length > 0) {
                    setCompanyCode(formattedCodes[0].value);
                    setTenantId(formattedCodes[0].tenantId);                   
                } else {
                    setCompanyCode('');
                    setTenantId('');
                }
            } else {
                setCompanyCodes([]);
                setCompanyCode('');
                setTenantId('');
            }
        } catch (error) {
            console.error('Error fetching company codes:', error);
            setCompanyCodes([]);
            setCompanyCode('');
            setTenantId('');
        }
    };

    const sendForgetRequest = async (email, companyCode, tenantId) => {
        setLoader(true)
        try{
            const response = await callAPIWithoutAuth(apiUrls.ForgetPassword, {}, 'POST', {
                email: email,
                code: companyCode,
                tenantId: tenantId
            })
            setLoader(false)
            if(response.data.isSuccess){
                SuccessMessage(response.data.message)
            }else{
                ErrorMessage(response.data.message)
            }
        } catch(error){
           setLoader(false)
        }
    }

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        
        const timeoutId = setTimeout(() => {
            fetchCompanyCodeByEmail(emailValue);
        }, 500);
        
        return () => clearTimeout(timeoutId);
    };

    const handleCompanyCodeChange = (e) => {
        const selectedCode = e.target.value;
        setCompanyCode(selectedCode);
        
        // Find the corresponding tenantId for the selected company code
        const selectedCompany = companyCodes.find(company => company.value === selectedCode);
        if (selectedCompany) {
            setTenantId(selectedCompany.tenantId);
        } else {
            setTenantId('');
        }
    };

    function handleSubmit(e){
        e.preventDefault(); 
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
                simpleValidator.current.showMessages();
                forceUpdate(1);
        } else if (companyCodes.length === 0 || !companyCode) {
                ErrorMessage("Please enter a valid email to load company codes, then select a company code.");
        } else {
                sendForgetRequest(email, companyCode, tenantId)
        }
    }

    function changeFavicon(users) {
      let favicon = document.querySelector("link[rel~='icon']");
      if (!favicon) {
          favicon = document.createElement("link");
          favicon.rel = "icon";
          document.head.appendChild(favicon);
      }
      favicon.href = users?.logo ||"/image/logo.svg";
      document.title = users?.firstName
      ? `${users?.firstName} ${users?.lastName || ''}`.trim()
      : document.title;
    }

    const getCompanyData = async () => {
        try {
            const response = await callAPIWithoutAuth(
                apiUrls.HomePageContent,
                {CompanyCode: companyCode},
                "GET"
            );
            setLoader(false);
            if (response.data.isSuccess) {
                let datas = response?.data?.data;
                setData(datas)
                changeFavicon(datas)
            } else {
                navigate("/404");
                ErrorMessage(response.data.message);
            }
        } catch (e) {
            navigate("/404");
        }
    };

    useEffect(() => {
      if(companyCode) {
        getCompanyData();
      }
    }, [companyCode])

    return (
        <>
            {loader && <ApiLoder />}
            <Box sx={{ 
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={0} sx={{ minHeight: '100vh', width: '100%' }}>
                        {/* Forgot Password Form Section */}
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
                                                to="/login" 
                                                style={{ 
                                                    textDecoration: 'none',
                                                    color: data?.primaryColor || '#0e0d32',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                <ArrowBackIos sx={{ fontSize: 16, mr: 0.5 }} />
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
                                                Forgot Your Password?
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary"
                                                sx={{ fontWeight: 400, lineHeight: 1.6 }}
                                            >
                                                Don't worry! Resetting your password is easy. 
                                                Just enter your email address and we'll help you reset it.
                                            </Typography>
                                        </Box>

                                        {/* Form */}
                                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                            {/* Email Field */}
                                            <Box sx={{ mb: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    placeholder="Enter your email address"
                                                    error={Boolean(simpleValidator.current.message("email", email, "required|email"))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <EmailOutlined color="action" />
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
                                                {simpleValidator.current.message("email", email, "required|email") && (
                                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                                                        {simpleValidator.current.message("email", email, "required|email")}
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Company Code Dropdown */}
                                            <Box sx={{ mb: 3 }}>
                                                <FormControl 
                                                    fullWidth 
                                                    error={Boolean(simpleValidator.current.message("companyCode", companyCode, "required"))}
                                                    disabled={companyCodes.length === 0}
                                                >
                                                    <InputLabel 
                                                        id="company-code-label"
                                                        sx={{
                                                            '&.Mui-focused': {
                                                                color: data?.primaryColor || '#0e0d32',
                                                            },
                                                        }}
                                                    >
                                                        Company Code
                                                    </InputLabel>
                                                    <Select
                                                        labelId="company-code-label"
                                                        id="companyCode"
                                                        name="companyCode"
                                                        value={companyCode}
                                                        label="Company Code"
                                                        onChange={handleCompanyCodeChange}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <BusinessOutlined color="action" sx={{ ml:0 }} />
                                                            </InputAdornment>
                                                        }
                                                        sx={{
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: data?.primaryColor || '#0e0d32',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: data?.primaryColor || '#0e0d32',
                                                            },
                                                        }}
                                                    >
                                                        {companyCodes.length > 0 ? (
                                                            companyCodes.map((option, index) => (
                                                                <MenuItem key={index} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : (
                                                            <MenuItem value="" disabled>
                                                                {email && email.includes('@') 
                                                                    ? 'No company codes found for this email' 
                                                                    : 'Enter email first'
                                                                }
                                                            </MenuItem>
                                                        )}
                                                    </Select>
                                                    {simpleValidator.current.message("companyCode", companyCode, "required") && (
                                                        <FormHelperText>
                                                            {simpleValidator.current.message("companyCode", companyCode, "required")}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
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
                                                {loader ? 'Sending...' : 'Send Reset Link'}
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

export default ForgetPassword;
