import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddEditJob from "./AddEditJob";
import FilterJob from "./FilterJob";
import { TablePagination, Tooltip } from "@mui/material";

export default function Joblist({ initialActiveTab }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
   const [StagesList, setStagesList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [addresList, setaddressList] = useState([]);
  const [value, setValue] = useState({ address: "", jobStatus: "" });
    const [JobStatus, setJobStatus] = useState([]);
  const navigate = useNavigate();
  const param = useParams();

  const AddresslistAPI = async () => {
   
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllAddress,
        { ContactId: param.contactId },
        "GET"
      );

      if (apiResponse?.data?.isSuccess) {
        setaddressList(apiResponse?.data?.data);
      } else {
        setaddressList([]);
      }
    } catch (error) {
      setLoader(false)
    }
  };

  useEffect(() => {
    AddresslistAPI();
    // eslint-disable-next-line
  }, [initialActiveTab]);

  const TenantlistAPI = async (page, perpage, jobStatus, address) => {
    setLoader(true);
    let query = {
      tenantId: "",
      searchValue: param.contactId,
      pageNo: page,
      recordPerPage: perpage,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: jobStatus,
      address: address,
    };

    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI(page, rowsPerPage, value.jobStatus, value.address);
    // eslint-disable-next-line
  }, []);

  const CountryList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllStages, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setStagesList(apiResponse?.data?.data)
      } else {
        setStagesList([])
      }
    } catch (error) {
     
      setStagesList([]);
    }
  };

  useEffect(() => {
    CountryList();
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      value.jobStatus,
      value.address
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, 10, value.jobStatus, value.address);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    setAction("edit");
    setObject(item);
    setOpen(true);
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.JobDelete, { Id: id }, "POST", {});
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, value.jobStatus, value.address);
        setPage(pageNo);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
  };

  const getDynamicSteps = (currentStageId) => {
    return StagesList.map((stage, index) => ({
      status:
        stage.ghlStageId === currentStageId
          ? "active"
          : index < StagesList.findIndex(s => s.ghlStageId === currentStageId)
            ? "Abandon"
            : "disabled",
      tooltip: stage.ghlStageName,
    }));
  };
  const handleAddresschnage = (value) => {
    setValue((val) => {
      return { ...val, address: value };
    });
    TenantlistAPI(page, rowsPerPage, value.jobStatus, value);
  };
  const handleStatuschange = (value) => {
    setValue((val) => {
      return { ...val, jobStatus: value };
    });
    TenantlistAPI(page, rowsPerPage, value, value.address);
  };

  const GetSatus = (data) => {
    setJobStatus(data);
  };

  const getDynamicStepsstaus = (currentjobStatusId) => {
    return JobStatus.map((stage, index) => ({
      status:
        stage.jobStatusId === currentjobStatusId
          ? "active"
          : index < JobStatus.findIndex(s => s.jobStatusId === currentjobStatusId)
            ? "Abandon"
            : "disabled",
      tooltip: stage.jobStatusName,
    }));
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div
        className={`tab-pane fade ${initialActiveTab === "#pills-content" ? "show active" : ""
          }`}
        id="pills-content"
        role="tabpanel"
        aria-labelledby="pills-content-tab"
        tabIndex={0}
      >
        <BackButton link="/contacts" />
        <FilterJob
          addresList={addresList}
          handleAddresschnage={handleAddresschnage}
          handleStatuschange={handleStatuschange}
          value={value}
          GetSatus={GetSatus}
        />
        <div className="d-flex align-items-center justify-content-between mb-30">
          <TableTitle title="Jobs" />
        </div>
        <div className="row g-3">
          <div className="col-lg-4 col-xxl-3">
            <div className="create_jobs jobempty">
              {HasPermission("JobAdd") && (
                <Link
                  to="#"
                  onClick={() => {
                    setAction("add");
                    setOpen(true);
                  }}
                >
                  <img src="/image/add.svg" alt="" loading="lazy" />
                  <span>Create New Job</span>
                </Link>
              )}
            </div>
          </div>
          {tenantList?.map((val, i) => {
            const Steps = getDynamicSteps(val?.ghL_StageId); // Generate steps dynamically
            const Steps2 = getDynamicStepsstaus(val?.jobStatus);
            return (
              <div className="col-lg-4 col-xxl-3" key={i}>
                <div className="notes_card">
                  {StagesList?.length>0 ?
                  <div className="job-status">
                    <div
                      className="row bs-wizard justify-content-center"
                      style={{ borderBottom: 0 }}
                    >
                      {Steps.map((step, index) => (
                        <div
                          key={index}
                          className={`col-md-2 col-2 bs-wizard-step ${step.status === "Abandon"
                              ? "Abandon"
                              : step.status === "active"
                                ? "active"
                                : "disabled"
                            }`}
                        >
                          <div className="progress">
                            <div className="progress-bar" />
                          </div>
                          <Tooltip title={step.tooltip}>
                            <span className="bs-wizard-dot">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                id="check"
                              >
                                <path
                                  fill="#fff"
                                  d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"
                                />
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
:
                  <div className="job-status">
                    <div
                      className="row bs-wizard justify-content-center"
                      style={{ borderBottom: 0 }}
                    >
                      {Steps2.map((step, index) => (
                        <div
                          key={index}
                          className={`col-md-2 col-2 bs-wizard-step ${step.status === "Abandon"
                              ? "Abandon"
                              : step.status === "active"
                                ? "active"
                                : "disabled"
                            }`}
                        >
                          <div className="progress">
                            <div className="progress-bar" />
                          </div>
                          <Tooltip title={step.tooltip}>
                            <span className="bs-wizard-dot">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                id="check"
                              >
                                <path
                                  fill="#fff"
                                  d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"
                                />
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
          }
                  <div className="notes_header d-flex align-items-center justify-content-between mb-2">
                    <div className="title-job">
                      <h6 className="mb-0 font-16">{val?.jobName}</h6>
                      <span>
                        {val?.streetAddress}, {val?.city}, {val?.state}-{" "}
                        {val?.zipCode} ({val?.label})
                      </span>
                    </div>
                    <div className="company-logo-dropdown">
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle border-0 w-100 d-flex align-items-center"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src="/image/three-dot-new.svg" alt="" loading="lazy" />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow w-100">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                navigate(`/contacts/job/${val?.jobId}`);
                                localStorage.setItem(
                                  "activeTab",
                                  "#window-measurement"
                                );
                              }}
                            >
                              <img
                                src="/image/eye.svg"
                                alt=""
                               loading="lazy"
                                className="me-1"
                              />{" "}
                              View Job
                            </button>
                          </li>
                          {HasPermission("JobEdit") && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => handleedit(val)}
                              >
                                <img
                                  src="/image/edit.svg"
                                  alt=""
                                  loading="lazy"
                                  className="me-1"
                                />{" "}
                                Edit
                              </Link>
                            </li>
                          )}
                          {HasPermission("JobDelete") && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => handledelete(val)}
                              >
                                <img
                                  src="/image/trash-alt-new.svg"
                                  alt=""
                                  loading="lazy"
                                  className="me-1"
                                />
                                Delete
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white note_topic">
                    <div className="pricing_terms d-flex justify-content-between">
                      <div>
                        <p>Job Type</p>
                        <h6>{val?.jobTypeName}</h6>
                      </div>
                      <div className="">
                        <p>Assigned Personnel</p>
                        <h6>{val?.assignedPersonnelName}</h6>
                      </div>
                    </div>
                    <div className="pricing_terms mb-2">
                      <p>Relevant notes</p>
                      <ul>
                        <li>{val?.notes ? val?.notes : "---"}</li>
                      </ul>
                    </div>
                    {val?.attachmentsAny &&
                      val?.attachmentsAny?.length > 0 && (
                        <div className="pricing_terms border-0 mb-0 pb-0">
                          <p>Attachment</p>

                          <div className="image-attached">

                            {val?.attachmentsAny &&
                              val?.attachmentsAny?.length > 0 &&
                              val?.attachmentsAny.map((val, i) => {
                                const fileExtension = val
                                  .split(".")
                                  .pop()
                                  .toLowerCase();
                                const isImage = ["jpeg", "jpg", "png"].includes(
                                  fileExtension
                                );
                                return (
                                  <div className="attached_image" key={i}>
                                    <Link

                                      to={val.trim()}
                                      target="_blank"
                                      className="d-block attchment-file tax_document"
                                    >
                                      {isImage ? (
                                        <img
                                          src={val}
                                          alt={`Preview ${val}`}
                                          loading="lazy"
                                          height={30}
                                          width={30}
                                        />
                                      ) : (
                                        <img
                                          src="/image/file.svg"
                                          alt="File preview"
                                          loading="lazy"
                                        />
                                      )}
                                    </Link>
                                  </div>
                                );
                              })}

                          </div>
                        </div>
                      )}
                  </div>
                  <div className="buttons_group gap-3 mt-3 d-flex align-items-center justify-content-between">
                    {HasPermission("EstimateView") && (
                      <button
                        onClick={() => {
                          navigate(`/contacts/job/${val?.jobId}`);
                          localStorage.setItem("activeTab", "#estimate");
                        }}
                        className="btn border-btn w-50"
                      >
                        View Estimates
                      </button>
                    )}
                    {HasPermission("EstimateAdd") && (
                      <button
                        onClick={() => {
                          navigate(`/contacts/job/${val?.jobId}`);
                          localStorage.setItem("activeTab", "#window-measurement");
                        }}
                        className="btn blue-btn w-50"
                      >
                        View Windows
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {(!tenantList || tenantList?.length === 0) && (
             <div className="col-lg-4 col-xxl-3">
            <div className="jobempty">
            <div className="text-center border-0 no-records">
              <img src="/image/no-records.svg" alt=" " loading="lazy" className="img-fluid" />
              <p className="font-14">No Records Found</p>
            </div>
            </div>
            </div>
          )}
        </div>
        {tenantList && tenantList?.length > 0 && (
          <div className="d-flex align-items-center justify-content-end bottom_nav">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 25, 100]}
                  component="div"
                  count={paginatedItems}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </ul>
            </nav>
          </div>
        )}
      </div>
     {open && <AddEditJob
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
      />
     }
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.jobName}
        id={object?.jobId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}
