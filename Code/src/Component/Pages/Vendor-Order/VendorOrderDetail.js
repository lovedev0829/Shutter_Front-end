import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import EditVendorMaterial from "./EditVendorMaterial";
import Detail from "../../Form/Details";
import { defaultConfig } from "../../../config";

function VendorOrderDetail() {
  const { vendorId } = useParams();
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const TenantlistAPI = async () => {
    let query = {
      searchValue: vendorId,
      pageNo: 1,
      recordPerPage: 10,
      tenantId: "",
      status: 2,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.VendorOrder, {}, "POST", query);
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

  const handlesendInvoice = async () => {
    const isConfirmed = window.confirm("Are you sure you want to send the order?");
    if (isConfirmed) {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorOrderInvoice,
        {},
        "POST",
        {
          vendorOrderId: tenantList[0]?.vendorOrderId,
          vendorId: tenantList[0]?.vendorId,
        }
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  }
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.deleteVendorOrderItem,
        { VendorOrderItemId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        TenantlistAPI();
        SuccessMessage(response.data.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleclose = () => {
    setOpen(false);
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);
  const handleedit = (item) => {
    setAction("edit");
    setObject({ ...item });
    setOpen(true);
  };
  const handledelclose = () => {
    setDelOpen(false);
  };
  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
  };
  const handleapi = () => {
    TenantlistAPI();
    setOpen(false);
  };

  const details = [
    {
      label: "Vendor Name",
      value: tenantList[0]?.firstName + " " + tenantList[0]?.lastName,
    },
    { label: "Job Name", value: tenantList[0]?.jobName },
    { label: "Order No", value: tenantList[0]?.orderNumber },
    {
      label: "Order Date",
      value: tenantList[0]?.orderDate
        ? moment(tenantList[0].orderDate).format("MM-DD-YYYY")
        : "---",
    },
    {
      label: "Expiry Delivery Date",
      value: tenantList[0]?.expectedDeliveryDate
        ? moment(tenantList[0].expectedDeliveryDate).format("MM-DD-YYYY")
        : "---",
    },
    {
      label: "Actual Delivery Date",
      value: tenantList[0]?.actualDeliveryDate
        ? moment(tenantList[0].actualDeliveryDate).format("MM-DD-YYYY")
        : "---",
    },
    { label: "Status", value: tenantList[0]?.vendorOrderStatus },
    {
      label: "Total Cost",
      value: `${defaultConfig.currencySign} ${tenantList[0]?.totalAmount}`,
    },
    { label: "Notes", value: tenantList[0]?.notes || "---" },
  ];
  return (
    <>
      {loder && <ApiLoder />}
      <div className="main_container">
        <div className="limani_body">
          <div className="intersight_content">
            <div className="top_header d-flex align-items-center justify-content-between">
              <h1>Vender</h1>
            </div>
            <div className="body_content">
              <div className="contact-profile">
                <div className="engage-tabs">
                  <ul className="nav nav-pills" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link to={"/vendors"}>
                        <button
                          onClick={() =>
                            localStorage.setItem(
                              "activeTab2",
                              "#vendorlisttabd"
                            )
                          }
                          className="nav-link "
                          id="pills-playbook-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#vendorlisttab"
                          type="button"
                          role="tab"
                          aria-controls="pills-playbook"
                          aria-selected="true"
                        >
                          <span>
                            <svg
                              width={20}
                              height={22}
                              viewBox="0 0 20 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.500031 7.85964L9.50003 13.0596C9.65205 13.1474 9.82449 13.1936 10 13.1936C10.1756 13.1936 10.348 13.1474 10.5 13.0596L19.5 7.85964C19.6512 7.77238 19.7768 7.64709 19.8646 7.49622C19.9523 7.34535 19.999 7.17415 20 6.99964C20.0007 6.82343 19.9549 6.65016 19.8671 6.49738C19.7792 6.34461 19.6526 6.21774 19.5 6.12964L10.5 0.939639C10.348 0.85187 10.1756 0.805664 10 0.805664C9.82449 0.805664 9.65205 0.85187 9.50003 0.939639L0.500031 6.12964C0.347426 6.21774 0.220812 6.34461 0.133009 6.49738C0.0452054 6.65016 -0.000669067 6.82343 3.05002e-05 6.99964C0.00108387 7.17415 0.0477894 7.34535 0.135505 7.49622C0.223221 7.64709 0.348893 7.77238 0.500031 7.85964ZM10 2.99964L17 6.99964L10 10.9996L3.00003 6.99964L10 2.99964ZM18.5 10.1696L10 14.9996L1.50003 10.1296C1.3859 10.0635 1.25981 10.0206 1.12903 10.0035C0.998253 9.98627 0.865367 9.99513 0.738027 10.0295C0.610687 10.0639 0.491408 10.1232 0.387061 10.2038C0.282714 10.2845 0.195361 10.3851 0.130031 10.4996C-0.000341877 10.7293 -0.0346082 11.0011 0.0347087 11.2559C0.104026 11.5107 0.271299 11.7277 0.500031 11.8596L9.50003 17.0596C9.65205 17.1474 9.82449 17.1936 10 17.1936C10.1756 17.1936 10.348 17.1474 10.5 17.0596L19.5 11.8596C19.7288 11.7277 19.896 11.5107 19.9654 11.2559C20.0347 11.0011 20.0004 10.7293 19.87 10.4996C19.8047 10.3851 19.7173 10.2845 19.613 10.2038C19.5087 10.1232 19.3894 10.0639 19.262 10.0295C19.1347 9.99513 19.0018 9.98627 18.871 10.0035C18.7402 10.0206 18.6142 10.0635 18.5 10.1296V10.1696ZM18.5 14.1696L10 18.9996L1.50003 14.1296C1.3859 14.0635 1.25981 14.0206 1.12903 14.0035C0.998253 13.9863 0.865367 13.9951 0.738027 14.0295C0.610687 14.0639 0.491408 14.1232 0.387061 14.2038C0.282714 14.2845 0.195361 14.3851 0.130031 14.4996C-0.000341877 14.7293 -0.0346082 15.0011 0.0347087 15.2559C0.104026 15.5107 0.271299 15.7277 0.500031 15.8596L9.50003 21.0596C9.65205 21.1474 9.82449 21.1936 10 21.1936C10.1756 21.1936 10.348 21.1474 10.5 21.0596L19.5 15.8596C19.7288 15.7277 19.896 15.5107 19.9654 15.2559C20.0347 15.0011 20.0004 14.7293 19.87 14.4996C19.8047 14.3851 19.7173 14.2845 19.613 14.2038C19.5087 14.1232 19.3894 14.0639 19.262 14.0295C19.1347 13.9951 19.0018 13.9863 18.871 14.0035C18.7402 14.0206 18.6142 14.0635 18.5 14.1296V14.1696Z"
                                fill="#9C9BA3"
                              />
                            </svg>
                          </span>
                          Manage Vendor
                        </button>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-overview-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#addvendortab"
                        type="button"
                        role="tab"
                        aria-controls="pills-overview"
                        aria-selected="false"
                      >
                        <span>
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.3333 0.75H1.66667C1.42355 0.75 1.19039 0.846577 1.01849 1.01849C0.846577 1.19039 0.75 1.42355 0.75 1.66667V16.3333C0.75 16.5764 0.846577 16.8096 1.01849 16.9815C1.19039 17.1534 1.42355 17.25 1.66667 17.25H16.3333C16.5764 17.25 16.8096 17.1534 16.9815 16.9815C17.1534 16.8096 17.25 16.5764 17.25 16.3333V1.66667C17.25 1.42355 17.1534 1.19039 16.9815 1.01849C16.8096 0.846577 16.5764 0.75 16.3333 0.75ZM8.08333 15.4167H2.58333V9.91667H8.08333V15.4167ZM8.08333 8.08333H2.58333V2.58333H8.08333V8.08333ZM15.4167 15.4167H9.91667V9.91667H15.4167V15.4167ZM15.4167 8.08333H9.91667V2.58333H15.4167V8.08333Z"
                              fill="#9C9BA3"
                            />
                          </svg>
                        </span>
                        Vendor Order
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade "
                      id="vendorlisttab"
                      role="tabpanel"
                      aria-labelledby="pills-overview-tab"
                      tabIndex={0}
                    ></div>
                    <div
                      className="tab-pane fade show active"
                      id="addvendortab"
                      role="tabpanel"
                      aria-labelledby="pills-payment-tab"
                      tabIndex={0}
                    >
                      <BackButton link={`/vendors`} />
                      <div className="d-flex align-items-center justify-content-between mb-30">
                        <h2 className="body_heading width-left-border mb-0">
                          Vendor Order Items
                        </h2>
                        <div className="heading_width_search d-flex align-items-center gap-3">
                          {HasPermission("VendorOrderEdit") &&  <Link
                            to="#"
                            className="btn blue-btn small_btn"
                            onClick={handlesendInvoice}
                          >
                            Send Order
                          </Link>}
                        </div>
                      </div>
                      <div className="row">
                        <Detail title="Vendor Detail" Data={details} />

                        <div className="col-xxl-8 col-lg-8 col-md-7 col-12">
                          <div className="task_table mb-30">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th scope="col">Material Name</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Unit Price</th>
                                    <th
                                      scope="col"
                                      className="text-end actionheading"
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tenantList[0]?.vendorOrderItems?.map(
                                    (item, i) => {
                                      return (
                                        <tr key={i}>
                                          <td>{item?.materialName}</td>
                                          <td>{item?.quantity}</td>
                                          <td>
                                            {defaultConfig.currencySign}{" "}
                                            {item?.unitPrice}
                                          </td>
                                          <td className="text-end actiondescription">
                                            <div className="company-logo-dropdown">
                                              <div className="dropdown text-end">
                                                {(HasPermission(
                                                  "VendorOrderEdit"
                                                ) ||
                                                  HasPermission(
                                                    "VendorOrderDelete"
                                                  )) && (
                                                  <>
                                                    <button
                                                      className="dropdown-toggle border-0 w-100 d-flex align-items-center justify-content-end"
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
                                                      {HasPermission(
                                                        "VendorOrderEdit"
                                                      ) && (
                                                        <li
                                                          onClick={() =>
                                                            handleedit(item)
                                                          }
                                                        >
                                                          <Link
                                                            className="dropdown-item"
                                                            to="#"
                                                          >
                                                            <img
                                                              src="/image/edit 1.svg"
                                                              alt=""
                                                              loading="lazy"
                                                              className="me-1"
                                                            />
                                                            Edit
                                                          </Link>
                                                        </li>
                                                      )}
                                                      {HasPermission(
                                                        "VendorOrderDelete"
                                                      ) && (
                                                        <li
                                                          onClick={() =>
                                                            handledelete(item)
                                                          }
                                                        >
                                                          <Link
                                                            className="dropdown-item"
                                                            to="#"
                                                          >
                                                            <img
                                                              src="/image/delete 1.svg"
                                                              alt=""
                                                              loading="lazy"
                                                              className="me-1"
                                                            />
                                                            Delete
                                                          </Link>
                                                        </li>
                                                      )}
                                                    </ul>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                  {(!tenantList[0]?.vendorOrderItems ||
                                    tenantList[0]?.vendorOrderItems?.length ===
                                      0) && (
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
                                        <p className="font-14">
                                          No Material Found
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className="d-flex justify-content-end">
                              <h2 className="font-14">
                                Total Price:-{" "}
                                <span className="color-blue">
                                  {tenantList[0]?.totalAmount}
                                </span>
                              </h2>
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
     {open && <EditVendorMaterial
        open={open}
        handleclose={handleclose}
        action={action}
        object={object}
        LanguageListAPI={handleapi}
        vendorOrderId={tenantList[0]?.vendorOrderId}
        materials={tenantList[0]?.vendorOrderItems}
        vendorId={tenantList[0]?.vendorId}
      />
     }
     {delOpen && <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.materialName}
        id={object?.vendorOrderItemId}
        handleDelete={handleDelete}
        loder={loder}
      />
     }
    </>
  );
}

export default VendorOrderDetail;
