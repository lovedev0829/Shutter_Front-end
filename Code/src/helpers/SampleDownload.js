import React, { useState } from "react";
import { Link } from "react-router-dom";
import { callAPI } from "../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "./common";
import { apiUrls } from "../utils/apiUrls";


export default function SampleDownload({type}) {
  const [loder, setLoader] = useState(false);
 
  const postImage = async () => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(
         apiUrls.DownloadSample,
        {downloadSample:type},
        "GET",
        {}
      );
      setLoader(false);
      if (apiResponse.data.isSuccess) {
        const decodedString = atob(apiResponse?.data?.data);
        const blob = new Blob([decodedString], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Sample${type}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    
      } else {
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
      <div className="import_data position-relative" onClick={postImage}>
        <Link to="#" className="btn blue-btn small_btn">
        <i className="fa fa-file-o me-2"></i>
          Download Sample
        </Link>
      </div>

    
    </>
  );
}
