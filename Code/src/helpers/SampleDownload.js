import React, { useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "./common";
import { apiUrls } from "../utils/apiUrls";
import { Button, CircularProgress } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

export default function SampleDownload({ type }) {
  const [loder, setLoader] = useState(false);

  const postImage = async () => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(
        apiUrls.DownloadSample,
        { downloadSample: type },
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
        err?.message || "An error occurred while downloading the sample file."
      );
    }
  };

  return (
    <>
      <ApiLoder open={loder} />
      <Button
        variant="outlined"
        onClick={postImage}
        size="small"
        startIcon={loder ? <CircularProgress size={16} color="inherit" /> : <GetAppIcon />}
        disabled={loder}
        sx={{
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {loder ? 'Downloading...' : 'Download Sample'}
      </Button>
    </>
  );
}
