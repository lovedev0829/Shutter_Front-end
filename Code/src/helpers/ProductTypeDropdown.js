import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function ProductTypeDropdown({ value = "", fn,load,name="productType",disabled=false,className=null,Getproduct = () => {}}) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllProductType,{},"GET");
        setShow(false)
        if (apiResponse?.data?.isSuccess) {
          const foundItem = apiResponse.data.data.find(item => item.isDefault === true);
          if (foundItem) {
            Getproduct(foundItem.productId);
          }
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
    // eslint-disable-next-line
  }, [load]);

  

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
        <option value="">Choose Type</option>
        {countryList?.map((item, i) => {
          return (
           
              <option key={i} value={item?.productId} selected={item?.productId===value?true:false}>{item?.productName}</option>
            
          );
        })}
      </select>
      </div>
  );
}


