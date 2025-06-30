import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PostImage } from "../utils/apiCall";
import { t } from "i18next";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Appointment from "./Appointment";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

const ApiLoder = () => {
  return (
    <>
      <div className="spinner_overlay"></div>
      <div className="spinner-box">
        <img src="/image/loder.gif" alt="" className="loading-icon" loading="lazy" />
      </div>
    </>
  );
};

const SuccessMessage = (message) => {
  setTimeout(
    () =>
      toast.success(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }),
    10
  );
};

const ErrorMessage = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const CommonUploadImage = async (e, handleonchange, allowedFileTypes) => {
  let file = e?.target?.files[0];
  let name = e?.target?.name;
  if (
    allowedFileTypes.includes(file?.type) ||
    allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
  ) {
    const path = await PostImage(file);
    if (path?.length > 0) {
      handleonchange((extra) => ({ ...extra, [name]: path[0] }));
    } else {
      handleonchange((extra) => ({ ...extra, [name]: "" }));
    }
    e.target.value = null;
  } else {
    ErrorMessage("Invalid file Formate");
    handleonchange((extra) => ({ ...extra, [name]: "" }));
    e.target.value = null;
    return false;
  }
};

const AcceptFileType =
  "image/png,image/PNG,image/jpg,image/JPG,image/jpeg,image/JPEG,.doc, .docx,.xls,.xlsx,.pdf,.csv,";
const FileType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "pdf",
  "csv",
  "jpg",
  "png",
  "jpeg",
  "JPG",
  "PNG",
  "JPEG",
];

const CustomMessages = {
  required: t("required_field"),
  email: t("email_field"),
  min: t("min_field"),
  max: t("max_field"),
  numeric: t("numeric_field"),
  alpha_num: t("alpha_num_field"),
  alpha_num_space: t("alpha_num_space_field"),
};

function SubmitButton({ onClick, disabled, text }) {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className="btn blue-btn"
    >
      {text}
      {disabled && (
        <i className="fa fa-spinner fa-spin" style={{ marginLeft: "10px" }}></i>
      )}
    </button>
  );
}

const Delete = ({ open, handleClose, handleDelete, title, id, loder }) => {
  return (
    <>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body logout-popup text-center">
              <span className="mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={48}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.592 4.4881C25.306 3.6521 28 6.8441 28 10.0001V38.0001C28 41.1561 25.306 44.3481 21.592 43.5121C12.668 41.5041 6 33.5321 6 24.0001C6 14.4681 12.668 6.4961 21.592 4.4881ZM32.586 16.5861C32.9611 16.2112 33.4697 16.0005 34 16.0005C34.5303 16.0005 35.0389 16.2112 35.414 16.5861L41.414 22.5861C41.7889 22.9612 41.9996 23.4698 41.9996 24.0001C41.9996 24.5304 41.7889 25.039 41.414 25.4141L35.414 31.4141C35.0368 31.7784 34.5316 31.98 34.0072 31.9754C33.4828 31.9709 32.9812 31.7606 32.6104 31.3897C32.2395 31.0189 32.0292 30.5173 32.0247 29.9929C32.0201 29.4685 32.2217 28.9633 32.586 28.5861L35.172 26.0001H18C17.4696 26.0001 16.9609 25.7894 16.5858 25.4143C16.2107 25.0392 16 24.5305 16 24.0001C16 23.4697 16.2107 22.961 16.5858 22.5859C16.9609 22.2108 17.4696 22.0001 18 22.0001H35.172L32.586 19.4141C32.2111 19.039 32.0004 18.5304 32.0004 18.0001C32.0004 17.4698 32.2111 16.9612 32.586 16.5861Z"
                    fill="white"
                  />
                </svg>
              </span>
              <h3> Delete</h3>
              <p>
                Are your sure you want to delete{" "}
                <strong className="stongtag">{title}</strong> ?
              </p>
              <div className="save_btn">
                <button
                  type="button"
                  className="btn border-btn me-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn blue-btn"
                  disabled={loder}
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export const getHomeUrl = () => {
  return window.location.origin;
};

const HasPermission = (permission) => {
  const permissions = JSON.parse(localStorage.getItem("userData"));
  return permissions?.roles.includes(permission);
};

function SelectBoxLoader() {
  return (
    <div
      className="spinner-border custom_spiner text-danger spinner-border-sm"
      role="status"
    ></div>
  );
}

const ColorList = [
  { value: "#e94235", label: "Red" },
  { value: "#4285f4", label: "Blue" },
  { value: "#34a853", label: "Green" },
  { value: "#1d7e8b", label: "Teal" },
  { value: "#c950b4", label: "Pink" },
  { value: "#ab743f", label: "Brown" },
  { value: "#c1a536", label: "Yellow" },
  { value: "#e25530", label: "Orange" },
];

function BackButton({ link }) {
  return (
    <div className="back-option mb-2 ">
      <Link to={link} className="d-flex align-items-center">
        <img src="/image/back.svg" className="me-1" alt="" loading="lazy"/> Back
      </Link>
    </div>
  );
}

function JobUi({ tenantList, onJobUpdate }) {
  const [open, setOpen] = useState(false);
  const [childData, setChildData] = useState("");
  const [powderCoatColors, setPowderCoatColors] = useState([]);
  const [selectedPowderCoatColor, setSelectedPowderCoatColor] = useState(tenantList?.powderCoatColorId || "");
  const [loadingColors, setLoadingColors] = useState(false);
  const [updatingColor, setUpdatingColor] = useState(false);

  const handleChildData = (data) => {
    setChildData(data);
  };

  // Load powder coat colors
  const loadPowderCoatColors = async () => {
    try {
      setLoadingColors(true);
      const response = await callAPI(apiUrls.GetPowderCoatColorsForDropdown, {}, "GET");
      if (response?.data?.isSuccess) {
        setPowderCoatColors(response.data.data);
      } else {
        setPowderCoatColors([]);
        ErrorMessage(response?.data?.message || "Failed to load powder coat colors");
      }
    } catch (error) {
      console.error("Error loading powder coat colors:", error);
      ErrorMessage("Error loading powder coat colors");
      setPowderCoatColors([]);
    } finally {
      setLoadingColors(false);
    }
  };

  // Update job powder coat color
  const updateJobPowderCoatColor = async (colorId) => {
    try {
      setUpdatingColor(true);
      
      const response = await callAPI(apiUrls.UpdateJobPowderCoatColor, {
        jobId: tenantList?.jobId,
        powderCoatColorId: colorId || null
      }, "POST");
      
      if (response?.data?.isSuccess) {
        setSelectedPowderCoatColor(colorId);
        if (onJobUpdate) {
          onJobUpdate({ ...tenantList, powderCoatColorId: colorId });
        }
        SuccessMessage("Powder coat color updated successfully");
      } else {
        ErrorMessage(response?.data?.message || "Failed to update powder coat color");
      }
    } catch (error) {
      console.error("Error updating powder coat color:", error);
      ErrorMessage("Error updating powder coat color");
    } finally {
      setUpdatingColor(false);
    }
  };

  const handlePowderCoatColorChange = (e) => {
    const colorId = e.target.value;
    if( colorId != "") {
      updateJobPowderCoatColor(colorId);
    }
  };

  useEffect(() => {
    loadPowderCoatColors();
  }, []);

  useEffect(() => {
    setSelectedPowderCoatColor(tenantList?.powderCoatColorId || "");
  }, [tenantList?.powderCoatColorId]);

  // Ensure the selected color is set after colors are loaded
  useEffect(() => {
    if (powderCoatColors.length > 0 && tenantList?.powderCoatColorId) {
      setSelectedPowderCoatColor(tenantList.powderCoatColorId);
    }
  }, [powderCoatColors, tenantList?.powderCoatColorId]);
  return (
    <div className="row">
      <div className="col-lg-3 col-6">
        <div className="additional_direction mt-0">
          <h6 className="mb-1">Address</h6>
          <span>
            {tenantList?.streetAddress}, {tenantList?.city}, {tenantList?.state}
            - {tenantList?.zipCode} ({tenantList?.label})
          </span>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="additional_direction mt-0">
          <h6 className="mb-1">Job Name</h6>
          <span>{tenantList?.jobName}</span>
        </div>
      </div>
      <div className="col-lg-2 col-6">
        <div className="additional_direction mt-0">
          <h6 className="mb-1">Job Type</h6>
          <span>{tenantList?.jobTypeName}</span>
        </div>
      </div>
      <div className="col-lg-2">
        <div className="additional_direction mt-0">
          <h6 className="mb-1">Assigned Personnel</h6>
          <span>{tenantList?.assignedPersonnelName}</span>
        </div>
      </div>
      <div className="col-lg-2">
        <div className="additional_direction mt-0">
          <h6 className="mb-1">Job Status</h6>
          <span style={{color: "#1e90ff"}}>{tenantList?.jobStatusName}</span>
        </div>
      </div>

      <div className="col-lg-3">
        <div className="additional_direction">
          <h6 className="mb-1">Schedule Date &amp; Time</h6>
          <span>
            {tenantList?.scheduledDate
              ? `${moment(tenantList.scheduledDate).format(
                  "MM-DD-YYYY"
                )} | ${moment(tenantList.scheduledDate).format("hh:mm A")}`
              : "N/A"}
          </span>
        </div>
      </div>
      <div className="col-lg-3">
        <div className="additional_direction">
          <h6 className="mb-1">Job Notes</h6>
          <span>{tenantList?.notes ? tenantList?.notes : "---"}</span>
        </div>
      </div>

      <div className="col-lg-3">
        <div className="additional_direction">
          <h6 className="mb-1">Powder Coating Color</h6>
          <div className="position-relative">
            {loadingColors && <SelectBoxLoader />}
            <select 
              className="selectboxdropdown"
              style={{ width: "200px" }}
              value={selectedPowderCoatColor}
              onChange={handlePowderCoatColorChange}
              disabled={updatingColor || !HasPermission("JobEdit")}
            >
              <option value="">Select Color</option>
              {powderCoatColors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.colorName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

         {HasPermission("JobEdit") && (
      <div className="col-lg-3">
        <div className="additional_direction">
          <h6 className="mb-1">Appointment Date &amp; Time</h6>
          <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
           
            {childData?.scheduleDateTime
              ? `${moment(childData.scheduleDateTime).format(
                  "MM-DD-YYYY"
                )} | ${moment(childData.scheduleDateTime).format("hh:mm A")}`
              : "Add Appointment"}
              {!childData?.scheduleDateTime?<i className="fa fa-plus appom" aria-hidden="true"></i>:
              <i class="fa fa-pencil appom" aria-hidden="true"></i>}
          </span>
        </div>
      </div>
      )}
      <div className="col-lg-3">
        <PreviewFiles file={tenantList?.attachmentsAny} />
      </div>
     {open &&<Appointment
        open={open}
        handleclose={() => setOpen(false)}
        action={open}
        jobId={tenantList?.jobId}
        sendToParent={handleChildData}
      />
     }
    </div>
  );
}

const PreviewFiles = ({ file, isdelete = false, handleImageDelelet }) => {
  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {file &&
          file.length > 0 &&
          file.map((val, i) => {
            const fileExtension = val.split(".").pop().toLowerCase();
            const isImage = ["jpeg", "jpg", "png"].includes(fileExtension);
            return (
              <React.Fragment key={i}>
                <Link
                  to={val.trim()}
                  target="_blank"
                  className="d-block attchment-file tax_document"
                >
                  {isImage ? (
                    <img
                      src={val}
                      alt={`Preview ${val}`}
                      height={30}
                      width={30}
                      loading="lazy"
                    />
                  ) : (
                    <img src="/image/file.svg" alt="File preview" loading="lazy"/>
                  )}
                </Link>
                {isdelete && (
                  <i
                    className="fa fa-times deleteimage"
                    onClick={() => handleImageDelelet(i)}
                  ></i>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
};

function FormatPhoneNumber(input) {
  // Remove everything except numbers
  let cleaned = input?.replace(/\D/g, '');

  // Remove leading 1 if user manually typed it
  if (cleaned?.startsWith('1')) {
    cleaned = cleaned?.slice(1);
  }

  // Format based on how many digits the user typed
  if (cleaned?.length <= 3) {
    return `+1(${cleaned}`;
  } else if (cleaned?.length <= 6) {
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(3)}`;
  } else if (cleaned?.length <= 10) {
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(3, 6)}-${cleaned?.slice(6)}`;
  } else {
    // Limit to 10 digits after +1
    cleaned = cleaned?.slice(0, 10);
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(3, 6)}-${cleaned?.slice(6)}`;
  }
}


export {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
  CommonUploadImage,
  CustomMessages,
  FileType,
  AcceptFileType,
  SubmitButton,
  Delete,
  HasPermission,
  SelectBoxLoader,
  ColorList,
  BackButton,
  JobUi,
  PreviewFiles,
  FormatPhoneNumber
};
