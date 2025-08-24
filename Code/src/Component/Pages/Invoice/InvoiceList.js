import React, { useEffect } from "react";
import { useState } from "react";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
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
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon
} from "@mui/icons-material";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { Link } from "react-router-dom";
import AddEditInvoice from "./AddEditInvoice";
import moment from "moment";
import StatusDropdown from "../../../helpers/StatusDropdown";
import { defaultConfig } from "../../../config";
import { PageHeader, EmptyState } from "../../Form/MaterialUIComponents";

export default function InvoiceList({ JobId,contactId,listdata }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [filter, setFilter] = useState({ status: "2", tenantId: "" });
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
  const TenantlistAPI = async (page, perpage, tenantId, status) => {
    let query = {
      searchValue: JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      productType: "",
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Invoice, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage, filter.tenantId, filter.status);
    setPage(1);
    // eslint-disable-next-line
  }, [JobId]);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
        apiUrls.InvoiceDelete,
        { ContactId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
  const handleStatus = async (item) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.InvoiceActiveInActive,
        { ContactId: item.invoiceId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      rowsPerPage,
      e.target.name === "tenantId" ? e.target.value : filter.tenantId,
      e.target.name === "status" ? e.target.value : filter.status
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlesandinvoice = async (param) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", {
        documentType: 3,
        templateId: null,
        contactId:contactId,
        estimationId: param.estimateId,
        invoiceId: param.invoiceId,
      });
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
        title="Invoice"
        subtitle="Manage and track invoices for this job"
        actions={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter.status}
                label="Status"
                name="status"
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="2">All</MenuItem>
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
            {HasPermission("InvoiceAdd") && listdata?.tenantId === Loginuser?.tenantId && (
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
                Add Invoice
              </Button>
            )}
          </Box>
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
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Invoice Number</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estimate Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Issue Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Balance Due</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
              {listdata?.tenantId === Loginuser?.tenantId && (
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tenantList.map((val, i) => (
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
                    to={listdata?.tenantId === Loginuser?.tenantId ? `/contacts/payment/${val?.invoiceId}` : "#"}
                    variant="text"
                    startIcon={<ReceiptIcon />}
                    disabled={listdata?.tenantId !== Loginuser?.tenantId}
                    sx={{
                      textTransform: 'none',
                      p: 0,
                      textDecoration: 'underline',
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent'
                      },
                      '&.Mui-disabled': {
                        color: 'text.primary',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {val?.invoiceNumber}
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {val?.estimateName}
                  </Typography>
                </TableCell>
                <TableCell>{moment(val?.issueDate).format("MM-DD-YYYY")}</TableCell>
                <TableCell>{moment(val?.dueDate).format("MM-DD-YYYY")}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {defaultConfig.currencySign} {val?.totalAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    {defaultConfig.currencySign} {val?.balanceDue}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={val?.isActive === true ? "Active" : "Inactive"}
                    size="small"
                    color={val?.isActive === true ? "success" : "default"}
                    variant={val?.isActive === true ? "filled" : "outlined"}
                    clickable={listdata?.tenantId === Loginuser?.tenantId}
                    onClick={() => listdata?.tenantId === Loginuser?.tenantId ? handleStatus(val) : null}
                    sx={{
                      fontWeight: 500,
                      minWidth: 80,
                      cursor: listdata?.tenantId === Loginuser?.tenantId ? 'pointer' : 'default'
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
                  colSpan={listdata?.tenantId === Loginuser?.tenantId ? 9 : 8} 
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
                    title="No Invoices Found"
                    description="There are no invoices available for this job yet."
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
        {HasPermission("InvoiceEdit") && (
          <MenuItem
            onClick={() => {
              handlesandinvoice(selectedRow);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Send Invoice</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          component={Link}
          to={`/contacts/payment/${selectedRow?.invoiceId}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Payment</ListItemText>
        </MenuItem>

        {HasPermission("InvoiceEdit") && (
          <MenuItem
            onClick={() => {
              handleedit(selectedRow);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {HasPermission("InvoiceDelete") && (
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
     {open && <AddEditInvoice
        jobid={JobId}
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
      />
     }
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.invoiceNumber}
        id={object?.invoiceId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </Box>
  );
}
