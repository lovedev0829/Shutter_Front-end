import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import AddEditButton from "../../Form/AddEditButton";
import { 
  TablePagination,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon
} from "@mui/icons-material";
import AddEditdocument from "./AddEditdocument";
import moment from "moment";
import { PageHeader, EmptyState } from "../../Form/MaterialUIComponents";

function AllDocumentlist({listdata}) {
  const param = useParams();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [documentslistAPI, setdocumentslistAPI] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    DocumentslistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    DocumentslistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const DocumentslistAPI = async (page, perpage) => {
    let query = {
      searchValue: "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      productType: "",
      status: "2",
      jobId: param?.JobId,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.UploadDocumentGetAll,
        {},
        "POST",
        query
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setdocumentslistAPI(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setdocumentslistAPI([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    DocumentslistAPI(1, rowsPerPage);
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const refreshDocumentslistAPI = () => {
    let pageNo = 1;
    DocumentslistAPI(page, rowsPerPage);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    setAction("edit");
    setObject(item);
    setOpen(true);
  };

  const handledelclose = () => {
    setDelOpen(false);
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.UploadDocumentDelete,
        { documentId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        DocumentslistAPI(page, rowsPerPage);
        setPage(pageNo);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
  };

 const getFileExtension = (url) => {
  return url.split(".").pop().split(/[#?]/)[0];
};


  const handleDownload = async (documentId,blobUrl, documentTitle) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.UploadDocumentDownloadBlobAsBase64,
        { documentId: documentId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        const decodedString = atob(response?.data?.data);
        const byteArray = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
          byteArray[i] = decodedString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], {
          type: "application/pdf",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${documentTitle?.replace(/\s+/g, '')}.${getFileExtension(blobUrl)}`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

   const Loginuser = JSON.parse(localStorage.getItem("userData"));

  return (
    <Box sx={{ p: 3 }}>
      <ApiLoder open={loder} />

      <PageHeader
        title="Documents"
        subtitle="Manage and upload documents for this job project"
        actions={
          HasPermission("JobContactAdd") && listdata?.tenantId === Loginuser?.tenantId && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setAction("add");
                setOpen(true);
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
                px: 3
              }}
            >
              Add Document
            </Button>
          )
        }
      />

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>SN</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Uploaded By</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Document</TableCell>
              {(HasPermission("JobContactEdit") || HasPermission("JobContactDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {documentslistAPI?.map((item, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { backgroundColor: 'grey.50' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item?.documentTitle}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item?.createdBy}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={moment(item?.createdAt).format("MM-DD-YYYY")} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Download Document">
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(item?.documentId, item?.blobUrl, item?.documentTitle)}
                      sx={{ 
                        color: 'success.main',
                        '&:hover': { 
                          backgroundColor: 'success.light',
                          color: 'success.dark'
                        }
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                {(HasPermission("JobContactEdit") || HasPermission("JobContactDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {HasPermission("JobContactEdit") && (
                        <Tooltip title="Edit Document">
                          <IconButton
                            size="small"
                            onClick={() => handleedit(item)}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.light' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {HasPermission("JobContactDelete") && (
                        <Tooltip title="Delete Document">
                          <IconButton
                            size="small"
                            onClick={() => handledelete(item)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { backgroundColor: 'error.light' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {(!documentslistAPI || documentslistAPI?.length === 0) && (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  sx={{ border: 0, py: 6 }}
                >
                  <EmptyState
                    icon={
                      <Box
                        component="img"
                        src="/image/no-records.svg"
                        alt="No records"
                        sx={{ width: 80, height: 80, opacity: 0.5 }}
                      />
                    }
                    title="No Documents Found"
                    description="There are no documents uploaded for this job yet."
                    action={
                      HasPermission("JobContactAdd") && listdata?.tenantId === Loginuser?.tenantId && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setAction("add");
                            setOpen(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 2,
                            px: 3
                          }}
                        >
                          Add Document
                        </Button>
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {documentslistAPI && documentslistAPI?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25, 100]}
              component="div"
              count={paginatedItems}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
        )}
      </TableContainer>
      {open && (
        <AddEditdocument
          open={open}
          handleclose={handleclose}
          action={action}
          DocumentslistAPI={refreshDocumentslistAPI}
          selecteddata={object}
          jobid={param?.JobId}
         handleDownload={handleDownload}
        />
      )}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.documentTitle}
        id={object?.documentId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </Box>
  );
}

export default AllDocumentlist;
