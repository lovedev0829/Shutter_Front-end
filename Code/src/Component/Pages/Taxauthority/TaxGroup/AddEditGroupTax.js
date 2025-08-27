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
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
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
import AddEditTax from "../Tax/AddEditTax";

const AddEditGroupTax = ({
  open,
  handleclose,
  TaxGrouplistAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = useMemo(
    () => ({
      groupName: "",
      taxIds: [],
    }),
    []
  );

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [taxlist, settaxlist] = useState([]);
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
          action === "add" ? apiUrls.TaxGroupCreate : apiUrls.TaxGroupUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await TaxGrouplistAPI();
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
      setValue({
        id: object?.id || "",
        groupName: object?.groupName || "",
        taxIds: object?.taxes?.map((tax) => tax.id) || [],
      });
    } else {
      setValue(defaultState);
    }
    setvendorlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };

  const TaxListAPI = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.CommonGetAllTaxs, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        settaxlist(apiResponse?.data?.data);
      } else {
        settaxlist([]);
      }
    } catch (error) {
      settaxlist([]);
    }
  };

  useEffect(() => {
    TaxListAPI();
    // eslint-disable-next-line
  }, [vendorlist]);

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
            {action === "add" ? "Add Group Tax" : "Update Group Tax"}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Name"
                  placeholder="Enter Group Name"
                  name="groupName"
                  value={value.groupName}
                  onChange={handleChange}
                  size={isMobile ? "small" : "medium"}
                  required
                  error={
                    !!simpleValidator.current.message(
                      "Group Name",
                      value?.groupName,
                      "required"
                    )
                  }
                  helperText={simpleValidator.current.message(
                    "Group Name",
                    value?.groupName,
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
                      Select Tax *
                    </Typography>
                    {HasPermission("TaxAdd") && (
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
                  <Select
                    multiple
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    name="taxIds"
                    value={value.taxIds || []}
                    onChange={(e) =>
                      setValue((val) => ({
                        ...val,
                        taxIds: e.target.value,
                      }))
                    }
                    renderValue={(selected) =>
                      taxlist
                        .filter((tax) => selected.includes(tax.id))
                        .map((tax) => tax.taxName)
                        .join(", ")
                    }
                    sx={{
                      borderRadius: "8px",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                    }}
                  >
                    {taxlist.length > 0 ? (
                      taxlist.map((tax) => (
                        <MenuItem key={tax.id} value={tax.id}>
                          <Checkbox checked={value.taxIds.includes(tax.id)} />
                          <ListItemText primary={tax.taxName} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No taxes available</MenuItem>
                    )}
                  </Select>
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
                      "Tax",
                      value?.taxIds,
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
        <AddEditTax
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          TaxListAPI={handleapi}
          object={""}
        />
      )}
    </>
  );
};

export default AddEditGroupTax;
