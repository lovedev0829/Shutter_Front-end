import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import ExportFile from "../../../helpers/ExportFile";
import { defaultConfig } from "../../../config";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const Breakdown = ({
  open,
  handleClose,
  data,
  EstimateId = "",
  IsView = false,
}) => {
  const [tenantList, setTenantList] = useState([]);
  const [tenantList2, setTenantList2] = useState([]);
  const [shows, setShows] = useState(false);
  const [show, setShow] = useState(false);
   const [name, setname] = useState("");

  const TenantlistAPI = async () => {
    let query = {
      WindowProductIds: [data.windowProdcutId],
      IsBreakDown: true,
      EstimateId: EstimateId,
      IsView: IsView,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(
        apiUrls.BuildEstimate,
        {},
        "POST",
        query
      );
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
    if (data.windowProdcutId) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [open]);

  const TenantlistAPI2 = async (componentId) => {
    let query = {
      WindowProductIds: [data.windowProdcutId],
      IsBreakDown: true,
      EstimateId: EstimateId,
      IsView: IsView,
      IsMaterialBreakdown: true,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(
        apiUrls.BuildEstimate,
        {},
        "POST",
        query
      );
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
       const filter = apiResponse?.data?.data.filter((val)=> val.componentId ===componentId)
        setTenantList2(filter);
      } else {
        setTenantList2([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setShow(false);
    }
  };

  const handlemat = (name,componentId)=>{
     setname(name)
     setShows(true)
    TenantlistAPI2(componentId);
  }
 

  const token = localStorage.getItem("accessToken");

  const componentprice = tenantList?.reduce(
    (sum, item) => sum + item.price || 0,
    0
  );

  const optionprice = tenantList
    .flatMap((val) => val?.optionTaxDetails || [])
    .sort((a, b) => a.optionName.localeCompare(b.optionName))
    .reduce((sum, item) => sum + (item.optionPrice || 0), 0);

  const overheadprice =
    Number(tenantList[0]?.componentMarkup || 0) +
    Number(tenantList[0]?.productMarkup || 0) +
    Number(tenantList[0]?.optionMarkup || 0);

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
          <div
            className="modal-dialog modal-dialog-centered filter_modal"
            style={{ maxWidth: "90%" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  Breakdown
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
                    <div className="d-flex align-items-center justify-content-between mb-30">
                      <div className="heading_width_search d-flex align-items-center gap-3">
                        <h2 className="body_heading width-left-border mb-0">
                          {data?.label}
                        </h2>
                      </div>
                      {token && tenantList?.length !== 0 && (
                        <div className="heading_width_search d-flex align-items-center gap-3">
                          <ExportFile
                            type="breakdown"
                            serach={""}
                            page={1}
                            perpage={10}
                            tenantId={""}
                            status={"2"}
                            Url={apiUrls.ExportContacts}
                            jobStatus={""}
                            vendor={""}
                            productType={""}
                            WindowProductId={data.windowProdcutId}
                            EstimationId={""}
                          />
                        </div>
                      )}
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            <th scope="col">Product Type</th>
                            <th scope="col">Product</th>
                            <th scope="col">Window Qty</th>
                            <th scope="col">Product Width</th>
                            <th scope="col">Product Height</th>

                            {tenantList?.map(
                              (val, i) =>
                                val.componentId && (
                                  <th scope="col" key={i}>
                                    <Link
                                      className="color-blue"
                                      to={`/component/detail/${val.componentId}`}
                                      target="_blank"
                                    >
                                      {val?.componentName}
                                    </Link>{" "}
                                    {val.isMaterialBreakdown && (
                                      <span
                                        className="product_question" style={{background:"#fff"}}
                                        onClick={() => {
                                          handlemat(val?.componentName,val.componentId);
                                        }}
                                      >
                                       <img src="/image/breakdown.svg" alt="" loading="lazy"/>
                                      </span>
                                    )}
                                  </th>
                                )
                            )}
{/* 
                            {tenantList &&
                              tenantList
                                .flatMap((val) => val?.optionTaxDetails || [])
                                .sort((a, b) =>
                                  a.optionName.localeCompare(b.optionName)
                                )
                                .map((opt, idx) => (
                                  <th key={idx}>
                                    {opt.optionName} - {opt.optionTypeName}
                                  </th>
                                ))} */}

                            <th scope="col">Sub Total</th>
                            <th scope="col">Over Head</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{tenantList[0]?.productTypeName}</td>
                            <td>
                              <Link
                                className="color-blue"
                                to={`/products/detail/${tenantList[0]?.productId}`}
                                target="_blank"
                              >
                                {tenantList[0]?.productName}
                              </Link>
                            </td>
                            <td>{tenantList[0]?.quantity}</td>
                            <td>{tenantList[0]?.buildWidth}</td>
                            <td>{tenantList[0]?.buildHeight}</td>
                            {tenantList?.map((val, i) =>
                              val.componentId ? (
                                <td key={i}>
                                  {defaultConfig.currencySign} {val.price ?? 0}
                                </td>
                              ) : null
                            )}

                            {/* {tenantList &&
                              tenantList
                                .flatMap((val) => val?.optionTaxDetails || [])
                                .sort((a, b) =>
                                  a.optionName.localeCompare(b.optionName)
                                )
                                .map((opt, idx) => (
                                  <td key={idx}>
                                    {defaultConfig.currencySign}{" "}
                                    {opt.optionPrice || 0}
                                  </td>
                                ))} */}

                            <td style={{ whiteSpace: "nowrap" }}>
                              {defaultConfig.currencySign}{" "}
                              {(
                                Number(componentprice) + Number(optionprice)
                              )?.toFixed(2)}
                              {/* {Number(
                                tenantList[0]?.productPrice ||
                                  tenantList[0]?.totalPrice ||
                                  0
                              )?.toFixed(2)} */}
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {defaultConfig.currencySign}{" "}
                              {overheadprice?.toFixed(2)}
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {defaultConfig.currencySign}{" "}
                              {(
                                Number(componentprice) +
                                Number(optionprice) +
                                overheadprice
                              )?.toFixed(2)}
                              {/* {(
                                Number(
                                  tenantList[0]?.productPrice ||
                                    tenantList[0]?.totalPrice ||
                                    0
                                ) + Number(tenantList[0]?.additionalCost || 0)
                              )?.toFixed(2)} */}
                            </td>
                          </tr>
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
                        <p className="font-14">No Breakdown available</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={shows}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px",
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
          <div
            className="modal-dialog modal-dialog-centered filter_modal"
            
          >
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  {data?.label}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setShows(false);
                  }}
                ></i>
              </div>
              <form>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    {show && <ApiLoder />}
                    <div className="d-flex align-items-center justify-content-between mb-30">
                      <div className="heading_width_search d-flex align-items-center gap-3">
                        <h2 className="body_heading width-left-border mb-0">
                          {name}
                        </h2>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            {tenantList2?.map(
                              (val, i) =>
                                val.materialName && val.isMaterialBreakdown && (
                                  <th scope="col" key={i}>
                                    {val?.materialName}
                                  </th>
                                )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {tenantList2?.map(
                              (val, i) =>
                               val.materialName && val.isMaterialBreakdown && (
                                  <td key={i}> {defaultConfig.currencySign}{" "} {val?.materialPrice}</td>
                                )
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {(!tenantList2 || tenantList2?.length === 0) && (
                      <div className="text-center border-0 no-records">
                        <img
                          src="/image/no-records.svg"
                          alt=" "
                          loading="lazy"
                          className="img-fluid"
                        />
                        <p className="font-14">No Breakdown available</p>
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

export default Breakdown;
