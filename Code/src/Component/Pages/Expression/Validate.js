import { Dialog } from "@mui/material";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../Form/InputField";
import SimpleReactValidator from "simple-react-validator";
import SubmitButton from "../../Form/SubmitButton";

export default function ValidatePopup({
  open,
  handleClose,
  handleValidate,
  loder,
  expression,
}) {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [value, setValue] = useState({
    BuildWidth: "",
    BuildHeight: "",
    Quantity: "",
   
  });
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
      handleValidate(value);
      setValue({
        BuildWidth: "",
        BuildHeight: "",
        Quantity: "",
        
      });
      simpleValidator.current.hideMessages();
      forceUpdate();
    }
  };

  const allowedNames = ["{{BuildWidth}}", "{{BuildHeight}}", "{{Quantity}}"];

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
                  Enter Detail to validate Formula
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue({
                      BuildWidth: "",
                      BuildHeight: "",
                      Quantity: "",
                    });
                    handleClose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                />
              </div>
              <form onSubmit={languageAdd}>
                <div className="modal-body">
                  <div className="form-design">
                    <div className="row">
                      {allowedNames?.map((item) => (
                        <div className="col-lg-4 col-md-4" key={item}>
                          <div className="form-group">
                            <InputField
                              labelName={item.replace(/{{|}}/g, "")}
                              placeholderName={`Enter ${item.replace(
                                /{{|}}/g,
                                ""
                              )}`}
                              type={"text"}
                              handleChange={handleChange}
                              id={item.replace(/{{|}}/g, "")}
                              name={item.replace(/{{|}}/g, "")}
                              value={value[item.replace(/{{|}}/g, "")] || ""}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                item.replace(/{{|}}/g, ""),
                                value?.[item.replace(/{{|}}/g, "")],
                                "numeric"
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                     
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to="#"
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setValue({
                          BuildWidth: "",
                          BuildHeight: "",
                          Quantity: "",
                        });
                        handleClose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                    >
                      Cancel
                    </Link>
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={"Submit"}
                      disabled={loder}
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
}
