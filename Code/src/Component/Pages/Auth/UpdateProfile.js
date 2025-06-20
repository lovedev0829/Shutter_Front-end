import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import {
  ApiLoder,
  CustomMessages,
  ErrorMessage,
  FormatPhoneNumber,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import Header from "../../../Layout/header";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { useDispatch } from "react-redux";
import { Profile } from "../../../Redux/Redux/Action/Action";

const UpdateProfile = () => {
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    suffix: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
  
      if (e.target.name === "phone") {
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
  

  const dispatch = useDispatch();

  const handleProfileUpdate = (updatedFields) => {
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    dispatch(Profile(updatedUser));
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
          apiUrls.ProfileUpdate,
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

  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.ProfileDetails, {}, "POST", {});
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        handleProfileUpdate({
          firstName: apiResponse?.data?.data.firstName,
          lastName: apiResponse?.data?.data.lastName,
          suffix:apiResponse?.data?.data.suffix,
          phone: apiResponse?.data?.data.phone,
        });
      } else {
        ErrorMessage(apiResponse.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="intersight_content">
      {loader && <ApiLoder />}
      <Header title="Update Profile" />
      <div className="body_content">
        <div className="contact-profile">
          <div className="form-design">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"First Name"}
                      placeholderName={"Enter First name"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"firstName"}
                      name={"firstName"}
                      value={value.firstName}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "firstName",
                        value?.firstName,
                        `required|min:3|alpha|max:50`
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Last Name"}
                      placeholderName={"Enter Last name"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"lastName"}
                      name={"lastName"}
                      value={value.lastName}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "lastName",
                        value?.lastName,
                        `required|min:3|alpha|max:50`
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Suffix"}
                      placeholderName={"Enter suffix"}
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
                    <InputField
                      labelName={"Email"}
                      placeholderName={"Enter email"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"email"}
                      name={"email"}
                      value={value.email}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Phone Number"}
                      placeholderName={"Enter Phone Number"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"phone"}
                      name={"phone"}
                      value={FormatPhoneNumber(value.phone||"")}
                      required={true}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "phone",
                        value?.phone,
                        `required|integer|min:10|max:10`
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-style form-group d-flex align-items-center justify-content-end mt-2">
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

export default UpdateProfile;
