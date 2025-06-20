import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllJobs({ value = "", fn, load, className = null, name = "jobId" }) {
  const [jobList, setjobList] = useState([]);
  const [show, setShow] = useState(false);
  const joblist = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllJobList, {}, "GET");
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setjobList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false)
      setjobList([]);
    }
  };

  useEffect(() => {
    joblist();
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
        <option value="">Select Jobs</option>
        {jobList?.map((item, i) => {
          return (

            <option key={i} value={item?.jobId} selected={item?.jobId === value ? true : false}>{item?.jobName}</option>

          );
        })}
      </select>
    </div>
  );
}


