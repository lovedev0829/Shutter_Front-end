import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem, InputLabel, CircularProgress, Box, useTheme, useMediaQuery } from '@mui/material';
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function ProductTypeDropdown({ value = "", fn, load, name = "productType", disabled = false, className = null, Getproduct = () => {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  
  const CountryList = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllProductType, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
        // Set "Choose Type" as default - no automatic selection
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setShow(false);
      setCountryList([]);
    }
  };

  useEffect(() => {
    CountryList();
    // eslint-disable-next-line
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
        disabled={disabled || show}
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
        <InputLabel id="product-type-select-label">Product Type</InputLabel>
        <Select
          labelId="product-type-select-label"
          name={name}
          value={value || ""}
          label="Product Type"
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
          <MenuItem value="">Choose Type</MenuItem>
          {countryList?.map((item, i) => (
            <MenuItem key={i} value={item?.productId}>
              {item?.productName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


