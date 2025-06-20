import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllContactType({ value = "", fn,load,name="contactTypeId" }) {
  const [ContactTypeList, setContactTypeList] = useState([]);
  const [show, setShow] = useState(false);
  const ContactTypelist = async () => {
    try {
      setShow(true)
     
      const apiResponse = await callAPI(apiUrls.GetAllMstContactType, {}, "POST",{});
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setContactTypeList(apiResponse?.data?.data);
      } else {
      }
    } catch (error) {
      setShow(false)
      setContactTypeList([]);
    }
  };

  useEffect(() => {
    ContactTypelist();
  }, [load]);

  return (
    <>
      <div className="position-relative">
        {show &&<SelectBoxLoader/>}
        <select
          value={value}
          className="form-select"
          name={name}
          onChange={(e) => {
            if (fn) fn(e);
          }}
        >
          <option value="">Select Contact Type</option>
          {ContactTypeList?.map((item, i) => {
            return (
             
                <option
                  key={i}
                  value={item?.mstContactId}
                  selected={item?.mstContactId === value ? true : false}
                >
                  {item?.mstContactName}
                </option>
             
            );
          })}
        </select>
      </div>
    </>
  );
}
