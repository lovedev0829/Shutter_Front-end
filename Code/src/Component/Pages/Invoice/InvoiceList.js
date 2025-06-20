import React, { useEffect } from "react";
import { useState } from "react";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { Link } from "react-router-dom";
import AddEditInvoice from "./AddEditInvoice";
import moment from "moment";
import StatusDropdown from "../../../helpers/StatusDropdown";
import { defaultConfig } from "../../../config";

export default function InvoiceList({ JobId,contactId }) {
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
      searchValue: JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      productType: "",
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Invoice, {}, "POST", query);
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
  }, [JobId]);

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
        apiUrls.InvoiceDelete,
        { ContactId: id },
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
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.InvoiceActiveInActive,
        { ContactId: item.invoiceId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      rowsPerPage,
      e.target.name === "tenantId" ? e.target.value : filter.tenantId,
      e.target.name === "status" ? e.target.value : filter.status
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handlesandinvoice = async (param) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", {
        documentType: 3,
        templateId: null,
        contactId:contactId,
        estimationId: param.estimateId,
        invoiceId: param.invoiceId,
      });
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
        <div className="d-flex gap-3 invoice-new">
          <h2 className="body_heading width-left-border mb-0">Invoice</h2>
          <div className="filter-dropdown dropdown">
            <StatusDropdown value={filter.status} fn={handleChange} />
          </div>
        </div>
        {HasPermission("InvoiceAdd") && (
          <AddEditButton
            handleClick={() => {
              setAction("add");
              setOpen(true);
            }}
            title="Add Invoice"
          />
        )}
      </div>
      <div className="estimate-table task_table mb-30">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SN</th>

                <th scope="col ">Invoice Number</th>
                <th scope="col ">Estimate Name</th>
                <th scope="col">Issue Date</th>
                <th scope="col">Due Date</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Balance Due</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenantList.map((val, i) => (
                <tr key={i}>
                  <td>{(page - 1) * rowsPerPage + i + 1}</td>
                  <td>
                    <Link
                      className="color-blue"
                      to={`/contacts/payment/${val?.invoiceId}`}
                    >
                      {" "}
                      {val?.invoiceNumber}
                    </Link>
                  </td>
                  <td>{val?.estimateName}</td>
                  <td>{moment(val?.issueDate).format("MM-DD-YYYY")}</td>
                  <td>{moment(val?.dueDate).format("MM-DD-YYYY")}</td>
                  <td>
                    {defaultConfig.currencySign} {val?.totalAmount}
                  </td>
                  <td>
                    {defaultConfig.currencySign} {val?.balanceDue}
                  </td>
                  <td>
                    <span
                      className={`tags ${
                        val?.isActive === true ? "active" : "inactive"
                      }-tag`}
                      onClick={() => handleStatus(val)}
                    >
                      {val?.isActive === true ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="company-logo-dropdown">
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle border-0 w-100 d-flex align-items-center"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src="/image/three-dot.svg" alt="" loading="lazy"/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end w-100 shadow dropdown-menu-big">
                        {HasPermission("InvoiceEdit") && ( <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handlesandinvoice(
                                  val
                                  
                                )
                              }
                            >
                              <img
                                src="/image/export.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Send Invoice
                            </button>
                          </li>
                           )}
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/contacts/payment/${val?.invoiceId}`}
                            >
                              <img
                                src="/image/eye.svg"
                                className="me-1"
                                alt=""
                                loading="lazy"
                              />
                              View Payment
                            </Link>
                          </li>
                          <li>
                            {HasPermission("InvoiceEdit") && (
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  onClick={() => handleedit(val)}
                                >
                                  <img
                                    src="/image/edit 1.svg"
                                    className="me-1"
                                    role="button"
                                    alt=""
                                    loading="lazy"
                                  />
                                  Edit
                                </Link>
                              </li>
                            )}
                          </li>

                          {HasPermission("InvoiceDelete") && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => handledelete(val)}
                              >
                                <img
                                  src="/image/delete 1.svg"
                                  className="me-1"
                                  role="button"
                                  alt=""
                                  loading="lazy"
                                />
                                Delete
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
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
                    <p className="font-14">No Invoices Found</p>
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
     {open && <AddEditInvoice
        jobid={JobId}
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
        title={object?.invoiceNumber}
        id={object?.invoiceId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}
