import { Dialog, Button, useTheme, alpha, FormControl, InputLabel, Select, MenuItem, Typography, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import InputField from "../../Form/InputField";

import GetAllCustomer from "../../../helpers/GetAllCustomer";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ErrorMessage, HasPermission, SuccessMessage } from "../../../helpers/common";
import DateInputField from "../../Form/DateInputField";
import ExpiryDate from "../../Form/ExpiryDate";
import AddEditContact from "../Contacts/AddEditContact";

function AddEditDiscount({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) {
  const defaultState = {
    appliedFor: "",
    customerId: [],
    discountType: "",
    percentageDiscount: null,
    fixedAmount: null,
    startDate: "",
    expiryDate: "",
  };
const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();
  const handleChange = (e) => {
    if (e.target.value === "0" || e.target.value === 0) {
      if (e.target.name === "appliedFor") {
        simpleValidator.current.purgeFields("customerId");
        setValue((prev) => {
          return { ...prev, customerId: [] };
        });
      } else if (e.target.name === "discountType") {
        simpleValidator.current.purgeFields("fixedAmount");
        setValue((prev) => {
          return { ...prev, fixedAmount: null, percentageDiscount: "" };
        });
      }
    } else if (e.target.value > 100) {
      if (e.target.name === "percentageDiscount") {
        ErrorMessage("Percentage discount must be between 0 and 100.");
      }
    } else {
      if (e.target.name === "discountType") {
        simpleValidator.current.purgeFields("percentageDiscount");
        setValue((prev) => {
          return { ...prev, percentageDiscount: null, fixedAmount: "" };
        });
      }
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });

    console.log(value)

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
        const data = {
          ...value,
          appliedFor: Number(value?.appliedFor),
          discountType: Number(value?.discountType),
          percentageDiscount: value?.percentageDiscount,
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.DiscountCreate : apiUrls.DiscountUpdate,
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
          simpleValidator.current.hideMessages()
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
      if (value.discountType === 0 || value.discountType === '0') {
        simpleValidator.current.purgeFields("fixedAmount");
  
      } else if (value.appliedFor === 0 || value.appliedFor === '0') {
        simpleValidator.current.purgeFields("customerId");
      } else {
        simpleValidator.current.purgeFields("percentageDiscount");
      }
      setValue(object);
      console.log("hiiii")
    } else {
      setValue(defaultState);
    }
    setvendorlist(false)
    // eslint-disable-next-line
  }, [open, action]);
  const handleapi = () => {
    setvendorlist((prev) => !prev)
  }
  return (
    <>
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px",
          },
        },
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div
        className="modal fade show"
        id="contactModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-modal="true"
        role="dialog"
        style={{ display: "block", backgroundColor: "#00000080" }}
      >
        <div className="modal-dialog modal-dialog-centered filter_modal">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="exampleModalLabel">
                {action === "add" ? "Add Discount" : "Update Discount"}
              </h1>
              <i
                className="icofont-close btn-close"
                onClick={() => {
                  setValue(defaultState);
                  handleclose();
                  simpleValidator.current.hideMessages();
                  forceUpdate();
                }}
              ></i>
            </div>
            <form onSubmit={languageAdd}>
              <div className="modal-body">
                <div className="form-design">
                  <div className="row">
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            component="label"
                            sx={{ 
                              fontSize: '14px',
                              fontWeight: 500,
                              mb: 1,
                              display: 'block',
                              color: 'text.primary'
                            }}
                          >
                            Apply To <Typography component="sup" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                          </Typography>
                          <FormControl fullWidth variant="outlined" disabled={action === "edit"}>
                            <Select
                              value={value.appliedFor}
                              onChange={handleChange}
                              name="appliedFor"
                              id="appliedFor"
                              displayEmpty
                              sx={{
                                borderRadius: 1,
                                fontSize: '14px',
                                '& .MuiSelect-select': {
                                  padding: '12px 14px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.divider,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: 2,
                                },
                                '&.Mui-disabled': {
                                  backgroundColor: alpha(theme.palette.action.disabledBackground, 0.5),
                                }
                              }}
                            >
                              <MenuItem value={0}>
                                <Typography sx={{ fontSize: '14px' }}>All</Typography>
                              </MenuItem>
                              <MenuItem value={1}>
                                <Typography sx={{ fontSize: '14px' }}>Customer</Typography>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <div className="error">
                          {simpleValidator.current.message(
                            "Apply",
                            value?.appliedFor,
                            "required"
                          )}
                        </div>
                      </div>
                    </div>
                    {(value.appliedFor === "1" || value.appliedFor === 1) && action !== 'edit' && (
                      <div className="col-lg-4 col-md-4">
                      <label className="font-14 d-flex align-items-center justify-content-between" style={{marginTop: "8px"}}>
                      <span> Customer Name <sup>*</sup> </span>
                      {HasPermission("ContactAdd") &&  <img
                              src="/image/plusblue.svg"
                              alt=""
                              loading="lazy"
                              style={{ cursor: "pointer" }}
                             onClick={(()=>setvendor(true))}
                            />
                      }
                        </label>
                        <GetAllCustomer
                          value={value.customerId}
                          name={"customerId"}
                          load={vendorlist}
                          className={"multiSelectorCheckBox"}
                          fn={(e) => handleChange(e)}

                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "Customer",
                            value?.customerId,
                            `required`
                          )}
                        </div>
                      </div>
                    )}
                    {action === "edit" && (
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Coupon Code"}
                            placeholderName={"Enter Coupon Code"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"couponCode"}
                            name={"couponCode"}
                            value={value.couponCode}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "couponCode",
                              value?.couponCode,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-lg-4 col-md-4">
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          component="label"
                          sx={{ 
                            fontSize: '14px',
                            fontWeight: 500,
                            mb: 1,
                            display: 'block',
                            color: 'text.primary'
                          }}
                        >
                          Discount Type <Typography component="sup" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                        </Typography>
                        <FormControl fullWidth variant="outlined">
                          <Select
                            value={value.discountType}
                            onChange={handleChange}
                            name="discountType"
                            id="discountType"
                            displayEmpty
                            sx={{
                              borderRadius: 1,
                              fontSize: '14px',
                              '& .MuiSelect-select': {
                                padding: '12px 14px',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                                borderWidth: 2,
                              }
                            }}
                          >
                            <MenuItem value={0}>
                              <Typography sx={{ fontSize: '14px' }}>Percentage</Typography>
                            </MenuItem>
                            <MenuItem value={1}>
                              <Typography sx={{ fontSize: '14px' }}>Fixed Amount</Typography>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <div className="error">
                        {simpleValidator.current.message(
                          "Discount type",
                          value?.discountType,
                          `required`
                        )}
                      </div>
                    </div>
                    {value.discountType !== "" && (
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Discount"}
                            placeholderName={"Enter Discount"}
                            type={"Discount"}
                            handleChange={handleChange}
                            id={"Discount"}
                            name={
                              (value.discountType === "0" ||
                                value.discountType === 0)
                                ? "percentageDiscount"
                                : "fixedAmount"
                            }
                            value={
                              (value.discountType === "0" ||
                                value.discountType === 0)
                                ? value.percentageDiscount
                                : value.fixedAmount
                            }
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              (value.discountType === "0" ||
                                value.discountType === 0)
                                ? "percentageDiscount"
                                : "fixedAmount",
                              (value.discountType === "0" ||
                                value.discountType === 0)
                                ? value.percentageDiscount
                                : value.fixedAmount,
                              (value.discountType === "0" ||
                                value.discountType === 0)
                                ? "required|numeric"
                                : "required|numeric"
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <label className="font-14">
                          Start Date <sup>*</sup>
                        </label>
                        <DateInputField name="startDate" value={value?.startDate} handleChange={handleChange} action={action} />

                        <div className="error">
                          {simpleValidator.current.message(
                            "startDate",
                            value?.startDate,
                            `required`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <label className="font-14">
                          Expiry Date <sup>*</sup>
                        </label>

                        <ExpiryDate name={"expiryDate"} startDate={value?.startDate} expiryDate={value?.expiryDate} handlechange={handleChange} action={action}/>
                        <div className="error">
                          {simpleValidator.current.message(
                            "expiryDate",
                            value?.expiryDate,
                            `required`
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="form-style form-group d-flex align-items-center justify-content-end">
                  <Button
                    onClick={() => {
                      setValue(defaultState);
                      handleclose();
                      simpleValidator.current.hideMessages();
                      forceUpdate();
                    }}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: theme.palette.grey[300],
                      color: theme.palette.text.secondary,
                      marginRight: 2,
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loader}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[500],
                      }
                    }}
                  >
                    {action === "add" ? "Submit" : "Update"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
    <AddEditContact
       open={vendor} handleclose={(()=>setvendor(false))} action={"add"} LanguageListAPI={handleapi} object={""} 
      />
    </>
  );
}

export default AddEditDiscount;
