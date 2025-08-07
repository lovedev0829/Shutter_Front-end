import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem, InputLabel, CircularProgress, Box, useTheme, useMediaQuery } from '@mui/material';
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function GetAllVendorDropdown({ value = "", fn, load, className = null, name = "vendorId" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllVendor, {}, "GET");
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false)
      setCountryList([]);
    }
  };

  useEffect(() => {
    CountryList();
  }, [load]);



  return (
    <Box sx={{ position: 'relative' }}>
      {show && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      <FormControl 
        size={isMobile ? "medium" : "small"} 
        variant="outlined" 
        disabled={show}
        className={className}
        sx={{
          minWidth: isMobile ? 120 : 180,
          width: '100%',
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            borderRadius: 1,
            minHeight: isMobile ? '44px' : '40px', // Touch-friendly height
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          },
          '& .MuiInputBase-input': {
            padding: isMobile ? '12px 14px' : '10px 12px',
            fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
          },
          '& .MuiInputLabel-root': {
            fontSize: isMobile ? '16px' : '14px',
          },
        }}
      >
        <InputLabel id="vendor-select-label">Select Vendor</InputLabel>
        <Select
          labelId="vendor-select-label"
          name={name}
          value={value || ""}
          label="Select Vendor"
          onChange={(e) => {
            if (fn) fn(e);
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: isMobile ? 250 : 300,
                '& .MuiMenuItem-root': {
                  fontSize: isMobile ? '16px' : '14px',
                  minHeight: isMobile ? '44px' : '36px', // Touch-friendly menu items
                  padding: isMobile ? '12px 16px' : '8px 16px',
                },
              },
            },
          }}
        >
          <MenuItem value="">Select Vendor</MenuItem>
          {countryList?.map((item, i) => (
            <MenuItem key={i} value={item?.vendorId}>
              {item?.companyName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


