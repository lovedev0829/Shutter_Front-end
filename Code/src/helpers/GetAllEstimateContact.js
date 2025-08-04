import { useEffect, useState } from "react";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Box,
  useTheme 
} from "@mui/material";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function GetAllEstimateContact({ value = "", fn, ContactId }) {
  const theme = useTheme();
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  
  const CountryList = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllEstimateContact, { ContactId: ContactId }, "GET");
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
    if (ContactId) {
      CountryList();
    } else {
      setCountryList([]);
    }
    // eslint-disable-next-line
  }, [ContactId]);

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        },
        '& .MuiInputLabel-root': {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      }}
      disabled={show || !ContactId}
    >
      <InputLabel>Select Estimate</InputLabel>
      <Select
        value={value || ""}
        label="Select Estimate"
        name="estimateId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
        sx={{
          '& .MuiSelect-select': {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
          },
        }}
        endAdornment={
          show ? (
            <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
              <CircularProgress size={16} />
            </Box>
          ) : null
        }
      >
        <MenuItem 
          value=""
          sx={{ 
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontStyle: 'italic',
            color: theme.palette.text.secondary
          }}
        >
          {!ContactId ? "Select Contact First" : "Select Estimate"}
        </MenuItem>
        {countryList?.map((item, i) => (
          <MenuItem 
            key={i} 
            value={item?.estimateId}
            sx={{ 
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }}
          >
            {item?.estimateName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}


