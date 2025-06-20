import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import moment from "moment";
import SendApproved from "../Estimate/SendApproved";
import { defaultConfig } from "../../../config";
import Breakdown from "../Estimate/Breakdown";

export default function PreviewOrder() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState("");
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();

  const TenantlistAPI = async () => {
    setLoader(true);
    let query = {
      orderId: param.orderId,
    };
    try {
      const apiResponse = await callAPIWithoutAuth(
        apiUrls.ViewOrder,
        query,
        "POST",
        {}
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);
  const token = localStorage.getItem("accessToken");

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPIWithoutAuth(
        apiUrls.OrderApproved,
        { OrderId: param.orderId, Status: reject ? 3 : 2 },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setReject("");
        setApproved(false);
        TenantlistAPI();
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

                    {!token &&
                      tenantList[0]?.status !== "Approved" &&
                      tenantList[0]?.status !== "Rejected" && (
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
                  <div className="new-job_list mb-30">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Address</h6>
                          <span>{tenantList[0]?.jobDetails?.address}</span>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="additional_direction mt-0">
                          <h6 className="mb-1">Job Name</h6>
                          <span>{tenantList[0]?.jobDetails?.jobName}</span>
                        </div>
                      </div>
                      <div className="col-lg-3">
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
                              ? `${moment(
                                  tenantList[0]?.jobDetails?.scheduleTime
                                ).format("MM-DD-YYYY")} | ${moment(
                                  tenantList[0]?.jobDetails?.scheduleTime
                                ).format("hh:mm A")}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="additional_direction">
                          <h6 className="mb-1">Estimate Name</h6>
                          <span>
                            <span>{tenantList[0]?.estimateName}</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="additional_direction">
                          <h6 className="mb-1">Order Number</h6>
                          <span>
                            <span>{tenantList[0]?.orderNumber}</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="additional_direction">
                          <h6 className="mb-1">Order Date</h6>
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
                        <thead>
                          <tr>
                            <th scope="col">Window label</th>
                            <th scope="col">Window Qty</th>
                            <th scope="col">Product Type</th>
                            <th scope="col">Product</th>
                            <th scope="col">Dimension</th>
                            <th scope="col">Options</th>
                            {/* <th scope="col">Wholesale Price</th> */}
                            <th scope="col">Retail Price</th>
                            {/* {token && ( <th scope="col" className=" text-center">
                              Breakdown
                            </th>
                             )} */}
                          </tr>
                        </thead>
                        <tbody>
                          {tenantList[0]?.estimateProductList?.map((val, i) => (
                            <tr key={i}>
                              <td>{val?.label}</td>
                              <td>{val?.windowQty}</td>
                              <td>{val?.productTypeName}</td>
                              <td>{val?.productName}</td>
                              <td>
                                {" "}
                                W: {val?.estimateWindowDetails?.width}”, H:{" "}
                                {val?.estimateWindowDetails?.height}”, A:{" "}
                                {val?.estimateWindowDetails?.archHeight}”
                              </td>
                              <td>
                                <span>
                                  <ul className="colors">
                                    {val?.options?.map((vals, ind) => (
                                      <li className="color-item" key={ind}>
                                        {vals}
                                      </li>
                                    ))}
                                  </ul>
                                </span>
                              </td>
                              {/* <td>
                                {defaultConfig.currencySign}{" "}
                                {val.wholesalePrice ?? 0}
                              </td> */}
                              <td style={{ whiteSpace: "nowrap" }}>
                                {defaultConfig.currencySign}{" "}
                                {parseFloat(
                                  (
                                    (val?.price ?? val?.productPrice ?? 0) +
                                    (val?.additionalCost ?? 0) + (val?.componentMarkup ?? 0) + (val?.productMarkup ?? 0) + (val?.optionMarkup ?? 0)
                                  )?.toFixed(2)
                                )}
                              </td>
                              {/* {token && val?.price ?
                              <td
                                className="text-center"
                                onClick={() => {
                                  setHistory(true);
                                  setObject(val);
                                }}
                              >
                                <Link to="#">
                                  {" "}
                                  <img src="/image/breakdown.svg" alt="" loading="lazy"/>
                                </Link>
                              </td>:
                              <td>
                             

                              </td>
                               } */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6" />
                    <div className="col-md-6">
                      <div className="adjust-pricing">
                        <div className="middle-heading">
                          <h4>Summary</h4>
                        </div>
                        {tenantList[0]?.discountCoupon && (
                          <div className="couponapplied d-block d-md-flex align-items-center w-100 gap-3">
                            <h2 className="font-14 mb-0">Discount Applied</h2>

                            <input
                              type="text"
                              value={
                                tenantList[0]?.discountCoupon
                                  ? tenantList[0]?.discountCoupon
                                  : "No Discount Applied"
                              }
                              disabled
                            />
                          </div>
                        )}
                        {/* <div className="couponapplied d-block d-md-flex align-items-center w-100 gap-3">
                          <h2 className="font-14 mb-0">Tax Rate Applied</h2>

                          <input
                            type="text"
                            value={
                              tenantList[0]?.taxRate
                                ? `(${tenantList[0]?.region}) ${tenantList[0]?.taxRate}`
                                : "No Tax Applied"
                            }
                            disabled
                          />
                        </div> */}
                        <div className="price-content w-100">
                          <div className="price-content-inner">
                            <div className="d-flex justify-content-between">
                              <h2 className="font-14 mb-0">Subtotal:</h2>
                              <span className="mb-0">
                                {defaultConfig.currencySign}{" "}
                                {tenantList[0]?.subTotal}
                              </span>
                            </div>
                            {/* <div className="d-flex justify-content-between">
                              <h2 className="font-14 mb-0">Additional Cost:</h2>
                              <span className="mb-0">
                                {defaultConfig.currencySign}{" "}
                                {tenantList[0]?.additionalCost}
                              </span>
                            </div> */}
                            {Number(tenantList[0]?.discount) > 0 && (
                              <div className="d-flex justify-content-between">
                                <h2 className="font-14 mb-0">Discount:</h2>
                                <span className="mb-0">
                                  {defaultConfig.currencySign}{" "}
                                  {tenantList[0]?.discount}
                                </span>
                              </div>
                            )}
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
                        </div>
                        <div className="middle-heading">
                          <h4>Estimate Notes</h4>
                        </div>
                        <div className="row">
                          <div className="col-md-6  mb-2">
                            <h2 className="font-14">Terms and Conditions</h2>
                            <div className="terms-content">
                              <p>{tenantList[0]?.termsCondition}</p>
                            </div>
                          </div>
                          <div className="col-md-6  mb-2">
                            <h2 className="font-14">Additional Notes</h2>
                            <div className="terms-content">
                              <p>{tenantList[0]?.notes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
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
        estimateId={tenantList[0]?.orderId}
        isApproved={true}
        loder={loder}
        title={
          reject
            ? "You want to reject this order?"
            : "You want to approve this order?"
        }
        subtitle={
          reject
            ? "Please click the Confirm button to reject this order."
            : "Please click the Confirm button to approve this order."
        }
      />
      <Breakdown
        open={history}
        handleClose={() => setHistory(false)}
        data={{ windowProdcutId: object.windowProductId, label: object.label }}
        EstimateId={tenantList[0]?.estimateId}
        IsView={true}
        isestimate={false}
      />
    </>
  );
}
