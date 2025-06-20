import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function AllLocation({ value = "", fn,load }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GeltallLocation, {}, "GET", {});
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
        className="form-select"
        name="label"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Location</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.locationName} selected={item?.locationName===value?true:false}> {item?.locationName}</option>
           
          );
        })}
      </select>
    </div>
  );
}


