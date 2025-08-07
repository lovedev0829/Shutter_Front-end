import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box
} from "@mui/material";

export default function GetEmailTypeConfiguration({ value = "", fn, error, helperText }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetEmailTypeConfiguration, {}, "GET", {});
        setShow(false)
        if (apiResponse?.data?.isSuccess) {
            setCountryList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setCountryList([]);
      setShow(false)
    }
  };

  useEffect(() => {
    CountryList();
  }, []);

  

  return (
    <FormControl fullWidth size="small" required error={error}>
      <InputLabel>Method Type</InputLabel>
      <Select
        value={value || ''}
        label="Method Type"
        name="emailType"
        onChange={(e) => {
          if (fn) fn(e);
        }}
        disabled={show}
      >
        <MenuItem value="">
          <em>Select Method Type</em>
        </MenuItem>
        {countryList?.map((item, i) => (
          <MenuItem key={i} value={item?.id}>
            {item?.name}
          </MenuItem>
        ))}
      </Select>
      {show && (
        <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
          <CircularProgress size={20} />
        </Box>
      )}
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}


