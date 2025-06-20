import React, { useState, useRef, useEffect } from "react";
import Loginsidebar from "../Auth/Loginsidebar";
import SimpleReactValidator from "simple-react-validator";
import { ApiLoder, CustomMessages, ErrorMessage, SuccessMessage } from "../../../helpers/common";
import InputField2 from "../../Form/InputField2";
import SubmitButton from "../../Form/SubmitButton";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { useNavigate, useParams } from "react-router-dom";

function ForgetPassword() {
  const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
  const [, forceUpdate] = useState();
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({});
    const param = useParams();
    const navigate = useNavigate();

    const sendForgetRequest = async (email) => {
      setLoader(true)
        try{
         const response = await callAPIWithoutAuth(apiUrls.ForgetPassword, {}, 'POST', {email:email,code:param.type})
         setLoader(false)
         if(response.data.isSuccess){
          SuccessMessage(response.data.message)
         }else{
          ErrorMessage(response.data.message)
         }
        } catch(error){
           setLoader(false)
        }
    }

    function handleSubmit(e){
      e.preventDefault(); 
      const formValid = simpleValidator.current.allValid();
      if (!formValid) {
        simpleValidator.current.showMessages();
        forceUpdate(1);
      } else {
        sendForgetRequest(email)
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
      document.title = users?.firstName
      ? `${users?.firstName} ${users?.lastName || ''}`.trim()
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
                <h1>Forgot Your Password?</h1>
                <p>
                  Don’t Worry! Reseting your password is easy. Just type in the
                  email your registered.
                </p>
                <form className="form_sec mt-5" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                      <InputField2    labelName="Email"
                        type="text"
                        placeholder="abc12@gmail.com"
                        name="email"
                        id="email"
                        handleChange={(e)=>{setEmail(e.target.value)}}
                        value={email}
                         />
                      <div className="error">
                        {simpleValidator.current.message(
                          "email",
                          email,
                          "required|email",
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                    <SubmitButton type="submit" className="btn blue-btn w-100 text-uppercase" name="Send" disabled={loader} color={data?.primaryColor}/>
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
  );
}

export default ForgetPassword;
