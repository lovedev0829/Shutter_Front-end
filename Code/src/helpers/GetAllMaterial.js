import { useEffect, useState } from "react";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Box,
  CircularProgress,
  InputLabel
} from '@mui/material';
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

export default function GetAllMaterial({ value = "", fn, load, className = null, name = "materialId" ,Materials=[],VendorId}) {
  const [MaterialList, setMaterialList] = useState([]);
  const [show, setShow] = useState(false);
  const Materiallist = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllIMaterial, {VendorId:VendorId}, "GET");
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setMaterialList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false)
      setMaterialList([]);
    }
  };

  useEffect(() => {
    Materiallist();
    // eslint-disable-next-line
  }, [load,VendorId]);

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
          labelId="material-select-label"
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
              Select Material
            </Typography>
          </MenuItem>
          {MaterialList?.map((item, i) => {
            const isDisabled = Materials?.some((items) => items?.materialId === item?.materialId);
            return (
              <MenuItem 
                key={i} 
                value={item?.materialId}
                disabled={isDisabled}
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
                  },
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                    opacity: 0.6,
                  }
                }}
              >
                {item?.materialName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}


