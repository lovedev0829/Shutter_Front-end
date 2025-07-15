import React, { useState, useRef, useEffect } from "react";
import Loginsidebar from "../Auth/Loginsidebar";
import SimpleReactValidator from "simple-react-validator";
import { ApiLoder, CustomMessages, ErrorMessage, SuccessMessage } from "../../../helpers/common";
import InputField2 from "../../Form/InputField2";
import Selectbox from "../../Form/Selectbox";
import SubmitButton from "../../Form/SubmitButton";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { useNavigate, useParams } from "react-router-dom";

function ForgetPassword() {
  const simpleValidator = useRef(new SimpleReactValidator({ messages: CustomMessages }));
  const [, forceUpdate] = useState();
    const [email, setEmail] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    const [companyCodes, setCompanyCodes] = useState([]);
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({});
    const param = useParams();
    const navigate = useNavigate();

    // Function to fetch company codes for the specific email
    const fetchCompanyCodeByEmail = async (emailValue) => {
        // Only fetch if email is provided and looks valid
        if (!emailValue || !emailValue.includes('@')) {
            setCompanyCodes([]);
            setCompanyCode('');
            return;
        }

        try {
            const response = await callAPIWithoutAuth(
                `${apiUrls.GetCompanyCodesByEmail}?email=${encodeURIComponent(emailValue)}`, 
                {}, 
                'GET'
            );
            
            if (response.data.isSuccess) {
                const companyCodes = response.data.data || [];
                
                // Format for dropdown
                const formattedCodes = companyCodes.map(code => ({ 
                    value: code.code, 
                    label: code.name ? `${code.code} - ${code.name}` : code.code
                }));
                
                setCompanyCodes(formattedCodes);
                
                // Auto-populate the first company code if found
                if (formattedCodes.length > 0) {
                    setCompanyCode(formattedCodes[0].value);
                } else {
                    setCompanyCode('');
                }
            } else {
                setCompanyCodes([]);
                setCompanyCode('');
            }
        } catch (error) {
            console.error('Error fetching company codes:', error);
            setCompanyCodes([]);
            setCompanyCode('');
        }
    };

    const sendForgetRequest = async (email, companyCode) => {
      setLoader(true)
        try{
         const response = await callAPIWithoutAuth(apiUrls.ForgetPassword, {}, 'POST', {
             email: email,
             code: companyCode,
         })
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

    // Handle email change with debouncing for company code lookup
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        
        // Debounce the API call
        const timeoutId = setTimeout(() => {
            fetchCompanyCodeByEmail(emailValue);
        }, 500);
        
        return () => clearTimeout(timeoutId);
    };

    function handleSubmit(e){
      e.preventDefault(); 
      const formValid = simpleValidator.current.allValid();
      if (!formValid) {
        simpleValidator.current.showMessages();
        forceUpdate(1);
      } else if (companyCodes.length === 0 || !companyCode) {
        ErrorMessage("Please enter a valid email to load company codes, then select a company code.");
      } else {
        sendForgetRequest(email, companyCode)
      }
     
    }



  return (
    
    <section className="sign_in p-0">
       {loader && <ApiLoder/>}
      <div className="container-fluid">
        <div className="row align-items-center">
          
              <div className="col-lg-7">
              <div className="inner_content_one forgot-password">
                <h1>Forgot Your Password?</h1>
                <p>
                  Don't Worry! Reseting your password is easy. Just type in the
                  email your registered.
                </p>
                <form className="form_sec mt-5" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                      <InputField2    
                        labelName="Email"
                        type="text"
                        placeholder="abc12@gmail.com"
                        name="email"
                        id="email"
                        handleChange={handleEmailChange}
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
                      <Selectbox
                        labelName="Company Code"
                        options={companyCodes.length > 0 ? companyCodes : [{ value: '', label: email && email.includes('@') ? 'No company codes found for this email' : 'Enter email first' }]}
                        handleChange={(e) => setCompanyCode(e.target.value)}
                        value={companyCode}
                        id="companyCode"
                        name="companyCode"
                        required={true}
                        disabledselectBox={companyCodes.length === 0}
                      />
                      <div className="error">
                        {simpleValidator.current.message(
                          "companyCode",
                          companyCode,
                          "required",
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
