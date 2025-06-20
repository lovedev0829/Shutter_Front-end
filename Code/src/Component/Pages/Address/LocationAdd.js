import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";

const LocationAdd = ({ open, handleclose, handleload }) => {
  const [locationname, setlocationname] = useState("");
  const [loactionadd, setloactionadd] = useState(false);

  const locationAdd = async (e) => {
    e.preventDefault();
    try {
      setloactionadd(true);
      const apiResponse = await callAPI(apiUrls.CreateLocation, {}, "POST", {
        locationName: locationname,
      });
      setloactionadd(false);
      if (apiResponse?.data?.isSuccess) {
        handleload();
        setlocationname("");
        setloactionadd(false);
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setloactionadd(false);
    }
  };

  useEffect(() => {
    setlocationname("");
    // eslint-disable-next-line
  }, [open]);

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
                  Add Location
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setlocationname("");
                    handleclose();
                  }}
                ></i>
              </div>
              <form onSubmit={locationAdd}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label className="font-14" for="locationname">
                            Location Name <sup>*</sup>
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setlocationname(e.target.value)}
                            id="locationname"
                            name="locationname"
                            placeholder="Enter Location Name"
                            value={locationname ? locationname : ""}
                          />
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
                        setlocationname("");
                        handleclose();
                      }}
                    >
                      Cancel
                    </Link>
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={"Submit"}
                      disabled={loactionadd}
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

export default LocationAdd;
