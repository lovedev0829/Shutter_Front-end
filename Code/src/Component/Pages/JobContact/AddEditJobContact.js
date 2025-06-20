import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, HasPermission, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import GetAllContactType from "../../../helpers/GetAllContactType";
import GetAllContact from "../../../helpers/GetAllContact";
import AddEditContact from "../Contacts/AddEditContact";

const AddEditJobContact = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  jobid,
}) => {
  const defaultState = {
    jobId: jobid,
    contactTypeId: "",
    contactId: "",
  };
  const [contact, setcontact] = useState(false);
    const [contactlist, setcontactlist] = useState(false);
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
          action === "add"
            ? apiUrls.JobContactCreate
            : apiUrls.JobContactUpdate,
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
    setcontactlist(false)
    // eslint-disable-next-line
  }, [open, action]);
  const handleapiv = () => {
    setcontactlist((prev) => !prev)
  }
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
                  {action === "add" ? "Add Contact Job" : "Update Contact Job"}
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
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label className="font-14">
                            Contact Type <sup>*</sup>
                          </label>
                          <GetAllContactType
                            name="contactTypeId"
                            value={value.contactTypeId}
                            fn={handleChange}
                            load={action}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Contact Type",
                              value?.contactTypeId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                        <label className="font-14 d-flex align-items-center justify-content-between">
                             <span>Contact Name <sup>*</sup></span>
                             {HasPermission("ContactAdd") &&<img
                              src="/image/plusblue.svg"
                              alt=""
                              loading="lazy"
                              style={{ cursor: "pointer" }}
                             onClick={(()=>setcontact(true))}
                            />}
                            </label>
                          <GetAllContact
                            value={value.contactId}
                            fn={handleChange}
                            load={contactlist}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "contact Name",
                              value?.contactId,
                              `required`
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
      {contact &&
      <AddEditContact
       open={contact} handleclose={(()=>setcontact(false))} action={"add"} LanguageListAPI={handleapiv} object={""} 
      />
}
    </>
  );
};

export default AddEditJobContact;
