import React, { useEffect, useRef } from "react";
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

import InputField from "../../Form/InputField";
import SimpleReactValidator from "simple-react-validator";
import SubmitButton from "../../Form/SubmitButton";
import Selectbox from "../../Form/Selectbox";
import GetEmailTypeConfiguration from "../../../helpers/GetEmailTypeConfiguration";
import moment from "moment";

export default function Email() {
  const [loder, setLoader] = useState(false);
  const [ghl, setGhl] = useState(false);
   const [isdata, setisdata] = useState(false);
  const [value, setValue] = useState({
    smtpServer: "",
    port: "",
    username: "",
    password: "",
    useSsl: true,
    replyTo: "",
    emailType: null,
    from: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetEmailConfiguration,
        {},
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        if (
          apiResponse?.data?.data?.emailType !==
          "d4efb2c6-a9cb-4433-9698-29ad10cc87a1"
        ) {
          simpleValidator.current.purgeFields(["smtpServer", "port", "useSsl"]);
        }

        if (!apiResponse?.data?.data?.emailType) {
          setGhl(true);
        } else {
          setGhl(false);
           setisdata(true)
        }
      } else {
        setGhl(true);
        setValue({});
      }
    } catch (error) {
      setGhl(true);
      setLoader(false);
     
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    if (name === "emailType") {
      if (value !== "d4efb2c6-a9cb-4433-9698-29ad10cc87a1") {
        simpleValidator.current.purgeFields(["smtpServer", "port", "useSsl"]);
      }
       setisdata(false)
        setGhl(true);
    }
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
        const sanitizedValue = {
          ...value,
          useSsl: value.useSsl === "false" ? false : true,
          port: value.port ? value.port : 0,
        };
        const response = await callAPI(
          apiUrls.AddOrUpdateEmailConfiguration,
          {},
          "POST",
          sanitizedValue
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

  const handleDelte = async (type) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to Connect to  ${type}?`
    );
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.EmailOAuth,
          { OauthType: type },
          "GET",
          {}
        );
        setLoader(false);

        if (response?.data?.isSuccess) {
          window.open(
            response?.data?.data,
            "_blank",
            "noopener,noreferrer"
          );
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
  const emailType = value?.emailType;
  const emailTypeName = value?.emailTypeName;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (
      !expirationTime ||
      emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1"
    ) {
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
  }, [expirationTime, emailType]);

  return (
    <>
      {loder && <ApiLoder />}
      <div className="contact-profile">
        <div className="d-flex align-items-center justify-content-between mb-30">
          <TableTitle title="Manage Email Configuration" />
        </div>
        <div
          className="form-design"
          style={{ background: "#f5f5f5", padding: "10px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <label className="font-14">
                    Method Type <sup>*</sup>
                  </label>
                  <GetEmailTypeConfiguration
                    value={value.emailType}
                    fn={handleChange}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "Method Type",
                      value?.emailType,
                      `required`
                    )}
                  </div>
                </div>
              </div>
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"SMTP Server"}
                      placeholderName={"Enter SMTP Server"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"smtpServer"}
                      name={"smtpServer"}
                      value={value.smtpServer}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "SMTP Server",
                        value?.smtpServer,
                        `required`
                      )}
                    </div>
                  </div>
                </div>
              )}
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Port"}
                      placeholderName={"Enter Port"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"port"}
                      name={"port"}
                      value={value.port}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "Port",
                        value?.port,
                        `required|integer`
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"User Name"}
                    placeholderName={"Enter User Name"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"username"}
                    name={"username"}
                    value={value.username}
                  />
                </div>
              </div>
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Password"}
                      placeholderName={"Enter Password"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"password"}
                      name={"password"}
                      value={value.password}
                    />
                  </div>
                </div>
              )}
              {value.emailType === "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <Selectbox
                      labelName={"SSL/TLS"}
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      handleChange={handleChange}
                      id={"useSsl"}
                      name={"useSsl"}
                      value={value.useSsl}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "SSL/TLS",
                        value?.useSsl,
                        `required`
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"From"}
                    placeholderName={"Enter From"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"from"}
                    name={"from"}
                    value={value.from}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"Reply To"}
                    placeholderName={"Enter Reply To"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"replyTo"}
                    name={"replyTo"}
                    value={value.replyTo}
                  />
                </div>
              </div>{" "}
              {value.isConnected && isdata && (
                <p>
                  {timeLeft && "Expiration Date/time:"}{" "}
                  <strong>
                    {timeLeft && `${timeLeft}`} (Connected with {emailTypeName})
                  </strong>
                </p>
              )}
              <div className="form-style form-group d-flex align-items-center justify-content-end">
                {HasPermission("EmailConfigurationEdit") && (
                  <SubmitButton
                    type="submit"
                    className="btn blue-btn me-3"
                    name={"Submit"}
                    disabled={loder}
                  />
                )}

                {!ghl &&
                  value?.emailType !==
                    "d4efb2c6-a9cb-4433-9698-29ad10cc87a1" && (
                    <button
                      type="button"
                      className="btn btn-success me-3"
                      onClick={() =>
                        handleDelte(
                          value?.emailType ===
                            "16b6b079-5e5b-44d8-8cb4-1b7aa6143d87"
                            ? "Google"
                            : "Microsoft365"
                        )
                      }
                    >
                      Connect to{" "}
                      {value?.emailType ===
                      "16b6b079-5e5b-44d8-8cb4-1b7aa6143d87"
                        ? "Google"
                        : "Microsoft365"}
                    </button>
                  )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
