import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllEstimateContact({ value = "",fn,ContactId }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllEstimateContact,{ContactId:ContactId}, "GET");
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
   if(ContactId){
    CountryList();
  }
    // eslint-disable-next-line
  }, [ContactId]);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
        className="form-select selectboxdropdown"
        name="estimateId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Estimate</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.estimateId} selected={item?.estimateId===value?true:false}>{item?.estimateName}</option>
           
          );
        })}
      </select>
    </div>
  );
}


