import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
export default function FilterJob({
  addresList,
  handleAddresschnage,
  handleStatuschange,
  value,
  GetSatus
}) {
  const [JobStatus, setJobStatus] = useState([]);

  const StatusList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setJobStatus(apiResponse?.data?.data);
        GetSatus(apiResponse?.data?.data)
      } else {
        setJobStatus([]);
      }
    } catch (error) {
      setJobStatus([]);
    }
  };
  useEffect(() => {
    StatusList();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="filter_jobs mb-30">
      <div className="filter_option mb-30">
        <h6>Filter By Address</h6>
        <Link
          to="#"
          className={value.address === "" ? "active" : ""}
          onClick={() => handleAddresschnage("")}
        >
          All
        </Link>
        {addresList?.map((val, i) => (
          <Link
            to="#"
            className={value.address === val.addressId ? "active" : ""}
            key={i}
            onClick={() => handleAddresschnage(val.addressId)}
          >
            {val?.streetAddress} ({val?.label})
          </Link>
        ))}
      </div>
      <div className="filter_option">
        <h6>Filter By Status</h6>
        <Link
          to="#"
          className={value.jobStatus === "" ? "active" : ""}
          onClick={() => handleStatuschange("")}
        >
          All
        </Link>
        {JobStatus?.map((val, i) => (
          <Link
            to="#"
            key={i}
            onClick={() => handleStatuschange(val.jobStatusId)}
            className={value.jobStatus === val.jobStatusId ? "active" : ""}
          >
            {val.jobStatusName}
          </Link>
        ))}
      </div>
    </div>
  );
}
