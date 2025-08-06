import { useEffect, useState, useCallback } from "react";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Box
} from "@mui/material";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function AssignedPersonnelDropdown({ value = "", fn, load, name = "assignedPersonnel" }) {
  const [personnelList, setPersonnelList] = useState([]);
  const [show, setShow] = useState(false);
  
  const fetchPersonnel = useCallback(async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllAssignedPerson, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setPersonnelList(apiResponse?.data?.data);
      } else {
        // Keep original behavior - no error handling
      }
    } catch (error) {
      setShow(false);
      setPersonnelList([]);
    }
  }, []);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel, load]);

  return (
    <Box sx={{ position: 'relative', minWidth: 120 }}>
      <FormControl fullWidth size="small" variant="outlined">
        <Select
          value={value || ""}
          name={name}
          onChange={(e) => {
            if (fn) fn(e);
          }}
          disabled={show}
          displayEmpty
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            }
          }}
        >
          <MenuItem value="">
            Select Assigned Personnel
          </MenuItem>
          {personnelList?.map((item, i) => {
            return (
              <MenuItem 
                key={i} 
                value={item?.userId}
                selected={item?.userId === value ? true : false}
              >
                {item?.firstName} {item?.lastName} {(item?.suffix ?? "")}
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


