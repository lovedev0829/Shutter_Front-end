import { useEffect, useState } from "react";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Box,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
export default function GetAllGHLUsers({
  value = "",
  fn,
  load,
  name = "",
  className = null,
}) {
  const [productList, setproductList] = useState([]);
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const productlist = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllGHL_Users, {}, "GET", {});
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setproductList(apiResponse?.data?.data);
        console.log(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false);
      setproductList([]);
    }
  };

  useEffect(() => {
    productlist();
    // eslint-disable-next-line
  }, [load]);

  return (
    <Box sx={{ position: 'relative', minWidth: 120 }}>
      <FormControl 
        fullWidth 
        size={isMobile ? "small" : "medium"}
        disabled={show}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&.Mui-focused': {
              color: '#3b82f6',
            },
          },
        }}
      >
        <InputLabel 
          id="ghl-users-select-label"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 500,
          }}
        >
          Choose GHL Users
        </InputLabel>
        <Select
          labelId="ghl-users-select-label"
          value={value}
          name={name}
          label="Choose GHL Users"
          onChange={(e) => {
            if (fn) fn(e);
          }}
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '& .MuiSelect-select': {
              padding: isMobile ? '10px 14px' : '12px 14px',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                '& .MuiMenuItem-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '8px 12px', sm: '10px 16px' },
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#e0f2fe',
                    '&:hover': {
                      backgroundColor: '#b3e5fc',
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" sx={{ fontStyle: 'italic', color: '#6b7280' }}>
            <em>Choose GHL Users</em>
          </MenuItem>
          {productList?.map((item, i) => (
            <MenuItem 
              key={item?.ghlUserId || i} 
              value={item?.ghlUserId}
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              {item?.ghlUserName}
            </MenuItem>
          ))}
        </Select>
        
        {/* Loading Indicator */}
        {show && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 40,
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress 
              size={isMobile ? 16 : 20} 
              sx={{ color: '#3b82f6' }}
            />
          </Box>
        )}
      </FormControl>
    </Box>
  );
}
