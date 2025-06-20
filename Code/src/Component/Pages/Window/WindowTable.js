import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddEditButton from "../../Form/AddEditButton";
import AddEditWindow from "./AddEditWindow";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { TablePagination } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Window } from "../../../Redux/Redux/Action/Action";
import Imagepreview from "../../MultiImage/Imagepreview";

function WindowTable({ listdata }) {
  const [multiImage, setMultiImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const [selectedParentId, setSelectedParentId] = useState([]);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage) => {
    let query = {
      searchValue: listdata?.jobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: "2",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Window, {}, "POST", query);
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
    if (listdata?.jobId) {
      TenantlistAPI(1, rowsPerPage);
      setPage(1);
    }

    // eslint-disable-next-line
  }, [listdata?.jobId]);

  const handleclose = () => {
    setOpen(false);
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    const windowdata =
      item?.productDetails?.map((product) => {
        var optionTypes =
          product?.windowOptions?.map((option) => {
            return option?.optionTypeId;
          }) || [];

        return {
          productId: product?.productId,
          productTypeId: product?.productTypeId,
          optionTypeId: optionTypes,
          buildWidth: product?.buildWidth,
          buildHeight: product?.buildHeight,
        };
      }) || [];

    const defaultState = {
      windowId: item?.windowId,
      contactId: listdata?.contactId,
      addressId: item?.addressId,
      jobId: item?.jobId,
      quantity: item?.quantity,
      label: item?.label,
      width: item?.width,
      height: item?.height,
      archHeight: item?.archHeight,
      notes: item?.notes,
      photo: item?.photo,
      // isRated:item?.isRated,
      windowProducts: windowdata,
    };

    setAction("edit");
    setObject(defaultState);
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
        apiUrls.WindowDelete,
        { WindowId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage);
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

  const handleRadioChange = (
    id,
    parentIndex,
    label,
    height,
    width,
    archHeight
  ) => {
    setSelectedParentId((prev) => {
      const updatedSelection = prev.filter(
        (existingId) => existingId.parentIndex !== parentIndex
      );
      return [
        ...updatedSelection,
        { ...id, parentIndex, label, height, width, archHeight },
      ];
    });
  };
  useEffect(() => {
    dispatch(Window(selectedParentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentId]);

  const handleRemoveRadio = (parentIndex) => {
  setSelectedParentId((prev) =>
    prev.filter((item) => item.parentIndex !== parentIndex)
  );
};



  const resetObject = () => {
    setObject("");
  };
  const HandleImagePreview = () => setMultiImage(false);
  return (
    <>
      {loder && <ApiLoder />}
      <div className="d-flex align-items-center justify-content-between mb-30">
        <h2 className="body_heading width-left-border mb-0">
          {" "}
          Window Measurements
        </h2>
      </div>

      <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
        <div className="d-flex align-items-center gap-2 status-full-width"></div>
        <div className="heading_width_search d-flex align-items-center gap-3">
          {HasPermission("EstimateAdd") && (
            <Link
              to={`/contacts/estimate/${listdata?.jobId}`}
              className={`btn blue-outline-btn small_btn ${
                selectedParentId?.length > 0 ? "" : "disabled-link"
              }`}
            >
              Build Estimate
            </Link>
          )}
          {HasPermission("WindowAdd") && (
            <AddEditButton
              handleClick={() => {
                setAction("add");

                setOpen(true);
              }}
              title="Add new Window"
            />
          )}
        </div>
      </div>
      {tenantList?.map((val, i) => (
        <div className="living-room-window-table mb-3" key={i}>
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="mb-3 font-16">{val?.label}</h2>
            {(HasPermission("WindowEdit") || HasPermission("WindowDelete")) && (
              <div className="company-logo-dropdown mb-2">
                <div className="dropdown">
                  <button
                    className="dropdown-toggle border-0 w-100 d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Action{" "}
                    <img
                      src="/image/three-dot.svg"
                      className="ps-3"
                      alt=""
                      loading="lazy"
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end w-100 shadow">
                    {HasPermission("WindowEdit") && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => handleedit(val)}
                        >
                          <img
                            src="/image/edit 1.svg"
                            className="me-1"
                            alt=""
                            loading="lazy"
                          />
                          Edit
                        </Link>
                      </li>
                    )}
                    {HasPermission("WindowDelete") && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => handledelete(val)}
                        >
                          <img
                            src="/image/delete 1.svg"
                            className="me-1"
                            alt=""
                            loading="lazy"
                          />
                          Delete
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    Qty
                  </th>
                  <th scope="col">Product Type</th>
                  <th scope="col">Product</th>
                  <th scope="col">Dimensions</th>
                  <th scope="col">Build Width</th>
                  <th scope="col">Build Height</th>
                  <th scope="col">Photo</th>
                </tr>
              </thead>
              <tbody>
                {val?.productDetails?.map((vals, ind) => (
                  <tr key={ind}>
                    <td>
                      <div className="form-check table-form-check">
                        <input
                          className="form-check-input table-form-check-input"
                          type="radio"
                          name={`parentRadio-${i}`}
                          id={`parentRadio-${ind}`}
                          checked={selectedParentId.some(
                            (id) =>
                              id.windowProductId === vals.windowProductId &&
                              id.parentIndex === i
                          )}
                          onChange={() =>
                            handleRadioChange(
                              vals,
                              i,
                              val?.label,
                              val?.height,
                              val?.width,
                              val?.archHeight
                            )
                          }
                        />
                        {selectedParentId.some(
                          (id) =>
                            id.windowProductId === vals.windowProductId &&
                            id.parentIndex === i
                        ) && (
                          <img
                            src="/image/cross.png"
                            alt=""
                            style={{width:"17px",cursor:"pointer"}}
                            onClick={() => handleRemoveRadio(i)}
                          >
                            
                          </img>
                        )}
                        <label
                          className="form-check-label"
                          htmlFor={`parentRadio-${ind}`}
                        >
                          {val.quantity}
                        </label>
                      </div>
                    </td>
                    <td>{vals?.productTypeName}</td>
                    <td>
                      <Link
                        className="color-blue"
                        to={`/products/detail/${vals.productId}`}
                      >
                        {vals?.productName}
                      </Link>
                    </td>
                    <td>
                      W: {val?.width}”, H: {val?.height}”, A: {val?.archHeight}”
                    </td>
                    <td>{vals?.buildWidth}</td>
                    <td>{vals?.buildHeight}</td>
                    <td>
                      <span
                        className="d-flex align-items-center gap-2 table-photo"
                        onClick={() => {
                          setSelectedImages(val || {});
                          setMultiImage(true);
                        }}
                      >
                        <img
                          src={val?.photo[0] || "/image/no-image.jpg"}
                          alt=""
                          loading="lazy"
                          style={{ cursor: "pointer" }}
                        />
                        {val?.photo?.length > 1 && (
                          <h2
                            className="font-14 mb-0"
                            style={{ cursor: "pointer" }}
                          >
                            +{val?.photo?.length - 1}
                          </h2>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
                {multiImage && (
                  <Imagepreview
                    imagesData={selectedImages}
                    imageopen={multiImage}
                    handlecloseImage={HandleImagePreview}
                  />
                )}
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
          <p className="font-14">No Windows Found</p>
        </div>
      )}
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
      {open && (
        <AddEditWindow
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={handleapi}
          object={object}
          listdata={listdata}
          resetObject={resetObject}
        />
      )}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.label}
        id={object?.windowId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}

export default WindowTable;
