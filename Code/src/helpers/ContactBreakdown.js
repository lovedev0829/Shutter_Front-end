import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Box
} from '@mui/material';

export default function ContactBreakdown({ value = "", fn,name="ContactName",disabled=false,className=null}) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
        const apiResponse = await callAPI(apiUrls.ContactBreakdown,{},"GET");
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
  }, []);

  

    return (
    <Box className={`position-relative ${className || ''}`} sx={{ position: 'relative' }}>
        {show && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}>
            <CircularProgress size={24} />
          </Box>
        )}
      <FormControl 
        fullWidth 
        variant="outlined" 
        disabled={disabled}
        sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#666',
            '&.Mui-focused': {
              color: '#1976d2',
              fontWeight: 600,
            },
          },
        }}
      >
        <InputLabel id={`${name}-label`}>Select Customer</InputLabel>
        <Select
          labelId={`${name}-label`}
          value={value}
          name={name}
          onChange={(e) => {
            if (fn) fn(e);
          }}
          label="Select Customer"
          disabled={disabled}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '8px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                mt: 1,
                '& .MuiMenuItem-root': {
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="">
            <em style={{ color: '#999' }}>Select Customer</em>
          </MenuItem>
          {countryList?.map((item, i) => {
            return (
              <MenuItem 
                key={i} 
                value={item?.contactUniqueId}
                selected={item?.ContactName===value?true:false}
              >
                {item?.firstName +" " + item?.lastName +" " + (item?.suffix ?? "")}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      </Box>
  );
}


