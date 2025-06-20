import React from "react";
import { Link } from "react-router-dom";
import { FormatPhoneNumber, HasPermission } from "../../helpers/common";
import moment from "moment";
import { defaultConfig } from "../../config";

const DynamicTable = ({
  data,
  columns,
  title,
  rowActions,
  edituser,
  handledelete,
  handlestatus,
  deletepermission,
  editpermission,
  viewUser,
  handleVersion,
  handlecontact,
  handleFilterSortChange,
  sortColumn,
  sortDirection,
  columnFilters,
  handlesearchChange,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th style={{ verticalAlign: "top" }} scope="col" key={index}>
              {col.label || col.key}
              {col.sort && sortColumn === col.key && (
                <span
                  className="ascen-descending"
                  onClick={() =>
                    col.sort ? handleFilterSortChange(col.key) : null
                  }
                >
                  {sortDirection === "asc" ? (
                    <img src="/image/ascending.png" alt=""></img>
                  ) : (
                    <img src="/image/descending.png" alt=""></img>
                  )}
                </span>
              )}

              {col.sort && sortColumn !== col.key && (
                <span
                  className="ascen-descending"
                  onClick={() =>
                    col.sort ? handleFilterSortChange(col.key) : null
                  }
                >
                  <img src="/image/ascending.png" alt=""></img>
                </span>
              )}

              {col.sort && (
                <input
                  type="text"
                  class="form-control new-search-input"
                  name="suffix"
                  placeholder="Search here"
                  value={
                    columnFilters.find((f) => f.field === col.key)?.value || ""
                  }
                  onChange={(e) => handlesearchChange(col.key, e.target.value)}
                ></input>
              )}
            </th>
          ))}
          {(HasPermission(editpermission) ||
            HasPermission(deletepermission)) && (
            <th
              scope="col"
              className="text-end"
              style={{ verticalAlign: "top" }}
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.key === "firstName" ? (
                    <span
                      className={`max_width_column ${
                        col.link ? "color-blue" : ""
                      }`}
                      onClick={() => (col.link ? viewUser(row) : null)}
                    >
                      {row.firstName +
                        " " +
                        row.lastName +
                        " " +
                        (row?.suffix ?? "")}
                    </span>
                  ) : col.key === "contactFirstName" ? (
                    <span
                      className={`max_width_column ${
                        col.link ? "color-blue" : ""
                      }`}
                      onClick={() => (col.link ? handlecontact(row) : null)}
                    >
                      {row.contactFirstName +
                        " " +
                        row.contactLastName +
                        " " +
                        (row?.suffix ?? "")}
                    </span>
                  ) : col.key === "firstContactName" ? (
                    <span
                      className={`max_width_column ${
                        col.link ? "color-blue" : ""
                      }`}
                      onClick={() => (col.link ? handlecontact(row) : null)}
                    >
                      {row.firstContactName +
                        " " +
                        row.lastContactName +
                        " " +
                        (row?.suffix ?? "")}
                    </span>
                  ) : col.key === "expressionFormulae" ? (
                    row?.displayArray?.join("")
                  ) : col.key === "isActive" ? (
                    <span
                      className={`tags ${
                        row[col.key] ? "active" : "inactive"
                      }-tag`}
                      onClick={() => handlestatus(row)}
                    >
                      {row[col.key] ? "Active" : "Inactive"}
                    </span>
                  ) : col.key === "vendorOrderStatus" ? (
                    <span
                      className={`tags ${
                        row[col.key] === "Approved" ? "active" : "inactive"
                      }-tag`}
                    >
                      {row[col.key]}
                    </span>
                  ) : col.key === "primaryColor" ? (
                    <div
                      style={{
                        width: "31px",
                        height: "18px",
                        backgroundColor: row.primaryColor || "#0e0d32",
                        borderRadius: "6px",
                      }}
                    ></div>
                  ) : col.key === "isCutSheet" ? (
                    <span>{row.isCutSheet ? "Yes" : "No"}</span>
                  ) : col.key === "isDefault" ? (
                    <span>{row.isDefault ? "Yes" : "No"}</span>
                  ) : col.key === "jobStatusName" ? (
                    <span className={`status-select difulatcolor`}>
                      {row?.jobStatusName}
                    </span>
                  ) : col.key === "options" ? (
                    <span>
                      <ul className="colors">
                        {row?.options?.map((opt, optIndex) => (
                          <li key={optIndex} className="color-item">
                            {opt.optionType} ($ {opt.additionalCost})
                          </li>
                        ))}
                      </ul>
                    </span>
                  ) : col.key === "logo" ? (
                    <span
                      className="person-logo"
                      onClick={() =>
                        window.open(row.logo || "/image/no-image.jpg", "_blank")
                      }
                    >
                      <img
                        src={row.logo || "/image/no-image.jpg"}
                        alt="Logo"
                        loading="lazy"
                      />
                    </span>
                  ) : col.key === "effectiveDate" ||
                    col.key === "startDate" ||
                    col.key === "orderDate" ||
                    col.key === "expectedDeliveryDate" ||
                    col.key === "actualDeliveryDate" ||
                    col.key === "createdDate" ? (
                    moment(row[col.key]).format("MM-DD-YYYY") || ""
                  ) : col.key === "expiryDate" ? (
                    moment(row[col.key]).format("MM-DD-YYYY") || ""
                  ) : col.phoneformate ? (
                    FormatPhoneNumber(row[col.key] || "")
                  ) : col.link ? (
                    <span className="color-blue" onClick={() => viewUser(row)}>
                      {row[col.key]}
                    </span>
                  ) : col.sign ? (
                    defaultConfig.currencySign + " " + row[col.key]
                  ) : row[col.key] || row[col.key] === 0 ? (
                    row[col.key]
                  ) : (
                    "-"
                  )}
                </td>
              ))}
              {(HasPermission(editpermission) ||
                HasPermission(deletepermission)) && (
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
                          alt=" "
                          loading="lazy"
                        />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end w-100 shadow">
                        {rowActions.includes("view") && (
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => viewUser(row)}
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
                        )}
                        {rowActions.includes("edit") && (
                          <li>
                            {HasPermission(editpermission) && (
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => {
                                  edituser(row);
                                }}
                              >
                                <img
                                  src="/image/edit.svg"
                                  className="me-1"
                                  alt=" "
                                  loading="lazy"
                                />{" "}
                                Edit
                              </Link>
                            )}
                          </li>
                        )}
                        {rowActions.includes("delete") && (
                          <li>
                            {HasPermission(deletepermission) && (
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => handledelete(row)}
                              >
                                <img
                                  src="/image/trash-alt.svg"
                                  className="me-1"
                                  alt=" "
                                  loading="lazy"
                                />{" "}
                                Delete
                              </Link>
                            )}
                          </li>
                        )}

                        {rowActions.includes("version") && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to="#"
                              onClick={() => handleVersion(row)}
                            >
                              <img
                                src="/image/history.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Version History
                            </Link>
                          </li>
                        )}
                        {rowActions.includes("product") && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/managepartnerproduct/${row.tenantId}`}
                            >
                              <img
                                src="/image/history.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Manage Product
                            </Link>
                          </li>
                        )}
                        {rowActions.includes("ghl") && (
                          <li
                            onClick={() => {
                              localStorage.setItem("ghluser", row?.companyName);
                            }}
                          >
                            <Link
                              className="dropdown-item"
                              to={`/subtenant/${row.tenantId}`}
                            >
                              <img
                                src="/image/history.svg"
                                className="me-1"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Sync GHL
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              className="text-center border-0 no-records"
              colSpan={columns.length + 1}
            >
              <img
                src="/image/no-records.svg"
                alt=" "
                loading="lazy"
                className="img-fluid"
              />
              <p className="font-14">
                No Records Found. Please Add New {title}
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DynamicTable;
