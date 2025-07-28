import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Assignment as StatusIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";

export default function FilterJob({
  addresList,
  handleAddresschnage,
  handleStatuschange,
  value,
  GetSatus
}) {
  const [JobStatus, setJobStatus] = useState([]);

  const StatusList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setJobStatus(apiResponse?.data?.data);
        GetSatus(apiResponse?.data?.data)
      } else {
        setJobStatus([]);
      }
    } catch (error) {
      setJobStatus([]);
    }
  };

  useEffect(() => {
    StatusList();
    // eslint-disable-next-line
  }, []);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Filter Jobs
        </Typography>
      </Box>

      {/* Filter by Address */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Filter By Address
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => handleAddresschnage("")}
            color={value.address === "" ? "primary" : "default"}
            variant={value.address === "" ? "filled" : "outlined"}
            sx={{
              fontWeight: value.address === "" ? 600 : 400,
              '&:hover': {
                backgroundColor: value.address === "" ? 'primary.dark' : 'action.hover',
              },
              transition: 'all 0.2s ease',
            }}
          />
          {addresList?.map((address, i) => (
            <Chip
              key={i}
              label={`${address?.streetAddress} (${address?.label})`}
              onClick={() => handleAddresschnage(address.addressId)}
              color={value.address === address.addressId ? "primary" : "default"}
              variant={value.address === address.addressId ? "filled" : "outlined"}
              sx={{
                fontWeight: value.address === address.addressId ? 600 : 400,
                '&:hover': {
                  backgroundColor: value.address === address.addressId ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Filter by Status */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StatusIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Filter By Status
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => handleStatuschange("")}
            color={value.jobStatus === "" ? "primary" : "default"}
            variant={value.jobStatus === "" ? "filled" : "outlined"}
            sx={{
              fontWeight: value.jobStatus === "" ? 600 : 400,
              '&:hover': {
                backgroundColor: value.jobStatus === "" ? 'primary.dark' : 'action.hover',
              },
              transition: 'all 0.2s ease',
            }}
          />
          {JobStatus?.map((status, i) => (
            <Chip
              key={i}
              label={status.jobStatusName}
              onClick={() => handleStatuschange(status.jobStatusId)}
              color={value.jobStatus === status.jobStatusId ? "primary" : "default"}
              variant={value.jobStatus === status.jobStatusId ? "filled" : "outlined"}
              sx={{
                fontWeight: value.jobStatus === status.jobStatusId ? 600 : 400,
                '&:hover': {
                  backgroundColor: value.jobStatus === status.jobStatusId ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
