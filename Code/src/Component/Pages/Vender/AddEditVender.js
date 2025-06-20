import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, FormatPhoneNumber, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import Allstate from "../../../helpers/Allstate";

const AddEditVender = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const defaultState = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      stateId: null,
      zipCode: "",
      companyName: "",
    }),
    []
  );

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

 

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
  
      if (e.target.name === "phoneNumber") {
        let cleanedValue = newValue.replace(/\D/g, "").replace(/^1/, "");
        if (cleanedValue.length > 10) {
          cleanedValue = cleanedValue.slice(0, 10);
        }
        newValue = cleanedValue;
      }
  
      return {
        ...val,
        [e.target.name]: newValue,
      };
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
        const sanitizedValue = {
          ...value,
          stateId: !value.stateId ? null : value.stateId,
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.VendorCreate : apiUrls.VendorUpdate,
          {},
          "POST",
          sanitizedValue
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
                  {action === "add" ? "Add Vendor" : "Update Vendor"}
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
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Company Name"}
                            placeholderName={"Enter Company Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"companyName"}
                            name={"companyName"}
                            value={value.companyName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Company Name",
                              value?.companyName,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"First Name"}
                            placeholderName={"Enter First Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"firstName"}
                            name={"firstName"}
                            value={value.firstName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "First Name",
                              value?.firstName,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Last Name"}
                            placeholderName={"Enter Last Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"lastName"}
                            name={"lastName"}
                            value={value.lastName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Last Name",
                              value?.lastName,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Email"}
                            placeholderName={"Enter Email"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"email"}
                            name={"email"}
                            value={value.email}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Email",
                              value?.email,
                              `required|email|max:50`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Phone Number"}
                            placeholderName={"Enter Phone Number"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"phoneNumber"}
                            name={"phoneNumber"}
                            value={FormatPhoneNumber(value.phoneNumber||"")}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Phone Number",
                              value?.phoneNumber,
                              `required|integer|min:10|max:10`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Street Address"}
                            placeholderName={"Enter Street Address"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"streetAddress"}
                            name={"streetAddress"}
                            value={value.streetAddress}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            State
                          </label>
                          <Allstate
                            name="stateId"
                            value={value.stateId || ""}
                            fn={handleChange}
                            load={action}
                          />
                          {/* <InputField
                            labelName={"State"}
                            placeholderName={"Enter State"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"state"}
                            name={"state"}
                            value={value.state}
                            required={true}
                          /> */}
                        
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"City"}
                            placeholderName={"Enter City"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"city"}
                            name={"city"}
                            value={value.city}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"ZipCode"}
                            placeholderName={"Enter ZipCode"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"zipCode"}
                            name={"zipCode"}
                            value={value.zipCode}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "zipCode",
                              value?.zipCode,
                              `integer|min:5|max:6`
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
    </>
  );
};

export default AddEditVender;
