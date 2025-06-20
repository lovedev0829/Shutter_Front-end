import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetEmailTypeConfiguration({ value = "", fn }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetEmailTypeConfiguration, {}, "GET", {});
        setShow(false)
        if (apiResponse?.data?.isSuccess) {
            setCountryList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setCountryList([]);
      setShow(false)
    }
  };

  useEffect(() => {
    CountryList();
  }, []);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
       className={`form-select`}
        name="emailType"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Method Type</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.id} selected={item?.id===value?true:false}> {item?.name}</option>
           
          );
        })}
      </select>
    </div>
  );
}


