import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";

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
                  <Link
                    to={"#"}
                    className="cancel text-decoration-underline"
                    onClick={() => {
                      setValue(defaultState);
                      handleclose();
                      simpleValidator.current.hideMessages();
                      forceUpdate();
                    }}
                  >
                    Cancel
                  </Link>
                  <SubmitButton
                    type="submit"
                    className="btn blue-btn"
                    name={action === "add" ? "Submit" : "Update"}
                    disabled={loader}
                  />
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
