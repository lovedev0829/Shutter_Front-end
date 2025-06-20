import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import Select from 'react-select';

export default function FormulaDropdown({ value = "", fn,load,ProductId,isOptionExpression=false,name="pricingExpression" }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllExpression,{}, "POST",{productType: ProductId,isOptionExpression:isOptionExpression});
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
   if(ProductId){
    CountryList();
  }
    // eslint-disable-next-line
  }, [load,ProductId]);

  const customStyles = {
  menu: (provided) => ({
    ...provided,
    position: 'absolute', // key change
    zIndex: 9999, // ensure it's above other elements
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const options = countryList?.map((item) => ({
  value: item.expressionId,
  label: item.expressionName
}));

const handleChange = (selectedOption) => {

  if (fn) {
    fn({
      target: {
        name: name,
        value: selectedOption?.value || ''
      }
    });
  }
};

  return (
    <div className="position-relative">
       {show &&<SelectBoxLoader/>}
      
      {/* <select value={value}
        className="form-select"
        name={name}
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Expression</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.expressionId} selected={item?.expressionId===value?true:false}>{item?.expressionName}</option>
           
          );
        })}
      </select> */}
      <Select
  name={name}
  value={options.find(option => option.value === value) || null}
  onChange={handleChange}
  options={options}
  classNamePrefix="react-select"
  placeholder="Select Expression"
    menuPortalTarget={document.body}
  menuPosition="fixed"
   styles={customStyles}
/>
    </div>
  );
}


