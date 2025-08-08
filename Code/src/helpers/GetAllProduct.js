import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  CircularProgress
} from "@mui/material";
export default function GetAllProduct({ value = "", fn, load, name = "productId", disabled = false, className = null, producttypeId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { ProductTypeId: producttypeId }
            const apiResponse = await callAPI(apiUrls.GetAllProduct, query, "GET", {});
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
        if (!producttypeId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [producttypeId, load]);
    

    return (
        <Box sx={{ position: 'relative', minWidth: 120 }}>
            <FormControl fullWidth disabled={disabled} size="small">
               
                <Select
                    labelId={`product-select-label-${name}`}
                    value={value || ""}
                    name={name}
                    onChange={(e) => {
                        if (fn) fn(e);
                    }}
                    disabled={disabled || show}
                    className={className}
                    sx={{
                        fontSize: '14px',
                        '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1976d2'
                        }
                    }}
                    startAdornment={
                        show && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <CircularProgress size={16} sx={{ color: '#1976d2' }} />
                            </Box>
                        )
                    }
                >
                    <MenuItem value="" disabled>
                        <em style={{ color: '#999', fontSize: '14px' }}>Choose Product</em>
                    </MenuItem>
                    {productList?.map((item, i) => (
                        <MenuItem 
                            key={i} 
                            value={item?.productId}
                            sx={{
                                fontSize: '14px',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.12)'
                                    }
                                }
                            }}
                        >
                            {item?.productName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {show && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                    }}
                >
                    <SelectBoxLoader />
                </Box>
            )}
        </Box>
    );
}


