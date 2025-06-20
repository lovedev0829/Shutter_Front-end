import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function ContactBreakdown({ value = "", fn,name="ContactName",disabled=false,className=null}) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
        const apiResponse = await callAPI(apiUrls.ContactBreakdown,{},"GET");
        setShow(false)
        if (apiResponse?.data?.isSuccess) {
            setCountryList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false)
      setCountryList([]);
    }
  };

  useEffect(() => {
    CountryList();
  }, []);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
        className={`form-select ${className}`}
        name={name}
        onChange={(e) => {
          if (fn) fn(e);
        }}
        disabled={disabled} 
      >
        <option value="">Select Customer</option>
        {countryList?.map((item, i) => {
          return (
           
              <option key={i} value={item?.ContactName} selected={item?.ContactName===value?true:false}>{item?.firstName +" " + item?.lastName +" " + (item?.suffix ?? "")}</option>
            
          );
        })}
      </select>
      </div>
  );
}


