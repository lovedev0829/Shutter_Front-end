import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { API } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import InputField from "../../Form/InputField";

const AddEditdocument = ({
  open,
  handleclose,
  DocumentslistAPI,
  action,
  selecteddata,
  jobid,
  handleDownload,
}) => {
  const defaultState = {
    jobId: jobid,
    documentTitle: "",
    file: "",
  };

  const [value, setValue] = useState(
    selecteddata ? selecteddata : defaultState
  );
  const [loader, setLoader] = useState(false);
   const [isimage, setisimage] = useState(false);

  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const DocumentAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await API(
          action === "add"
            ? apiUrls.UploadDocument
            : apiUrls.UploadDocumentUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await DocumentslistAPI();
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
      setValue(selecteddata);
      simpleValidator.current.purgeFields("file");
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);

  const UploadImage = async (e) => {
    let file = e.target.files[0];
    setValue((val) => {
      return { ...val, file: file };
    });
setisimage(true)
    e.target.value = null;
  };

  const truncateFileName = (name, maxLength = 50) => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength - 3) + "..."
      : name;
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
                  {action === "add" ? "Add Document" : "Update Document"}
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
              <form onSubmit={DocumentAddUpdate}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <InputField
                            labelName={"Title"}
                            placeholderName={"Enter Title"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"documentTitle"}
                            name={"documentTitle"}
                            value={value.documentTitle}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Title",
                              value?.documentTitle,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label className="font-14">
                            Attachment {action !== "edit" ? <sup>*</sup> : ""}
                          </label>
                          <div className="position-relative upload-photo">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                              name="file"
                              onChange={(e) => {
                                UploadImage(e);
                              }}
                            />
                            <span>
                              <img
                                src="/image/upload.svg"
                                className="me-2"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              {truncateFileName(value?.file?.name) || truncateFileName(value?.blobUrl) ||
                                "Choose File"}
                            </span>
                          </div>
                          {action === "edit" && !isimage && (
                            <button
                              type="button"
                              className="downloaddoc"
                              onClick={() =>
                                handleDownload(
                                  value?.documentId,
                                  value?.blobUrl,
                                  value?.documentTitle
                                )
                              }
                            >
                              {" "}
                            
                              <img
                                src="/image/export.svg"
                                
                                alt=" "
                                loading="lazy"
                              />  Download
                            </button>
                          )}
                          <div className="error">
                            {action !== "edit" &&
                              simpleValidator.current.message(
                                "Document",
                                value?.file,
                                "required"
                              )}
                          </div>
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

export default AddEditdocument;
