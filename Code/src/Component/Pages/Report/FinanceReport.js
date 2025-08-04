import React, { useEffect } from "react";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import { ApiLoder } from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import ReportFilter from "./ReportFilter";
import moment from "moment";
import { defaultConfig } from "../../../config";
import ExportFile from "../../../helpers/ExportFile";

export default function FinanceReport() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
   const [filter, setFilter] = useState({ toDate: null, formDate: null });
  const [value, setValue] = useState({
    orderStatus: 0,
    orderReport: "Outstanding Invoice",
  });
  const JobStatus = [
    {
      jobStatusId: 0,
      jobStatusName: "Outstanding Invoice",
      isActive: true,
    },
    {
      jobStatusId: 2,
      jobStatusName: "Outstanding Invoice (Due Date)",
      isActive: true,
    },
    {
      jobStatusId: 1,
      jobStatusName: "Payment Received",
      isActive: true,
    },
  ];
  const handleSearch = (value) => {
    setsearch(value);
  };
  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search, value.orderStatus,filter.toDate,filter.formDate);
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      value.orderStatus,filter.toDate
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, serach, Type,toDate,formDate) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      toDate: toDate?toDate:null,
      formDate:formDate?formDate: null,
      status: 2,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetInvoiceReport,
        { Type: Type ? Type : 0 },
        "POST",
        query
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch, value.orderStatus,filter.toDate,filter.formDate);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handleStatuschange = (value, name) => {
    setValue((val) => {
      return { ...val, orderStatus: value, orderReport: name };
    });
    TenantlistAPI(1, rowsPerPage, search, value,filter.toDate,filter.formDate);
    setPage(1);
  };
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, search,value.orderStatus, e.target.name === "toDate" ? e.target.value : filter.toDate,e.target.name === "formDate" ? e.target.value : filter.formDate
    );
    setPage(1)
    setFilter((val) => {
        return { ...val, [e.target.name]: e.target.value };
    });
};
  return (
    <>
      {loder && <ApiLoder />}
      <ReportFilter
        handleStatuschange={handleStatuschange}
        value={value}
        JobStatus={JobStatus}
      />
      <div className="contact-profile">
        <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
          <TableTitle
            title={`${
              value.orderReport ? value.orderReport : "All Finance Report"
            }`}
          />
          <div className="heading_width_search d-flex align-items-center gap-3">
            <div className="greencolor">
              Total Number Of{" "}
              {value.orderReport ? value.orderReport : "All Finance Report"}:{" "}
              {paginatedItems}
            </div>
          </div>
        </div>
        <div className="d-block d-md-flex align-items-center gap-2  justify-content-between">
          <div className="d-block d-md-flex gap-2 mb-30 ">
            <div className="filter-dropdown dropdown ">
              <Search handleSearch={handleSearch} />
            </div>
             <div className="filter-dropdown dropdown ">
              <div className="position-relative calender-input">
                <input
                  style={{ color: "white" }}
                  type="date"
                  onChange={handleChange}
                  className="form-control selectboxdropdown"
                  name="formDate"
                  value={moment(filter.formDate).format("YYYY-MM-DD") || ""}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#212529",
                    pointerEvents: "none",
                  }}
                >
                  {filter.formDate ? moment(filter.formDate).format("MM-DD-YYYY") : "From Date"}
                </span>
                <img src="/image/calendar-alt.svg" alt="" loading="lazy" style={{top:"4px"}}/>
              </div>
            </div>
            <div className="filter-dropdown dropdown ">
              <div className="position-relative calender-input">
                <input
                  style={{ color: "white" }}
                  type="date"
                  onChange={handleChange}
                  className="form-control selectboxdropdown"
                  name="toDate"
                  value={moment(filter.toDate).format("YYYY-MM-DD") || ""}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#212529",
                    pointerEvents: "none",
                  }}
                >
                  {filter.toDate ? moment(filter.toDate).format("MM-DD-YYYY") : "To Date"}
                </span>
                <img src="/image/calendar-alt.svg" alt="" loading="lazy" style={{top:"4px"}}/>
              </div>
            </div>
           
          </div>
          <div className="d-flex gap-2 mb-30 justify-content-between">
            {/* <div className="btn blue-btn small_btn">
              <PrintSvg />
              <Link to="#">Print</Link>
            </div> */}
            <div className="btn blue-btn small_btn">
               <ExportFile type="invoice"  serach={search} page={page} perpage={rowsPerPage}  status={"2"} Url={apiUrls.ExportContacts} toDate={filter.toDate} formDate={filter.formDate} filterType={value.orderStatus}/>
            </div>
          </div>
        </div>
        <div className="estimate-table task_table mb-30">
          <div className="table-responsive">
            <table className="table jobscheduletable">
              <thead>
                <tr>
                  <th scope="col">Invoice Number</th>
                  <th scope="col">Contact Name</th>
                  <th scope="col">Invoice Date</th>
                  <th scope="col">Due Date</th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    Due Amount
                  </th>
                  <th scope="col" className="text-end actionheading">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenantList?.map((val, i) => (
                  <tr key={i}>
                    <td>{val?.invoiceNumber}</td>
                    <td>{val?.contactFirstName + " " + val?.contactLastName+ " " + (val?.suffix ?? "") }</td>
                    <td>{moment(val?.issueDate).format("MM-DD-YYYY")}</td>
                    <td
                      style={{
                        color: moment(val?.dueDate).isSame(moment(), "day")
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {moment(val?.dueDate).format("MM-DD-YYYY")}
                    </td>
                    <td>
                      {defaultConfig.currencySign} {val?.balanceDue}
                    </td>
                    <td>
                      {" "}
                      <span className="d-flex align-items-center justify-content-end gap-3">
                        {defaultConfig.currencySign} {val?.totalAmount}
                      </span>
                    </td>
                  </tr>
                ))}

                {(!tenantList || tenantList?.length === 0) && (
                  <tr>
                    <td className="text-center border-0 no-records" colSpan={7}>
                      <img
                        src="/image/no-records.svg"
                        alt=" "
                        loading="lazy"
                        className="img-fluid"
                      />
                      <p className="font-14">No Finance Report</p>
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
      </div>
    </>
  );
}
