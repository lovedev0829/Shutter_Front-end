import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem, InputLabel, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 12px',
    fontSize: '14px',
  },
}));

export default function GetAllVendorDropdown({ value = "", fn, load, className = null, name = "vendorId" }) {
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
      <StyledFormControl 
        size="small" 
        variant="outlined" 
        disabled={show}
        className={className}
      >
        <InputLabel id="vendor-select-label">Select Vendor</InputLabel>
        <Select
          labelId="vendor-select-label"
          name={name}
          value={value}
          label="Select Vendor"
          onChange={(e) => {
            if (fn) fn(e);
          }}
        >
          <MenuItem value="">Select Vendor</MenuItem>
          {countryList?.map((item, i) => (
            <MenuItem key={i} value={item?.vendorId}>
              {item?.companyName}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </Box>
  );
}


