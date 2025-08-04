import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllStages({ value = "", fn, load, className = null, name = "ghL_StageId" }) {
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const CountryList = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllStages, {}, "GET");
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
        <option value="">Select Ghl Stage</option>
        {countryList?.map((item, i) => {
          return (

            <option key={i} value={item?.ghlStageId} selected={item?.ghlStageId === value ? true : false}>{item?.ghlStageName}</option>

          );
        })}
      </select>
    </div>
  );
}


