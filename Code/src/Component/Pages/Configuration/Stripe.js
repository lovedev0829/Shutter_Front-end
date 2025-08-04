import React, { useEffect, useRef } from "react";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  CustomMessages,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";

import InputField from "../../Form/InputField";
import SimpleReactValidator from "simple-react-validator";
import SubmitButton from "../../Form/SubmitButton";


export default function Stripe() {
  const [loder, setLoader] = useState(false);
   const [ghl, setGhl] = useState(false);
  const [value, setValue] = useState({
    secretKey: "",
    publishableKey: "",
    cancelUrl: "",
    successUrl: "",
    webhookSecret: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();
  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetStripeConfiguration,
        {},
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if(!apiResponse?.data?.data?.secretKey){
          setGhl(true)
        }
        else{
          setGhl(false)
        }
        setValue(apiResponse?.data?.data);
      } else {
        setGhl(true)
        setValue({});
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setGhl(true)
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

    const handleDelte = async () => {
      const isConfirmed = window.confirm("Are you sure you want to delete Stripe?");
      if (isConfirmed) {
        setLoader(true);
        try {
          const response = await callAPI(
            apiUrls.DeleteConfiguration,
            {deleteType:0,configurationId:value?.id},
            "POST",
            {}
          );
          setLoader(false);
  
          if (response.data.isSuccess) {
            TenantlistAPI();
          } else {
            ErrorMessage(response.data.message);
          }
        } catch (error) {
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    };

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
          apiUrls.AddStripeConfiguration,
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
  return (
    <>
      {loder && <ApiLoder />}
      <div className="contact-profile">
        <div className="d-flex align-items-center justify-content-between mb-30">
          <TableTitle title="Manage Stripe Configuration" />
        </div>
        <div
          className="form-design"
          style={{ background: "#f5f5f5", padding: "10px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"Secret Key"}
                    placeholderName={"Enter Secret Key"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"secretKey"}
                    name={"secretKey"}
                    value={value.secretKey}
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "secretKey",
                      value?.secretKey,
                      `required`
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"Publishable Key"}
                    placeholderName={"Enter Publishable Key"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"publishableKey"}
                    name={"publishableKey"}
                    value={value.publishableKey}
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "publishableKey",
                      value?.publishableKey,
                      `required`
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <InputField
                    labelName={"Webhook Secret"}
                    placeholderName={"Enter Webhook Secret"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"webhookSecret"}
                    name={"webhookSecret"}
                    value={value.webhookSecret}
                    required={true}
                  />
                  <div className="error">
                    {simpleValidator.current.message(
                      "webhookSecret",
                      value?.webhookSecret,
                      `required`
                    )}
                  </div>
                </div>
              </div>
              <div className="form-style form-group d-flex align-items-center justify-content-end">
                {HasPermission("StripeEdit") && (
                  <SubmitButton
                    type="submit"
                    className="btn blue-btn me-3"
                    name={"Submit"}
                    disabled={loder}
                  />
                )}
                 {!ghl && 
                <button
                  type="button"
                  onClick={handleDelte}
                  className="btn btn-danger me-3"
                >
                  Unlink Stripe
                </button>}
               
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
