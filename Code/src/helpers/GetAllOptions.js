import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { HasPermission, SelectBoxLoader } from "./common";
import {
  Box,
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider
} from "@mui/material";

export default function GetAllOptions({
  value = [],
  fn,
  load,
  name = "optionTypeId",
  disabled = false,
  producttypeId = "",
  indexId = 0,
  setOptionName = () => {},
  setAdditionalCosts = () => {},
  isRender = true,
  buildRequirement = false,
  showOptionsPopup = false,
  setOptionMapping = () => {}
}) {
  // Main state
  const [optionList, setoptionList] = useState([]);
  const [allOption, setAllOption] = useState([]);
  const [show, setShow] = useState(false);

  // Local state for tracking changes
  const [localOptionName, setLocalOptionName] = useState({});
  const [localAdditionalCosts, setLocalAdditionalCosts] = useState([]);

  const fetchOptions = async () => {
    if (!producttypeId) return;

    try {
      setShow(true);
      const query = {
        productId: producttypeId,
        isManageProductOption: !HasPermission("SubTenantView"),
      };

      const apiResponse = await callAPI(apiUrls.GetAllOption, query, "GET", {});

      if (apiResponse?.data?.isSuccess) {
        let fetchedOptions = apiResponse.data.data.filter((item) => {
          const hasDefault = item.options.some((opt) => opt.isDefault === true);

          if (!hasDefault && item.options.length > 0) {
            // Clone options array and set the first one to default
            const updatedInnerOptions = item.options.map((opt, index) => ({
              ...opt,
              isDefault: index === 0 ? true : opt.isDefault,
            }));

            return {
              ...item,
              options: updatedInnerOptions,
            };
          }
          return item;
        });

        // Filter by buildRequirement when in popup mode
        if (showOptionsPopup) {
          fetchedOptions = fetchedOptions.filter(
            (item) => item.buildRequirement === buildRequirement
          );
        }

        setoptionList(fetchedOptions);

        // Process options for current tab first
        const currentTabSelections = [];
        const selectedOptionDetails = [];
        const optionLabelToIdMapping = {};

        fetchedOptions.forEach((item) => {
          const selectedOptionId = value.find((val) =>
            item.options.some((opt) => opt.optionTypeId === val)
          );

          const finalOption = selectedOptionId
            ? item.options.find((opt) => opt.optionTypeId === selectedOptionId)
            : item.options.find((opt) => opt.isDefault);

          if (finalOption) {
            currentTabSelections.push({
              optionName: `${item.optionId}-${indexId}`,
              value: finalOption.optionTypeId,
            });

            const optionLabel = `${item.optionName}-${indexId}`;
            selectedOptionDetails.push({
              optionGroupName: item.optionName,
              optionType: finalOption.optionType,
            });

            optionLabelToIdMapping[optionLabel] = finalOption.optionTypeId;
          }
        });

        // Update local option names for current tab
        setLocalOptionName((prev) => {
          const newLocalOptionNames = { ...prev };
          selectedOptionDetails.forEach((opt) => {
            const optionLabel = `${opt.optionGroupName}-${indexId}`;
            newLocalOptionNames[optionLabel] = opt.optionType;
          });
          return newLocalOptionNames;
        });

        // Update option mapping
        updateOptionMapping(optionLabelToIdMapping, true);

        // Preserve selections across tabs by only updating current tab's options
        setAllOption((prevAllOptions) => {
          const currentTabOptionIds = new Set(
            fetchedOptions.map(item => `${item.optionId}-${indexId}`)
          );
          
          // Keep selections from other tabs (different buildRequirement)
          const otherTabSelections = prevAllOptions.filter(
            opt => !currentTabOptionIds.has(opt.optionName)
          );

          // Combine other tab selections with current tab selections
          return [...otherTabSelections, ...currentTabSelections];
        });
      } else {
        resetState();
      }
    } catch (error) {
      resetState();
    } finally {
      setShow(false);
    }
  };

  const updateOptionMapping = (optionLabelToIdMapping, isPartialUpdate = false) => {
    if (typeof setOptionMapping === "function") {
      setOptionMapping((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        
        const newEntry = {
          indexId,
          data: isPartialUpdate && existingIndex !== -1
            ? { ...updated[existingIndex].data, ...optionLabelToIdMapping }
            : optionLabelToIdMapping
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
  };

  const resetState = () => {
    setoptionList([]);
    setAllOption([]);
    setLocalOptionName({});
  };

  useEffect(() => {
    if (producttypeId) {
      fetchOptions();
    }
    // eslint-disable-next-line
  }, [producttypeId, load, showOptionsPopup, buildRequirement]);
  // Sync with parent components
  useEffect(() => {
    if (typeof setOptionName === "function") {
      setOptionName((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        const newEntry = { indexId, data: localOptionName };

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
    // eslint-disable-next-line
  }, [localOptionName]);

  useEffect(() => {
    if (typeof setAdditionalCosts === "function") {
      setAdditionalCosts((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        const newEntry = { indexId, data: localAdditionalCosts };   

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
    // eslint-disable-next-line
  }, [localAdditionalCosts]);

  useEffect(() => {
    if (fn) {
      fn({ target: { name, value: allOption.map((obj) => obj.value) } });
    }
    // eslint-disable-next-line
  }, [allOption, name]);

  const handleChangeOption = (e, optionId, optionTypeId, optionGroupName, labelText) => {
    const updatedOption = {
      optionName: `${optionId}-${indexId}`,
      value: optionTypeId,
    };
    
    setAllOption((prevOptions) => {
      const existingIndex = prevOptions.findIndex(
        (opt) => opt.optionName === updatedOption.optionName
      );

      return existingIndex !== -1
        ? prevOptions.map((opt, i) => (i === existingIndex ? updatedOption : opt))
        : [...prevOptions, updatedOption];
    });

    setLocalOptionName((prev) => ({
      ...prev,
      [`${optionGroupName}-${indexId}`]: labelText,
    }));

    // Update option mapping
    updateOptionMapping({ [`${optionGroupName}-${indexId}`]: optionTypeId }, true);
  };

  const handleAdditionalCostChange = (e, optionTypeId, optionGroupName, optionType) => {
    const costValue = e.target.value;
    console.log(optionTypeId)
    setLocalAdditionalCosts((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(cost => cost.optionTypeId.toLowerCase() === optionTypeId.toLowerCase());
      
      if (existingIndex !== -1) {
        updated[existingIndex] = {
          optionTypeId,
          additionalCost: costValue
        };
      } else {
        updated.push({
          optionTypeId,
          additionalCost: costValue
        });
      }
      return updated;
    });
  };

  const handleDoubleClickOption = (optionId, optionGroupName) => {
    const optionKey = `${optionId}-${indexId}`;
    const nameKey = `${optionGroupName}-${indexId}`;

    // Remove from allOption
    setAllOption((prevOptions) =>
      prevOptions.filter((opt) => opt.optionName !== optionKey)
    );

    // Remove from localOptionName
    setLocalOptionName((prev) => {
      const updated = { ...prev };
      delete updated[nameKey];
      return updated;
    });

    // Remove from option mapping
    if (typeof setOptionMapping === "function") {
      setOptionMapping((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);

        if (existingIndex !== -1) {
          const updatedData = { ...updated[existingIndex].data };
          delete updatedData[nameKey];
          updated[existingIndex] = { ...updated[existingIndex], data: updatedData };
        }

        return updated;
      });
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {show && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1
        }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {isRender && (
        <Box sx={{ mt: 2 }}>
          {optionList.length > 0 ? (
            <Grid container spacing={2}>
              {optionList.map((item, i) => (
                <Grid item xs={12} key={i}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        borderColor: '#1976d2',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#1976d2',
                          mb: 2,
                          borderLeft: '3px solid #1976d2',
                          paddingLeft: 2
                        }}
                      >
                        {item?.optionName}
                      </Typography>
                      
                      <RadioGroup
                        name={`${item?.optionId}-${indexId}`}
                        value={
                          allOption.find(
                            (opt) => opt.optionName === `${item?.optionId}-${indexId}`
                          )?.value || ""
                        }
                        onChange={(e) => {
                          const selectedOption = item?.options.find(
                            (opt) => opt.optionTypeId === e.target.value
                          );
                          if (selectedOption) {
                            handleChangeOption(
                              e,
                              item?.optionId,
                              selectedOption.optionTypeId,
                              item?.optionName,
                              selectedOption.optionType
                            );
                          }
                        }}
                        sx={{ gap: 1 }}
                      >
                        {item?.options.map((option, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            gap: 2,
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: allOption.some(
                              (opt) =>
                                opt.optionName === `${item?.optionId}-${indexId}` &&
                                opt.value === option?.optionTypeId
                            ) ? '#f3f8ff' : 'transparent',
                            border: allOption.some(
                              (opt) =>
                                opt.optionName === `${item?.optionId}-${indexId}` &&
                                opt.value === option?.optionTypeId
                            ) ? '1px solid #1976d2' : '1px solid transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#f8f9fa'
                            }
                          }}>
                            <FormControlLabel
                              value={option?.optionTypeId}
                              control={
                                <Radio 
                                  size="small"
                                  disabled={disabled}
                                  onDoubleClick={() =>
                                    handleDoubleClickOption(item?.optionId, item?.optionName)
                                  }
                                  sx={{
                                    color: '#1976d2',
                                    '&.Mui-checked': {
                                      color: '#1976d2',
                                    }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                                  {option?.optionType}
                                  {option?.additionalCost && (
                                    <Chip 
                                      label={`$${option.additionalCost}`}
                                      size="small"
                                      sx={{ 
                                        ml: 1,
                                        backgroundColor: '#e8f5e8',
                                        color: '#2e7d32',
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  )}
                                </Typography>
                              }
                              sx={{ flexGrow: 1, mr: 2 }}
                            />
                            
                            {!option?.additionalCost && (
                              <TextField
                                size="small"
                                placeholder="Cost"
                                type="number"
                                value={localAdditionalCosts.find(cost => cost.optionTypeId.toLowerCase() === option?.optionTypeId.toLowerCase())?.additionalCost || ""}
                                onChange={(e) => handleAdditionalCostChange(e, option?.optionTypeId, item?.optionName, option?.optionType)}
                                sx={{
                                  width: 100,
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#1976d2',
                                    }
                                  }
                                }}
                                InputProps={{
                                  startAdornment: <Typography variant="body2" sx={{ color: '#666', mr: 0.5 }}>$</Typography>
                                }}
                              />
                            )}
                          </Box>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                border: '1px dashed #ddd'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No options available for this product
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
