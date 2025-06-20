import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import moment from "moment";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "./common";
import AssignedPersonnelDropdown from "./AssignedPersonnelDropdown";
import AddEditUser from "../Component/Pages/Users/AddEditUser";
import { Tooltip } from "@mui/material";

const Appointment = ({ open, handleclose, action, jobId, sendToParent }) => {
  const defaultState = {
    scheduleDateTime: "",
    title: "",
    description: "",
    ghlUserId: "",
  };

  const [value, setValue] = useState(defaultState);
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const [loader, setLoader] = useState(false);
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
        value.jobId = jobId;
        const apiResponse = await callAPI(
          apiUrls.CreateAppointment,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
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

  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAppointment,
        { JobId: jobId },
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if (apiResponse?.data?.data?.length > 0) {
          setValue(apiResponse?.data?.data[0]);
          sendToParent(apiResponse?.data?.data[0]);
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();

    // eslint-disable-next-line
  }, [action, jobId]);

  const handleapi = () => {
    setvendorlist((prev) => !prev);
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
                  Add/Update Appointment
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
                  {loader && <ApiLoder />}
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14" htmlFor={"title"}>
                            Title <sup>*</sup>
                          </label>
                          <input
                            type="text"
                            value={value.title}
                            onChange={handleChange}
                            className="form-control"
                            id={"title"}
                            name={"title"}
                            placeholder={"Enter title"}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Title",
                              value?.title,
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
                            Schedule Date and Time <sup>*</sup>
                          </label>
                          <div className="position-relative">
                            <input
                              type="datetime-local"
                              style={{ color: "white" }}
                              value={value.scheduleDateTime || ""}
                              onChange={handleChange}
                              className="form-control"
                              id="scheduleDateTime"
                              name="scheduleDateTime"
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
                              {value.scheduleDateTime
                                ? moment(value.scheduleDateTime).format(
                                    "MM-DD-YYYY hh:mm A"
                                  )
                                : "mm-dd-yyyy --:--"}
                            </span>
                          </div>
                          <div className="error">
                            {simpleValidator.current.message(
                              "Schedule Date and Time",
                              value?.scheduleDateTime,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label className="font-14" htmlFor={"description"}>
                            Description
                          </label>
                          <input
                            type="text"
                            value={value.description}
                            onChange={handleChange}
                            className="form-control"
                            id={"description"}
                            name={"description"}
                            placeholder={"Enter description"}
                          />
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

                    <button
                      type="submit"
                      className="btn blue-btn"
                      disabled={loader}
                    >
                      Submit
                      {loader && (
                        <i
                          className="fa fa-spinner fa-spin"
                          style={{ marginLeft: "10px" }}
                        ></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      <AddEditUser
        open={vendor}
        handleclose={() => setvendor(false)}
        action={"add"}
        LanguageListAPI={handleapi}
        object={""}
      />
    </>
  );
};

export default Appointment;
