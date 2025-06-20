import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function PartnerDropdown({ value = "", fn }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const TenantlistAPI = async () => {
    let query={searchValue:"",pageNo:1,recordPerPage:1000,tenantId:"",status:"2"}
    setShow(true)
    try {
      const apiResponse = await callAPI(apiUrls.SubTenant,{}, "POST",query);
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data)
      } else {
        setCountryList([])
      }
    } catch (error) {
      setShow(false)
      setCountryList([]);
    }
  }
  useEffect(() => {
    TenantlistAPI();
  }, []);

  

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      <select value={value}
        className="form-select selectboxdropdown"
        name="tenantId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Partner</option>
        {countryList?.map((item, i) => {
          return (
          
              <option key={i} value={item?.tenantId} selected={item?.tenantId===value?true:false}>{item?.firstName + " " + item?.lastName}</option>
           
          );
        })}
      </select>
      </div>
   
  );
}


