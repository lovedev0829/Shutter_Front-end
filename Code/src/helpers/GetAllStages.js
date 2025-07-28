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

export default function GetAllStages({ value = "", fn, load, className = null, name = "ghL_StageId" }) {
  const [stageList, setStageList] = useState([]);
  const [show, setShow] = useState(false);
  
  const fetchStages = useCallback(async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllStages, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setStageList(apiResponse?.data?.data);
      } else {
        // Keep original behavior - no error handling
      }
    } catch (error) {
      setShow(false);
      setStageList([]);
    }
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages, load]);

  return (
    <Box sx={{ position: 'relative', minWidth: 120 }}>
      <FormControl fullWidth size="small" variant="outlined" className={className}>
        <Select
          labelId="ghl-stage-select-label"
          value={value}
          name={name}
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
          <MenuItem value="">
            <em>Select Ghl Stage</em>
          </MenuItem>
          {stageList?.map((item, i) => {
            return (
              <MenuItem 
                key={i} 
                value={item?.ghlStageId}
                selected={item?.ghlStageId === value ? true : false}
              >
                {item?.ghlStageName}
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


