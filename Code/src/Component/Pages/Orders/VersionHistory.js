import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import { Link } from "react-router-dom";
import moment from "moment";
import { defaultConfig } from "../../../config";

const VersionHistory = ({ open, handleClose, EstimationId }) => {
  const [tenantList, setTenantList] = useState([]);
  const [show, setShow] = useState(true);
  const TenantlistAPI = async () => {
    let query = {
      EstimationId: EstimationId,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.ViewHistory, query, "POST", {});
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setShow(false);
    }
  };
  useEffect(() => {
    if (EstimationId) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [EstimationId, open]);
  let isFirstApprovedShown = false;
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className="modal fade show"
          id="contactModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", backgroundColor: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered filter_modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  Version History
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    handleClose();
                  }}
                ></i>
              </div>
              <form>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <ApiLoder open={show} />
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">SN</th>
                            <th scope="col">Version No</th>
                            <th scope="col">Order Number</th>
                            <th scope="col">Estimate Title</th>
                            <th scope="col">Create Date</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tenantList?.map((val, i) => {
                            const isApproved = val?.status === "Approved";
                            let showNew = false;

                            if (isApproved && !isFirstApprovedShown) {
                              showNew = true;
                              isFirstApprovedShown = true;
                            }
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{val?.version} </td>
                                <td>
                                  <Link
                                    to={`/contacts/order/preview/${val?.orderId}`}
                                    className="cancel text-decoration-underline color-blue"
                                    target="_blank"
                                  >
                                    {val?.orderNumber}
                                  </Link>
                                </td>
                                <td>{val?.estimateName}</td>
                                <td>
                                  {moment(val?.createdDate).format(
                                    "MM-DD-YYYY"
                                  ) || ""}
                                </td>
                                <td>{defaultConfig.currencySign} {val?.grandTotal}</td>
                                <td>
                                  <span
                                    className={`btn ${
                                      val?.status === "Approved"
                                        ? "approved"
                                        : "pending"
                                    } small_btn`}
                                  >
                                    {val?.status}
                                  </span>

                                  {showNew ? (
                                    <div className="live-container">
                                      <span className="live-text">LIVE</span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {(!tenantList || tenantList?.length === 0) && (
                      <div className="text-center border-0 no-records">
                        <img
                          src="/image/no-records.svg"
                          alt=" "
                          loading="lazy"
                          className="img-fluid"
                        />
                        <p className="font-14">No Version History available</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default VersionHistory;
