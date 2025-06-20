import React, { useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Link, useNavigate } from "react-router-dom";
import {
  CustomMessages,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { removeAuth } from "../../../helpers/auth";
import { Eyeclose, Eyeopen } from "../../../SvgFile/Index";
import Header from "../../../Layout/header";
import SubmitButton from "../../Form/SubmitButton";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData"));

  const [value, setValue] = useState({
    passWord: "",
    oldPassWord: "",
    confirmPassWord: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();

  const navigate = useNavigate();

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
          apiUrls.ResetPassword,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
          handleLogout();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  function handleLogout() {
    navigate(`/${user?.code}`);
    removeAuth();
  }

  return (
    <div className="intersight_content">
      <Header title="Change Password" />
      <div className="body_content">
        <div className="contact-profile">
          <div className="form-design">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-4 col-md-4 mb-2">
                  <label className="font-14">
                    Current Password <sup>*</sup>
                  </label>
                  <div className="position-relative password_svg">
                    <input
                      name="oldPassWord"
                      type={`${currentPassword === true ? "text" : "password"}`}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder={"Enter Current Password"}
                      value={value?.oldPassWord}
                      onChange={handleChange}
                    />
                    {currentPassword === true ? (
                      <span
                        onClick={() => {
                          setCurrentPassword(!currentPassword);
                        }}
                      >
                        {" "}
                        <Eyeopen />{" "}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setCurrentPassword(!currentPassword);
                        }}
                      >
                        {" "}
                        <Eyeclose />
                      </span>
                    )}
                  </div>
                  <div className="error">
                    {simpleValidator.current.message(
                      "oldPassword",
                      value?.oldPassWord,
                      "required"
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 mb-2">
                  <label className="font-14">
                    New Password <sup>*</sup>
                  </label>
                  <div className="position-relative password_svg">
                    <input
                      type={`${newPassword === true ? "text" : "password"}`}
                      name="passWord"
                      className="form-control"
                      id="exampleInputPassword2"
                      placeholder={"Enter New Password"}
                      value={value?.passWord}
                      onChange={handleChange}
                    />
                    {newPassword === true ? (
                      <span
                        onClick={() => {
                          setNewPassword(!newPassword);
                        }}
                      >
                        {" "}
                        <Eyeopen />{" "}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setNewPassword(!newPassword);
                        }}
                      >
                        <Eyeclose />
                      </span>
                    )}
                  </div>
                  <div className="error">
                    {simpleValidator.current.message(
                      "newPassword",
                      value?.passWord,
                      "required"
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 mb-2">
                  <label className="font-14">
                    Confirm Password <sup>*</sup>
                  </label>
                  <div className="position-relative password_svg">
                    <input
                      type={`${confirmPassword === true ? "text" : "password"}`}
                      className="form-control"
                      id="exampleInputPassword3"
                      placeholder={"Enter Confirm Password"}
                      name="confirmPassWord"
                      value={value?.confirmPassWord}
                      onChange={handleChange}
                    />
                    {confirmPassword === true ? (
                      <span
                        onClick={() => {
                          setConfirmPassword(!confirmPassword);
                        }}
                      >
                        {" "}
                        <Eyeopen />{" "}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setConfirmPassword(!confirmPassword);
                        }}
                      >
                        <Eyeclose />
                      </span>
                    )}
                  </div>
                  <div className="error">
                    {simpleValidator.current.message(
                      "confirm password",
                      value?.confirmPassWord,
                      `required|in:${value?.passWord}`
                    )
                      ? "Password Not Match"
                      : ""}
                  </div>
                </div>

                <div className="form-style form-group d-flex align-items-center justify-content-end">
                  <Link
                    to={"/dashboard"}
                    className="cancel text-decoration-underline"
                  >
                    Cancel
                  </Link>
                  <SubmitButton
                    type="submit"
                    className="btn blue-btn"
                    name={"Submit"}
                    disabled={loader}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
