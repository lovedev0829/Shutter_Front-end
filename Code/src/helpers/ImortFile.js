import React, { useState } from "react";
import { API } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { ApiLoder, ErrorMessage, SuccessMessage } from "./common";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button, 
  IconButton, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  CircularProgress
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  fontSize: '14px',
  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const UploadContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    minWidth: '500px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(2, 3),
}));

const ErrorList = styled(List)(({ theme }) => ({
  maxHeight: '300px',
  overflow: 'auto',
  backgroundColor: '#fef2f2',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
}));

const ErrorListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderBottom: '1px solid #fecaca',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      postImage(e.target.files[0]);
    }
    e.target.value = null;
  };

  const handleClose = () => {
    setOpen(false);
    setTenantList([]);
  };

  return (
    <>
      <ApiLoder open={loder} />
      <UploadContainer>
        <HiddenInput
          id="import-file-input"
          type="file"
          onChange={handleFileChange}
          accept=".csv"
        />
        <label htmlFor="import-file-input">
          <StyledButton
            variant="contained"
            component="span"
            startIcon={loder ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
            disabled={loder}
          >
            {loder ? 'Importing...' : 'Import'}
          </StyledButton>
        </label>
      </UploadContainer>

      <StyledDialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <StyledDialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon color="error" />
            <Typography variant="h6" fontWeight={600}>
              Import Errors
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            The following errors occurred during the import process:
          </Typography>
          
          <ErrorList>
            {tenantList?.map((error, index) => (
              <ErrorListItem key={index}>
                <ListItemText
                  primary={error}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    color: '#dc2626',
                  }}
                />
              </ErrorListItem>
            ))}
          </ErrorList>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
}
