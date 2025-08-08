import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import GetAllMaterial from "../../../helpers/GetAllMaterial";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
const EditVendorMaterial = ({
    open,
    handleclose,
    LanguageListAPI,
    action,
    object,
    vendorOrderId,
    materials,
    vendorId
}) => {
    const defaultState = {

        vendorOrderItemId:"",
        materialId: "",
        quantity: "",
        unitPrice: "",

    }
    const [value, setValue] = useState(object ? object : defaultState);
    const [loader, setLoader] = useState(false);
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        setValue((val) => {
            return { ...val, [e.target.name]: e.target.value };
        });
    };

    const languageAdd = async (e) => {
        e.preventDefault();
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        } else {
            try {
                setLoader(true);
                const data={...value,vendorOrderId:vendorOrderId}
                const apiResponse = await callAPI(
                    action === "add" ? apiUrls.updateVendorOrderItem : apiUrls.updateVendorOrderItem,
                    {},
                    "POST",
                    data    
                );
                setLoader(false);
                if (apiResponse?.data?.isSuccess) {
                    SuccessMessage(apiResponse?.data?.message);
                    await LanguageListAPI();
                    handleclose();
                    setValue(defaultState);
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                } else {
                    ErrorMessage(apiResponse?.data?.message);
                }
            } catch (error) {
                setLoader(false);
            }
        }
    };
    useEffect(() => {
        if (action === "edit") {
            setValue(object);
        } else { setValue(defaultState); }
        // eslint-disable-next-line
    }, [open, action]);
    return (
        <Dialog
            open={open}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: isMobile ? 0 : '12px',
                    margin: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)',
                    width: isMobile ? '100vw' : 'auto',
                },
            }}
            aria-labelledby="edit-vendor-material-dialog-title"
        >
            <DialogTitle 
                id="edit-vendor-material-dialog-title"
                sx={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: '#1e293b',
                    }}
                >
                    {action === "add" ? "Add Vendor Order" : "Update Vendor Order Item"}
                </Typography>
                <IconButton
                    onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                    }}
                    sx={{ 
                        color: '#64748b',
                        '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={languageAdd}>
                <DialogContent 
                    sx={{ 
                        p: { xs: 2, sm: 3 },
                        minHeight: '200px',
                    }}
                >
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {/* Material Selection */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        mb: 1,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        fontWeight: 500,
                                        color: '#374151',
                                    }}
                                >
                                    Material <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <GetAllMaterial
                                    value={value.materialId}
                                    fn={handleChange}
                                    load={true}
                                    className="selectboxdropdown"
                                    name="materialId"
                                    Materials={materials}
                                    VendorId={vendorId}
                                />
                                {simpleValidator.current.message("material", value?.materialId, "required") && (
                                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                                        {simpleValidator.current.message("material", value?.materialId, "required")}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        {/* Quantity Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                placeholder="Enter quantity"
                                name="quantity"
                                value={value?.quantity || ''}
                                onChange={handleChange}
                                size={isMobile ? "small" : "medium"}
                                required
                                error={!!simpleValidator.current.message("quantity", value?.quantity, "required|integer")}
                                helperText={simpleValidator.current.message("quantity", value?.quantity, "required|integer")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        '&.Mui-focused': {
                                            color: '#3b82f6',
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        {/* Unit Price Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Unit Price"
                                placeholder="Enter unit Price"
                                name="unitPrice"
                                value={value?.unitPrice || ''}
                                onChange={handleChange}
                                size={isMobile ? "small" : "medium"}
                                required
                                error={!!simpleValidator.current.message("unitPrice", value?.unitPrice, "required|numeric")}
                                helperText={simpleValidator.current.message("unitPrice", value?.unitPrice, "required|numeric")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        '&.Mui-focused': {
                                            color: '#3b82f6',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />
                
                <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                            setValue(defaultState);
                            handleclose();
                            simpleValidator.current.hideMessages();
                            forceUpdate();
                        }}
                        sx={{
                            textTransform: 'none',
                            textDecoration: 'underline',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            '&:hover': {
                                textDecoration: 'underline',
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <SubmitButton
                        type="submit"
                        className="btn blue-btn"
                        buttonName={action === "add" ? "Submit" : "Update"}
                        disabled={loader}
                        loading={loader}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditVendorMaterial;
