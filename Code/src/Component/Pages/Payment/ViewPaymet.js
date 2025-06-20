import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder } from "../../../helpers/common";
import moment from "moment";
import { defaultConfig } from "../../../config";

const ViewPaymet = ({ open, handleClose, data }) => {
  const [tenantList, setTenantList] = useState("");
  const [show, setShow] = useState(true);
  const TenantlistAPI = async () => {
    let query = {
      Tranjectionid: data.transactionId,
      PaymentId: data.paymentId,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(
        apiUrls.GetPaymentDetails,
        query,
        "GET",
        {}
      );
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList("");
      }
    } catch (error) {
      setShow(false);
      setTenantList("");
    }
  };
  useEffect(() => {
    if (data) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [data, open]);

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
                  Payment History
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
                    {show && <ApiLoder />}
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr style={{whiteSpace:"nowrap"}}>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Customer Email</th>
                            <th scope="col">Payment Amount</th>
                            <th scope="col">Stripe Tranjection Id</th>
                            <th scope="col">Payment Method</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Payment Date/Time</th>
                          </tr>
                        </thead>
                        <tbody>
                            {tenantList &&
                          <tr>
                            <td>{tenantList?.customerName}</td>
                            <td>{tenantList?.customerEmail} </td>
                            <td>
                              {defaultConfig.currencySign}
                              {tenantList?.paymentAmount}
                            </td>
                            <td>{tenantList?.stripeTranjectionId}</td>
                            <td>{tenantList?.paymentMethod}</td>
                            <td>
                            <span className={`tags ${tenantList?.paymentStatus==="paid" ?"active-tag":""}`}> {tenantList?.paymentStatus}</span>
                               </td>
                            <td style={{whiteSpace:"nowrap"}}>
                              {moment(tenantList?.paymentDate).format(
                                "MM-DD-YYYY || hh:mm A"
                              ) || ""}
                            </td>
                          </tr>
}
                        </tbody>
                      </table>
                    </div>

                    {!tenantList && (
                      <div className="text-center border-0 no-records">
                        <img
                          src="/image/no-records.svg"
                          alt=" "
                          loading="lazy"
                          className="img-fluid"
                        />
                        <p className="font-14">No Payment History available</p>
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

export default ViewPaymet;
