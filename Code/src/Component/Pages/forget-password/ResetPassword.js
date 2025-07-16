import React, { useEffect, useRef, useState } from 'react'
import { Eyeclose, Eyeopen } from '../../../SvgFile/Index'
import {  callAPIWithoutAuth } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import {  ErrorMessage, SuccessMessage, CustomMessages, ApiLoder } from '../../../helpers/common';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate, useParams } from 'react-router-dom';
import SubmitButton from '../../Form/SubmitButton';
import InputField2 from '../../Form/InputField2';
import Loginsidebar from '../Auth/Loginsidebar';

const ResetPassword = ({ email }) => {
    const [eye, setEye] = useState(false);
    const [confirm_eye, setConfirmEye] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
    const [,forceUpdate] = useState()
    const param = useParams();
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()
    const [data, setData] = useState({});

    const showPassword = () => {
        if (eye) setEye(false);
        else setEye(true);
    };

    const ConfirmShowPassword = () => {
        if (confirm_eye) setConfirmEye(false);
        else setConfirmEye(true);
    };

    const updatePassword = async () => {
        setLoader(true)
        try {
            const response = await callAPIWithoutAuth(apiUrls.VerifyForgetPassword, {}, 'POST', {  token: param.token, password:password })
            setLoader(false)
            if (response.data.isSuccess) {
                SuccessMessage(response.data.message)
                navigate(`/${param.type}`)
            } else {
                ErrorMessage(response.data.message)
            }
        } catch (error) {
            setLoader(false)
        }
    }



    function handleSubmission(e) {
        e.preventDefault()
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
          simpleValidator.current.showMessages();
          forceUpdate(1);
        } else {
            updatePassword()
        }
    }


    function changeFavicon(users) {
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }
        favicon.href = users?.logo ||"/image/logo.svg";
        document.title = users?.companyName
        ? `${users?.companyName} ${''}`.trim()
        : document.title;
    }
  
      const GetData = async () => {
        setLoader(true);
        try {
          const response = await callAPIWithoutAuth(
            apiUrls.HomePageContent,
            {CompanyCode:param.type},
            "GET"
          );
          setLoader(false);
          if (response.data.isSuccess) {
            let datas = response?.data?.data;
            setData(datas)
           changeFavicon(datas)
            localStorage.setItem("code", JSON.stringify(param.type));
          } else {
            navigate("/404");
            ErrorMessage(response.data.message);
          }
        } catch (e) {
          navigate("/404");
          setLoader(false);
        }
      };
      const token = localStorage.getItem('accessToken')
    
      useEffect(() => {
        if(!token){
          GetData();
        }
       // eslint-disable-next-line
      }, [param.type]);

  

    return (
        <section className="sign_in p-0">
            {loader && <ApiLoder/>}
      <div className="container-fluid">
        <div className="row align-items-center">
        <div className="col-lg-7">
             <div className="inner_content_one forgot-password">
             <h1>Reset Password</h1>
               
                <p>
                Enter New Password  
                </p>
            </div>
          
            {<form className="form_sec mt-md-5 mt-3" onSubmit={handleSubmission}>
            <div className="row">
            <div className="col-lg-12">
            <div className="position-relative password_svg">

                        <InputField2
                           labelName="Password"
                          type={eye ? "text" : "password"}
                          placeholder="********"
                          name="password"
                          id="password"
                          handleChange={(e)=>{setPassword(e.target.value)}}
                          value={password}
                     
                        />
                        <span onClick={showPassword}>
                            {eye ? <Eyeopen /> : <Eyeclose />}{" "}
                        </span>
                    </div>
                    <div className="error">
                          {simpleValidator.current.message(
                            "password",
                            password,
                            "required|min:8"
                          )}
                        </div>
                </div>
                <div className="col-lg-12">
            <div className="position-relative password_svg mt-2 mb-3">

            <InputField2
                           labelName="confirm Password"
                          type={confirm_eye ? "text" : "password"}
                          placeholder="********"
                          name="password_confirmation"
                          id="password_confirmation"
                          handleChange={(e)=>{setConfirmPassword(e.target.value)}}
                          value={confirmPassword}
                     
                        />
                       
                        <span onClick={ConfirmShowPassword}>
                            {confirm_eye ? <Eyeopen /> : <Eyeclose />}{" "}
                        </span>
                    </div>
                    <div className="error">
                        {simpleValidator.current.message(
                            "confirm password",
                            confirmPassword,
                            `required|in:${password}`
                        )
                            ? 'Password Not Match'
                            : ""}
                    </div>
                </div>
                </div>
                <SubmitButton type="submit" className="btn blue-btn w-100 text-uppercase" name="Submit" disabled={loader} color={data?.primaryColor}/>
                
              

            </form>}
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
    )
}

export default ResetPassword