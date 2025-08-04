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

export default function ProductTypeDropdown({ value = "", fn, load, name = "productType", disabled = false, className = null, Getproduct = () => {} }) {
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
      <StyledFormControl size="small" variant="outlined" disabled={disabled || show}>
        <InputLabel id="product-type-select-label">Product Type</InputLabel>
        <Select
          labelId="product-type-select-label"
          name={name}
          value={value}
          label="Product Type"
          onChange={(e) => {
            if (fn) fn(e);
          }}
        >
          <MenuItem value="">Choose Type</MenuItem>
          {countryList?.map((item, i) => (
            <MenuItem key={i} value={item?.productId}>
              {item?.productName}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </Box>
  );
}


