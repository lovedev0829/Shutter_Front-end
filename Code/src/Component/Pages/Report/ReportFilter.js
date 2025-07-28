import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export default function ReportFilter({ handleStatuschange, value, JobStatus }) {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      const selectedStatus = JobStatus.find(status => status.jobStatusId === newValue);
      if (selectedStatus) {
        handleStatuschange(selectedStatus.jobStatusId, selectedStatus.jobStatusName);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <ToggleButtonGroup
        value={value.orderStatus}
        exclusive
        onChange={handleChange}
        aria-label="report filter"
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            px: 3,
            py: 1,
            mx: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          },
        }}
      >
        {JobStatus?.map((val, i) => (
          <ToggleButton
            key={i}
            value={val.jobStatusId}
            aria-label={val.jobStatusName}
          >
            <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
              {val.jobStatusName}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
