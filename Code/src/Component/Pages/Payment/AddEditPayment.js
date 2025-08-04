import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import Selectbox from "../../Form/Selectbox";
import DateInputField from "../../Form/DateInputField";

const AddEditPayment = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  InvoiceId,
  HandleInvoiceApi
}) => {
  const defaultState = {
    invoiceId: InvoiceId,
    paymentDate: "",
    paymentDueDate: "",
    paymentMethod: "",
    amount: "",
    transactionId: "",
    paymentStatus: "",
    notes: "",
  }


  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
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
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.PaymentCreate : apiUrls.PaymentUpdate,
          {},
          "POST",
          { ...value, paymentStatus: Number(value?.paymentStatus) }
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          if (value?.paymentStatus === '1') {
            await HandleInvoiceApi()
          }
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
                  {action === "add" ? "Add Payment" : "Update Payment"}
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
                            Payment Date <sup>*</sup>
                          </label>
                           <DateInputField name="paymentDate" value={value?.paymentDate} handleChange={handleChange} action={action}/>
                        
                          <div className="error">
                            {simpleValidator.current.message(
                              "paymentDate",
                              value?.paymentDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Payment Due Date <sup>*</sup>
                          </label>
                          <div className="position-relative calender-input">
                            <input
                              style={{ color: "white" }}
                              type="date"
                              className="form-control"
                              placeholder="Enter Payment Due Date"
                              name={"paymentDueDate"}
                              value={
                                moment(value?.paymentDueDate).format(
                                  "YYYY-MM-DD"
                                ) || ""
                              }
                              onChange={handleChange}
                              min={
                                value?.paymentDate
                                  ? moment(value?.paymentDate)
                                    .format("YYYY-MM-DD")
                                  : ""
                              }
                            />
                            <span
                              style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#212529",
                                pointerEvents: "none",
                              }}
                            >
                              {value?.paymentDueDate ? moment(value?.paymentDueDate).format(
                                "MM-DD-YYYY"
                              ) : "mm-dd-yyyy"}
                            </span>
                            <img src="/image/calendar-alt.svg" alt="" srcSet="" />
                          </div>
                          <div className="error">
                            {simpleValidator.current.message(
                              "paymentDueDate",
                              value?.paymentDueDate,
                              `required`
                            )}
                          </div>
                        </div>
                      </div> */}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Payment Method"}
                            placeholderName={"Enter Payment Method"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"paymentMethod"}
                            name={"paymentMethod"}
                            value={value.paymentMethod}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "paymentMethod",
                              value?.paymentMethod,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Amount"}
                            placeholderName={"Enter Amount"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"amount"}
                            name={"amount"}
                            value={value.amount}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "amount",
                              value?.amount,
                              `required|numeric`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Transaction Id"}
                            placeholderName={"Enter transaction Id"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"transactionId"}
                            name={"transactionId"}
                            value={value.transactionId}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "transaction",
                              value?.transactionId,
                              `required`
                            )}
                          </div>
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

                      <div className="col-lg-4 col-md-4 mb-3">
                        <Selectbox
                          labelName={"Status"}
                          options={[
                            { value: 0, label: "Unpaid" },
                            { value: 1, label: "Paid" },
                          ]}
                          handleChange={handleChange}
                          id={"paymentStatus"}
                          name={"paymentStatus"}
                          value={value.paymentStatus}
                          required={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "paymentStatus",
                            value?.paymentStatus,
                            `required`
                          )}
                        </div>
                      </div>
                    </div>
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

export default AddEditPayment;
