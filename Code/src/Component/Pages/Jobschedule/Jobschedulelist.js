import React, { useEffect, useState } from 'react'
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common';
import { TablePagination } from '@mui/material';
import AddEditJobShedule from './AddEditJobShedule';
import AddEditButton from '../../Form/AddEditButton';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import StatusDropdown from '../../../helpers/StatusDropdown';
export default function Jobschedulelist() {
  const param = useParams()

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [filter, setFilter] = useState({ status: "2", tenantId: "" });

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, tenantId, status) => {
    let query = {
      searchValue: param?.JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      productType: "",
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.JobSchedule, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage, filter.tenantId, filter.status);
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.JobScheduleDelete,
        { JobScheduleId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
  const handleStatus = async (item) => {
    setLoader(true)
    try {
      const response = await callAPI(apiUrls.JobScheduleActiveInActive, { JobScheduleId: item.scheduleJobId }, 'POST', {})
      setLoader(false)
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message)
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
      } else {
        ErrorMessage(response.data.message)
      }
    } catch (error) {
      setLoader(false)
    }

  }
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, e.target.name === 'tenantId' ? e.target.value : filter.tenantId, e.target.name === 'status' ? e.target.value : filter.status);
    setPage(1)
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
        <div className='d-flex gap-3 invoice-new'>
          <h2 className="body_heading width-left-border mb-0">
            Job Schedule
          </h2>
          <div className="filter-dropdown dropdown">
            <StatusDropdown value={filter.status}
              fn={handleChange} />
          </div>
        </div>

        {HasPermission("JobScheduleAdd") && (
          <AddEditButton
            handleClick={() => {
              setAction("add");
              setOpen(true);
            }}
            title="Create Schedule"
          />
        )}
      </div>
      <div className="estimate-table task_table mb-30">
        <div className="table-responsive">
          <table className="table jobscheduletable">
            <thead>
              <tr>
                <th scope="col">SN</th>
                <th scope="col ">Estimate Name</th>
                <th scope="col">Job Title</th>
                <th scope="col">Resource Name</th>
                <th scope="col">Ghl User Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Date</th>
                <th scope="col">End Time</th>
                <th scope="col">Status</th>
                {(HasPermission("JobScheduleEdit") || HasPermission("JobScheduleDelete")) && <th scope="col" className="text-end">
                  Action
                </th>}
              </tr>
            </thead>
            <tbody>
              {
                tenantList?.map((item, index) => {
                  return (
                    <tr>
                      <td>{(page - 1) * rowsPerPage + index + 1}</td>
                      <td>{item?.estimateName}</td>
                      <td>{item?.jobTitle}</td>
                      <td>{item?.userFullname}</td>
                      <td>{item?.ghlUserName}</td>
                      <td>{moment(item?.startDate).format("MM-DD-YYYY")}</td>
                      <td>{moment(item?.dayStartTime,"HH:mm:ss").format("hh:mm A")}</td>
                      <td>{moment(item?.endDate).format("MM-DD-YYYY")}</td>
                      <td>{moment(item?.dayEndDateTime,"HH:mm:ss").format("hh:mm A")}</td>
                      <td><span className={`tags ${item?.isActive === true ? "active" : "inactive"}-tag`} onClick={() => handleStatus(item)}>{item?.isActive === true ? "Active" : "Inactive"}</span></td>


                      {(HasPermission("JobScheduleEdit") || HasPermission("JobScheduleDelete")) &&
                        <td className="text-end">
                          <span className="d-flex align-items-center justify-content-end gap-3">
                            {HasPermission("JobScheduleEdit") && <img src="/image/editblue.svg" role="button" alt="" loading="lazy" onClick={() => handleedit(item)} />}
                            {HasPermission("JobScheduleDelete") && <img src="/image/deleteblue.svg" role="button" alt=""  loading="lazy" onClick={() => handledelete(item)} />}
                          </span>
                        </td>
                      }
                    </tr>
                  )
                })
              }
              {(!tenantList || tenantList?.length === 0) && (
                <tr>
                  <td className="text-center border-0 no-records" colSpan={7}>
                    <img
                      src="/image/no-records.svg"
                      alt=" "
                      loading="lazy"
                      className="img-fluid"
                    />
                    <p className="font-14">No Job Schedule Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      </div>
      {open &&<AddEditJobShedule
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
        jobid={param?.JobId}
      />
}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.jobTitle}
        id={object?.scheduleJobId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  )
}
