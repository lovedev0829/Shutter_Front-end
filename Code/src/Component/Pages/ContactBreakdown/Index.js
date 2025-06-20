import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import ContactBreakdown from "../../../helpers/ContactBreakdown";
import ContactUniqueIdBreakdown from "../../../helpers/ContactUniqueIdBreakdown";
import ContactJobBreakdown from "../../../helpers/ContactJobBreakdown";
import ContactEstimatioBreakdown from "../../../helpers/ContactEstimatioBreakdown";
import ExportFile from "../../../helpers/ExportFile";
import GetProductBreakdown from "../../../helpers/GetProductBreakdown";
import { defaultConfig } from "../../../config";
import { Link } from "react-router-dom";

export default function Index() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [filter, setFilter] = useState({
    ContactName: "",
    contactUniqueId: "",
    JobId: "",
    EstimationId: "",
    windowProdcutId: "",
  });

  const TenantlistAPI = async (EstimationId, WindowProdcutId) => {
    let query = {
      EstimationId: EstimationId ? EstimationId : "",
      WindowProdcutId: WindowProdcutId ? WindowProdcutId : "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.ContactEstimationProductBreakdown,
        query,
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "EstimationId") {
      TenantlistAPI(e.target.value, filter.windowProdcutId);
    }
    if (e.target.name === "windowProdcutId") {
      TenantlistAPI(filter.EstimationId, e.target.value);
    }
    if (
      e.target.name !== "windowProdcutId" ||
      e.target.name !== "EstimationId"
    ) {
      setTenantList([]);
    }
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  // Group by windowProdcutId
  const groupedData = tenantList.reduce((result, item) => {
    if (!result[item.windowProdcutId]) {
      result[item.windowProdcutId] = [];
    }
    result[item.windowProdcutId].push(item);
    return result;
  }, {});

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Estimate Cost Break Down" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Breakdown List" />
              {tenantList?.length !== 0 && (
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
                    WindowProductId={
                      filter.windowProdcutId ? filter.windowProdcutId : ""
                    }
                    EstimationId={
                      filter.windowProdcutId ? "" : filter.EstimationId
                    }
                  />
                </div>
              )}
            </div>

            <div className="d-block d-md-flex align-items-center gap-2 mb-30">
              <div className="filter-dropdown dropdown">
                <ContactBreakdown
                  value={filter.ContactName}
                  fn={handleChange}
                  className="selectboxdropdown"
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactUniqueIdBreakdown
                  value={filter.contactUniqueId}
                  fn={handleChange}
                  className="selectboxdropdown"
                  ContactId={filter.ContactName}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactJobBreakdown
                  value={filter.JobId}
                  fn={handleChange}
                  className="selectboxdropdown"
                  ContactId={filter.contactUniqueId}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactEstimatioBreakdown
                  value={filter.EstimationId}
                  fn={handleChange}
                  className="selectboxdropdown"
                  JobId={filter.JobId}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <GetProductBreakdown
                  value={filter.windowProdcutId}
                  fn={handleChange}
                  className="selectboxdropdown"
                  EstimationId={filter.EstimationId}
                />
              </div>
            </div>

            {Object.entries(groupedData).map(([key, items]) => (
              <div
                className="living-room-window-table mb-3 estimatebreakdown"
                key={key}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="mb-3 font-16">{items[0]?.label}</h2>
                </div>
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Product Type</th>
                        <th scope="col">Product</th>
                        <th scope="col">Window Qty</th>
                        <th scope="col">Width</th>
                        <th scope="col">Height</th>

                        
                        {items?.map((vals, ind) =>  vals.componentId && (
                          <th scope="col" key={ind}>
                            <Link
                              className="color-blue"
                              to={`/component/detail/${vals.componentId}`}
                             
                            >
                              {vals?.componentName}
                            </Link>
                          </th>
                        ))}
                        {items &&
                          items
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <th key={idx}>
                                {opt.optionName} - {opt.optionTypeName}
                              </th>
                            ))}
                        <th scope="col">Sub Total</th>
                           <th scope="col">Over Head</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{items[0]?.productTypeName}</td>
                        <td>
                          <Link
                            className="color-blue"
                            to={`/products/detail/${items[0]?.productId}`}
                          
                          >
                            {items[0]?.productName}
                          </Link>
                        </td>
                        <td>{items[0]?.quantity}</td>
                        <td>{items[0]?.buildWidth}</td>
                        <td>{items[0]?.buildHeight}</td>
                        {items?.map((vals, ind) =>  vals.componentId &&(
                          <td key={ind}>
                            {defaultConfig.currencySign} {vals?.price}
                          </td>
                        ))}
                        {items &&
                          items
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <td key={idx}>
                                {defaultConfig.currencySign}{" "}
                                {opt.optionPrice || 0}
                              </td>
                            ))}
                        <td style={{ whiteSpace: "nowrap" }}>
                          {defaultConfig.currencySign}{" "}
                          {Number(
                                items[0]?.productPrice ||
                                  items[0]?.totalPrice ||
                                  0
                              )?.toFixed(2)}
                     
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {(
                                Number(
                                  items[0]?.componentMarkup ||
                                    0
                                ) + Number(items[0]?.productMarkup || 0) + Number(items[0]?.optionMarkup || 0)
                              )?.toFixed(2)}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {(
                                Number(
                                  items[0]?.productPrice ||
                                    items[0]?.totalPrice ||
                                    0
                                ) + Number(items[0]?.additionalCost || 0)+Number(
                                  items[0]?.componentMarkup ||
                                    0
                                ) + Number(items[0]?.productMarkup || 0) + Number(items[0]?.optionMarkup || 0)
                              )?.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
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
      </div>
      
    </>
  );
}
