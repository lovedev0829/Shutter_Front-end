import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
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
import { Link, useParams } from "react-router-dom";
import JobTypeDropdown from "../../../helpers/JobTypeDropdown";
import AssignedPersonnelDropdown from "../../../helpers/AssignedPersonnelDropdown";
import JobstatusDropdown from "../../../helpers/JobstatusDropdown";
import { PostImage } from "../../../utils/apiCall";
import moment from "moment";
import GetAllContact from "../../../helpers/GetAllContact";
import AddEditUser from "../Users/AddEditUser";
import AddEditAddress from "../Address/AddEditAddress";
import AddEditContact from "../Contacts/AddEditContact";
import AddEditJobType from "../JobType/AddEditJobType";
import GetAllStages from "../../../helpers/GetAllStages";

const AddEditJob = ({ open, handleclose, LanguageListAPI, action, object }) => {
  let param = useParams();

  const defaultState = {
    contactId: param.contactId ? param.contactId : "",
    addressId: "",
    jobName: "",
    jobType: "",
    assignedPersonnel: "",
    scheduledDate: null,
    jobStatus: "",
    notes: "",
    attachmentsAny: [],
    ghL_StageId:null
  };
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const [contact, setcontact] = useState(false);
  const [contactlist, setcontactlist] = useState(false);
  const [address, setaddress] = useState(false);
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [show, setShow] = useState(false);
  const [addresList, setaddressList] = useState([]);
  const [shows, setShows] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);
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
        setLoader(true);
        const sanitizedValue = {
          ...value,
          ghL_StageId: !value.ghL_StageId ? null : value.ghL_StageId,
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.JobCreate : apiUrls.JobUpdate,
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
      setaddressList([]);
      setValue(defaultState);
    }
    setvendorlist(false);
    setcontactlist(false);
    setproducttypelist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const UploadImage = async (e) => {
    setShows(true);
    let file = [...e.target.files];
    const path = await PostImage(file);
    setShows(false);
    if (path) {
      setValue((val) => {
        return {
          ...val,
          attachmentsAny: [...(val.attachmentsAny || []), ...path],
        };
      });
    }
    e.target.value = null;
  };
  const handleImageDelelet = (data) => {
    const arr = value?.attachmentsAny?.filter((val, i) => i !== data);
    setValue((val) => {
      return { ...val, attachmentsAny: arr };
    });
  };

  const AddresslistAPI = async () => {
    setShow(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllAddress,
        { ContactId: param.contactId ? param.contactId : value.contactId },
        "GET"
      );

      if (apiResponse?.data?.isSuccess) {
        setaddressList(apiResponse?.data?.data);
      } else {
        setaddressList([]);
      }
      setShow(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (value.contactId) {
      AddresslistAPI();
    }

    // eslint-disable-next-line
  }, [value.contactId, open]);
  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };
  const handleapiv = () => {
    setcontactlist((prev) => !prev);
  };
  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
  };
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
                  {action === "add" ? "Add Job" : "Update Job"}
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
                      {!param.contactId && (
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <label className="font-14 d-flex align-items-center justify-content-between">
                              <span>
                                Contact Name <sup>*</sup>
                              </span>
                              {HasPermission("ContactAdd") && (
                                <img
                                  src="/image/plusblue.svg"
                                  alt=""
                                  loading="lazy"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setcontact(true)}
                                />
                              )}
                            </label>
                            <GetAllContact
                              value={value.contactId}
                              fn={handleChange}
                              load={contactlist}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                "contact Name",
                                value?.contactId,
                                `required`
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label
                            className="font-14 d-flex align-items-center justify-content-between"
                            for="addressId"
                          >
                            <span>
                              Select Address <sup>*</sup>
                            </span>
                            {param.contactId && HasPermission("AddressAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setaddress(true)}
                              />
                            )}
                          </label>
                          <div className="position-relative">
                            {show && <SelectBoxLoader />}
                            <select
                              id="addressId"
                              name="addressId"
                              onChange={handleChange}
                              value={value?.addressId}
                              className="form-select"
                            >
                              <option value="">Select an address</option>
                              {addresList?.map((val, i) => (
                                <option value={val?.addressId} key={i}>
                                  {" "}
                                  {val?.streetAddress},
                                  {val?.stateName} , {val?.city} - {val?.zipCode} ({val?.label})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="error">
                            {simpleValidator.current.message(
                              "Address",
                              value?.addressId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Job Name"}
                            placeholderName={"Enter Job Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"jobName"}
                            name={"jobName"}
                            value={value.jobName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Job Name",
                              value?.jobName,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Select Job Type <sup>*</sup>{" "}
                            </span>
                            {HasPermission("JobTypeAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setproducttype(true)}
                              />
                            )}
                          </label>

                          <JobTypeDropdown
                            value={value.jobType}
                            fn={handleChange}
                            load={producttypelist}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Job Type",
                              value?.jobType,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Select Ghl Stage
                          </label>
                          <GetAllStages
                            value={value.ghL_StageId}
                            fn={handleChange}
                            load={action}
                          />
                          {/* <div className="error">
                            {simpleValidator.current.message(
                              "ghL_StageId",
                              value?.ghL_StageId,
                              `required`
                            )}
                          </div> */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Select Assigned Personnel<sup>*</sup>
                            </span>
                            {HasPermission("UsersAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setvendor(true)}
                              />
                            )}
                          </label>
                          <AssignedPersonnelDropdown
                            value={value.assignedPersonnel}
                            fn={handleChange}
                            load={vendorlist}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Assigned Personnel",
                              value?.assignedPersonnel,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      {action === "edit" && (
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <label className="font-14">Select Job Status</label>
                            <JobstatusDropdown
                              value={value.jobStatus}
                              fn={handleChange}
                              load={action}
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Schedule Date and Time 
                          </label>
                          <div className="position-relative">
                            <input
                              type="datetime-local"
                              style={{ color: "white" }}
                              value={value.scheduledDate || ""}
                              onChange={handleChange}
                              className="form-control"
                              id="scheduledDate"
                              name="scheduledDate"
                              min={
                                action === "add"
                                  ? new Date().toISOString().slice(0, 16)
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
                              {value.scheduledDate
                                ? moment(value.scheduledDate).format(
                                    "MM-DD-YYYY hh:mm A"
                                  )
                                : "mm-dd-yyyy --:--"}
                            </span>
                          </div>
                          {/* <div className="error">
                            {simpleValidator.current.message(
                              "Schedule Date and Time",
                              value?.scheduledDate,
                              `required`
                            )}
                          </div> */}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <h1 className="font-18 mb-30 mt-3  pb-2">
                          Add Job Notes
                        </h1>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <InputField
                            labelName={"Enter any relavent notes"}
                            placeholderName={"Enter any relavent notes"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"notes"}
                            name={"notes"}
                            value={value.notes}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">Attachment Any</label>
                          <div className="position-relative upload-photo">
                            {shows && <SelectBoxLoader />}
                            <input
                              type="file"
                              className="form-control"
                              accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                              name="attachmentsAny"
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
                            file={value?.attachmentsAny}
                            isdelete={true}
                            handleImageDelelet={handleImageDelelet}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="font-14"> Example :</p>
                        <ul className="newlistcontent">
                          <li>Customer prefers afternoon visits.</li>
                          <li>Be aware of the dog in the backyard.</li>
                          <li>
                            Parking available on the street; permit required
                          </li>
                        </ul>
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
     {vendor && <AddEditUser
        open={vendor}
        handleclose={() => setvendor(false)}
        action={"add"}
        LanguageListAPI={handleapi}
        object={""}
      />
     }
     {address && <AddEditAddress
        open={address}
        handleclose={() => setaddress(false)}
        action={"add"}
        LanguageListAPI={AddresslistAPI}
        object={""}
      />
     }
     {contact &&<AddEditContact
        open={contact}
        handleclose={() => setcontact(false)}
        action={"add"}
        LanguageListAPI={handleapiv}
        object={""}
      />
     }
     {producttype && <AddEditJobType
        open={producttype}
        handleclose={() => setproducttype(false)}
        action={"add"}
        LanguageListAPI={handleapiproduct}
        object={""}
      />
     }
    </>
  );
};

export default AddEditJob;
