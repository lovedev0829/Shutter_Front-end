import React, { useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "./common";
import { Button, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function ExportFile({
  type,
  serach = "",
  page,
  perpage,
  tenantId = "",
  status,
  Url,
  jobStatus = "",
  vendor = "",
  productType = "",
  WindowProductId = "",
  EstimationId = "",
  toDate = null,
  formDate = null
}) {
  const [loder, setLoader] = useState(false);

  const postImage = async () => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(
        `${Url}`,
        {
          Type: type,
          WindowProductId: WindowProductId,
          EstimationId: EstimationId
        },
        "POST",
        {
          searchValue: serach ? serach : "",
          pageNo: page ? page : 1,
          recordPerPage: perpage ? perpage : 10,
          tenantId: tenantId ? tenantId : "",
          status: status ? status : "",
          jobStatus: jobStatus ? jobStatus : "",
          vendor: vendor ? vendor : "",
          productType: productType ? productType : "",
          toDate: toDate ? toDate : null,
          formDate: formDate ? formDate : null,
        }
      );
      setLoader(false);
      if (apiResponse.data.isSuccess) {
        const decodedString = atob(apiResponse?.data?.data);
        const blob = new Blob([decodedString], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${type}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        ErrorMessage(apiResponse.data.message);
      }
    } catch (err) {
      setLoader(false);
      ErrorMessage(
        err?.message || "An error occurred while exporting the file."
      );
    }
  };

  return (
    <>
      {loder && <ApiLoder />}
      <Button
        variant="contained"
        onClick={postImage}
        size="medium"
        startIcon={loder ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon />}
        disabled={loder}
        sx={{
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 600,
          maxHeight: "42px",
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {loder ? 'Exporting...' : 'Export'}
      </Button>
    </>
  );
}
