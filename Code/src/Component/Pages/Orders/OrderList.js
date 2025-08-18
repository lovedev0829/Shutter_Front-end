import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { TablePagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import SendApproved from "../Estimate/SendApproved";
import VersionHistory from "./VersionHistory";
import { defaultConfig } from "../../../config";

export default function OrderList({ JobId,listdata }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);
  const [history, setHistory] = useState(false);
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
      searchValue: JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: 2,
      tenantId: "",
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
      region: "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Order, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage);
    // eslint-disable-next-line
  }, [JobId]);

  const handledelclosee = () => {
    setApproved(false);
    setObject("");
  };

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.SendInvoice,
        { },
        "POST",
        {
          documentType: 2,
          templateId: null,
          contactId: object.contactId,
          estimationId:  object.estimateId,
          orderId: object.orderId,
        }
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI(page, rowsPerPage, 2);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const navigate = useNavigate();

   const handleDownload = async (id, name) => {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.GenerateOrderSheet, {Orderid: id}, "POST", {});
        setLoader(false);
        if (response.data.isSuccess) {
          const decodedString = atob(response?.data?.data);
          const byteArray = new Uint8Array(decodedString.length);
          for (let i = 0; i < decodedString.length; i++) {
            byteArray[i] = decodedString.charCodeAt(i);
          }
          const blob = new Blob([byteArray], {
            type: "application/pdf",
          });
  
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${name}.pdf`;
          link.click();
          URL.revokeObjectURL(link.href);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    };

     const Loginuser = JSON.parse(localStorage.getItem("userData"));

console.log(listdata)
  return (
    <>
      <ApiLoder open={loder} />
      <div className="d-flex align-items-center justify-content-between mb-30">
        <h2 className="body_heading width-left-border mb-0">Orders</h2>
      </div>
      {/* order table */}
      <div className="estimate-table task_table mb-30">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SN</th>
                <th scope="col">Order Number</th>
                <th scope="col">Estimate Title</th>
                <th scope="col">Create Date</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Status</th>
                {listdata?.tenantId === Loginuser?.tenantId &&<th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {tenantList?.map((val, i) => (
                <tr key={i}>
                  <td>{(page - 1) * rowsPerPage + i + 1}</td>
                  <td>
                    <Link
                      to={`/contacts/order/preview/${val?.orderId}`}
                      className="cancel text-decoration-underline color-blue"
                    >
                      {val?.orderNumber}
                    </Link>
                  </td>
                  <td>{val?.estimateName}</td>
                  <td>{moment(val?.createdDate).format("MM-DD-YYYY") || ""}</td>
                  <td>
                    {" "}
                    {defaultConfig.currencySign} {val?.grandTotal}
                  </td>
                  <td>
                    <span
                      className={`btn ${
                        val?.status === "Approved" ? "approved" : "pending"
                      } small_btn`}
                    >
                      {val?.status}
                    </span>
                  </td>
                
{listdata?.tenantId === Loginuser?.tenantId &&
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
                        <ul
                          className="dropdown-menu dropdown-menu-end w-100 shadow dropdown-menu-big"
                          style={{ minWidth: "160px" }}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(
                                  `/contacts/order/preview/${val?.orderId}`
                                )
                              }
                            >
                              <img
                                src="/image/eye.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              View
                            </button>
                          </li>
                          {HasPermission("OrderEdit") && val?.status !== "PendingForApproval" && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/contacts/invoice/${JobId}/${val?.orderId}`}
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
                          {val?.status !== "Approved" && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => {
                                  setApproved(true);
                                  setObject(val);
                                }}
                              >
                                <img
                                  src="/image/message.svg"
                                  className="me-1"
                                  alt=""
                                  loading="lazy"
                                />
                                Send For Approval
                              </Link>
                            </li>
                          )}
                            <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleDownload(
                                  val?.orderId,
                                  val?.orderNumber
                                )
                              }
                            >
                              <img
                                src="/image/export.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Generate Order
                            </button>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="#"
                              onClick={() => {
                                setHistory(true);
                                setObject(val);
                              }}
                            >
                              <img
                                src="/image/history.svg"
                                className="me-1"
                                alt=""
                                loading="lazy"
                              />
                              Version History
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
}
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
                    <p className="font-14">No Orders Found</p>
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
      <SendApproved
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        estimateId={object.orderId}
        isApproved={false}
        loder={loder}
        title={"Share Link Via Copy or Email Prospective Customer"}
        subtitle={
          "You can send this link via email and copy to send the customer"
        }
        url="/contacts/order/preview/"
      />
     {history &&<VersionHistory
        open={history}
        handleClose={() => setHistory(false)}
        EstimationId={object.estimateId}
      />
     }
    </>
  );
}
