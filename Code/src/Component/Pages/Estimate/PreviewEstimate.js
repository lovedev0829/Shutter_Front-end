import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { callAPI, callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import moment from "moment";
import SendApproved from "./SendApproved";
import { defaultConfig } from "../../../config";
import Breakdown from "./Breakdown";

export default function PreviewEstimate() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState("");
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();
  const [msg, setMsg] = useState("");

  const TenantlistAPI = async () => {
    setLoader(true);
    let query = {
      EstimationId: param.estimateId,
    };
    try {
      const apiResponse = await callAPIWithoutAuth(
        apiUrls.ViewEstimate,
        query,
        "POST",
        {}
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
         ErrorMessage(apiResponse.data.message);
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const Paymentget = async () => {
    try {
      const apiResponse = await callAPI(
        apiUrls.EstimateAmmount,
        { EstimateId: param.estimateId },
        "GET",
        {}
      );

      if (apiResponse?.data?.isSuccess) {
        setMsg(apiResponse?.data?.data);
      } else {
        setMsg("");
      }
    } catch (error) {
      setMsg("");
    }
  };
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      Paymentget();
    }
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPIWithoutAuth(
        apiUrls.EstimateApproved,
        { EstimationId: param.estimateId, Status: reject ? 3 : 2 },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI();
        setReject("");
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
      <div className="main_container">
        <div className="limani_body">
          <div
            className="estimate-header"
            style={{ backgroundColor: tenantList[0]?.primarycolor }}
          >
            <div className="container">
              <div className="header-body">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <h2>{tenantList[0]?.companyName}</h2>
                  <div className="d-flex align-items-center gap-3">
                    {token && (
                      <Link
                        to={`/contacts/job/${tenantList[0]?.jobId}`}
                        className="cancelheader text-decoration-underlinet"
                      >
                        Cancel
                      </Link>
                    )}

                    {!token && tenantList[0]?.status === "Approved" && (
                      <span className="badge badge-success">Approved</span>
                    )}

                    {!token && tenantList[0]?.status === "Rejected" && (
                      <span className="badge badge-danger">Rejected</span>
                    )}
                    {!token && tenantList[0]?.status === "GenerateOrder" && (
                      <span className="badge badge-info">Order Generated</span>
                    )}
                    {!token &&
                      tenantList[0]?.status !== "Approved" &&
                      tenantList[0]?.status !== "Rejected" &&
                      tenantList[0]?.status !== "GenerateOrder" && (
                        <>
                          <Link
                            to="#"
                            className="btn btn-success"
                            onClick={() => {
                              setApproved(true);
                              setReject("");
                            }}
                          >
                            Approve
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger"
                            onClick={() => {
                              setApproved(true);
                              setReject("yes");
                            }}
                          >
                            Reject
                          </Link>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="body_content">
              <div className="row mt-5 new-estimate">
                <div className="col-lg-12">
                  <div className="mb-30" style={{ paddingBottom:"50px" }}>
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Address</h6>
                          <span>{tenantList[0]?.jobDetails?.address}</span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Job Name</h6>
                          <span>{tenantList[0]?.jobDetails?.jobName}</span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Job Type</h6>
                          <span>{tenantList[0]?.jobDetails?.jobType}</span>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Assigned Personnel</h6>
                          <span>
                            {tenantList[0]?.jobDetails?.assignedPersonnel}
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="additional_direction">
                          <h6 className="mb-1">Job Notes</h6>
                          <span>
                            {tenantList[0]?.jobDetails?.jobNotes
                              ? tenantList[0]?.jobDetails?.jobNotes
                              : "---"}
                          </span>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="additional_direction">
                          <h6 className="mb-1">Schedule Date &amp; Time</h6>
                          <span>
                             {tenantList[0]?.jobDetails?.scheduleTime
                                          ? `${moment(tenantList[0]?.jobDetails?.scheduleTime).format(
                                              "MM-DD-YYYY"
                                            )} | ${moment(tenantList[0]?.jobDetails?.scheduleTime).format("hh:mm A")}`
                                          : "N/A"}

                           
                          </span>
                        </div>
                      </div>

                      <div className="col-lg-3 col-6">
                        <div className="additional_direction">
                          <h6 className="mb-1">Estimate Name</h6>
                          <span>
                            <span>{tenantList[0]?.estimateName}</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="additional_direction">
                          <h6 className="mb-1">Estimate Date</h6>
                          <span>
                            <span>
                              {moment(tenantList[0]?.createdDate).format(
                                "MM-DD-YYYY"
                              ) || ""}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="estimate-table task_table mb-30">
                    <div className="table-responsive">
                      <table className="table">
                          <tr>
                            <th scope="col">Window label</th>
                            <th scope="col">Window Qty</th>
                            <th scope="col">Product Type</th>
                            <th scope="col">Product</th>
                            <th scope="col">Retail Price</th>
                          </tr>
                        <tbody>
                          {tenantList[0]?.estimateProductList?.map((val, i) => (
                            <tr key={i}>
                              <td>{val?.label}</td>
                              <td>{val?.windowQty}</td>
                              <td>{val?.productName}</td>
                              <td>
                              {" "}
                                W: {val?.estimateWindowDetails?.width}”, H:{" "}
                                {val?.estimateWindowDetails?.height}”, A:{" "}
                                {val?.estimateWindowDetails?.archHeight}”
                                <span>
                                  <ul className="colors">
                                    {val?.options?.map((vals, ind) => (
                                      <li  key={ind}>
                                         {`-> ${vals}`}
                                      </li>
                                    ))}
                                  </ul>
                                </span>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {" "}
                                {defaultConfig.currencySign} 
                                {parseFloat(((val?.totalPrice ?? val?.productPrice ?? 0) + (val?.additionalCost ?? 0) + (val?.componentMarkup ?? 0) + (val?.productMarkup ?? 0) + (val?.optionMarkup ?? 0)).toFixed(2))}
                              </td>
                            </tr>
                          ))}
                            <tr >
                                <td colSpan="2" ></td>
                                <td style={{verticalAlign:"top"}}>
                                    <h2 className="font-14">Order Notes</h2>
                                    <h2 className="font-14">Terms and Conditions</h2>
                                    <div className="terms-content">
                                        <p>{tenantList[0]?.termsCondition}</p>
                                    </div>
                                </td>
                                <td style={{verticalAlign:"top"}}>
                                    <div className="col-md-6  mb-2">
                                        <h2 className="font-14">Additional Notes</h2>
                                        <div className="terms-content">
                                            <p>{tenantList[0]?.notes}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{verticalAlign:"top"}}>
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between">
                                            <h2 className="font-14 mb-0">Subtotal:</h2>
                                            <span className="mb-0">
                                            {defaultConfig.currencySign}{" "}
                                                {tenantList[0]?.subTotal}
                                            </span>
                                        </div>
                                        {Number(tenantList[0]?.discount)>0 && (
                                        <div className="d-flex justify-content-between">
                                            <h2 className="font-14 mb-0">Discount:</h2>
                                            <span className="mb-0">
                                            {defaultConfig.currencySign}{" "}
                                            {tenantList[0]?.discount}
                                            </span>
                                        </div>)}
                                        {tenantList[0]?.isTaxApplicable && (
                                            <div className="d-flex justify-content-between">
                                                <h2 className="font-14 mb-0">Taxes:</h2>
                                                <span className="mb-0">
                                                {defaultConfig.currencySign}{" "}
                                                {tenantList[0]?.tax}
                                                </span>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between">
                                            <h2 className="font-14 mb-0">Grand Total:</h2>
                                            <span className="mb-0">
                                            {defaultConfig.currencySign}{" "}
                                            {tenantList[0]?.grandTotal}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {msg && (
                        <div className="estimation">
                          <div
                            className="accordion accordion-flush"
                            id="accordionFlushExample"
                          >
                            {msg?.invoices?.map((val, i) => (
                              <div className="accordion-item" key={i}>
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse${i}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse${i}`}
                                  >
                                    <div className="estimation-heading">
                                      <h5>{val?.invoiceNumber}</h5>
                                      <div className="creator">
                                        <span>
                                          <strong>Invioce Amount:</strong>{" "}
                                          {defaultConfig.currencySign}{" "}
                                          {val?.totalAmount}
                                        </span>
                                        <span>
                                          <strong>Paid Amount:</strong>
                                          {defaultConfig.currencySign}{" "}
                                          {val?.paidAmount}
                                        </span>

                                        <span className="span_t">
                                          <strong>Payment status:</strong>{" "}
                                          {val?.status}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </h2>
                                <div
                                  id={`flush-collapse${i}`}
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  <div className="accordion-body">
                                    <div className="estimation-body">
                                      {val?.payments?.length > 0 && (
                                        <div className="task_attachment comments">
                                          <div className="comment_list">
                                            {val?.payments?.map((val, i) => (
                                              <div className="paymentdata">
                                                <span>
                                                  <strong>Payment Date:</strong>{" "}
                                                  {moment(
                                                    val?.paymentDate
                                                  ).format(
                                                    "MM-DD-YYYY-hh:mm A"
                                                  )}
                                                </span>
                                                <span>
                                                  <strong>Paid Amount:</strong>
                                                  {
                                                    defaultConfig.currencySign
                                                  }{" "}
                                                  {val?.amount}
                                                </span>
                                                <span>
                                                  <strong>
                                                    Transaction Id:
                                                  </strong>{" "}
                                                  {val?.transactionId}
                                                </span>
                                                <span>
                                                  <strong>
                                                    Payment Method:
                                                  </strong>{" "}
                                                  {val?.paymentMethod}
                                                </span>
                                                <span>
                                                  <strong>
                                                    Payment status:
                                                  </strong>{" "}
                                                  {val?.status}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
      <SendApproved
        open={approved}
        handleClose={() => setApproved(false)}
        handlestatus={handlestatus}
        estimateId={tenantList[0]?.estimateId}
                        isApproved={true}
                        loder={loder}
                        title={
                        reject
                            ? "You want to reject this estimate?"
                            : "You want to approve this estimate?"
                        }
                        subtitle={
                        reject
                            ? "Please click the Confirm button to reject this estimate."
                            : "Please click the Confirm button to approve this estimate."
                        }
                    />
                    {history &&<Breakdown
                        open={history}
                        handleClose={() => setHistory(false)}
                        data={{ windowProdcutId: object.windowProductId, label: object.label }}
                        EstimateId={tenantList[0]?.estimateId}
                        IsView={true}
                    />
                }
    </>
  );
}
