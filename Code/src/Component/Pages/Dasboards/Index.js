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
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: 0,
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  marginBottom: theme.spacing(4),
  borderRadius: 16,
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
}));

const StatsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const JobsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export default function Index() {
  const theme = useTheme();
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
    <DashboardContainer>
      {loder && <ApiLoder />}
      <Box className="intersight_content">
        <Header title="Dashboard" />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Fade in timeout={600}>
            <Box>
              {/* Welcome Section */}
              <WelcomeCard elevation={0}>
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                    <Typography 
                      variant="h4" 
                      component="h1"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Welcome To{" "}
                      <Box 
                        component="span" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.95)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
                      fontSize: '1.1rem',
                      fontWeight: 400
                    }}
                  >
                    Manage your business operations with ease
                  </Typography>
                </CardContent>
              </WelcomeCard>

              {/* Dashboard Stats */}
              {user?.code !== "admin" && (
                <StatsSection>
                  <Fade in timeout={800}>
                    <Grid container spacing={3}>
                      <DasboardPart data={data} />
                    </Grid>
                  </Fade>
                </StatsSection>
              )}

              {/* Jobs Section */}
              {user?.code !== "admin" && (
                <Fade in timeout={1000}>
                  <JobsSection>
                    <SectionHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 4, 
                            height: 32, 
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 2
                          }} 
                        />
                        <Typography 
                          variant="h5" 
                          component="h2"
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                          }}
                        >
                          Recent Jobs
                        </Typography>
                      </Box>
                      <ViewAllButton
                        component={Link}
                        to="/job"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            backgroundColor: `${theme.palette.primary.main}08`,
                          }
                        }}
                      >
                        <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
                        View All Jobs
                      </ViewAllButton>
                    </SectionHeader>
                    
                    <Divider sx={{ mb: 3, opacity: 0.6 }} />
                    
                    <Calendardashboard Apiload={Apiload} />
                  </JobsSection>
                </Fade>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </DashboardContainer>
  );
}
