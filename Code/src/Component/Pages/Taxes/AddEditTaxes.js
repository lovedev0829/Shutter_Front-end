import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Button, useTheme, alpha } from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import InputField from "../../Form/InputField";

function AddEditTaxes({ open, handleclose, LanguageListAPI, action, object }) {
  const defaultState = useMemo(
    () => ({
      taxName: "",
      municipality: "",
      state: "",
      city: "",
    }),
    []
  );
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();
  const TaxAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.TaxCreate : apiUrls.TaxUpdate,
          {},
          "POST",
          value
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
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  useEffect(() => {
    if (action === "edit") {
      setValue(object);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);
  return (
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
                {action === "add" ? "Add Tax" : "Update Tax"}
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
            <form onSubmit={TaxAddUpdate}>
              <div className="modal-body modale-scroll">
                <div className="form-design">
                  <div className="row">
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <InputField
                          labelName={"Tax Name"}
                          placeholderName={"Enter Tax Name"}
                          type={"text"}
                          handleChange={handleChange}
                          id={"taxName"}
                          name={"taxName"}
                          value={value.taxName}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "Tax Name",
                            value?.taxName,
                            `required`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <InputField
                          labelName={"Municipality %"}
                          placeholderName={"Enter Municipality %"}
                          type={"text"}
                          handleChange={handleChange}
                          id={"municipality"}
                          name={"municipality"}
                          value={value.municipality}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "municipality",
                            value?.municipality,
                            `required|numeric`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <InputField
                          labelName={"City %"}
                          placeholderName={"Enter City %"}
                          type={"text"}
                          handleChange={handleChange}
                          id={"city"}
                          name={"city"}
                          value={value.city}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "City",
                            value?.city,
                            `required|numeric`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <InputField
                          labelName={"State %"}
                          placeholderName={"Enter State %"}
                          type={"text"}
                          handleChange={handleChange}
                          id={"state"}
                          name={"state"}
                          value={value.state}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "State",
                            value?.state,
                            `required|numeric`
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
  );
}

export default AddEditTaxes;
