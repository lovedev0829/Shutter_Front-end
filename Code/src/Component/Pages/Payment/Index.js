import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  JobUi,
  SuccessMessage,
} from "../../../helpers/common";
import Header from "../../../Layout/header";
import JobTab from "../../Form/JobTab";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import AddEditPayment from "./AddEditPayment";
import { TablePagination } from "@mui/material";
import AddEditButton from "../../Form/AddEditButton";
import Detail from "../../Form/Details";
import { defaultConfig } from "../../../config";
import ViewPaymet from "./ViewPaymet";

function Index() {
  const [open, setOpen] = useState(false);
  const [JobData, setJobData] = useState([]);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [loder, setLoader] = useState(false);
  const [tenantList, setTenantList] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [delOpen, setDelOpen] = useState(false);
   const [history, setHistory] = useState(false);
   const [data, setData] = useState("");
  const param = useParams();

  const startLoading = () => setLoader((prev) => prev + 1);
  const stopLoading = () => setLoader((prev) => Math.max(0, prev - 1));

  const InvoiceDataApi = async () => {
    startLoading();
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllInvoice,
        { InvoiceId: param.invoiceId },
        "GET",
        {}
      );
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        JobDataAPI(apiResponse?.data?.data[0]?.jobId);
        setInvoiceData(apiResponse?.data?.data);
      } else {
        setInvoiceData([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      stopLoading();
    }
  };
  const JobDataAPI = async (job) => {
    startLoading();
    let query = {
      tenantId: "",
      searchValue: job,
      pageNo: 1,
      recordPerPage: 10,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
    };
    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setJobData(apiResponse?.data?.data);
      } else {
        setJobData([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      stopLoading();
    }
  };

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
  const TenantlistAPI = async (page, perpage) => {
    let query = {
      searchValue: param.invoiceId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      productType: "",
      status: 2,
    };
    startLoading();
    try {
      const apiResponse = await callAPI(apiUrls.Payment, {}, "POST", query);
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      stopLoading();
    }
  };

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(page, rowsPerPage);
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
    startLoading();
    try {
      const response = await callAPI(
        apiUrls.PaymentDelete,
        { ContactId: id },
        "POST",
        {}
      );
      stopLoading();
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(page, rowsPerPage);
        setPage(pageNo);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      stopLoading();
    }
  };

  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
  };
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage);
    setPage(1);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    InvoiceDataApi();
    // eslint-disable-next-line
  }, []);
  const handleInvoicDataApi = () => {
    InvoiceDataApi();
  };

  const details = [
    { label: "Estimate Name", value: InvoiceData[0]?.estimateName },
    { label: "Invoice No.", value: InvoiceData[0]?.invoiceNumber },
    {
      label: "Issue Date",
      value: InvoiceData[0]?.issueDate
        ? moment(InvoiceData[0].issueDate).format("MM-DD-YYYY")
        : "---",
    },
    {
      label: "Due Date.",
      value: InvoiceData[0]?.dueDate
        ? moment(InvoiceData[0].dueDate).format("MM-DD-YYYY")
        : "---",
    },
    {
      label: "Total Ammount",
      value: `${defaultConfig.currencySign} ${InvoiceData[0]?.totalAmount}`,
    },
    {
      label: "Balance Due",
      value:
        `${defaultConfig.currencySign} ${InvoiceData[0]?.balanceDue}` || "---",
    },
  ];

  return (
    <>
      <ApiLoder open={loder > 0} />
      <div className="intersight_content">
        <Header
          title={`Contacts / ${
            JobData[0]?.contactFirstName + " " + JobData[0]?.contactLasttName
          }`}
        />

        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <JobTab contactId={JobData[0]?.contactId} />
              </ul>

              <div className="row">
                <BackButton link={`/contacts/job/${InvoiceData[0]?.jobId}`} />
                <div className="col-lg-12">
                  <div className="new-job_list">
                    <JobUi tenantList={JobData[0]} />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {InvoiceData[0]?.balanceDue !== 0 && (
                  <div className="d-flex align-items-center justify-content-between mb-30">
                    <h2 className="body_heading width-left-border mb-0">
                      Payment
                    </h2>
                    {HasPermission("InvoiceAdd") && (
                      <AddEditButton
                        handleClick={() => {
                          setAction("add");
                          setOpen(true);
                        }}
                        title="Add Payment"
                      />
                    )}
                  </div>
                )}
                <div className="row">
                  <Detail title="Invoice Detail" Data={details} />

                  <div className="col-xxl-8 col-lg-8 col-md-7 col-12">
                    <div className="estimate-table task_table mb-30">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Payment Date</th>
                              {/* <th scope="col">Due Date</th> */}
                              <th scope="col">Amount</th>
                              <th scope="col">Method</th>
                              <th scope="col">TransactionId</th>
                              <th scope="col">Notes</th>
                              <th scope="col">Payment Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tenantList?.map((val, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    {moment(val?.paymentDate).format(
                                      "MM-DD-YYYY"
                                    )}
                                  </td>
                                  {/* <td>{moment(val?.paymentDueDate).format("MM-DD-YYYY")}</td> */}
                                  <td>
                                    {defaultConfig.currencySign} {val?.amount}
                                  </td>
                                  <td>{val?.paymentMethod}</td>
                                  <td><Link to={"#"} className="color-blue"  onClick={() => {
                                setHistory(true);
                                setData(val)
                              }}>{val?.transactionId}</Link></td>
                                  <td>{val.notes ? val.notes : "----"}</td>
                                  <td>
                                    <span
                                      className={`tags ${
                                        val?.status === "Paid"
                                          ? "active"
                                          : "inactive"
                                      }-tag`}
                                    >
                                      {val?.status}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    {val?.status === "Unpaid" && (
                                      <div className="company-logo-dropdown">
                                        <div className="dropdown">
                                          <button
                                            className="dropdown-toggle border-0 w-100 d-flex align-items-center"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <img
                                              src="/image/three-dot.svg"
                                              alt=""
                                              loading="lazy"
                                            />
                                          </button>
                                          <ul className="dropdown-menu dropdown-menu-end w-100 shadow dropdown-menu-big">
                                            <li>
                                              {HasPermission("InvoiceEdit") && (
                                                <li>
                                                  <Link
                                                    className="dropdown-item"
                                                    to="#"
                                                    onClick={() =>
                                                      handleedit(val)
                                                    }
                                                  >
                                                    <img
                                                      src="/image/edit 1.svg"
                                                      className="me-1"
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
                                                  onClick={() =>
                                                    handledelete(val)
                                                  }
                                                >
                                                  <img
                                                    src="/image/delete 1.svg"
                                                    className="me-1"
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
                                    )}
                                  </td>
                                </tr>
                              );
                            })}

                            {(!tenantList || tenantList?.length === 0) && (
                              <tr>
                                <td
                                  className="text-center border-0 no-records"
                                  colSpan={7}
                                >
                                  <img
                                    src="/image/no-records.svg"
                                    alt=" "
                                    loading="lazy"
                                    className="img-fluid"
                                  />
                                  <p className="font-14">No Payment Found</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewPaymet
              open={history}
              handleClose={() => setHistory(false)}
             data={data}
            />
      <AddEditPayment
        InvoiceId={param.invoiceId}
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
        HandleInvoiceApi={handleInvoicDataApi}
      />
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.transactionId}
        id={object?.paymentId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}

export default Index;
