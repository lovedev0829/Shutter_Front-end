import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function UnitofMesaurmentDropdown({ value = "", fn,load }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllUnitOfMeasurement,{}, "GET");
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
  }, [load]);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
        className="form-select"
        name="unitOfMeasurement"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Unit</option>
        {countryList?.map((item, i) => {
          return (
           
              <option key={i} value={item?.unitofMeasurementName} selected={item?.unitofMeasurementName===value?true:false}>{item?.unitofMeasurementName}</option>
            
          );
        })}
      </select>
      </div>
  );
}


