import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";

export default function EmailSucess() {
  const [loder, setLoader] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const param = useParams();
   const navigate = useNavigate();

  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.EmailOAuth2,
        { code: code, OauthType: param.type },
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        SuccessMessage(apiResponse.data?.message);
          localStorage.setItem("activeTab2", "#Email");
       
        navigate('/configuration')
      } else {
        ErrorMessage(apiResponse.data.message);
      }
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };
  useEffect(() => {
    if (code && param.type) {
      TenantlistAPI();
    }

    // eslint-disable-next-line
  }, [code, param.type]);

  return (
    <div className="container">
      {loder && <ApiLoder />}
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="message-box _success">
           
            <p>Please Wait .................... </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
