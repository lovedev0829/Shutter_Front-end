import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    '& .stats-icon': {
      transform: 'scale(1.1)',
    },
    '& .arrow-icon': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  },
}));

const StatsIconContainer = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& img': {
    width: 32,
    height: 32,
    filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`,
  },
}));

const StatsValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  marginBottom: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ArrowIcon = styled(ArrowForwardIcon)(({ theme }) => ({
  fontSize: 16,
  opacity: 0,
  transform: 'translateX(-8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: theme.palette.primary.main,
}));

const TrendIcon = styled(TrendingUpIcon)(({ theme }) => ({
  fontSize: 20,
  color: alpha(theme.palette.success.main, 0.8),
  position: 'absolute',
  top: 16,
  right: 16,
  opacity: 0.6,
}));

export default function DasboardPart({ data }) {
  const theme = useTheme();
  const navigate = useNavigate();

  function redirect(url) {
    localStorage.setItem("activeTab2", "#pills-overview");
    navigate(url);
  }

  return (
    <>
      {data?.map((val, i) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={i}>
          <StatsCard onClick={() => redirect(val?.url)}>
            <TrendIcon />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <StatsIconContainer className="stats-icon">
                <img src={val?.image} alt={val?.label} loading="lazy" />
              </StatsIconContainer>
              
              <StatsValue variant="h3" component="div">
                {val?.count}
              </StatsValue>
              
              <StatsLabel variant="body2">
                {val?.label}
                <ArrowIcon className="arrow-icon" />
              </StatsLabel>
            </CardContent>
          </StatsCard>
        </Grid>
      ))}
    </>
  );
}
