import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  PreviewFiles,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import GetAllProduct from "../../../helpers/GetAllProduct";
import { PostImage } from "../../../utils/apiCall";
import GetAllOptions from "../../../helpers/GetAllOptions";
import GetAllForedit from "./GetAllForedit";
import AddEditProduct from "../Products/AddEditProduct";
import AddEditProductType from "../ProductType/AddEditProductType";
import AddEditOption from "../Option/AddEditOption";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  FormHelperText,
  CircularProgress,
  Fade
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon
} from "@mui/icons-material";

function AddEditWindow({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  listdata,
  resetObject,
}) {
  const defaultState = {
    contactId: listdata?.contactId,
    addressId: listdata?.addressId,
    jobId: listdata?.jobId,
    quantity: "",
    label: "",
    width: "",
    height: "",
    archHeight: null,
    notes: "",
    photo: [],
    windowProducts: [
      {
        productId: "",
        productTypeId: "",
        optionTypeId: [],
        buildWidth: "",
        buildHeight: "",
      },
    ],
  };

  // Main state
  const [value, setValue] = useState(object || defaultState);
  
  // Option-related state
  const [optionName, setOptionName] = useState([]);
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [optionMapping, setOptionMapping] = useState([]);
  
  // UI state
  const [show, setShow] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [popupMode, setPopupMode] = useState("");
  const [activeOptionsTab, setActiveOptionsTab] = useState("options");
  
  // Modal states
  const [vendor, setvendor] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [option, setoption] = useState(false);
  
  // Data states
  const [vendorlist, setvendorlist] = useState(false);
  const [optionlist, setoptionlist] = useState(false);
  const [countryList, setCountryList] = useState([]);
  
  // Validator
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    setValue((val) => {
      if (index !== null && name === "productId") {
        const updatedProducts = [...val.windowProducts];
        updatedProducts[index][name] = value;
        return { ...val, windowProducts: updatedProducts };
      }
      return { ...val, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
      return;
    }

    try {
      setLoader(true);
      const submissionData = { ...value, additionalCosts };
      const apiResponse = await callAPI(
        action === "add" ? apiUrls.WindowCreate : apiUrls.WindowUpdate,
        {},
        "POST",
        submissionData
      );
      
      if (apiResponse?.data?.isSuccess) {
        SuccessMessage(apiResponse?.data?.message);
        await LanguageListAPI();
        handleClearState();
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage("An error occurred while saving the window.");
    } finally {
      setLoader(false);
    }
  };
  const fetchProductTypes = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllProductType, {}, "GET");
      
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setCountryList([]);
    } finally {
      setShow(false);
    }
  };
  const addProduct = () => {
    const newProduct = {
      productId: "",
      productTypeId: "",
      optionTypeId: [],
      buildWidth: "",
      buildHeight: "",
      additionalCost: 0,
    };
    
    setValue((prev) => ({
      ...prev,
      windowProducts: [...prev.windowProducts, newProduct]
    }));
  };

  const handleproduct = (e, i) => {
    const { name, value, type } = e.target;
    setValue((prev) => {
      const updatedProducts = [...prev.windowProducts];
      if (name === "optionTypeId" && type === "radio") {
        // For radio buttons, we receive an array of all selected option values
        updatedProducts[i][name] = Array.isArray(value) ? value : [value];
      } else {
        updatedProducts[i][name] = value;
      }
      return { ...prev, windowProducts: updatedProducts };
    });
  };

  const deleteProduct = (index) => {
    // Remove product from window products
    setValue((prev) => ({
      ...prev,
      windowProducts: prev.windowProducts.filter((_, i) => i !== index)
    }));

    // Helper function to update indexed arrays
    const updateIndexedArray = (array) => 
      array
        .filter((entry) => entry.indexId !== index)
        .map((entry) => ({
          ...entry,
          indexId: entry.indexId > index ? entry.indexId - 1 : entry.indexId,
        }));

    // Update all option-related state arrays
    setOptionName(updateIndexedArray);
    setAdditionalCosts(updateIndexedArray);
    setOptionMapping(updateIndexedArray);

    // Clear validator fields if no products remain
    if (value.windowProducts.length <= 1) {
      simpleValidator.current.purgeFields([
        "productTypeId",
        "productId", 
        "buildWidth",
        "buildHeight",
      ]);
    }
  };

  const removeOption = (productIndex, optionLabel) => {
    // Find the optionTypeId that corresponds to this option using optionMapping
    let optionTypeIdToRemove = null;
    const mappingEntry = optionMapping.find(entry => entry.indexId === productIndex);
    if (mappingEntry && mappingEntry.data[optionLabel]) {
      optionTypeIdToRemove = mappingEntry.data[optionLabel];
    }
    
    // Remove from optionName state
    setOptionName((prevOptionName) => {
      return prevOptionName.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          delete updatedData[optionLabel];
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove from additionalCosts state
    setAdditionalCosts((prevAdditionalCosts) => {
      return prevAdditionalCosts.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          // Remove all additional costs that match the option label pattern
          Object.keys(updatedData).forEach((key) => {
            if (key.includes(optionLabel.replace(`-${productIndex}`, ""))) {
              delete updatedData[key];
            }
          });
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove from optionMapping state
    setOptionMapping((prevMapping) => {
      return prevMapping.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          delete updatedData[optionLabel];
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove the optionTypeId from windowProducts
    if (optionTypeIdToRemove) {
      setValue((prevValue) => {
        const updatedProducts = [...prevValue.windowProducts];
        if (updatedProducts[productIndex] && updatedProducts[productIndex].optionTypeId) {
          updatedProducts[productIndex].optionTypeId = updatedProducts[productIndex].optionTypeId.filter(
            (id) => id !== optionTypeIdToRemove
          );
        }
        return { ...prevValue, windowProducts: updatedProducts };
      });
    }
  };

  useEffect(() => {
    setValue(action === "edit" ? object : defaultState);
    fetchProductTypes();
    setvendorlist(false);
    setoptionlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const UploadImage = async (e) => {
    setImageLoader(true);
    let file = [...e.target.files];
    const path = await PostImage(file);
    setImageLoader(false);
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

  const handleClearState = () => {
    setValue(defaultState);
    setShowOptionsPopup(false);
    setOptionName([]);
    setAdditionalCosts([]);
    setOptionMapping([]);
    simpleValidator.current.hideMessages();
    forceUpdate();
    resetObject?.();
    handleclose();
  };

  const handleImageDelete = (index) => {
    setValue((prev) => ({
      ...prev,
      photo: prev.photo?.filter((_, i) => i !== index) || []
    }));
  };

  const refreshVendorList = () => setvendorlist((prev) => !prev);
  const refreshProductTypes = () => fetchProductTypes();
  const refreshOptionList = () => setoptionlist((prev) => !prev);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClearState}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {action === "add" ? "Add New Window" : "Update Window"}
            </Typography>
            <IconButton
              onClick={handleClearState}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  color: '#1976d2', 
                  fontWeight: 600,
                  borderLeft: '4px solid #1976d2',
                  paddingLeft: 2
                }}
              >
                Window Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    placeholder="Enter window qty"
                    type="text"
                    name="quantity"
                    value={value.quantity}
                    onChange={handleChange}
                    required
                    size="small"
                    error={!!simpleValidator.current.message("quantity", value?.quantity, "required|numeric")}
                    helperText={simpleValidator.current.message("quantity", value?.quantity, "required|numeric")}
                    sx={{
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
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Window Label"
                    placeholder="e.g., Living Room Window 1"
                    type="text"
                    name="label"
                    value={value.label}
                    onChange={handleChange}
                    required
                    size="small"
                    error={!!simpleValidator.current.message("label", value?.label, "required")}
                    helperText={simpleValidator.current.message("label", value?.label, "required")}
                    sx={{
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
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                    Dimensions
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Width"
                    placeholder="Width (entered in Inches)"
                    type="text"
                    name="width"
                    value={value.width}
                    onChange={handleChange}
                    required
                    size="small"
                    error={!!simpleValidator.current.message("width", value?.width, "required|numeric")}
                    helperText={simpleValidator.current.message("width", value?.width, "required|numeric")}
                    sx={{
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
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Height"
                    placeholder="Height (entered in Inches)"
                    type="text"
                    name="height"
                    value={value.height}
                    onChange={handleChange}
                    required
                    size="small"
                    error={!!simpleValidator.current.message("height", value?.height, "required|numeric")}
                    helperText={simpleValidator.current.message("height", value?.height, "required|numeric")}
                    sx={{
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
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Arch Height"
                    placeholder="Arch (entered in Inches)"
                    type="text"
                    name="archHeight"
                    value={value.archHeight || ""}
                    onChange={handleChange}
                    size="small"
                    error={!!simpleValidator.current.message("archHeight", value?.archHeight, "numeric")}
                    helperText={simpleValidator.current.message("archHeight", value?.archHeight, "numeric")}
                    sx={{
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
                  />
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#1976d2', 
                    fontWeight: 600,
                    borderLeft: '4px solid #1976d2',
                    paddingLeft: 2
                  }}
                >
                  Product Configuration
                </Typography>
                <Button
                  onClick={addProduct}
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{
                    color: '#1976d2',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                  }}
                >
                  Add Product
                </Button>
              </Box>
              
              {value.windowProducts !== undefined &&
                value.windowProducts.length > 0 &&
                value?.windowProducts?.map((val, i) => (
                  <Paper key={i} elevation={1} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Product {i + 1}
                        </Typography>
                        {value.windowProducts.length > 1 && (
                          <IconButton
                            onClick={() => deleteProduct(i)}
                            size="small"
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        {/* Product Type & Product Selection Row */}
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                              Product Type <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            {HasPermission("ProductTypeAdd") && (
                              <IconButton
                                size="small"
                                onClick={() => setproducttype(true)}
                                sx={{ 
                                  color: '#1976d2',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          
                          <FormControl fullWidth size="small" error={!!simpleValidator.current.message("Product type", val?.productTypeId, "required")}>
                            <InputLabel>Choose Product Type</InputLabel>
                            <Select
                              value={val?.productTypeId || ""}
                              label="Choose Product Type"
                              name="productTypeId"
                              onChange={(e) => handleproduct(e, i)}
                              disabled={show}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  }
                                }
                              }}
                            >
                              <MenuItem value="">
                                <em>Choose Product Type</em>
                              </MenuItem>
                              {countryList?.map((vals, idx) => (
                                <MenuItem key={idx} value={vals.productId}>
                                  {vals.productName}
                                </MenuItem>
                              ))}
                            </Select>
                            {simpleValidator.current.message("Product type", val?.productTypeId, "required") && (
                              <FormHelperText>
                                {simpleValidator.current.message("Product type", val?.productTypeId, "required")}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                              Select Product <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            {HasPermission("ProductsAdd") && (
                              <IconButton
                                size="small"
                                onClick={() => setvendor(true)}
                                sx={{ 
                                  color: '#1976d2',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            <GetAllProduct
                              fn={(e) => handleproduct(e, i)}
                              value={val.productId}
                              name="productId"
                              load={vendorlist}
                              producttypeId={val.productTypeId}
                            />
                            {simpleValidator.current.message("product", val?.productId, "required") && (
                              <FormHelperText error sx={{ mt: 1 }}>
                                {simpleValidator.current.message("product", val?.productId, "required")}
                              </FormHelperText>
                            )}
                          </Box>
                        </Grid>


                        
                        {/* Build Dimensions Row */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#555', mb: 1 }}>
                            Build Dimensions <span style={{ color: 'red' }}>*</span>
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              label="Width (in)"
                              placeholder="Build Width"
                              type="text"
                              name="buildWidth"
                              value={val.buildWidth}
                              onChange={(e) => handleproduct(e, i)}
                              required
                              size="small"
                              error={!!simpleValidator.current.message("Width", val?.buildWidth, "required|numeric")}
                              helperText={simpleValidator.current.message("Width", val?.buildWidth, "required|numeric")}
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  }
                                }
                              }}
                            />
                            
                            <TextField
                              label="Height (in)"
                              placeholder="Build Height"
                              type="text"
                              name="buildHeight"
                              value={val.buildHeight}
                              onChange={(e) => handleproduct(e, i)}
                              required
                              size="small"
                              error={!!simpleValidator.current.message("Height", val?.buildHeight, "required|numeric")}
                              helperText={simpleValidator.current.message("Height", val?.buildHeight, "required|numeric")}
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                        
                        {/* Options Section */}
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                              Product Options
                            </Typography>
                            {HasPermission("OptionsAdd") && (
                              <IconButton
                                size="small"
                                onClick={() => setoption(true)}
                                sx={{ 
                                  color: '#1976d2',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          
                          {/* Options Display Area */}
                          <Box sx={{ minHeight: 60, backgroundColor: '#fafafa', borderRadius: 1, p: 2, border: '1px dashed #ddd' }}>
                            {action === "edit" && (
                              <>
                                <div className="new-option-wrapper">
                                  {optionName
                                    .filter((entry) => entry.indexId === i)
                                    .map((entry) => (
                                      <div key={entry.indexId} className="mb-3">
                                        <ul className="list-unstyled new-option-main">
                                          {Object.entries(entry.data).map(([label, value], idx) => (
                                            <li key={idx} className="new-option-li d-flex justify-content-between align-items-center">
                                              <Chip
                                                label={`${label.replace(new RegExp(`-${i}$`), "")} - ${value}`}
                                                onDelete={() => removeOption(i, label)}
                                                deleteIcon={<CloseIcon />}
                                                size="small"
                                                sx={{ 
                                                  mr: 1, 
                                                  mb: 1,
                                                  backgroundColor: '#e3f2fd',
                                                  color: '#1976d2'
                                                }}
                                              />
                                            </li>
                                          ))}
                                          {Object.keys(entry.data).length > 0 && (
                                            <IconButton
                                              size="small"
                                              onClick={() => {
                                                setActiveProductIndex(i);
                                                setShowOptionsPopup(true);
                                                setPopupMode(action);
                                              }}
                                              sx={{ 
                                                color: '#1976d2',
                                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                              }}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </ul>
                                      </div>
                                    ))}
                                </div>

                                <GetAllForedit
                                  fn={(e) => handleproduct(e, i)}
                                  values={val.optionTypeId}
                                  optiondata={val.optionTypeId}
                                  name="optionTypeId"
                                  load={optionlist}
                                  producttypeId={val.productId}
                                  indexId={i}
                                  optionName={optionName}
                                  setOptionName={setOptionName}
                                  additionalCosts={additionalCosts}
                                  setAdditionalCosts={setAdditionalCosts}
                                  isRender={false}
                                  buildRequirement={false}
                                  showOptionsPopup={false}
                                  optionMapping={optionMapping}
                                  setOptionMapping={setOptionMapping}
                                />
                              </>
                            )}
                            
                            {action === "add" && (
                              <>
                                {optionName
                                  .filter((entry) => entry.indexId === i)
                                  .map((entry) => (
                                    <div key={entry.indexId} className="mb-3">
                                      <ul className="list-unstyled new-option-main">
                                        {Object.entries(entry.data).map(([label, value], idx) => (
                                          <li key={idx} className="new-option-li d-flex justify-content-between align-items-center">
                                            <Chip
                                              label={`${label.replace(new RegExp(`-${i}$`), "")} - ${value}`}
                                              onDelete={() => removeOption(i, label)}
                                              deleteIcon={<CloseIcon />}
                                              size="small"
                                              sx={{ 
                                                mr: 1, 
                                                mb: 1,
                                                backgroundColor: '#e3f2fd',
                                                color: '#1976d2'
                                              }}
                                            />
                                          </li>
                                        ))}
                                        {Object.keys(entry.data).length > 0 && (
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              setActiveProductIndex(i);
                                              setShowOptionsPopup(true);
                                              setPopupMode(action);
                                            }}
                                            sx={{ 
                                              color: '#1976d2',
                                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                            }}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </ul>
                                    </div>
                                  ))}
                                  
                                <GetAllOptions
                                  fn={(e) => handleproduct(e, i)}
                                  value={val.optionTypeId}
                                  name="optionTypeId"
                                  load={optionlist}
                                  producttypeId={val.productId}
                                  indexId={i}
                                  optionName={optionName}
                                  setOptionName={setOptionName}
                                  additionalCosts={additionalCosts}
                                  setAdditionalCosts={setAdditionalCosts}
                                  isRender={false}
                                  buildRequirement={false}
                                  showOptionsPopup={false}
                                  optionMapping={optionMapping}
                                  setOptionMapping={setOptionMapping}
                                />
                              </>
                            )}
                            
                            {/* Add Options Button */}
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                setActiveProductIndex(i);
                                setShowOptionsPopup(true);
                                setPopupMode(action);
                              }}
                              sx={{
                                mt: 2,
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                textTransform: 'none',
                                '&:hover': {
                                  borderColor: '#1976d2',
                                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                }
                              }}
                            >
                              Add Options
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                ))}
            </Box>


                      <Dialog
                        open={showOptionsPopup}
                        onClose={() => {
                          setShowOptionsPopup(false);
                          setoptionlist((prev) => !prev); // Force refresh of inline components
                        }}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                          sx: {
                            maxHeight: '80vh',
                            borderRadius: 2,
                            boxShadow: 24,
                          }
                        }}
                      >
                        <DialogTitle sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderBottom: 1,
                          borderColor: 'divider',
                          pb: 2
                        }}>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                            Add Option
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {HasPermission("OptionsAdd") && (
                              <IconButton
                                color="primary"
                                onClick={() => setoption(true)}
                                sx={{
                                  bgcolor: 'primary.light',
                                  '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => {
                                setShowOptionsPopup(false);
                                setoptionlist((prev) => !prev); // Force refresh of inline components
                              }}
                              sx={{ 
                                color: 'grey.500',
                                '&:hover': { 
                                  bgcolor: 'grey.100',
                                  color: 'grey.700'
                                }
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 0 }}>
                          {/* Tab Navigation */}
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                              value={activeOptionsTab}
                              onChange={(event, newValue) => setActiveOptionsTab(newValue)}
                              sx={{
                                '& .MuiTab-root': {
                                  textTransform: 'none',
                                  fontSize: '1rem',
                                  fontWeight: 500,
                                  minWidth: 120,
                                },
                                '& .MuiTabs-indicator': {
                                  height: 3,
                                }
                              }}
                            >
                              <Tab
                                label="Options"
                                value="options"
                                sx={{
                                  '&.Mui-selected': {
                                    color: 'primary.main',
                                    fontWeight: 600,
                                  }
                                }}
                              />
                              <Tab
                                label="Build Requirements"
                                value="buildRequirements"
                                sx={{
                                  '&.Mui-selected': {
                                    color: 'primary.main',
                                    fontWeight: 600,
                                  }
                                }}
                              />
                            </Tabs>
                          </Box>

                          {/* Tab Content */}
                          <Box sx={{ p: 3 }}>
                            <Fade in={true} timeout={300}>
                              <Box>
                                {popupMode === "add" ? (
                                  <GetAllOptions
                                    fn={(e) =>
                                      handleproduct(e, activeProductIndex)
                                    }
                                    value={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId || []
                                    }
                                    name="optionTypeId"
                                    load={optionlist}
                                    producttypeId={
                                      value.windowProducts[activeProductIndex]
                                        ?.productId
                                    }
                                    indexId={activeProductIndex}
                                    optionName={optionName}
                                    setOptionName={setOptionName}
                                    additionalCosts={additionalCosts}
                                    setAdditionalCosts={setAdditionalCosts}
                                    buildRequirement={activeOptionsTab === 'buildRequirements'}
                                    showOptionsPopup={showOptionsPopup}
                                  />
                                ) : (
                                  <GetAllForedit
                                    fn={(e) =>
                                      handleproduct(e, activeProductIndex)
                                    }
                                    values={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId
                                    }
                                    optiondata={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId
                                    }
                                    name="optionTypeId"
                                    load={optionlist}
                                    producttypeId={
                                      value.windowProducts[activeProductIndex]
                                        ?.productId
                                    }
                                    indexId={activeProductIndex}
                                    optionName={optionName}
                                    setOptionName={setOptionName}
                                    additionalCosts={additionalCosts}
                                    setAdditionalCosts={setAdditionalCosts}
                                    buildRequirement={activeOptionsTab === 'buildRequirements'}
                                    showOptionsPopup={showOptionsPopup}
                                  />
                                )}
                              </Box>
                            </Fade>
                          </Box>
                        </DialogContent>

                        <DialogActions sx={{ 
                          borderTop: 1, 
                          borderColor: 'divider',
                          p: 3,
                          gap: 2
                        }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setShowOptionsPopup(false);
                              setoptionlist((prev) => !prev); // Force refresh of inline components
                            }}
                            sx={{
                              textTransform: 'none',
                              px: 4,
                              py: 1.5,
                              fontWeight: 600,
                              borderRadius: 2,
                              boxShadow: 2,
                              '&:hover': {
                                boxShadow: 4,
                              }
                            }}
                          >
                            Submit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              setShowOptionsPopup(false);
                              setoptionlist((prev) => !prev); // Force refresh of inline components
                            }}
                            sx={{
                              textTransform: 'none',
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                                bgcolor: 'secondary.light',
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>

            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  color: '#1976d2', 
                  fontWeight: 600,
                  borderLeft: '4px solid #1976d2',
                  paddingLeft: 2
                }}
              >
                Additional Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Add Notes"
                    placeholder="Add notes"
                    multiline
                    rows={3}
                    name="notes"
                    value={value.notes}
                    onChange={handleChange}
                    size="small"
                    sx={{
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
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: '#666' }}>
                      Upload Photos
                    </Typography>
                    
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        sx={{
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          '&:hover': {
                            borderColor: '#1976d2',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                          },
                          width: '100%',
                          py: 1.5
                        }}
                        disabled={imageLoader}
                      >
                        {imageLoader ? (
                          <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Uploading...
                          </>
                        ) : (
                          'Choose Files'
                        )}
                        <input
                          type="file"
                          hidden
                          accept="image/png,image/jpg,image/jpeg"
                          multiple
                          onChange={UploadImage}
                        />
                      </Button>
                    </Box>

                    <PreviewFiles
                      file={value?.photo}
                      isdelete={true}
                      handleImageDelelet={handleImageDelete}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, justifyContent: 'flex-start', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loader}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                },
                textTransform: 'none',
                px: 4,
                py: 1
              }}
              startIcon={loader && <CircularProgress size={16} color="inherit" />}
            >
              {loader ? 'Processing...' : (action === "add" ? "Submit" : "Update")}
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleClearState}
              sx={{
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#666',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                textTransform: 'none',
                px: 4,
                py: 1
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {vendor && (
        <AddEditProduct
          open={vendor}
          handleclose={() => setvendor(false)}
          action="add"
          LanguageListAPI={refreshVendorList}
          object=""
        />
      )}
      
      {option && (
        <AddEditOption
          open={option}
          handleclose={() => setoption(false)}
          action="add"
          LanguageListAPI={refreshOptionList}
          object=""
        />
      )}

      {producttype && (
        <AddEditProductType
          open={producttype}
          handleclose={() => setproducttype(false)}
          action="add"
          LanguageListAPI={refreshProductTypes}
          object=""
        />
      )}
    </>
  );
}

export default AddEditWindow;
