import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTitleContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 4,
    height: '60%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: '24px',
  lineHeight: 1.2,
  margin: 0,
}));

export default function TableTitle({title}) {
  return (
    <StyledTitleContainer>
      <StyledTitle variant="h4" component="h2">
        {title}
      </StyledTitle>
    </StyledTitleContainer>
  );
}
