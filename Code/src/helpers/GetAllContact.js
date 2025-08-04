import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllContact({ value = "", fn,load, className = null }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllContact, {}, "GET", {});
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
  }, [load]);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
       className={`form-select ${className}`}
        name="contactId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Contact</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.contactId} selected={item?.contactId===value?true:false}> {item?.firstName + " " + item?.lastName + " " + (item?.suffix ?? "")} ({item?.contactUniqueId})</option>
           
          );
        })}
      </select>
    </div>
  );
}


