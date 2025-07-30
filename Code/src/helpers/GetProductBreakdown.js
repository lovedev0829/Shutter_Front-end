import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Box
} from '@mui/material';

export default function GetProductBreakdown({ value = "", fn, name = "windowProdcutId", disabled = false, className = null, EstimationId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { EstimationId: EstimationId }
            const apiResponse = await callAPI(apiUrls.GetProductBreakdown, query, "GET", {});
            setShow(false)
            if (apiResponse?.data?.isSuccess) {
                setproductList(apiResponse?.data?.data)
            } else {
            }
        } catch (error) {
            setShow(false)
            setproductList([]);
        }
    };

    useEffect(() => {
        if (!EstimationId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [EstimationId]);
    

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
          <InputLabel id={`${name}-label`}>Choose Product</InputLabel>
          <Select
            labelId={`${name}-label`}
            value={value}
            name={name}
            onChange={(e) => {
              if (fn) fn(e);
            }}
            label="Choose Product"
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
              <em style={{ color: '#999' }}>Choose Product</em>
            </MenuItem>
            {productList?.map((item, i) => {
              return (
                <MenuItem 
                  key={i} 
                  value={item?.windowProductIds}
                  selected={item?.windowProductIds === value ? true : false}
                >
                  {item?.productName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        </Box>
    );
}


