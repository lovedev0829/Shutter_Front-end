import { Dialog } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { getHomeUrl, SuccessMessage } from "../../../helpers/common";

export default function SendApproved({
  open,
  handleClose,
  handlestatus,
  estimateId,
  isApproved = false,
  title = "",
  subtitle = "",
  url = "",
  loder,
}) {
  const copyToClipboard = () => {
    const link = `${getHomeUrl()}${url}${estimateId}`;
    navigator.clipboard.writeText(link).then(
      () => {
        SuccessMessage("Link copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };
  return (
    <>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header sharelinkheader d-flex p-2 justify-content-end">
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
            <div className="modal-body">
              <div className="text-center sharemodalcontent">
                <img src="/image/shareimg.svg" alt="" loading="lazy"/>

                <h2 className="mb-1">{title}</h2>
                <p className="mb-4">{subtitle}</p>

                <div className="d-flex align-items-center justify-content-center gap-2 mb-30">
                  {isApproved ? (
                    <>
                      <Link
                        to="#"
                        className="btn blue-outline-btn2 small_btn"
                        onClick={handleClose}
                      >
                        Cancel
                      </Link>
                      <button
                        disabled={loder}
                        type="button"
                        onClick={handlestatus}
                        className="btn blue-btn small_btn"
                      >
                        Confirm
                        {loder && (
                          <i
                            className="fa fa-spinner fa-spin"
                            style={{ marginLeft: "10px" }}
                          ></i>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="#"
                        className="btn blue-outline-btn2 small_btn"
                        onClick={copyToClipboard}
                      >
                        <i className="fa fa-clone me-2" />
                        Copy Link
                      </Link>
                      <button
                        disabled={loder}
                        type="button"
                        onClick={handlestatus}
                        className="btn blue-btn small_btn"
                      >
                        Send Via Email
                        {loder && (
                          <i
                            className="fa fa-spinner fa-spin"
                            style={{ marginLeft: "10px" }}
                          ></i>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
