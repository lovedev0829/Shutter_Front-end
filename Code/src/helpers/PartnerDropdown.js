import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import { FormControl, Select, MenuItem, InputLabel, CircularProgress, Box } from '@mui/material';

export default function PartnerDropdown({ value = "", fn }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  
  const TenantlistAPI = async () => {
    let query = {
      searchValue: "",
      pageNo: 1,
      recordPerPage: 1000,
      tenantId: "",
      status: "2"
    };
    setShow(true);
    try {
      const apiResponse = await callAPI(apiUrls.SubTenant, {}, "POST", query);
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setShow(false);
      setCountryList([]);
    }
  };

  useEffect(() => {
    TenantlistAPI();
  }, []);

  return (
    <FormControl 
      fullWidth 
      size="small" 
      variant="outlined"
      sx={{
        position: 'relative',
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#fff',
          borderRadius: 1,
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
          padding: '10px 12px', 
          fontSize: '14px',
        },
      }}
    >
      {show && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
            borderRadius: 1,
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      <InputLabel id="partner-select-label">Partner</InputLabel>
      <Select
        labelId="partner-select-label"
        name="tenantId"
        value={value || ""}
        label="Partner"
        onChange={(e) => {
          if (fn) fn(e);
        }}
        disabled={show}
      >
        <MenuItem value="">Select Partner</MenuItem>
        {countryList?.map((item, i) => (
          <MenuItem key={i} value={item?.tenantId}>
            {item?.firstName + " " + item?.lastName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}


