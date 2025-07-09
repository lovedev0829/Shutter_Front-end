import Dialog from "@mui/material/Dialog";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, ErrorMessage, HasPermission } from "../../../helpers/common";
import Imagepreview from "../../MultiImage/Imagepreview";
import AddEditWindow from "../Window/AddEditWindow";

const AddnewWindow = ({
  open,
  handleclose,
  jobid,
  handleSenddata,
  Addedwindows,
  listdata,
}) => {
  const [tenantList, setTenantList] = useState([]);
  const [multiImage, setMultiImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});
  const [show, setShow] = useState(true);
  const [vendor, setvendor] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState([]);
  const TenantlistAPI = async () => {
    let query = {
      searchValue: jobid,
      pageNo: 1,
      recordPerPage: 1000,
      status: 2,
    };

    try {
      const apiResponse = await callAPI(apiUrls.Window, {}, "POST", query);
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
    if (jobid) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [jobid]);

  const handleapi = () => {
    TenantlistAPI();
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

  function removeMatchingEntries(firstArray, secondArray) {
    return firstArray.filter((firstItem) => {
      return !firstItem.productDetails.some((productDetail) => {
        return secondArray.some((secondItem) => {
          return productDetail.windowProductId === secondItem.windowProdcutId;
        });
      });
    });
  }

  const filteredArray = removeMatchingEntries(tenantList, Addedwindows);
  const HandleImagePreview = () => setMultiImage(false);
  
 const handleRemoveRadio = (parentIndex) => {
  setSelectedParentId((prev) =>
    prev.filter((item) => item.parentIndex !== parentIndex)
  );
};
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
                  Add Windows
                </h1>
                {HasPermission("WindowAdd") && (
                  <img
                    src="/image/plusblue.svg"
                    alt=""
                    loading="lazy"
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => setvendor(true)}
                  />
                )}
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    handleclose();
                  }}
                ></i>
              </div>
              <form>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    {show && <ApiLoder />}
                    {filteredArray?.map((val, i) => (
                      <div className="living-room-window-table mb-3" key={i}>
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 className="mb-3 font-16">{val?.label}</h2>
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
                                            id.windowProductId ===
                                              vals.windowProductId &&
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
                                          id.windowProductId ===
                                            vals.windowProductId &&
                                          id.parentIndex === i
                                      ) && (
                                        <img
                                          src="/image/cross.png"
                                          alt=""
                                          style={{
                                            width: "17px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => handleRemoveRadio(i)}
                                        ></img>
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
                                      target="_blank"
                                    >
                                      {vals?.productName}
                                    </Link>
                                  </td>
                                  <td>
                                    W: {val?.width}”, H: {val?.height}”, A:{" "}
                                    {val?.archHeight}”
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
                                        src={
                                          val?.photo[0] || "/image/no-image.jpg"
                                        }
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
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                    {multiImage && (
                      <Imagepreview
                        imagesData={selectedImages}
                        imageopen={multiImage}
                        handlecloseImage={HandleImagePreview}
                      />
                    )}
                    {(!filteredArray || filteredArray?.length === 0) && (
                      <div className="text-center border-0 no-records">
                        <img
                          src="/image/no-records.svg"
                          alt=" "
                          loading="lazy"
                          className="img-fluid"
                        />
                        <p className="font-14">No Windows available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setSelectedParentId([]);
                        handleclose();
                      }}
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      className="btn blue-btn"
                      onClick={() => {
                        handleSenddata(selectedParentId);
                        setSelectedParentId([]);
                        handleclose();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {vendor && (
        <AddEditWindow
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          LanguageListAPI={handleapi}
          object={""}
          listdata={listdata}
          resetObject={() => setvendor(false)}
        />
      )}
    </>
  );
};

export default AddnewWindow;
