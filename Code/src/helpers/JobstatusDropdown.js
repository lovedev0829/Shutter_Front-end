import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  useTheme,
  alpha
} from "@mui/material";

export default function JobstatusDropdown({ value = "", fn, load }) {
  const theme = useTheme();
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
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
    <Box sx={{ position: 'relative', minWidth: 120 }}>
      <FormControl 
        fullWidth 
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <InputLabel>Job Status</InputLabel>
        <Select
          value={value}
          name="jobStatus"
          label="Job Status"
          onChange={(e) => {
            if (fn) fn(e);
          }}
          disabled={show}
          endAdornment={
            show && (
              <Box sx={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)' }}>
                <CircularProgress 
                  size={16} 
                  sx={{ color: theme.palette.primary.main }}
                />
              </Box>
            )
          }
          sx={{
            '& .MuiSelect-select': {
              paddingRight: show ? '48px !important' : '32px',
            },
          }}
        >
          {countryList?.map((item, i) => (
            <MenuItem 
              key={i} 
              value={item?.jobStatusId}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  },
                },
              }}
            >
              {item?.jobStatusName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
