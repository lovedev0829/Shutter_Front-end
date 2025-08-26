import React, { useEffect, useState } from "react";
import {
  ApiLoder,
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
  Divider
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Edit as EditIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import SendApproved from "../Estimate/SendApproved";
import VersionHistory from "./VersionHistory";
import { defaultConfig } from "../../../config";
import { PageHeader, EmptyState } from "../../Form/MaterialUIComponents";

export default function OrderList({ JobId,listdata }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);
  const [history, setHistory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage) => {
    let query = {
      searchValue: JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: 2,
      tenantId: "",
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
      region: "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Order, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage);
    // eslint-disable-next-line
  }, [JobId]);

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

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.SendInvoice,
        { },
        "POST",
        {
          documentType: 2,
          templateId: null,
          contactId: object.contactId,
          estimationId:  object.estimateId,
          orderId: object.orderId,
        }
      );
      setLoader(false);
      if (response.data.isSuccess) {
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
  const navigate = useNavigate();

   const handleDownload = async (id, name) => {
      setLoader(true);
      try {
        const response = await callAPI(apiUrls.GenerateOrderSheet, {Orderid: id}, "POST", {});
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
        title="Orders"
        subtitle={`Manage and track all orders for this job`}
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
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Order Number</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estimate Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Create Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
              {listdata?.tenantId === Loginuser?.tenantId && (
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Action
                </TableCell>
              )}
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
                    to={`/contacts/order/preview/${val?.orderId}`}
                    variant="text"
                    startIcon={<ReceiptIcon />}
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
                    {val?.orderNumber}
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {val?.estimateName}
                  </Typography>
                </TableCell>
                <TableCell>{moment(val?.createdDate).format("MM-DD-YYYY") || ""}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {defaultConfig.currencySign} {val?.grandTotal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={val?.status}
                    size="small"
                    color={val?.status === "Approved" ? "success" : "warning"}
                    variant={val?.status === "Approved" ? "filled" : "outlined"}
                    sx={{
                      fontWeight: 500,
                      minWidth: 100,
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                {listdata?.tenantId === Loginuser?.tenantId && (
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
                )}
              </TableRow>
            ))}
            {(!tenantList || tenantList?.length === 0) && (
              <TableRow>
                <TableCell 
                  colSpan={listdata?.tenantId === Loginuser?.tenantId ? 7 : 6} 
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
                    title="No Orders Found"
                    description="There are no orders available for this job yet."
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
            navigate(`/contacts/order/preview/${selectedRow?.orderId}`);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        {HasPermission("OrderEdit") && selectedRow?.status !== "PendingForApproval" && (
          <MenuItem
            component={Link}
            to={`/contacts/invoice/${JobId}/${selectedRow?.orderId}`}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {selectedRow?.status !== "Approved" && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                setApproved(true);
                setObject(selectedRow);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <SendIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send For Approval</ListItemText>
            </MenuItem>
          </>
        )}

        <MenuItem
          onClick={() => {
            handleDownload(selectedRow?.orderId, selectedRow?.orderNumber);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <GetAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Generate Order</ListItemText>
        </MenuItem>

        <Divider />
        
        <MenuItem
          onClick={() => {
            setHistory(true);
            setObject(selectedRow);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Version History</ListItemText>
        </MenuItem>
      </Menu>
      <SendApproved
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        estimateId={object.orderId}
        isApproved={false}
        loder={loder}
        title={"Share Link Via Copy or Email Prospective Customer"}
        subtitle={
          "You can send this link via email and copy to send the customer"
        }
        url="/contacts/order/preview/"
      />
      
      {history && (
        <VersionHistory
          open={history}
          handleClose={() => setHistory(false)}
          EstimationId={object.estimateId}
        />
      )}
    </Box>
  );
}
