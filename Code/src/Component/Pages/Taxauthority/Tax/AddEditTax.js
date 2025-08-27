import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";

import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  Box,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

import { callAPI } from "../../../../utils/apiUtils";
import { apiUrls } from "../../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../../helpers/common";
import SubmitButton from "../../../Form/SubmitButton";
import TaxAuthority from "../../../../helpers/TaxAuthority";
import AddEditTaxauthority from "../AddEditTaxauthority";

const AddEditTax = ({
  open,
  handleclose,
  TaxListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = useMemo(
    () => ({
      taxName: "",
      taxRate: 0,
      taxAuthorityId: "",
    }),
    []
  );

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
      return {
        ...val,
        [e.target.name]: newValue,
      };
    });
  };

  const VendorAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.TaxnewCreate : apiUrls.TaxnewUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await TaxListAPI();
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
    setvendorlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };

  return (
    <>
      <Dialog
        open={open}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : "12px",
            margin: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
            width: isMobile ? "100vw" : "auto",
          },
        }}
        aria-labelledby="vendor-dialog-title"
      >
        <DialogTitle
          id="vendor-dialog-title"
          sx={{
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#1e293b",
            }}
          >
            {action === "add" ? "Add Tax" : "Update Tax"}
          </Typography>
          <IconButton
            onClick={() => {
              setValue(defaultState);
              handleclose();
              simpleValidator.current.hideMessages();
              forceUpdate();
            }}
            sx={{
              color: "#64748b",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={VendorAddUpdate}>
          <DialogContent
            sx={{
              p: { xs: 2, sm: 3 },
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
            }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="Tax Name"
                  placeholder="Enter Tax Name"
                  name="taxName"
                  value={value.taxName}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={
                    !!simpleValidator.current.message(
                      "Tax Name",
                      value?.taxName,
                      "required"
                    )
                  }
                  helperText={simpleValidator.current.message(
                    "Tax Name",
                    value?.taxName,
                    "required"
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="Rate %"
                  placeholder="Enter Tax Rate %"
                  name="taxRate"
                  value={value.taxRate}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={
                    !!simpleValidator.current.message(
                      "Tax Rate %",
                      value?.taxRate,
                      "required|numeric"
                    )
                  }
                  helperText={simpleValidator.current.message(
                    "Tax Rate %",
                    value?.taxRate,
                    "required|numeric"
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Select Authority *
                    </Typography>
                    {HasPermission("TaxAuthorityAdd") && (
                      <IconButton
                        size="small"
                        onClick={() => setvendor(true)}
                        sx={{
                          color: "#3b82f6",
                          backgroundColor: "#eff6ff",
                          width: { xs: 24, sm: 28 },
                          height: { xs: 24, sm: 28 },
                          "&:hover": {
                            backgroundColor: "#dbeafe",
                          },
                        }}
                      >
                        <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      </IconButton>
                    )}
                  </Box>
                  <TaxAuthority
                    name="taxAuthorityId"
                    value={value.taxAuthorityId || ""}
                    fn={handleChange}
                    load={vendorlist}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ef4444",
                      fontSize: { xs: "0.625rem", sm: "0.75rem" },
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {simpleValidator.current.message(
                      "Authority",
                      value?.taxAuthorityId,
                      `required`
                    )}
                  </Typography>
                </Box>
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
                textTransform: "none",
                textDecoration: "underline",
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
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
      {vendor && (
        <AddEditTaxauthority
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          TaxauthorityListAPI={handleapi}
          object={""}
        />
      )}
    </>
  );
};

export default AddEditTax;
