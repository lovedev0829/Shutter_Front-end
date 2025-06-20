import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";

export default function Index() {
  return (
    <div className="intersight_content">
      <Header title="Cut Sheet" />
      <div className="body_content">
        <div className="contact-profile">
          <div className="d-flex align-items-center justify-content-between mb-30">
            <TableTitle title="Manage Cut Sheet" />
            <div className="heading_width_search d-flex align-items-center gap-3">
              <Link className="btn blue-btn small_btn" to="#">
              <img src="/image/plus.svg" alt=" " loading="lazy" />
              Generate Cut
                Sheet
              </Link>
            </div>
          </div>

          <div className="task_table mb-30">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Job Name</th>
                    <th scope="col">Job Id</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Customer ID</th>
                    <th scope="col">Window</th>
                    <th scope="col">Shutter Type</th>
                    <th scope="col">No. Window</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Austin Granger</td>
                    <td>Cus-TET20250130-1</td>
                    <td>Person</td>
                    <td>Cus-TET20250130-1</td>
                    <td>Home</td>
                    <td>Shutter</td>
                    <td>1</td>
                    <td>
                      <div className="company-logo-dropdown d-flex justify-content-end">
                        <div className="dropdown">
                          <button
                            className="dropdown-toggle border-0 w-100 d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src="/image/three-dot.svg" alt=" " loading="lazy"/>
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-end w-100 shadow"
                            style={{}}
                          >
                            <li>
                              <button className="dropdown-item">
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
                              <Link className="dropdown-item" to="#">
                                <img
                                  src="/image/edit.svg"
                                  className="me-1"
                                  alt=" "
                                  loading="lazy"
                                />{" "}
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="">
                                <img
                                  src="/image/trash-alt.svg"
                                  className="me-1"
                                  alt=" "
                                  loading="lazy"
                                />{" "}
                                Delete
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  );
}
