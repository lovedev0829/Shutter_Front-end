import { useEffect, useState, useCallback } from "react";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Box,
  InputLabel 
} from "@mui/material";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function JobTypeDropdown({ value = "", fn, load }) {
  const [jobTypeList, setJobTypeList] = useState([]);
  const [show, setShow] = useState(false);
  
  const fetchJobTypes = useCallback(async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllJobType, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setJobTypeList(apiResponse?.data?.data);
      } else {
        // Keep original behavior - no error handling
      }
    } catch (error) {
      setShow(false);
      setJobTypeList([]);
    }
  }, []);

  useEffect(() => {
    fetchJobTypes();
  }, [fetchJobTypes, load]);

  return (
    <Box sx={{ position: 'relative', minWidth: 120 }}>
      <FormControl fullWidth size="small" variant="outlined">
        <Select
          value={value}
          name="jobType"
          onChange={(e) => {
            if (fn) fn(e);
          }}
          disabled={show}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            }
          }}
        >
          <MenuItem value="0">
            Select Job Type
          </MenuItem>
          {jobTypeList?.map((item, i) => {
            return (
              <MenuItem 
                key={i} 
                value={item?.jobTypeId}
                selected={item?.jobTypeId === value ? true : false}
              >
                {item?.jobTypeName}
              </MenuItem>
            );
          })}
        </Select>
        {show && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <CircularProgress size={20} />
          </Box>
        )}
      </FormControl>
    </Box>
  );
}


