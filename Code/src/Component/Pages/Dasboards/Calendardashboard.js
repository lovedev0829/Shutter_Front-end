import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TableTitle from "../../Form/TableTitle";

const localizer = momentLocalizer(moment);

export default function Calendardashboard({ Apiload }) {
  const [jobData, setJobData] = useState([]);
  const [loder, setLoader] = useState(false);
  const [JobStatus, setJobStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const StatusList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setJobStatus(apiResponse?.data?.data);
      } else {
        setJobStatus([]);
      }
    } catch (error) {
      setJobStatus([]);
    }
  };

  const DashBoard = async () => {
    try {
      setLoader(true);
      const response = await callAPI(apiUrls.GetAllJobDetails, {}, "GET", {});
      setLoader(false);
      if (response?.data?.isSuccess) {
        setJobData(response?.data?.data);
      } else {
        ErrorMessage(response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    StatusList();
    DashBoard();
  }, []);

  // Convert jobData to events for the calendar
  const events = jobData.map((job) => ({
    title: `${job?.contactFirstName}  ${job?.contactLastName} ${(job?.suffix ?? "")}`,
    start: new Date(job.scheduledDate), // Start time only
    description: job.jobName,
    id: job.jobId,
    jobStatusName: job.jobStatusName,
  }));

  // Customize the event display
  const eventPropGetter = (event) => {
    let backgroundColor = "#e1f5fe";
    let color = "#1e90ff";
    switch (event.jobStatusName) {
     
      default:
        backgroundColor = "#e1f5fe";
        color = "#1e90ff";
    }

    return {
      style: {
        backgroundColor,
        color,
      },
    };
  };

  // Render the event details in a tooltip or popup
  const EventDetails = ({ event }) => (
    <span>
      <strong>{event.title}</strong>
      <br />
      {event.description && <span>{event.description}</span>}
    </span>
  );

  const handleChnage = async (value, jobid, jobstatus) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to change the job status?"
    );
    if (isConfirmed) {
      setLoader(true);
      setSelectedStatus((prev) => ({ ...prev, [jobid]: value }));
      try {
        const response = await callAPI(apiUrls.UpdateJobStatus, {}, "POST", {
          jobId: jobid,
          jobStatus: value,
        });
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
          DashBoard();
          Apiload();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      value = selectedStatus[jobid] || jobstatus;
    }
  };

const navigate= useNavigate();

  const handleEventClick = (event) => {
    localStorage.setItem("activeTab", "#window-measurement");
    const jobId = event.id;
    const url = `/contacts/job/${jobId}`;
    navigate(url)
   
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="table-responsive">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                 <th scope="col">Job ID</th>
                <th scope="col">Contact Name</th>
               
                <th scope="col">Job Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">Status Change Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobData?.map((val, i) => (
                <tr key={i}>
                   <td>

<Link
                      onClick={() => {
                        localStorage.setItem(
                          "activeTab",
                          "#window-measurement"
                        );
                      }}
                      className="color-blue"
                      to={`/contacts/job/${val.jobId}`}
                     
                    >
                      {val?.jobUniqueCode}
                    </Link>

                   </td>
                  <td>
                    {" "}
                    <Link
                      onClick={() => {
                        localStorage.setItem("activeTab2", "#pills-overview");
                      }}
                      className="color-blue"
                      to={`/contacts/detail/${val.contactId}`}
                     
                    >
                      {val?.contactFirstName} {val?.contactLastName} {(val?.suffix ?? "")}
                    </Link>
                  </td>
                 
                  <td>
                   
                      {val?.jobName}
                   
                  </td>
                  <td>
                    {val?.scheduledDate
                      ? `${moment(val?.scheduledDate).format(
                          "MM-DD-YYYY"
                        )} | ${moment(val?.scheduledDate).format("hh:mm A")}`
                      : "---"}
                  </td>
                  <td> {moment(val?.updatedAt).format("MM-DD-YYYY") || ""}</td>
                  <td>
                    <select
                      className={`form-select status-select difulatcolor`}
                      onChange={(e) =>
                        handleChnage(e.target.value, val.jobId, val.jobStatus)
                      }
                      value={selectedStatus[val.jobId] || val.jobStatus}
                    >
                      {JobStatus?.map((vals, i) => (
                        <option
                          key={i}
                          value={vals.jobStatusId}
                          selected={
                            vals.jobStatusId === val.jobStatus ? true : false
                          }
                        >
                          {vals?.jobStatusName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {(!jobData || jobData?.length === 0) && (
                <tr>
                  <td className="text-center border-0 no-records" colSpan={8}>
                    <img
                      src="/image/no-records.svg"
                      alt=" "
                      loading="lazy"
                      className="img-fluid"
                    />
                    <p className="font-14">No Records Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-30 mt-4">
        <TableTitle title="Jobs Schedule" />
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="start"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventDetails,
        }}
        onSelectEvent={handleEventClick}
      />
    </>
  );
}
