import { useEffect, useState } from "react";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Box,
  CircularProgress,
} from '@mui/material';
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function TaxAuthority({ value = "", fn, load, name = "" }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  
  const CountryList = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllTaxAuthority, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setCountryList([]);
      setShow(false);
    }
  };

  useEffect(() => {
    CountryList();
    // eslint-disable-next-line
  }, [load]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <FormControl 
        fullWidth 
        variant="outlined"
        disabled={show}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            fontSize: '14px',
            '& .MuiSelect-select': {
              padding: '12px 14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
            }
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px',
            '&.Mui-focused': {
              color: 'primary.main',
            }
          }
        }}
      >
        <Select
          labelId="state-select-label"
          value={value}
          name={name}
          onChange={(e) => {
            if (fn) fn(e);
          }}
          displayEmpty
          startAdornment={
            show && (
              <CircularProgress 
                size={16} 
                sx={{ 
                  mr: 1,
                  color: 'primary.main'
                }} 
              />
            )
          }
        >
          <MenuItem value="">
            <Typography 
              sx={{ 
                color: 'text.secondary', 
                fontSize: '14px',
                fontStyle: 'italic'
              }}
            >
              Select Tax Authority
            </Typography>
          </MenuItem>
          {countryList?.map((item, i) => (
            <MenuItem 
              key={i} 
              value={item?.id}
              sx={{
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              {item?.authorityName} ({item?.stateName})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


