import React, { useEffect } from "react";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import AddEditAddress from "./AddEditAddress";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  FormatPhoneNumber,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { Link, useParams } from "react-router-dom";

export default function Addresslist() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, "");
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), "");
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const param = useParams();
  const TenantlistAPI = async (page, perpage, serach) => {
    let query = {
      searchValue: param.contactId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Address, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage, "");
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, "");
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    setAction("edit");
    setObject(item);
    setOpen(true);
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.AddressDelete,
        { Id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, "");
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

  return (
    <>
      {loder && <ApiLoder />}
      <div className="d-flex align-items-center justify-content-between mb-30">
        <TableTitle title="Manage Address" />

        <div className="heading_width_search d-flex align-items-center gap-3">
          {HasPermission("AddressAdd") && (
            <AddEditButton
              handleClick={() => {
                setAction("add");
                setOpen(true);
              }}
              title="Add New
                        Address"
            />
          )}
        </div>
      </div>
      <div className="row">
        {tenantList.map((val, i) => (
          <div className="col-lg-6" key={i}>
            <div className="address_list mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="font-14">
                  {val?.firstName + " " + val?.lastName}
                </h6>
                <div className="d-flex align-items-center gap-3">
                  <label className="font-14 d-flex align-items-center gap-2">
                    <img
                      src={
                        val?.label === "Home"
                          ? "/image/home.svg"
                          : val?.label === "Office"
                          ? "/image/briefcase.svg"
                          : "/image/vector-square.svg"
                      }
                      alt=""
                      loading="lazy"
                    />{" "}
                    {val?.label}
                  </label>
                  {(HasPermission("AddressEdit") ||
                    HasPermission("AddressDelete")) && (
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
                        <ul className="dropdown-menu dropdown-menu-end w-100 shadow">
                          {HasPermission("AddressEdit") && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                onClick={() => handleedit(val)}
                              >
                                <img
                                  src="/image/edit.svg"
                                  className="me-1"
                                  alt=" "
                                  loading="lazy"
                                />{" "}
                                Edit
                              </Link>
                            </li>
                          )}
                          {HasPermission("AddressDelete") &&
                            !val.isBillingAddress && (
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  onClick={() => handledelete(val)}
                                >
                                  <img
                                    src="/image/trash-alt.svg"
                                    className="me-1"
                                    alt=" "
                                    loading="lazy"
                                  />{" "}
                                  Delete
                                </Link>
                              </li>
                            )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span>
                {val?.zipCode} {val?.streetAddress}, {val?.stateName} , {val?.city}
              </span>
              <div className="row">
                <div className="col-lg-6">
                  <div className="additional_direction">
                    <h6 className="font-14  mb-0">Phone No.</h6>
                    <span>{FormatPhoneNumber(val?.phone || "")}</span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="additional_direction">
                    <h6 className="font-14  mb-0">Email Address</h6>
                    <span>{val?.email}</span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="additional_direction">
                    <h6 className="font-14  mb-0">Additional Directions</h6>
                    <span>{val?.notes}</span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="additional_direction">
                    <h6 className="font-14  mb-0">Access Codes</h6>
                    <span>{val?.accessCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!tenantList || tenantList?.length === 0) && (
          <div className="text-center border-0 no-records">
            <img src="/image/no-records.svg" alt=" " loading="lazy" className="img-fluid" />
            <p className="font-14">No Records Found</p>
          </div>
        )}
      </div>
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

      {open &&<AddEditAddress
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
      />
}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.label}
        id={object?.addressId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}
