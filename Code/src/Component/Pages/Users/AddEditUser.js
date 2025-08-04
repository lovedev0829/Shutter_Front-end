import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, FormatPhoneNumber, HasPermission, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import { Eyeclose, Eyeopen } from "../../../SvgFile/Index";
import RoleDropdown from "../../../helpers/RoleDropdown";
import JobtitleDropdown from "../../../helpers/JobtitleDropdown";
import AddEditRole from "../Role/AddEditRole";
import GetAllGHLUsers from "../../../helpers/GetAllGHL_Users";
import AddEditJobTitle from "../Jobtitle/AddEditJobTitle";

const AddEditUser = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    jobTitle: "",
    roleId: "",
    ghlUserId:"",
    suffix:""
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
   const [user, setuser] = useState(false);
  const [userlist, setuserlist] = useState(false);
  const [loader, setLoader] = useState(false);
  const [eye, setEye] = useState(false);
   const [permission, setPermission] = useState([]);
  const simpleValidator = useRef(new SimpleReactValidator());
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
  

  const UserAddEdit = async (e) => {
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
          action === "add" ? apiUrls.UserCreate : apiUrls.UserUpdate,
          {},
          "POST",
          formBody
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

 const PermissionlistAPI = async () => {
        try {
        const apiResponse = await callAPI(apiUrls.permissionlist,{},"GET");
        if (apiResponse?.data?.isSuccess) {
             setPermission(apiResponse?.data?.data)
        } else {
          setPermission([])
        }
      } catch (error) {
        
       }
    }
  


  useEffect(() => {
    PermissionlistAPI();
    if (action === "edit") {
      simpleValidator.current.purgeFields("password")
      setValue(object);
    } else {setValue(defaultState);} 
    setvendorlist(false)
    setuserlist(false)
    // eslint-disable-next-line
  }, [open, action]);

  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };
  const handleapi = () => {
    setvendorlist((prev) => !prev)
  }
   const handleapi2 = () => {
    setuserlist((prev) => !prev)
  }
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
                  {action === "add" ? "Add User" : "Update User"}
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
              <form onSubmit={UserAddEdit}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
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
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between"><span>Job Title</span>
                           {HasPermission("JobTitleAdd") && 
                            <img
                              src="/image/plusblue.svg"
                              alt=""
                              loading="lazy"
                              style={{ cursor: "pointer" }}
                             onClick={(()=>setuser(true))}
                            />
                          }
                          </label>
                          <JobtitleDropdown
                            value={value.jobTitle}
                            fn={handleChange}
                            load={userlist}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                        <label className="font-14 d-flex align-items-center justify-content-between">
                           <span> Select Role <sup>*</sup></span>
                           {HasPermission("RolesAdd") && 
                            <img
                              src="/image/plusblue.svg"
                              alt=""
                              loading="lazy"
                              style={{ cursor: "pointer" }}
                             onClick={(()=>setvendor(true))}
                            />
                          }
                          </label>
                          <RoleDropdown
                            value={value.roleId}
                            fn={handleChange}
                            load={vendorlist}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Role",
                              value?.roleId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
<div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">GHL Users</label>
                          <GetAllGHLUsers
                            name="ghlUserId"
                            value={value.ghlUserId}
                            fn={handleChange}
                            load={action}
                          />
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
                              <div className='error'>{action !== "edit" && simpleValidator.current.message("password", value?.password, "required|min:8")}</div>
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
     {vendor && <AddEditRole open={vendor} handleclose={(()=>setvendor(false))} action={"add"} LanguageListAPI={handleapi} object={""}  permission={permission}/>}

        {user &&<AddEditJobTitle
                        open={user}
                        handleclose={(()=>setuser(false))}
                        action={"add"}
                        LanguageListAPI={handleapi2}
                        object={""}
                      />
        }
    </>
  );
};

export default AddEditUser;
