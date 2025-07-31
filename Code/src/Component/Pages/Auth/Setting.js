import React, { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import {
  ApiLoder,
  ColorList,
  CustomMessages,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import Header from "../../../Layout/header";
import SubmitButton from "../../Form/SubmitButton";
import { useDispatch } from "react-redux";
import { Profile } from "../../../Redux/Redux/Action/Action";
import Selectbox from "../../Form/Selectbox";
import { PostImage } from "../../../utils/apiCall";
import InputField from "../../Form/InputField";

const Setting = () => {
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState({
    logo: "",
    primaryColor: "#1d7e8b",
    phoneNumber: "",
    email: "",
    companyName: "",
    streetAddress: "",
    city: "",
    country: "",
    zipCode: "",
    markup: null,
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const [image, setImage] = useState("");
  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setValue((val) => {
      return { ...val, [name]: value };
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
          apiUrls.UpdateSettingById,
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
      const apiResponse = await callAPI(apiUrls.SettingById, {}, "POST", {});
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setValue(apiResponse?.data?.data);
        handleProfileUpdate({
          primaryColor: apiResponse?.data?.data.primaryColor,
          logo: apiResponse?.data?.data.logo,
          companyName: apiResponse?.data?.data.companyName,
          streetAddress: apiResponse?.data?.data.streetAddress,
          city: apiResponse?.data?.data.city,
          country: apiResponse?.data?.data.country,
          zipCode: apiResponse?.data?.data.zipCode,
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

  const UploadImage = async (e, allowedFileTypes) => {
    let file = [...e.target.files];
    let name = e?.target?.name;
    if (
      allowedFileTypes.includes(file[0]?.type) ||
      allowedFileTypes.includes(file[0]?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      if (path) {
        setValue((val) => {
          return { ...val, [name]: path[0] };
        });
        setImage(URL.createObjectURL(file[0]));
      } else {
        setValue((val) => {
          return { ...val, [name]: "" };
        });
      }
      e.target.value = null;
    } else {
      ErrorMessage("Invalid file Format");
      setValue((val) => {
        return { ...val, [name]: "" };
      });
      e.target.value = null;
      return false;
    }
  };

  return (
    <div className="intersight_content">
      {loader && <ApiLoder />}
      <Header title="Setting" />
      <div className="body_content">
        <div className="contact-profile">
          <div className="form-design"  style={{ background: "#f5f5f5", padding: "10px" }}>
            <form onSubmit={handleSubmit}>
            
                <div className="imagesec text-center mb-30">
                  <div className="imageuploadsec d-inline-block mb-3 position-relative">
                    <div className="upload-container">
                      <input
                        id="fileInput"
                        type="file"
                        name="logo"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={(e) => {
                          UploadImage(e, [
                            "image/png",
                            "image/jpg",
                            "image/jpeg",
                          ]);
                        }}
                      />
                      <label htmlFor="fileInput">
                        <span className="gallery-icon">
                          <img
                            src={
                              image
                                ? image
                                : value.logo
                                ? value.logo
                                : "/image/camera (1) 1.png"
                            }
                            alt="Gallery Icon"
                            loading="lazy"
                          />
                        </span>
                      </label>
                    </div>
                    {(image || value.logo) && (
                      <span
                        className="delete-image"
                        onClick={() => {
                          setValue((val) => ({ ...val, logo: "" }));
                          setImage("");
                        }}
                      >
                        X
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-16">Upload Logo</h2>
                    <p className="font-14">
                      Please upload right to use image and format like: png,
                      jpg, jpeg
                    </p>
                  </div>
                </div>
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
                      "companyName",
                      value?.companyName,
                      `required|string`
                    )}
                  </div>
                </div>
                </div>
                {value.isSubtenant && (
                  <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <InputField
                      labelName={"Markup"}
                      placeholderName={"Enter Markup"}
                      type={"text"}
                      handleChange={handleChange}
                      id={"markup"}
                      name={"markup"}
                      value={value.markup}
                     
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "markup",
                        value?.markup,
                        `numeric`
                      )}
                    </div>
                  </div>
                  </div>
                )}
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
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "streetAddress",
                      value?.streetAddress,
                      `required`
                    )}
                  </div>
                </div>
                </div>
                   <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"State"}
                    placeholderName={"Enter State"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"country"}
                    name={"country"}
                    value={value.country}
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "State",
                      value?.country,
                      `required`
                    )}
                  </div>
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
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "city",
                      value?.city,
                      `required`
                    )}
                  </div>
                </div>
                </div>
             
                <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"Zip Code"}
                    placeholderName={"Enter zipCode"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"zipCode"}
                    name={"zipCode"}
                    value={value.zipCode}
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "zipCode",
                      value?.zipCode,
                      `required`
                    )}
                  </div>
                </div>
                </div>
                <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <Selectbox
                    labelName={"Site Color"}
                    options={ColorList}
                    handleChange={handleChange}
                    id={"primaryColor"}
                    name={"primaryColor"}
                    value={value.primaryColor}
                    required={true}
                    iscolor={true}
                  />

                  <div className="error">
                    {simpleValidator.current.message(
                      "Site Color",
                      value?.primaryColor,
                      `required`
                    )}
                  </div>
                </div>
                </div>
                <div className="form-group d-flex align-items-center justify-content-end">
                  <SubmitButton
                    type="submit"
                    className="btn blue-btn me-3"
                    name={"Submit"}
                    disabled={loader}
                  />
                  <Link
                    to={"/dashboard"}
                    className="cancel text-decoration-underline"
                  >
                    Cancel
                  </Link>
                </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
