import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { ApiLoder, ErrorMessage, SuccessMessage } from "./common";
import { Dialog } from "@mui/material";

export default function ImportFile({ LanguageListAPI, type }) {
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [tenantList, setTenantList] = useState([]);
  const postImage = async (file) => {
    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("file", file);

      const apiResponse = await API(
        `${apiUrls.ImportandExport}/${type}`,
        {},
        "POST",
        formData
      );
      setLoader(false);
      if (apiResponse.data.isSuccess) {
        SuccessMessage(apiResponse.data.message);
        LanguageListAPI();
        setTenantList([]);
      } else {
        setTenantList(apiResponse?.data?.data);
        setOpen(true);
        ErrorMessage(apiResponse.data.message);
      }
    } catch (err) {
      setLoader(false);
      ErrorMessage(
        err?.message || "An error occurred while uploading the file."
      );
    }
  };



  return (
    <>
      {loder && <ApiLoder />}
      <div className="import_data position-relative">
        <input
          type="file"
          onChange={(e) => {
            postImage(e?.target?.files[0]);
            e.target.value = null;
          }}
          className="file-input"
          accept=".csv"
        />

        <Link to="#" className="btn blue-btn small_btn">
          <img src="/image/plus.svg" alt="Import Icon" loading="lazy"/>
          Import 
        </Link>
      </div>

      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px",
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
                Errors occurred during the import.
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setOpen(false);
                    setTenantList([]);
                  }}
                ></i>
              </div>

              <div className="modal-body modale-scroll">
                <div className="form-design window-form-design">
                <div>
              
                  <ul className="newlistcontent">
                    {tenantList?.map((val,i) => (
                      <li key={i}>{val}</li>
                    ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
