import React, { useEffect, useRef } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  CustomMessages,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import Tab from "../../Form/Tab";
import { EmailSvg, GhlSvg, StripeSvg } from "../../../SvgFile/Index";
import InputField from "../../Form/InputField";
import SimpleReactValidator from "simple-react-validator";
import SubmitButton from "../../Form/SubmitButton";
import Stripe from "./Stripe";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import Stages from "./Stages";
import Email from "./Email";

export default function Index() {
  const [loder, setLoader] = useState(false);
  const [open, setopen] = useState(false);
  const [ghl, setGhl] = useState(false);
  const [tabdata, setTabdata] = useState("#pills-overview-tab");
  const [value, setValue] = useState({
    pipelineId: "",
    locationId: "",
    calendarName: "",
    generatedToken: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetGHLConfiguration,
        { code: code },
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if (code) {
          SuccessMessage(apiResponse.data?.message);
          navigate("/configuration");
        }
        if (!apiResponse?.data?.data) {
          setGhl(true);
        } else {
          setGhl(false);
        }
        setValue(apiResponse?.data?.data);
      } else {
        setValue({
          apIkey: "",
          pipelineId: "",
          locationId: "",
          calendarName: "",
          generatedToken: "",
        });
        setGhl(true);
      }
    } catch (error) {
      setGhl(true);
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, [code]);

  // const GetAccessToken = async () => {
  //   try {
  //     await callAPI(apiUrls.GetAccessToken, { code: code }, "GET");
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   if (code) {
  //     GetAccessToken();
  //   }
  // }, [code]);

  const Tablist = [
    HasPermission("GHLView") && {
      status: true,
      id: "#ghl",
      svg: <GhlSvg />,
      title: "GHL Configuration",
    },
    HasPermission("StripeView") && {
      status: false,
      id: "#Stripe",
      svg: <StripeSvg />,
      title: "Stripe Configuration",
    },

    HasPermission("EmailConfigurationView") && {
      status: false,
      id: "#Email",
      svg: <EmailSvg />,
      title: "Email Configuration",
    },
  ];

  const handleTabchnage = (value) => {
    setTabdata(value || Tablist[0]?.id);
  };
  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0]?.id;

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setValue((val) => {
      return { ...val, [name]: value };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.AddGHLConfiguration,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  const handleChnage = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to sync Ghl Configuration?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.ghlsync, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleghluser = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to sync Ghl Users?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.UserSync, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleChnages = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Generate Token?"
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.GenerateToken, {}, "GET");
        setLoader(false);
        if (response.data.isSuccess) {
          setValue((val) => {
            return { ...val, generatedToken: response?.data?.data };
          });
          SuccessMessage(response.data.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleChnagess = async () => {
    const isConfirmed = window.confirm("Are you sure you want to go to Link?");
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.GoHighLevelAuthorization,
          {},
          "GET"
        );
        setLoader(false);

        if (response.data.isSuccess) {
          window.open(response?.data?.data, "_blank", "noopener,noreferrer");
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const handleDelte = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete GHL?");
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.DeleteConfiguration,
          { deleteType: 1, configurationId: value?.id },
          "POST",
          {}
        );
        setLoader(false);

        if (response.data.isSuccess) {
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const expirationTime = value?.refreshExpirationtime;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expirationTime) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = moment();
      const expiry = moment(expirationTime);
      const diff = expiry.diff(now);

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        // Check if today is the same day as expiration
        if (now.isSame(expiry, "day")) {
          const duration = moment.duration(diff);
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const seconds = duration.seconds();

          setTimeLeft(
            `Expires in ${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          const daysLeft = expiry
            .startOf("day")
            .diff(now.startOf("day"), "days");
          setTimeLeft(`${daysLeft} days left`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Configuration" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <Tab Tablist={Tablist} handleTabchnage={handleTabchnage} />
              </ul>
              <div className="tab-content" id="ghl">
                <div
                  className={`tab-pane fade ${
                    initialActiveTab === "#ghl" ? "show active" : ""
                  }`}
                  id="ghl"
                  role="tabpanel"
                  aria-labelledby="pills-overview-tab"
                  tabIndex={0}
                >
                  <div className="contact-profile">
                    <div className="d-flex align-items-center justify-content-between mb-30">
                      <TableTitle title="Manage GHL Configuration" />
                    </div>
                    <div
                      className="form-design"
                      style={{ background: "#f5f5f5", padding: "10px" }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {/* <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <InputField
                                labelName={"Api Key"}
                                placeholderName={"Enter Api Key"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"apIkey"}
                                name={"apIkey"}
                                value={value.apIkey}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "apIkey",
                                  value?.apIkey,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div> */}
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <InputField
                                labelName={"Location Id"}
                                placeholderName={"Enter LocationId"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"locationId"}
                                name={"locationId"}
                                value={value.locationId}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "Location Id",
                                  value?.locationId,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <InputField
                                labelName={"Pipe line Info"}
                                placeholderName={"Enter Pipe line Info"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"pipelineId"}
                                name={"pipelineId"}
                                value={value.pipelineId}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "pipelineInfo",
                                  value?.pipelineId,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                              <InputField
                                labelName={"Calendar Name"}
                                placeholderName={"Enter Calendar Name"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"calendarName"}
                                name={"calendarName"}
                                value={value.calendarName}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "Calendar Name",
                                  value?.calendarName,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4">
                            <div className="form-group position-relative copy-input-new">
                              <InputField
                                labelName={"Generated Token"}
                                placeholderName={"Enter Generated Token"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"generatedToken"}
                                name={"generatedToken"}
                                value={value.generatedToken}
                              />
                              {value.generatedToken && (
                                <span
                                  className="copy-span"
                                  onClick={() => {
                                    navigator.clipboard
                                      .writeText(value?.generatedToken)
                                      .then(() => {
                                        SuccessMessage(
                                          "Token copied to clipboard!"
                                        );
                                      })
                                      .catch((err) => {
                                        console.error("Failed to copy: ", err);
                                      });
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M21 8.94C20.9896 8.84813 20.9695 8.75763 20.94 8.67V8.58C20.8919 8.47718 20.8278 8.38267 20.75 8.3L14.75 2.3C14.6673 2.22222 14.5728 2.15808 14.47 2.11C14.4402 2.10576 14.4099 2.10576 14.38 2.11C14.2784 2.05174 14.1662 2.01434 14.05 2H10C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5V6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H14C14.7956 22 15.5587 21.6839 16.1213 21.1213C16.6839 20.5587 17 19.7956 17 19V18H18C18.7956 18 19.5587 17.6839 20.1213 17.1213C20.6839 16.5587 21 15.7956 21 15V9C21 9 21 9 21 8.94ZM15 5.41L17.59 8H16C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V5.41ZM15 19C15 19.2652 14.8946 19.5196 14.7071 19.7071C14.5196 19.8946 14.2652 20 14 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V9C5 8.73478 5.10536 8.48043 5.29289 8.29289C5.48043 8.10536 5.73478 8 6 8H7V15C7 15.7956 7.31607 16.5587 7.87868 17.1213C8.44129 17.6839 9.20435 18 10 18H15V19ZM19 15C19 15.2652 18.8946 15.5196 18.7071 15.7071C18.5196 15.8946 18.2652 16 18 16H10C9.73478 16 9.48043 15.8946 9.29289 15.7071C9.10536 15.5196 9 15.2652 9 15V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H13V7C13 7.79565 13.3161 8.55871 13.8787 9.12132C14.4413 9.68393 15.2044 10 16 10H19V15Z"
                                      fill="#9A9A9A"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                          {!ghl && (
                            <div className="col-lg-4 col-md-4">
                              <div className="generate-btn-mt">
                                <button
                                  type="button"
                                  onClick={handleChnages}
                                  className="btn blue-btn me-2"
                                >
                                  Generate Webhook Token
                                </button>
                              </div>
                            </div>
                          )}
                          <p>
                            Last Sync :{" "}
                            <strong>
                              {value?.lastSync
                                ? `${moment(value?.lastSync).format(
                                    "MM-DD-YYYY"
                                  )} | ${moment(value?.lastSync).format(
                                    "hh:mm A"
                                  )}`
                                : "N/A"}
                            </strong>
                          </p>
                          {value.isConnected && (
                            <p>
                              {timeLeft && "Expiration Date/time:"}{" "}
                              <strong>{timeLeft && `${timeLeft}`}</strong>
                            </p>
                          )}
                          {HasPermission("GHLEdit") && (
                            <>
                              <div className="form-group d-flex align-items-center justify-content-end">
                                <SubmitButton
                                  type="submit"
                                  className="btn blue-btn me-2"
                                  name={"Submit"}
                                  disabled={loder}
                                />
                                {!ghl && (
                                  <>
                                    {value.access_Token &&
                                      value.refresh_Token && (
                                        <button
                                          type="button"
                                          onClick={handleChnage}
                                          className="btn blue-btn me-2"
                                        >
                                          Sync GHL
                                        </button>
                                      )}

                                    {value.access_Token &&
                                      value.refresh_Token && (
                                        <button
                                          type="button"
                                          onClick={handleghluser}
                                          className="btn blue-btn me-2"
                                        >
                                          Sync GHL Users
                                        </button>
                                      )}
                                    {!value?.isConnected && (
                                      <button
                                        type="button"
                                        onClick={handleChnagess}
                                        className="btn blue-btn me-2"
                                      >
                                        Link to Ghl
                                      </button>
                                    )}

                                    {value.access_Token &&
                                      value.refresh_Token && (
                                        <button
                                          type="button"
                                          onClick={() => setopen(true)}
                                          className="btn blue-btn me-2"
                                        >
                                          GHL Stages Mapping
                                        </button>
                                      )}
                                    {value?.isConnected && (
                                      <button
                                        type="button"
                                        onClick={handleDelte}
                                        className="btn btn-danger"
                                      >
                                        Unlink GHL
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* vendorlisttab */}

                {HasPermission("StripeView") && (
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#Stripe" ? "show active" : ""
                    }`}
                    id="Stripe"
                    role="tabpanel"
                    aria-labelledby="pills-payment-tab"
                    tabIndex={0}
                  >
                    {tabdata === "#Stripe" && <Stripe />}
                  </div>
                )}

                {HasPermission("EmailConfigurationView") && (
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#Email" ? "show active" : ""
                    }`}
                    id="Email"
                    role="tabpanel"
                    aria-labelledby="pills-payment-tab"
                    tabIndex={0}
                  >
                    {tabdata === "#Email" && <Email />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Stages open={open} handleclose={() => setopen(false)} action={open} />
    </>
  );
}
