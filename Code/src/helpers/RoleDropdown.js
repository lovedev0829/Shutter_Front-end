import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import Select from 'react-select';

export default function RoleDropdown({ value = "", fn,load }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
        setShow(true)
        const apiResponse = await callAPI(apiUrls.GetAllRoles,{}, "GET");
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

const options = countryList?.map((item) => ({
  value: item.roleId,
  label: item.roleName
}));

const handleChange = (selectedOption) => {

  if (fn) {
    fn({
      target: {
        name: 'roleId',
        value: selectedOption?.value || ''
      }
    });
  }
};

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

  return (
    <div className="position-relative">
        {show &&<SelectBoxLoader/>}
      {/* <select value={value}
        className="form-select"
        name="roleId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Role</option>
        {countryList?.map((item, i) => {
          return (
            
              <option key={i} value={item?.roleId} selected={item?.roleId===value?true:false}>{item?.roleName}</option>
           
          );
        })}
      </select> */}

      <Select
  name="roleId"
  value={options.find(option => option.value === value) || null}
  onChange={handleChange}
  options={options}
  classNamePrefix="react-select"
  placeholder="Select Role"
    menuPortalTarget={document.body}
  menuPosition="fixed"
   styles={customStyles}
/>
    
    </div>
  );
}


