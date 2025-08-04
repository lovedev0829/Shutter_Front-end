import React, { useEffect, useRef, useState } from "react";
import { 
  Dialog,
  DialogActions,
  Button,
  CircularProgress
} from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ColorList,
  ErrorMessage,
  FormatPhoneNumber,
  getHomeUrl,
  SuccessMessage,
} from "../../../helpers/common";
import InputField from "../../Form/InputField";
import { Eyeclose, Eyeopen } from "../../../SvgFile/Index";
import { PostImage } from "../../../utils/apiCall";
import Selectbox from "../../Form/Selectbox";

const AddEditTenent = ({
  open,
  handleclose,
  TenantlistAPI,
  action,
  object,
}) => {
  const defaultState = {
    companyName: "",
    firstName: "",
    primaryColor: "#1d7e8b",
    logo: "",
    lastName: "",
    code: "",
    email: "",
    phoneNumber: "",
    password: "",
    url: getHomeUrl(),
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhoneNumber: "",
    streetAddress: "",
    city: "",
    country: "",
    zipCode: "",
    invoicePrefix:"",
    suffix:""
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [eye, setEye] = useState(false);
  const [image, setImage] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  let debounceTimer;

  const handleChange = (e) => {
    if (e.target.name === "companyName" && action !== "edit") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        CodeGenarte(e.target.value);
      }, 500); // 500ms delay
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
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

  const TenantAddUpadte = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        let formBody = new FormData();
        for (var i in value) {
          formBody.append(i, value[i]);
        }
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.TenantCreate : apiUrls.TenantUpdate,
          {},
          "POST",
          formBody
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await TenantlistAPI();
          handleclose();
          setImage("");
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
      simpleValidator.current.purgeFields("password");
      setValue(object);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);

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

  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };

  const CodeGenarte = async (code) => {
    try {
      if (code) {
        const apiResponse = await callAPI(
          apiUrls.GenerateCode,
          { code: code },
          "POST",
          {}
        );
        if (apiResponse?.data?.isSuccess) {
          setValue((val) => {
            return { ...val, code: apiResponse?.data?.data?.Code,invoicePrefix:apiResponse?.data?.data?.InvoicePrefix };
          });
        } else {
        }
      }
    } catch (error) {}
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
                  {action === "add" ? "Add Tenant" : "Update Tenant"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                    setImage("");
                  }}
                ></i>
              </div>
              <form onSubmit={TenantAddUpadte}>
                <div className="modal-body modale-scroll">
                  <div className="form-design window-form-design">
                    <div className="imagesec d-flex align-items-center gap-3 mb-30">
                      <div className="imageuploadsec position-relative">
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
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"code"}
                            placeholderName={"Enter code"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"code"}
                            name={"code"}
                            value={value.code}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Code",
                              value?.code,
                              `required|alpha_num`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Invoice Prefix"}
                            placeholderName={"Enter Invoice Prefix"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"invoicePrefix"}
                            name={"invoicePrefix"}
                            value={value.invoicePrefix}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Invoice Prefix",
                              value?.invoicePrefix,
                              `required|min:3`
                            )}
                          </div>
                        </div>
                      </div>
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
                          <InputField
                            labelName={"Email"}
                            placeholderName={"Enter email"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"email"}
                            name={"email"}
                            value={value.email}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "email",
                              value?.email,
                              `required|email|max:50`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Phone Number"}
                            placeholderName={"Enter Phone Number"}
                            type={"text"}
                            handleChange={handleChangenumber}
                            id={"phoneNumber"}
                            name={"phoneNumber"}
                            value={FormatPhoneNumber(value.phoneNumber||"")}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "phoneNumber",
                              value?.phoneNumber,
                              `required|integer|min:10|max:10`
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
                      </div>{" "}
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
                      </div>{" "}
                    
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
                   
                      <div className="col-lg-12 col-md-12">
                        <h1 className="font-18 mb-30 mt-3 border-bottom pb-2">
                          User Details
                        </h1>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"User first name"}
                            placeholderName={"Enter user first name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"userFirstName"}
                            name={"userFirstName"}
                            value={value.userFirstName}
                            required={true}
                            disabled={action === "edit" ? true : false}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "User First Name",
                              value?.userFirstName,
                              `required|min:3|alpha|max:50`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"User last name"}
                            placeholderName={"Enter user last name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"userLastName"}
                            name={"userLastName"}
                            value={value.userLastName}
                            required={true}
                            disabled={action === "edit" ? true : false}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "User last name",
                              value?.userLastName,
                              `required|min:3|alpha|max:50`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"User email"}
                            placeholderName={"Enter user email"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"userEmail"}
                            name={"userEmail"}
                            value={value.userEmail}
                            required={true}
                            disabled={action === "edit" ? true : false}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "User email",
                              value?.userEmail,
                              `required|email|max:50`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"User phone number"}
                            placeholderName={"Enter User phone number"}
                            type={"text"}
                            handleChange={handleChangenumber}
                            id={"userPhoneNumber"}
                            name={"userPhoneNumber"}
                            value={FormatPhoneNumber(value.userPhoneNumber||"")}
                            required={true}
                            disabled={action === "edit" ? true : false}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "User phone number",
                              value?.userPhoneNumber,
                              `required|integer|min:10|max:10`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <div className="position-relative password_svg">
                            <InputField
                              labelName={"Password"}
                              placeholderName={"Enter Password"}
                              type={eye ? "text" : "password"}
                              handleChange={handleChange}
                              id={"password"}
                              name={"password"}
                              value={value.password}
                              required={action === "edit" ? false : true}
                            />

                            <span
                              onClick={showPassword}
                              style={{ cursor: "pointer" }}
                            >
                              {eye ? <Eyeopen /> : <Eyeclose />}{" "}
                            </span>
                          </div>
                          <div className="error">
                            {action !== "edit" &&
                              simpleValidator.current.message(
                                "password",
                                value?.password,
                                "required|min:8"
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setValue(defaultState);
                      handleclose();
                      simpleValidator.current.hideMessages();
                      forceUpdate();
                      setImage("");
                    }}
                    sx={{ 
                      textTransform: 'none',
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loader}
                    startIcon={loader && <CircularProgress size={16} color="inherit" />}
                    sx={{ 
                      textTransform: 'none',
                      minWidth: 100,
                      '&:disabled': {
                        opacity: 0.7
                      }
                    }}
                  >
                    {loader ? 'Processing...' : (action === "add" ? "Submit" : "Update")}
                  </Button>
                </DialogActions>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddEditTenent;
