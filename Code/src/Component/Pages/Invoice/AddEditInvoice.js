import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import DateInputField from "../../Form/DateInputField";
import ExpiryDate from "../../Form/ExpiryDate";
import GetAllEstimate from "../../../helpers/GetAllEstimate";
import { defaultConfig } from "../../../config";

const AddEditInvoice = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  jobid,
}) => {
  const defaultState = {
    jobId: jobid,
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    totalAmount: 0,
    estimateId: "",
    invoicePayment: [
      {
        notes: "",
        invoiceAmount: "",
      },
    ],
  };

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "estimateId") {
      Paymentget(e.target.value);
    }
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
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.InvoiceCreate : apiUrls.InvoiceUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue(defaultState);
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
    const newArray = value?.invoicePayment;
    newArray.push({
      notes: "",
      invoiceAmount: "",
    });
    setValue((val) => {
      return { ...val, invoicePayment: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = [...value.invoicePayment];
    newArray.splice(i, 1);
    const sum = newArray.reduce((acc, current) => {
      const amount = parseFloat(current.invoiceAmount) || 0;
      return acc + amount;
    }, 0);

    setValue((val) => {
      return {
        ...val,
        invoicePayment: newArray,
        totalAmount: sum,
      };
    });
    if (newArray.length <= 0) {
      simpleValidator.current.purgeFields(["notes", "invoiceAmount"]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = [...value.invoicePayment];
    const key = e.target.name;
    if (key === "notes") {
      newArray[i].notes = e.target.value;
    } else if (key === "invoiceAmount") {
      newArray[i].invoiceAmount = e.target.value;
    }
    const sum = newArray.reduce((acc, current) => {
      const amount = parseFloat(current.invoiceAmount) || 0;
      return acc + amount;
    }, 0);

    setValue((val) => ({
      ...val,
      invoicePayment: newArray,
      totalAmount: sum,
    }));
  };

  const Paymentget = async (estimateid) => {
    try {
      const apiResponse = await callAPI(
        apiUrls.EstimateAmmount,
        { EstimateId: estimateid },
        "GET",
        {}
      );

      if (apiResponse?.data?.isSuccess) {
        setMsg(apiResponse?.data?.data)
        
          const newArray = [...(value?.invoicePayment || [])];
          newArray[0] = {
            notes: "",
            invoiceAmount: apiResponse?.data?.data?.dueBalance || 0,
          };
          const sum = newArray.reduce((acc, current) => {
            const amount = parseFloat(current.invoiceAmount) || 0;
            return acc + amount;
          }, 0);

          setValue((val) => {
            return { ...val, invoicePayment: newArray, totalAmount: sum };
          });
        
      } else {
        setMsg("")
      }
    } catch (error) {setMsg("")}
  };

  return (
    <>
      <Dialog
        open={open}
        scroll="paper"
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
                  {action === "add" ? "Add Invoice" : "Update Invoice"}
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
                            Estimate Name <sup>*</sup>
                          </label>
                          <GetAllEstimate
                            value={value.estimateId}
                            fn={handleChange}
                            jobId={jobid}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "estimateId",
                              value?.estimateId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      {action === "edit" && (
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <InputField
                              labelName={"Invoice Number"}
                              placeholderName={"Enter Invoice Number"}
                              type={"text"}
                              handleChange={handleChange}
                              id={"invoiceNumber"}
                              name={"invoiceNumber"}
                              value={value?.invoiceNumber}
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Issue Date <sup>*</sup>
                          </label>
                          <DateInputField
                            name="issueDate"
                            value={value?.issueDate}
                            handleChange={handleChange}
                            action={action}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "issueDate",
                              value?.issueDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Due Date <sup>*</sup>
                          </label>
                          <ExpiryDate
                            name={"dueDate"}
                            startDate={value?.issueDate}
                            expiryDate={value?.dueDate}
                            handlechange={handleChange}
                            action={action}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "dueDate",
                              value?.dueDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="middle-heading">
                      <h4>Add Invoice Amount</h4>
                    </div>
                    <div className="row">
                      {value?.invoicePayment !== undefined &&
                        value?.invoicePayment?.length > 0 &&
                        value?.invoicePayment?.map((val, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div className="col-lg-4 col-md-4">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14">Notes</label>
                                  )}
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Notes"
                                    name="notes"
                                    value={val?.notes}
                                    onChange={(e) => {
                                      handleContactPerson(e, i);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-4">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14">
                                      Invoice Amount <sup>*</sup>
                                    </label>
                                  )}
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Invoice Amount"
                                    name="invoiceAmount"
                                    value={val?.invoiceAmount}
                                    onChange={(e) => {
                                      handleContactPerson(e, i);
                                    }}
                                  />
                                  <div className="error">
                                    {simpleValidator.current.message(
                                      "Invoice Amount",
                                      val?.invoiceAmount,
                                      "required|numeric"
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-start deledit mb-3">
                                {i === value?.invoicePayment?.length - 1 && (
                                  <div
                                    onClick={AddContactPerson}
                                    className="me-3"
                                  >
                                    <img src="/image/plusblue.svg" alt="" loading="lazy"/>
                                  </div>
                                )}
                                {value?.invoicePayment?.length > 1 && (
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
                    <div className="row border-top justify-content-end gx-2">
                      <div className="col-lg-6 col-md-6 mt-3">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <label className="font-14">Total Amount</label>
                          <input
                            disabled
                            type="text"
                            className="form-control totalamountinput"
                            name={"totalAmount"}
                            value={value?.totalAmount?.toFixed(2)}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "totalAmount",
                              value?.totalAmount,
                              "numeric"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {msg &&
                    <div className="row mt-4">
                    <div className="col-md-4">
                      <p className="font-14 mb-0 color-para color_indication">
                      Total Estimate Amount : <span>{defaultConfig.currencySign} {msg?.totalOrderAmount}</span>
                      </p>
                    </div>
                    <div className="col-md-4">
                    <p className="font-14 mb-0 color-para color_indication">
                     Invoiced Amount : <span>{defaultConfig.currencySign} {msg?.totalPaidAmount}</span>
                    </p>
                    </div>
                    <div className="col-md-4">
                    <p className="font-14 mb-0 color-para color_indication">
                    Remaining Estimate Balance : <span>{defaultConfig.currencySign} {msg?.dueBalance}</span>
                    </p>
                    </div>
                </div>}
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                    >
                      Cancel
                    </Link>
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={action === "add" ? "Submit" : "Update"}
                      disabled={loader}
                    />
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

export default AddEditInvoice;
