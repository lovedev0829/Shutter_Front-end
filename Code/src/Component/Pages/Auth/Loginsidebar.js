import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function Loginsidebar({ title, descrption, users }) {
  const param = useParams();
  
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        background: users?.primaryColor ? 
          `linear-gradient(135deg, ${users.primaryColor} 0%, ${users.primaryColor}CC 100%)` :
          'linear-gradient(135deg, #0e0d32 0%, #1a1848 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          zIndex: 1,
          maxWidth: 400,
        }}
      >
        {/* Logo Section */}
        {users?.logo && (
          <Box sx={{ mb: 4 }}>
            <Link to={`/${param.type}`} style={{ textDecoration: 'none' }}>
              <Box
                component="img"
                src={users.logo}
                alt="Company Logo"
                loading="lazy"
                sx={{
                  maxWidth: '100px',
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Link>
          </Box>
        )}

        {/* Content Section */}
        <Box sx={{ color: 'white' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1.2,
              mb: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
              opacity: 0.9,
              textShadow: '0 1px 5px rgba(0,0,0,0.2)',
            }}
          >
            {descrption}
          </Typography>
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 4,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
}
