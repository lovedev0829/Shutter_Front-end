import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import DateInputField from "../../Form/DateInputField";
import JobtitleDropdown from "../../../helpers/JobtitleDropdown";
import AssignedPersonnelDropdown from "../../../helpers/AssignedPersonnelDropdown";
import ExpiryDate from "../../Form/ExpiryDate";
import GetAllEstimate from "../../../helpers/GetAllEstimate";
import AddEditUser from "../Users/AddEditUser";
import { Tooltip } from "@mui/material";

const AddEditJobShedule = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  jobid,
}) => {
  const defaultState = {
    jobId: jobid,
    jobTitleId: "",
    userId: "",
    startDate: "",
    endDate: "",
    dayStartTime: "",
    dayEndDateTime: "",
    estimateId: "",
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
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
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.JobScheduleCreate
            : apiUrls.JobScheduleUpdate,
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
        scroll="paper"
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
                  {action === "add"
                    ? "Add Job Schedule"
                    : "Update Job Schedule"}
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
                          <label className="font-14">
                            Estimate Name <sup>*</sup>
                          </label>
                          <GetAllEstimate
                            value={value.estimateId}
                            fn={handleChange}
                            jobId={jobid}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "estimateId",
                              value?.estimateId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Job Title <sup>*</sup>
                          </label>
                          <JobtitleDropdown
                            name="jobTitleId"
                            value={value.jobTitleId}
                            fn={handleChange}
                            load={action}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Job title",
                              value?.jobTitleId,
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
                              Resource Name<sup>*</sup>
                              <Tooltip
                                title={
                                  <span>
                                    If the user does not appear in this list,
                                    please reach out to your Admin or&nbsp;
                                    <Link
                                    onClick={() => {
                                      localStorage.setItem("activeTab2", "#ghl");
                                    }}
                                      to="/configuration"
                                      style={{
                                        color: "yellow",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      synchronize the users from GHL
                                    </Link>
                                    .
                                  </span>
                                }
                              >
                                <span className="product_question">?</span>
                              </Tooltip>
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
                            name="userId"
                            value={value.userId}
                            fn={handleChange}
                            load={vendorlist}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Resource Name",
                              value?.userId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Start Date <sup>*</sup>
                          </label>
                          <DateInputField
                            name="startDate"
                            value={value?.startDate}
                            handleChange={handleChange}
                            action={action}
                          />
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
                            Day Start Time <sup>*</sup>
                          </label>
                          <div className="position-relative calender-input">
                            <input
                              className="form-control"
                              type="time"
                              name="dayStartTime"
                              value={value?.dayStartTime}
                              onChange={handleChange}
                            />
                            <img src="/image/clock.svg" alt="" loading="lazy" />
                          </div>
                          <div className="error">
                            {simpleValidator.current.message(
                              "dayStartTime",
                              value?.dayStartTime,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            End Date <sup>*</sup>
                          </label>
                          <ExpiryDate
                            name={"endDate"}
                            startDate={value?.startDate}
                            expiryDate={value?.endDate}
                            handlechange={handleChange}
                            action={action}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "endDate",
                              value?.endDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Day End Time <sup>*</sup>
                          </label>
                          <div className="position-relative calender-input">
                            <input
                              type="time"
                              className="form-control"
                              name="dayEndDateTime"
                              value={value?.dayEndDateTime}
                              onChange={handleChange}
                            />
                            <img src="/image/clock.svg" alt="" loading="lazy" />
                          </div>
                          <div className="error">
                            {simpleValidator.current.message(
                              "dayEndDateTime",
                              value?.dayEndDateTime,
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
    </>
  );
};

export default AddEditJobShedule;
