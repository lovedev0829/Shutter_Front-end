import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



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
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Card
            onClick={() => redirect(val?.url)}
            sx={{
              borderRadius: 2,
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              minHeight: { xs: 140, sm: 160 },
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
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              },
            }}
          >
            {/* Trend Icon */}
            <TrendingUpIcon
              sx={{
                fontSize: 20,
                color: (theme) => alpha(theme.palette.success.main, 0.8),
                position: 'absolute',
                top: 16,
                right: 16,
                opacity: 0.6,
              }}
            />
            
            <CardContent sx={{ p: 3, position: 'relative' }}>
              {/* Icon Container */}
              <Box
                className="stats-icon"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& img': {
                    width: 32,
                    height: 32,
                    filter: (theme) => `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`,
                  },
                }}
              >
                <img src={val?.image} alt={val?.label} loading="lazy" />
              </Box>
              
              {/* Stats Value */}
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {val?.count}
              </Typography>
              
              {/* Stats Label */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {val?.label}
                <ArrowForwardIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 16,
                    opacity: 0,
                    transform: 'translateX(-8px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: 'primary.main',
                  }}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
}
