import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";

import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { TablePagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import SendApproved from "./SendApproved";
import { defaultConfig } from "../../../config";

export default function EstimateList({ listdata }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
    const [isResend, setisResend] = useState(false);
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);
  const [text, setText] = useState("1"); // 1 for approved 2 for reject and 3 for order

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, 2);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), 2);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, status) => {
    let query = {
      jobId: listdata?.jobId,
      searchValue: "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: status,
      tenantId: "",
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
      region: "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Estimate, {}, "POST", query);
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
    if (listdata?.jobId) {
      TenantlistAPI(1, rowsPerPage, 2);
      setPage(1);
    }

    // eslint-disable-next-line
  }, [listdata?.jobId]);

  const handlestatus = async () => {
    setLoader(true);
    try {
      let body =
        text === "1"
          ? {
              documentType: 0,
              templateId: null,
              contactId: listdata?.contactId,
              estimationId: object.estimateId,
              isResend:isResend
            }
          : {};
      let query = text === "1" ? {} : { EstimateId: object.estimateId };
      const response = await callAPI(
        text === "1" ? apiUrls.SendInvoice : apiUrls.OrderCreate,
        query,
        "POST",
        body
      );
      setLoader(false);
      if (response.data.isSuccess) {
        setisResend(false)
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

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.EstimateDelete,
        { EstimateId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, 2);
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

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };
  const handledelclosee = () => {
    setApproved(false);
    setObject("");
  };

  const handleDownload = async (id, name) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", {
        templateId: null,
        contactId: listdata?.contactId,
        estimationId: id,
        documentType: 1,
      });
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

  return (
    <>
      {loder && <ApiLoder />}

      <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
        <div className="d-flex gap-3 invoice-new">
          <h2 className="body_heading width-left-border mb-0">Estimate</h2>
        </div>
        {HasPermission("EstimateAdd") && (
          <Link
            to={`/contacts/estimate/${listdata?.jobId}`}
            className={`btn blue-outline-btn small_btn`}
          >
            Build Estimate
          </Link>
        )}
      </div>
      {/* estimate table */}
      <div className="estimate-table task_table mb-30">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SN</th>
                <th scope="col">Estimate Title</th>
                <th scope="col">Prepared by</th>
                <th scope="col">Create Date</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tenantList?.map((val, i) => (
                <tr key={i}>
                  <td>{(page - 1) * rowsPerPage + i + 1}</td>
                  <td>
                    <Link
                      to={`/contacts/estimate/preview/${val?.estimateId}`}
                      key={i}
                      className="cancel text-decoration-underline color-blue"
                    >
                      {val?.estimateName}
                    </Link>
                  </td>
                  <td>{val?.preparedByName || "---"}</td>
                  <td>{moment(val?.createdDate).format("MM-DD-YYYY") || ""}</td>
                  <td>
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
                  {val?.status !== "GenerateOrder" ? (
                    <td>
                      {HasPermission("EstimateEdit") && (
                        <button
                          className="btn blue-btn small_btn me-2"
                          onClick={() => {
                            if (
                              val?.status === "New" ||
                              val?.status === "Rejected"
                            ) {
                              setApproved(true);
                              setObject(val);
                              setText("1");
                              setisResend(false)
                            } else {
                              setApproved(true);
                              setObject(val);
                              setText("2");
                              setisResend(false)
                            }
                          }}
                          disabled={
                            val?.status === "PendingForApproval" ? true : false
                          }
                        >
                          {val?.status === "Approved"
                            ? "Genrate Order"
                            : "Send for Approval"}
                        </button>
                      )}
                      {HasPermission("EstimateEdit") &&
                        val?.status === "PendingForApproval" && (
                          <button
                            className="btn blue-btn small_btn"
                            onClick={() => {
                                setisResend(true)
                              setApproved(true);
                              setObject(val);
                              setText("1");
                            }}
                          >
                            Resend
                          </button>
                        )}
                    </td>
                  ) : (
                    <td></td>
                  )}
                  <td>
                    <div className="company-logo-dropdown d-flex justify-content-end">
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
                        <ul className="dropdown-menu dropdown-menu-end w-100 shadow">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(
                                  `/contacts/estimate/preview/${val?.estimateId}`
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
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleDownload(
                                  val?.estimateId,
                                  val?.estimateName
                                )
                              }
                            >
                              <img
                                src="/image/export.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Download Pdf
                            </button>
                          </li>
                          {HasPermission("EstimateEdit") && (
                            <li>
                              {(val?.status === "New" ||
                                val?.status === "Rejected") && (
                                <Link
                                  className="dropdown-item"
                                  to={`/contacts/estimate/${listdata?.jobId}/${val?.estimateId}`}
                                >
                                  <img
                                    src="/image/edit 1.svg"
                                    className="me-1"
                                    alt=""
                                    loading="lazy"
                                  />
                                  Edit
                                </Link>
                              )}
                            </li>
                          )}
                          {HasPermission("EstimateDelete") && (
                            <li>
                              {(val?.status === "New" ||
                                val?.status === "Rejected") && (
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  onClick={() => handledelete(val)}
                                >
                                  <img
                                    src="/image/delete 1.svg"
                                    className="me-1"
                                    alt=""
                                    loading="lazy"
                                  />
                                  Delete
                                </Link>
                              )}
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
                    <p className="font-14">No Estimates Found</p>
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
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.estimateName}
        id={object?.estimateId}
        handleDelete={handleDelete}
        loder={loder}
      />
      <SendApproved
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        estimateId={object.estimateId}
        loder={loder}
        isApproved={text === "2" ? true : false}
        title={
          text === "1"
            ? "Share Link Via Copy or Email Prospective Customer"
            : `You want to Genrate Order for this estimate (${object.estimateName})?`
        }
        subtitle={
          text === "1"
            ? "You can send this link via email and copy to send the customer"
            : "Please click the Confirm button to Genrate Order for this estimate."
        }
        url="/contacts/estimate/preview/"
      />
    </>
  );
}
