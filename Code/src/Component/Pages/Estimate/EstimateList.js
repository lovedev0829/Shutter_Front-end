import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";

import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import SendApproved from "./SendApproved";
import { defaultConfig } from "../../../config";
import { PageHeader, EmptyState } from "../../Form/MaterialUIComponents";

export default function EstimateList({ listdata }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [isResend, setisResend] = useState(false);
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);
  const [text, setText] = useState("1"); // 1 for approved 2 for reject and 3 for order
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, 2);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), 2);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, status) => {
    let query = {
      jobId: listdata?.jobId,
      searchValue: "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: status,
      tenantId: "",
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
      region: "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Estimate, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (listdata?.jobId) {
      TenantlistAPI(1, rowsPerPage, 2);
      setPage(1);
    }

    // eslint-disable-next-line
  }, [listdata?.jobId]);

  const handlestatus = async () => {
    setLoader(true);
    try {
      let body =
        text === "1"
          ? {
              documentType: 0,
              templateId: null,
              contactId: listdata?.contactId,
              estimationId: object.estimateId,
              isResend:isResend
            }
          : {};
      let query = text === "1" ? {} : { EstimateId: object.estimateId };
      const response = await callAPI(
        text === "1" ? apiUrls.SendInvoice : apiUrls.OrderCreate,
        query,
        "POST",
        body
      );
      setLoader(false);
      if (response.data.isSuccess) {
        setisResend(false)
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI(page, rowsPerPage, 2);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.EstimateDelete,
        { EstimateId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, 2);
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

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };
  const handledelclosee = () => {
    setApproved(false);
    setObject("");
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDownload = async (id, name) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", {
        templateId: null,
        contactId: listdata?.contactId,
        estimationId: id,
        documentType: 1,
      });
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
        link.download = `${name}.pdf`;
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
        title="Estimate"
        actions={
          HasPermission("EstimateAdd") && listdata?.tenantId === Loginuser?.tenantId ? (
            <Button
              component={Link}
              to={`/contacts/estimate/${listdata?.jobId}`}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
                px: 3
              }}
            >
              Build Estimate
            </Button>
          ) : null
        }
      />
      <TableContainer component={Paper} sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>SN</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estimate Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Prepared by</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Create Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
              {listdata?.tenantId === Loginuser?.tenantId && (
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}></TableCell>
              )}
              <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenantList?.map((val, i) => (
              <TableRow 
                key={i}
                sx={{ 
                  '&:hover': { backgroundColor: 'grey.50' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/contacts/estimate/preview/${val?.estimateId}`}
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      p: 0,
                      textDecoration: 'underline',
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {val?.estimateName}
                  </Button>
                </TableCell>
                <TableCell>{val?.preparedByName || "---"}</TableCell>
                <TableCell>{moment(val?.createdDate).format("MM-DD-YYYY") || ""}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {defaultConfig.currencySign} {val?.grandTotal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={val?.status}
                    size="small"
                    color={val?.status === "Approved" ? "success" : "default"}
                    variant={val?.status === "Approved" ? "filled" : "outlined"}
                    sx={{
                      fontWeight: 500,
                      minWidth: 80,
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                {val?.status !== "GenerateOrder" && listdata?.tenantId === Loginuser?.tenantId ? (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {HasPermission("EstimateEdit") && (
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 1,
                            px: 2
                          }}
                          onClick={() => {
                            if (
                              val?.status === "New" ||
                              val?.status === "Rejected"
                            ) {
                              setApproved(true);
                              setObject(val);
                              setText("1");
                              setisResend(false)
                            } else {
                              setApproved(true);
                              setObject(val);
                              setText("2");
                              setisResend(false)
                            }
                          }}
                          disabled={val?.status === "PendingForApproval"}
                        >
                          {val?.status === "Approved"
                            ? "Generate Order"  
                            : "Send for Approval"}
                        </Button>
                      )}
                      {HasPermission("EstimateEdit") &&
                        val?.status === "PendingForApproval" && (
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              textTransform: 'none',
                              fontWeight: 500,
                              borderRadius: 1,
                              px: 2
                            }}
                            onClick={() => {
                              setisResend(true)
                              setApproved(true);
                              setObject(val);
                              setText("1");
                            }}
                          >
                            Resend
                          </Button>
                        )}
                    </Box>
                  </TableCell>
                ) : (
                  listdata?.tenantId === Loginuser?.tenantId ? <TableCell></TableCell> : null
                )}
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuClick(event, val)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { backgroundColor: 'grey.100' }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {(!tenantList || tenantList?.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} sx={{ border: 0, py: 6 }}>
                  <EmptyState
                    icon={
                      <Box
                        component="img"
                        src="/image/no-records.svg"
                        alt="No records"
                        sx={{ width: 80, height: 80, opacity: 0.5 }}
                      />
                    }
                    title="No Estimates Found"
                    description="There are no estimates available for this job."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {tenantList && tenantList?.length > 0 && (
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

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 180,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/contacts/estimate/preview/${selectedRow?.estimateId}`);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDownload(selectedRow?.estimateId, selectedRow?.estimateName);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <GetAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>

        {HasPermission("EstimateEdit") && 
         listdata?.tenantId === Loginuser?.tenantId && 
         (selectedRow?.status === "New" || selectedRow?.status === "Rejected") && (
          <MenuItem
            component={Link}
            to={`/contacts/estimate/${listdata?.jobId}/${selectedRow?.estimateId}`}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {HasPermission("EstimateDelete") && 
         listdata?.tenantId === Loginuser?.tenantId && 
         (selectedRow?.status === "New" || selectedRow?.status === "Rejected") && (
          <MenuItem
            onClick={() => {
              handledelete(selectedRow);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.estimateName}
        id={object?.estimateId}
        handleDelete={handleDelete}
        loder={loder}
      />
      <SendApproved
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        estimateId={object.estimateId}
        loder={loder}
        isApproved={text === "2" ? true : false}
        title={
          text === "1"
            ? "Share Link Via Copy or Email Prospective Customer"
            : `You want to Generate Order for this estimate (${object.estimateName})?`
        }
        subtitle={
          text === "1"
            ? "You can send this link via email and copy to send the customer"
            : "Please click the Confirm button to Generate Order for this estimate."
        }
        url="/contacts/estimate/preview/"
      />
    </Box>
  );
}
