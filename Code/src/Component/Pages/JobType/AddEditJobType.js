import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Button, useTheme, alpha } from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import InputField from "../../Form/InputField";

const AddEditJobType = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const defaultState = {
    jobTypeName: "",
  
  };

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const theme = useTheme();

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
            ? apiUrls.JobTypeCreate
            : apiUrls.JobTypeUpdate,
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
                  {action === "add" ? "Add Job Type" : "Update Job Type"}
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
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <InputField
                            labelName={"Name"}
                            placeholderName={"Enter Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"jobTypeName"}
                            name={"jobTypeName"}
                            value={value.jobTypeName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Name",
                              value?.jobTypeName,
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
                    <Button
                      onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: theme.palette.grey[300],
                        color: theme.palette.text.secondary,
                        marginRight: 2,
                        '&:hover': {
                          borderColor: theme.palette.grey[400],
                          backgroundColor: alpha(theme.palette.grey[100], 0.5),
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loader}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        '&:disabled': {
                          background: theme.palette.grey[300],
                          color: theme.palette.grey[500],
                        }
                      }}
                    >
                      {action === "add" ? "Submit" : "Update"}
                    </Button>
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

export default AddEditJobType;
