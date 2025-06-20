import { Link } from "react-router-dom";
export default function ReportFilter({ handleStatuschange, value, JobStatus }) {
  return (
    <div className="filter_jobs mb-30">
      <div className="filter_option">
       
        {JobStatus?.map((val, i) => (
          <Link
            to="#"
            key={i}
            onClick={() =>
              handleStatuschange(val.jobStatusId, val.jobStatusName)
            }
            className={value.orderStatus === val.jobStatusId ? "active" : ""}
          >
            {val.jobStatusName}
          </Link>
        ))}
      </div>
    </div>
  );
}
