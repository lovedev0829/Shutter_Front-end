import { Dialog } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function ArchivePopup({
  open,
  handleClose,
  handlestatus,
  title = "",
  subtitle = "",
  loder,
  object
}) {
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
                    onClick={(()=>handlestatus(object?0:1))}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
