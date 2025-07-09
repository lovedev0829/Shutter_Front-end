import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  FormatPhoneNumber,
  PreviewFiles,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import Selectbox from "../../Form/Selectbox";
import moment from "moment/moment";
import { PostImage } from "../../../utils/apiCall";
import Allstate from "../../../helpers/Allstate";

const AddEditContact = ({
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
      suffix: "",
      contactType: "",
      phoneNumber: "+1",
      email: "",
      referral: "",
      website: "",
      notes: "",
      refral: "",
      isbillingSameAddress: false,
      billingAddressVm: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        streetAddress: "",
        city: "",
        stateId: "",
        zipCode: "",
      },
      isTaxExemption: true,
      taxExemptionVm: {
        exemptionCertificate: [],
        effectiveDate: null,
        expiryDate: null,
      },
    }),
    []
  );
  const [value, setValue] = useState(object ? object : defaultState);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [shows, setShows] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.ContactCreate : apiUrls.ContactUpdate,
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
          setShow(false);
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
      setShow(object.isTaxExemption ? false : true);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);

  const handleRadioChange = (e) => {
    setValue({
      ...value,
      isTaxExemption: e.target.value === "true",
    });
    setShow(e.target.value === "true" ? false : true);
    setValue((prev) => ({
      ...prev,
      taxExemptionVm: {
        ...prev.taxExemptionVm,
        exemptionCertificate: [],
        effectiveDate: null,
        expiryDate: null,
      },
    }));
  };

  const UploadImage = async (e) => {
    setShows(true);
    const files = [...e.target.files];
    const paths = await PostImage(files);
    setShows(false);

    if (paths) {
      setValue((prev) => ({
        ...prev,
        taxExemptionVm: {
          ...prev.taxExemptionVm,
          exemptionCertificate: [
            ...prev.taxExemptionVm.exemptionCertificate,
            ...(Array.isArray(paths) ? paths : [paths]),
          ],
        },
      }));
    }
    e.target.value = null;
  };

  const handleImageDelelet = (data) => {
    const arr = value?.taxExemptionVm?.exemptionCertificate?.filter(
      (val, i) => i !== data
    );
    setValue((prev) => ({
      ...prev,
      taxExemptionVm: {
        ...prev.taxExemptionVm,
        exemptionCertificate: arr,
      },
    }));
  };

  const handleChangenumber = (e) => {
    const { name, value } = e.target;
  
    let cleanedValue = value.replace(/\D/g, "").replace(/^1/, "");
  
    // ⛔ Prevent extra digits being stored
    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.slice(0, 10);
    }
  
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: cleanedValue,
        },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    }
  };
  
  const handleSameAsBillingChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prev) => ({
      ...prev,
      isbillingSameAddress: isChecked,
      billingAddressVm: isChecked
        ? {
            ...prev.billingAddressVm,
            firstName: prev.firstName,
            lastName: prev.lastName,
            phoneNumber: prev.phoneNumber,
            email: prev.email,
          }
        : {
            ...prev.billingAddressVm,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          },
    }));

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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  {action === "add" ? "Add Contact" : "Update Contact"}
                </h1>

                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    handleclose();
                    setValue(defaultState);
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                    setShow(false);
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
                            labelName={"Suffix"}
                            placeholderName={"Enter Suffix"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"suffix"}
                            name={"suffix"}
                            value={value.suffix}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <Selectbox
                            labelName={"Contact Type"}
                            options={[
                              { value: "person", label: "Person" },
                              { value: "organization", label: "Organization" },
                              { value: "lead", label: "Lead" },
                              { value: "customer", label: "Customer" },
                            ]}
                            handleChange={handleChange}
                            id={"contactType"}
                            name={"contactType"}
                            value={value.contactType}
                            required={true}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Contact Type",
                              value?.contactType,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Phone No."}
                            placeholderName={"Enter phone number"}
                            type={"text"}
                            handleChange={handleChangenumber}
                            id={"phoneNumber"}
                            name={"phoneNumber"}
                            value={FormatPhoneNumber(value.phoneNumber || "")}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Phone Number",
                              value?.phoneNumber,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Email Address."}
                            placeholderName={"Enter email address"}
                            type={"text"}
                            handleChange={handleChange}
                            idv={"email"}
                            name={"email"}
                            value={value.email}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "email",
                              value?.email,
                              "required|email"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Referral Source"}
                            placeholderName={"Enter Referral Source"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"referral"}
                            name={"referral"}
                            value={value.referral}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Website Url"}
                            placeholderName={"Enter website url"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"website"}
                            name={"website"}
                            value={value.website}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Notes"}
                            placeholderName={"Enter notes"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"notes"}
                            name={"notes"}
                            value={value.notes}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="middle-heading">
                          <h4 className="d-flex align-items-end gap-2">
                            <input
                              type="checkbox"
                              style={{ border: "1px solid #8f8b8b" }}
                              className="form-check-input"
                              name="isbillingSameAddress"
                              checked={value.isbillingSameAddress}
                              onChange={handleSameAsBillingChange}
                              // onChange={(e) => {
                              //   setValue((prev) => ({
                              //     ...prev,
                              //     isbillingSameAddress:
                              //       e.target.checked,
                              //   }));
                              // }}
                            />{" "}
                            Primary/Billing Address{" "}
                          </h4>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"First Name"}
                            placeholderName={"Enter First name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"firstName"}
                            name={"billingAddressVm.firstName"}
                            value={value.billingAddressVm?.firstName || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "First name",
                              value.billingAddressVm?.firstName || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"Last Name"}
                            placeholderName={"Enter Last name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"lastName"}
                            name={"billingAddressVm.lastName"}
                            value={value.billingAddressVm?.lastName || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Last name",
                              value.billingAddressVm?.lastName || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"Phone No."}
                            placeholderName={"Enter phone number"}
                            type={"text"}
                            handleChange={handleChangenumber}
                            id={"phoneNumber"}
                            name={"billingAddressVm.phoneNumber"}
                            value={FormatPhoneNumber(
                              value.billingAddressVm?.phoneNumber || ""
                            )}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "phoneNumber",
                              value.billingAddressVm?.phoneNumber || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"Email Address."}
                            placeholderName={"Enter email address"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"email"}
                            name={"billingAddressVm.email"}
                            value={value.billingAddressVm?.email || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "email",
                              value.billingAddressVm?.email || "",
                              "required|email"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"Street Adress"}
                            placeholderName={"Enter street address"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"streetAddress"}
                            name={"billingAddressVm.streetAddress"}
                            value={value.billingAddressVm?.streetAddress || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "streetAddress",
                              value.billingAddressVm?.streetAddress || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <label className="font-14">
                            State<sup>*</sup>
                          </label>
                          <Allstate
                            name="billingAddressVm.stateId"
                            value={value.billingAddressVm?.stateId || ""}
                            fn={handleChange}
                            load={action}
                          />
                          {/* <InputField
                            labelName={"State"}
                            placeholderName={"Enter state"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"state"}
                            name={"billingAddressVm.state"}
                            value={value.billingAddressVm?.state || ""}
                            required={true}
                          /> */}
                          <div className="error">
                            {simpleValidator.current.message(
                              "State",
                              value.billingAddressVm?.stateId || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"City"}
                            placeholderName={"Enter city"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"city"}
                            name={"billingAddressVm.city"}
                            value={value.billingAddressVm?.city || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "city",
                              value.billingAddressVm?.city || "",
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3">
                        <div className="form-group">
                          <InputField
                            labelName={"Zip Code "}
                            placeholderName={"Enter zip code"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"zipCode"}
                            name={"billingAddressVm.zipCode"}
                            value={value.billingAddressVm?.zipCode || ""}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "ZipCode",
                              value.billingAddressVm?.zipCode || "",
                              "required|min:5|max:6"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="middle-heading">
                          <h4>Tax Management</h4>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label className="font-14 me-4">Apply Tax</label>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio1"
                              value="true"
                              checked={value.isTaxExemption === true}
                              onChange={handleRadioChange}
                            />
                            <label
                              className="form-check-label mb-0"
                              htmlFor="inlineRadio1"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio2"
                              value="false"
                              checked={value.isTaxExemption === false}
                              onChange={handleRadioChange}
                            />
                            <label
                              className="form-check-label mb-0"
                              htmlFor="inlineRadio2"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      {show && (
                        <>
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <label className="font-14">Upload File</label>
                              <div className="position-relative upload-photo">
                                {shows && <SelectBoxLoader />}
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                                  name="exemptionCertificate"
                                  onChange={(e) => {
                                    UploadImage(e);
                                  }}
                                  multiple
                                />
                                <span>
                                  <img
                                    src="/image/upload.svg"
                                    className="me-2"
                                    alt=" "
                                    loading="lazy"
                                  />{" "}
                                  Choose File
                                </span>
                              </div>
                              <PreviewFiles
                                file={
                                  value?.taxExemptionVm?.exemptionCertificate
                                }
                                isdelete={true}
                                handleImageDelelet={handleImageDelelet}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <label className="font-14">Effective Date</label>
                              <div className="position-relative calender-input">
                                <input
                                  type="date"
                                  style={{ color: "white" }}
                                  className="form-control"
                                  placeholder="Enter zip code"
                                  name={"taxExemptionVm.effectiveDate"}
                                  value={
                                    action === "add"
                                      ? moment(
                                          value.taxExemptionVm?.effectiveDate
                                        ).format("YYYY-MM-DD") || ""
                                      : null
                                  }
                                  onChange={handleChange}
                                />
                                <span
                                  style={{
                                    position: "absolute",
                                    left: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#212529",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {value.taxExemptionVm?.effectiveDate
                                    ? moment(
                                        value.taxExemptionVm?.effectiveDate
                                      ).format("MM-DD-YYYY")
                                    : "mm-dd-yyyy"}
                                </span>
                                <img
                                  src="/image/calendar-alt.svg"
                                  alt=""
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <label className="font-14">Expiry Date</label>
                              <div className="position-relative calender-input">
                                <input
                                  type="date"
                                  style={{ color: "white" }}
                                  className="form-control"
                                  placeholder="Enter zip code"
                                  name={"taxExemptionVm.expiryDate"}
                                  value={
                                    moment(
                                      value.taxExemptionVm?.expiryDate
                                    ).format("YYYY-MM-DD") || ""
                                  }
                                  onChange={handleChange}
                                  min={
                                    action === "add"
                                      ? moment(
                                          value.taxExemptionVm?.effectiveDate
                                        ).format("YYYY-MM-DD") || ""
                                      : null
                                  }
                                />
                                <span
                                  style={{
                                    position: "absolute",
                                    left: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#212529",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {value.taxExemptionVm?.expiryDate
                                    ? moment(
                                        value.taxExemptionVm?.expiryDate
                                      ).format("MM-DD-YYYY")
                                    : "mm-dd-yyyy"}
                                </span>
                                <img
                                  src="/image/calendar-alt.svg"
                                  alt=""
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        handleclose();
                        setValue(defaultState);
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                        setShow(false);
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
export default AddEditContact;
