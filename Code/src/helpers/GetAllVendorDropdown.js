import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllVendorDropdown({ value = "", fn, load, className = null, name = "vendorId" }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllVendor, {}, "GET");
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
      {show && <SelectBoxLoader />}
      <select value={value}
        className={`form-select ${className}`}
        name={name}
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Vendor</option>
        {countryList?.map((item, i) => {
          return (

            <option key={i} value={item?.vendorId} selected={item?.vendorId === value ? true : false}>{item?.companyName}</option>

          );
        })}
      </select>
    </div>
  );
}


