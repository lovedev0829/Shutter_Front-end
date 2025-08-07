import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, PreviewFiles, SelectBoxLoader, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { 
  Button, 
  Stack,
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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import GetAllVendorDropdown from "../../../helpers/GetAllVendorDropdown";
import Selectbox from "../../Form/Selectbox";
import GetAllMaterial from "../../../helpers/GetAllMaterial";
import GetAllJobs from "../../../helpers/GetAllJobs";
import DateInputField from "../../Form/DateInputField";
import { PostImage } from "../../../utils/apiCall";

const VenderOrderAddEdit = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const defaultState = {
    vendorId: "",
    jobId: "",
    orderNumber: "",
    orderDate: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    status: "",
    totalAmount: 0,
    photo:[],
    vendorOrderItems: [
      {
        materialId: "",
        quantity: "",
        unitPrice: "",
      },
    ],
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [shows, setShows] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
        const data = { ...value, status: Number(value?.status) };
        delete value.totalAmount;
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.VendorOrderCreate
            : apiUrls.VendorOrderUpdate,
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
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);
  const AddContactPerson = () => {
    const newArray = value?.vendorOrderItems;
    newArray.push({
      quantity: "",
      unitPrice: "",
    });
    setValue((val) => {
      return { ...val, vendorOrderItems: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = [...value.vendorOrderItems];
    newArray.splice(i, 1);
    const sum = newArray.reduce((acc, current) => {
      const amount =
        (parseFloat(current.unitPrice) || 0) *
        (parseFloat(current.quantity) || 0);
      return acc + amount;
    }, 0);

    setValue((val) => {
      return {
        ...val,
        vendorOrderItems: newArray,
        totalAmount: sum,
      };
    });
    if (newArray.length <= 0) {
      simpleValidator.current.purgeFields([
        "materialId",
        "quantity",
        "unitPrice",
      ]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = [...value.vendorOrderItems];
    const key = e.target.name;
    if (key === "quantity") {
      newArray[i].quantity = e.target.value;
    } else if (key === "unitPrice") {
      newArray[i].unitPrice = e.target.value;
    } else if (key === "materialId") {
      newArray[i].materialId = e.target.value;
    }
    const sum = newArray.reduce((acc, current) => {
      const amount =
        (parseFloat(current.unitPrice) || 0) *
        (parseFloat(current.quantity) || 0);
      return acc + amount;
    }, 0);

    setValue((val) => ({
      ...val,
      vendorOrderItems: newArray,
      totalAmount: sum,
    }));
  };
  const handleImageDelelet=(data)=>{
    const arr =value?.photo?.filter((val,i)=> i !== data)
    setValue((val) => {
      return { ...val, photo: arr };
    });
  }

   const UploadImage = async (e) => {
       setShows(true)
       let file = ([...e.target.files])
       const path = await PostImage(file);
       setShows(false)
       if (path) {
        setValue((val) => {
          return {
            ...val,
            photo: [...(val.photo || []), ...path],
          };
        });
       } 
         e.target.value = null;
     };
  return (
    <>
      <Dialog
        open={open}
        fullScreen={isMobile}
        maxWidth={isMobile ? false : "md"}
        fullWidth={!isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : '12px',
            margin: isMobile ? 0 : 3,
            maxHeight: isMobile ? '100vh' : '90vh',
            width: isMobile ? '100vw' : { xs: '90vw', sm: '80vw', md: '70vw' },
            maxWidth: isMobile ? '100vw' : '900px',
          },
        }}
        aria-labelledby="vendor-order-dialog-title"
      >
        <DialogTitle 
          id="vendor-order-dialog-title"
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
            {action === "add" ? "Add Vendor Order" : "Update Vendor Order"}
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
              maxHeight: { 
                xs: 'calc(100vh - 120px)', 
                sm: 'calc(90vh - 180px)',
                md: 'calc(90vh - 160px)' 
              },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f5f9',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: '3px',
              },
            }}
          >
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
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
                    Vendor <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <GetAllVendorDropdown
                    value={value.vendorId}
                    fn={handleChange}
                    load={true}
                    className="selectboxdropdown"
                    name="vendorId"
                  />
                  {simpleValidator.current.message("Vendor", value?.vendorId, "required") && (
                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                      {simpleValidator.current.message("Vendor", value?.vendorId, "required")}
                    </Typography>
                  )}
                </Box>
              </Grid>

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
                    Job <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <GetAllJobs
                    value={value.jobId}
                    fn={handleChange}
                    load={true}
                    className="selectboxdropdown"
                    name="jobId"
                  />
                  {simpleValidator.current.message("Job", value?.jobId, "required") && (
                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                      {simpleValidator.current.message("Job", value?.jobId, "required")}
                    </Typography>
                  )}
                </Box>
              </Grid>

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
                    Order Number <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Order Number"
                    name="orderNumber"
                    value={value.orderNumber}
                    onChange={handleChange}
                    size="small"
                    required
                    error={!!simpleValidator.current.message("orderNumber", value?.orderNumber, "required")}
                    helperText={simpleValidator.current.message("orderNumber", value?.orderNumber, "required")}
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
                    }}
                  />
                </Box>
              </Grid>

              {/* Section Divider */}
              <Grid item xs={12}>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      color: '#1e293b',
                      px: 2,
                    }}
                  >
                    Add Items
                  </Typography>
                </Divider>
              </Grid>
              {/* Dynamic Items */}
              {value?.vendorOrderItems !== undefined &&
                value?.vendorOrderItems?.length > 0 &&
                value?.vendorOrderItems?.map((val, i) => (
                  <React.Fragment key={i}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        {i === 0 && (
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
                        )}
                        <GetAllMaterial
                          value={val.materialId}
                          fn={(e) => handleContactPerson(e, i)}
                          load={true}
                          className="selectboxdropdown"
                          name="materialId"
                          Materials={value.vendorOrderItems}
                          VendorId={value?.vendorId}
                        />
                        {simpleValidator.current.message("material", val?.materialId, "required") && (
                          <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                            {simpleValidator.current.message("material", val?.materialId, "required")}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        {i === 0 && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 1,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              fontWeight: 500,
                              color: '#374151',
                            }}
                          >
                            Qty <span style={{ color: '#ef4444' }}>*</span>
                          </Typography>
                        )}
                        <TextField
                          fullWidth
                          placeholder="Enter quantity"
                          name="quantity"
                          value={val?.quantity}
                          onChange={(e) => handleContactPerson(e, i)}
                          size="small"
                          error={!!simpleValidator.current.message("quantity", val?.quantity, "required|integer")}
                          helperText={simpleValidator.current.message("quantity", val?.quantity, "required|integer")}
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        {i === 0 && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 1,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              fontWeight: 500,
                              color: '#374151',
                            }}
                          >
                            Unit Price <span style={{ color: '#ef4444' }}>*</span>
                          </Typography>
                        )}
                        <TextField
                          fullWidth
                          placeholder="Enter unit Price"
                          name="unitPrice"
                          value={val?.unitPrice}
                          onChange={(e) => handleContactPerson(e, i)}
                          size="small"
                          error={!!simpleValidator.current.message("unitPrice", val?.unitPrice, "required|numeric")}
                          helperText={simpleValidator.current.message("unitPrice", val?.unitPrice, "required|numeric")}
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: i === 0 ? 'flex-end' : 'center', 
                        justifyContent: 'flex-start',
                        gap: 1,
                        height: '100%',
                        pt: i === 0 ? 3 : 0,
                      }}>
                        {i === value?.vendorOrderItems?.length - 1 && (
                          <IconButton
                            onClick={AddContactPerson}
                            size="small"
                            sx={{
                              color: '#3b82f6',
                              backgroundColor: '#eff6ff',
                              p: { xs: 0.5, sm: 1 },
                              '&:hover': {
                                backgroundColor: '#dbeafe',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        )}
                        {value?.vendorOrderItems?.length > 1 && (
                          <IconButton
                            onClick={() => deleteContactPerson(i)}
                            size="small"
                            sx={{
                              color: '#ef4444',
                              backgroundColor: '#fef2f2',
                              p: { xs: 0.5, sm: 1 },
                              '&:hover': {
                                backgroundColor: '#fee2e2',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </React.Fragment>
                ))}
              
              {/* Total Price Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', sm: 'flex-end' }, 
                  mt: { xs: 1, sm: 1.5 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 }
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        color: '#1e293b',
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      Total Price:
                    </Typography>
                    <TextField
                      disabled
                      value={value?.totalAmount?.toFixed(2) || '0.00'}
                      size="small"
                      sx={{
                        width: { xs: '140px', sm: '150px' },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          fontWeight: 600,
                          color: '#059669',
                          backgroundColor: '#f0fdf4',
                        },
                      }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 0.5, fontWeight: 600 }}>$</Typography>,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              
              {/* Dates Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      color: '#1e293b',
                      px: 2,
                    }}
                  >
                    Dates
                  </Typography>
                </Divider>
              </Grid>

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
                    Order Date <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <DateInputField
                    name="orderDate"
                    value={value?.orderDate}
                    handleChange={handleChange}
                    action={action}
                  />
                  {simpleValidator.current.message("orderDate", value?.orderDate, "required") && (
                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                      {simpleValidator.current.message("orderDate", value?.orderDate, "required")}
                    </Typography>
                  )}
                </Box>
              </Grid>

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
                    Expected Delivery Date <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <DateInputField
                    name="expectedDeliveryDate"
                    value={value?.expectedDeliveryDate}
                    handleChange={handleChange}
                    action={action}
                  />
                  {simpleValidator.current.message("expectedDeliveryDate", value?.expectedDeliveryDate, "required") && (
                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                      {simpleValidator.current.message("expectedDeliveryDate", value?.expectedDeliveryDate, "required")}
                    </Typography>
                  )}
                </Box>
              </Grid>

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
                    Actual Delivery Date <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <DateInputField
                    name="actualDeliveryDate"
                    value={value?.actualDeliveryDate}
                    handleChange={handleChange}
                    action={action}
                  />
                  {simpleValidator.current.message("actualDeliveryDate", value?.actualDeliveryDate, "required") && (
                    <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                      {simpleValidator.current.message("actualDeliveryDate", value?.actualDeliveryDate, "required")}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Additional Fields Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
              </Grid>

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
                    Status <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <FormControl 
                    fullWidth 
                    size="small"
                    error={!!simpleValidator.current.message("status", value?.status, "required")}
                  >
                    <Select
                      name="status"
                      value={value.status}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3b82f6',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
                      <MenuItem value={0}>Pending</MenuItem>
                      <MenuItem value={1}>Approved</MenuItem>
                    </Select>
                    {simpleValidator.current.message("status", value?.status, "required") && (
                      <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                        {simpleValidator.current.message("status", value?.status, "required")}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>

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
                    Notes
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter notes"
                    name="notes"
                    value={value.notes || ''}
                    onChange={handleChange}
                    size="small"
                    multiline
                    rows={3}
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
                    }}
                  />
                </Box>
              </Grid>

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
                    Attachment
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    {shows && <SelectBoxLoader/>}
                    <input
                      type="file"
                      accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                      name="photo"
                      onChange={UploadImage}
                      multiple
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          borderColor: '#d1d5db',
                          color: '#374151',
                          textTransform: 'none',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '&:hover': {
                            borderColor: '#3b82f6',
                            backgroundColor: '#f8fafc',
                          },
                        }}
                      >
                        Choose Files
                      </Button>
                    </label>
                  </Box>
                  <PreviewFiles
                    file={value?.photo}
                    isdelete={true}
                    handleImageDelelet={handleImageDelelet}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />
          
          <DialogActions sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
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
              buttonName={action === "add" ? "Submit" : "Update"}
              disabled={loader}
              loading={loader}
            />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default VenderOrderAddEdit;
