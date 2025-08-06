import { useEffect, useState } from "react";
import Header from "../../../Layout/header";
import DasboardPart from "../../Form/DasboardPart";
import TableTitle from "../../Form/TableTitle";
import { ApiLoder } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ErrorMessage } from "../../../helpers/common";
import Calendardashboard from "./Calendardashboard";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Fade,
  Divider,
  Button,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ResponsiveContainer } from '../../Layout/ResponsiveLayout';



export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loder, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const DashBoard = async () => {
    try {
      setLoader(true);
      const response = await callAPI(apiUrls.DashBoard, {}, "GET", {});
      setLoader(false);
      if (response?.data?.isSuccess) {
        setData(response?.data?.data)
      } else {
        ErrorMessage(response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    DashBoard();
  }, []);

  const user = JSON.parse(localStorage.getItem("userData"));

  const Apiload = () => {
    DashBoard();
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        padding: 0,
      }}
    >
      {loder && <ApiLoder />}
      <Box className="intersight_content">
        <Header title="Dashboard" />
        <ResponsiveContainer 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Fade in timeout={600}>
            <Box>
              {/* Welcome Section */}
              <Card
                elevation={0}
                sx={{
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  mb: { xs: 3, sm: 4 },
                  borderRadius: { xs: 2, sm: 4 },
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.1,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 2 }, 
                    mb: { xs: 1, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}>
                    <TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 32 }, opacity: 0.9 }} />
                    <Typography 
                      variant="h4" 
                      component="h1"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Welcome To{" "}
                      <Box 
                        component="span" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.95)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          display: { xs: 'block', sm: 'inline' }
                        }}
                      >
                        {user?.companyName
                          ? user?.companyName
                          : user?.firstName + user?.lastName}!
                      </Box>
                    </Typography>
                  </Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      fontWeight: 400,
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Manage your business operations with ease
                  </Typography>
                </CardContent>
              </Card>

              {/* Dashboard Stats */}
              {user?.code !== "admin" && (
                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Fade in timeout={800}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <DasboardPart data={data} />
                    </Grid>
                  </Fade>
                </Box>
              )}

              {/* Jobs Section */}
              {user?.code !== "admin" && (
                <Fade in timeout={1000}>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: { xs: 2, sm: 4 },
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      backgroundColor: 'background.paper',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 4, 
                            height: 32, 
                            backgroundColor: 'primary.main',
                            borderRadius: 2
                          }} 
                        />
                        <Typography 
                          variant="h5" 
                          component="h2"
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                          }}
                        >
                          Recent Jobs
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to="/job"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 2,
                          py: 1,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          minWidth: { xs: '100%', sm: 'auto' },
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
                        View All Jobs
                      </Button>
                    </Box>
                    
                    <Divider sx={{ mb: 3, opacity: 0.6 }} />
                    
                    <Calendardashboard Apiload={Apiload} />
                  </Paper>
                </Fade>
              )}
            </Box>
          </Fade>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
