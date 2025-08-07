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
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



export default function ImportFile({ LanguageListAPI, type }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      <Box sx={{ 
        position: 'relative', 
        display: 'inline-block' 
      }}>
        <input
          id="import-file-input"
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: 'none' }}
        />
        <label htmlFor="import-file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={loder ? <CircularProgress size={16} color="inherit" /> : <UploadIcon fontSize={isMobile ? "small" : "medium"} />}
            disabled={loder}
            size={isMobile ? "medium" : "small"}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: isMobile ? '13px' : '14px',
              padding: isMobile ? theme.spacing(1.2, 2) : theme.spacing(1, 2),
              minHeight: isMobile ? '44px' : '36px', // Touch-friendly height
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {loder ? 'Importing...' : 'Import'}
          </Button>
        </label>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            minWidth: isMobile ? '90vw' : '500px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e0e0e0',
            p: isMobile ? 2 : 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon color="error" />
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600}>
              Import Errors
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            The following errors occurred during the import process:
          </Typography>
          
          <List
            sx={{
              maxHeight: '300px',
              overflow: 'auto',
              backgroundColor: '#fef2f2',
              borderRadius: 1,
              p: 1,
            }}
          >
            {tenantList?.map((error, index) => (
              <ListItem
                key={index}
                sx={{
                  p: isMobile ? '8px 12px' : '4px 8px',
                  borderBottom: '1px solid #fecaca',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemText
                  primary={error}
                  primaryTypographyProps={{
                    fontSize: isMobile ? '15px' : '14px',
                    color: '#dc2626',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions sx={{ p: isMobile ? 2 : 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "small"}
            sx={{
              minHeight: isMobile ? '44px' : '36px',
              fontSize: isMobile ? '15px' : '14px',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
