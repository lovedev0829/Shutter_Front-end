import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, PreviewFiles, SelectBoxLoader, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Button, Stack } from "@mui/material";
import GetAllVendorDropdown from "../../../helpers/GetAllVendorDropdown";
import Selectbox from "../../Form/Selectbox";
import GetAllMaterial from "../../../helpers/GetAllMaterial";
import GetAllJobs from "../../../helpers/GetAllJobs";
import DateInputField from "../../Form/DateInputField";
import { PostImage } from "../../../utils/apiCall";

const VenderOrderAddEdit = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const defaultState = {
    vendorId: "",
    jobId: "",
    orderNumber: "",
    orderDate: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    status: "",
    totalAmount: 0,
    photo:[],
    vendorOrderItems: [
      {
        materialId: "",
        quantity: "",
        unitPrice: "",
      },
    ],
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [shows, setShows] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const languageAdd = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        const data = { ...value, status: Number(value?.status) };
        delete value.totalAmount;
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.VendorOrderCreate
            : apiUrls.VendorOrderUpdate,
          {},
          "POST",
          data
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue(defaultState);
          simpleValidator.current.hideMessages();
          forceUpdate();
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    if (action === "edit") {
      setValue(object);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);
  const AddContactPerson = () => {
    const newArray = value?.vendorOrderItems;
    newArray.push({
      quantity: "",
      unitPrice: "",
    });
    setValue((val) => {
      return { ...val, vendorOrderItems: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = [...value.vendorOrderItems];
    newArray.splice(i, 1);
    const sum = newArray.reduce((acc, current) => {
      const amount =
        (parseFloat(current.unitPrice) || 0) *
        (parseFloat(current.quantity) || 0);
      return acc + amount;
    }, 0);

    setValue((val) => {
      return {
        ...val,
        vendorOrderItems: newArray,
        totalAmount: sum,
      };
    });
    if (newArray.length <= 0) {
      simpleValidator.current.purgeFields([
        "materialId",
        "quantity",
        "unitPrice",
      ]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = [...value.vendorOrderItems];
    const key = e.target.name;
    if (key === "quantity") {
      newArray[i].quantity = e.target.value;
    } else if (key === "unitPrice") {
      newArray[i].unitPrice = e.target.value;
    } else if (key === "materialId") {
      newArray[i].materialId = e.target.value;
    }
    const sum = newArray.reduce((acc, current) => {
      const amount =
        (parseFloat(current.unitPrice) || 0) *
        (parseFloat(current.quantity) || 0);
      return acc + amount;
    }, 0);

    setValue((val) => ({
      ...val,
      vendorOrderItems: newArray,
      totalAmount: sum,
    }));
  };
  const handleImageDelelet=(data)=>{
    const arr =value?.photo?.filter((val,i)=> i !== data)
    setValue((val) => {
      return { ...val, photo: arr };
    });
  }

   const UploadImage = async (e) => {
       setShows(true)
       let file = ([...e.target.files])
       const path = await PostImage(file);
       setShows(false)
       if (path) {
        setValue((val) => {
          return {
            ...val,
            photo: [...(val.photo || []), ...path],
          };
        });
       } 
         e.target.value = null;
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
                  {action === "add"
                    ? "Add Vendor Order"
                    : "Update Vendor Order"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                ></i>
              </div>
              <form onSubmit={languageAdd}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Vendor <sup>*</sup>
                          </label>
                          <GetAllVendorDropdown
                            value={value.vendorId}
                            fn={handleChange}
                            load={true}
                            className="selectboxdropdown"
                            name="vendorId"
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Vendor",
                              value?.vendorId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Job <sup>*</sup>
                          </label>
                          <GetAllJobs
                            value={value.jobId}
                            fn={handleChange}
                            load={true}
                            className="selectboxdropdown"
                            name="jobId"
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Job",
                              value?.jobId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Order Number"}
                            placeholderName={"Enter Order Number"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"orderNumber"}
                            name={"orderNumber"}
                            value={value.orderNumber}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "orderNumber",
                              value?.orderNumber,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="middle-heading">
                        <h4>Add items</h4>
                      </div>
                      <div className="row">
                        {value?.vendorOrderItems !== undefined &&
                          value?.vendorOrderItems?.length > 0 &&
                          value?.vendorOrderItems?.map((val, i) => {
                            return (
                              <React.Fragment key={i}>
                                <div className="col-lg-3 col-md-3">
                                  <div className="form-group">
                                    {i === 0 && (
                                      <label className="font-14">
                                        Material <sup>*</sup>
                                      </label>
                                    )}
                                    <GetAllMaterial
                                      value={val.materialId}
                                      fn={(e) => handleContactPerson(e, i)}
                                      load={true}
                                      className="selectboxdropdown"
                                      name="materialId"
                                      Materials={value.vendorOrderItems}
                                      VendorId={value?.vendorId}
                                    />

                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "material",
                                        val?.materialId,
                                        `required`
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                  <div className="form-group">
                                    {i === 0 && (
                                      <label className="font-14">
                                        Qty <sup>*</sup>
                                      </label>
                                    )}
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter quantity"
                                      name="quantity"
                                      value={val?.quantity}
                                      onChange={(e) => {
                                        handleContactPerson(e, i);
                                      }}
                                    />
                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "quantity",
                                        val?.quantity,
                                        "required|integer"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                  <div className="form-group">
                                    {i === 0 && (
                                      <label className="font-14">
                                        Unit Price <sup>*</sup>
                                      </label>
                                    )}
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter unit Price"
                                      name="unitPrice"
                                      value={val?.unitPrice}
                                      onChange={(e) => {
                                        handleContactPerson(e, i);
                                      }}
                                    />
                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "unitPrice",
                                        val?.unitPrice,
                                        "required|numeric"
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-start deledit">
                                  {i ===
                                    value?.vendorOrderItems?.length - 1 && (
                                    <div
                                      onClick={AddContactPerson}
                                      className="me-3"
                                    >
                                      <img src="/image/plusblue.svg" alt="" loading="lazy"/>
                                    </div>
                                  )}
                                  {value?.vendorOrderItems?.length > 1 && (
                                    <div
                                      onClick={() => {
                                        deleteContactPerson(i);
                                      }}
                                    >
                                      <img src="/image/deletered.svg" alt="" loading="lazy"/>
                                    </div>
                                  )}
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <div className="row border-top justify-content-end gx-2">
                    <div className="col-lg-6 col-md-6 mt-3">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <label className="font-14">Total Price</label>
                        <input
                          disabled
                          type="text"
                          className="form-control totalamountinput"
                          name={"totalAmount"}
                          value={value?.totalAmount?.toFixed(2)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-design border-top mt-3">
                    <div className="row mt-3">
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Order Date <sup>*</sup>
                          </label>
                          <DateInputField
                            name="orderDate"
                            value={value?.orderDate}
                            handleChange={handleChange}
                            action={action}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "orderDate",
                              value?.orderDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Expected Delivery Date <sup>*</sup>
                          </label>
                          <DateInputField
                            name="expectedDeliveryDate"
                            value={value?.expectedDeliveryDate}
                            handleChange={handleChange}
                            action={action}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "expectedDeliveryDate",
                              value?.expectedDeliveryDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Actual Delivery Date <sup>*</sup>
                          </label>
                          <DateInputField
                            name="actualDeliveryDate"
                            value={value?.actualDeliveryDate}
                            handleChange={handleChange}
                            action={action}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "actualDeliveryDate",
                              value?.actualDeliveryDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-4 col-md-4 mb-3">
                        <Selectbox
                          labelName={"Status"}
                          options={[
                            { value: 0, label: "Pending" },
                            { value: 1, label: "Approved" },
                          ]}
                          handleChange={handleChange}
                          id={"status"}
                          name={"status"}
                          value={value.status}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "status",
                            value?.status,
                            `required`
                          )}
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"notes"}
                            placeholderName={"Enter notes"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"notes"}
                            name={"notes"}
                            value={value.notes}
                            required={false}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">Attachment Any</label>
                          <div className="position-relative upload-photo">
                            {shows && <SelectBoxLoader/>}
                            <input
                              type="file"
                              className="form-control"
                              accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                              name="photo"
                              onChange={(e) => {
                                UploadImage(e);
                              }}
                              multiple
                            />
                            <span>
                              <img
                                src="/image/upload.svg"
                                className="me-2"
                                alt=" "
                                srcSet=""
                              />{" "}
                              Choose File
                            </span>
                          </div>
                          <PreviewFiles
                            file={value?.photo}
                            isdelete={true}
                            handleImageDelelet={handleImageDelelet}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="flex-end" 
                    alignItems="center"
                    sx={{ padding: '16px 24px' }}
                  >
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                      sx={{
                        textTransform: 'none',
                        textDecoration: 'underline',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <SubmitButton
                      type="submit"
                      buttonName={action === "add" ? "Submit" : "Update"}
                      disabled={loader}
                      loading={loader}
                    />
                  </Stack>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default VenderOrderAddEdit;
