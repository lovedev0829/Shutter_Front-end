import React, { useEffect, useRef, useState } from "react";
import Loginsidebar from "./Loginsidebar";
import {Link, useNavigate, useParams } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage,CustomMessages, ApiLoder} from "../../../helpers/common";
import { Profile } from "../../../Redux/Redux/Action/Action";
import SubmitButton from "../../Form/SubmitButton";
import { Eyeclose, Eyeopen } from "../../../SvgFile/Index";
import InputField2 from "../../Form/InputField2";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "", companyCode:"" });
  const [data, setData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const [loader, setloader] = useState(false);
  const [eye, setEye] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
  const [, forceUpdate] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loginToApp = async (data) => {
   
    try {
      setloader(true);
      const response = await callAPIWithoutAuth(
        apiUrls.login,
        {},
        "POST",
        data
      );
      setloader(false);
      if (response.data.isSuccess) {
        let datas = response?.data?.data;

        localStorage.setItem("accessToken", datas?.token);
        dispatch(Profile(datas));
        localStorage.setItem("userData", JSON.stringify(datas));
        SuccessMessage(response.data.message);
        navigate("/dashboard");
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (e) {
      setloader(false);

    }
  };

  

  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      loginToApp(input);
    }
  };
  
  const param = useParams();

  useEffect(() => {
    setInput((prevInput) => ({ ...prevInput, 'companyCode': param.type }));
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.type]);

  return (
    <>
     {loader && <ApiLoder/>}
      <section className="sign_in p-0">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="inner_content_one">
                <h1>Sign In</h1>
                <h2>{t("Welcome")}</h2>
                <form onSubmit={handleSubmit} className="form_sec mt-5">
                  <div className="row">
                    <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                      <InputField2
                        labelName="Username"
                        type="text"
                        placeholder="abc12@gmail.com"
                        name="username"
                        id="email"
                        handleChange={handleChange}
                        value={input.username}
                        
                      />

                       <div className="error">
                          {simpleValidator.current.message(
                            "username",
                            input?.username,
                            "required|email",

                          )}
                        </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="position-relative password_svg">
                        <InputField2
                           labelName="Password"
                          type={eye ? "text" : "password"}
                          placeholder="********"
                          name="password"
                          id="password"
                          handleChange={handleChange}
                          value={input.password}
                     
                        />
                     <div className="error">
                          {simpleValidator.current.message(
                            "password",
                            input?.password,
                            "required"
                          )}
                        </div>
                        <span onClick={showPassword} style={{cursor:"pointer"}}>
                            {eye ? <Eyeopen/> : <Eyeclose/>}{" "}
                          </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between remember_div mt-30 mb-30">
                        {/* <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Remember me
                          </label>
                        </div> */}
                        <Link to={`/forget-password/${param.type}`} className="link_forget" style={{color:data?.primaryColor}}>
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                      <SubmitButton type="submit" className="btn blue-btn w-100 text-uppercase" name="Sign In" disabled={loader} color={data?.primaryColor}/>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <Loginsidebar
              title={"Shutter Management and Estimation System"}
              descrption={
                "You'd like to work with, and I'll help you with the title or any other tasks you have in mind."
              }
              users={data}
            />
          </div>
        </div>
      </section>
    </>
  );
}
