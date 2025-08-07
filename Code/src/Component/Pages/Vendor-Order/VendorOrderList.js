import React, { useEffect } from "react";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { 
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Link as MuiLink,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { 
  Edit,
  Delete as DeleteIcon,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  Add,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import VenderOrderAddEdit from "./VenderOrderAddEdit";
import { useNavigate } from "react-router";

export default function VendorOrderList() {
  let navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ status: "2", tenantId: "",sortColumn: "",
    sortDirection: "asc",
     columnFilters: [], });

  const columns = [
    { key: "firstName", label: "Vendor", link:true, sort: true },
    { key: "jobName", label: "Job", sort: true  },
    { key: "orderNumber", label: "Order Number", sort: true  },
      { key: "totalAmount", label: "Total Cost" ,sign:true, sort: true  },
    { key: "orderDate", label: "Order Date" },
    { key: "expectedDeliveryDate", label: "Expiry Delivery Date" },
    { key: "actualDeliveryDate", label: "Actual Delivery Date"},
  
    { key: "vendorOrderStatus", label: "Status" },
    
  ];
  const handleSearch = (value) => {
    setsearch(value);
  };
  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, serach, status,sortColumn,sortDirection,columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: status,
      sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.VendorOrder, {}, "POST", query);
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
   const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn]);

  const handleclose = () => {
    setOpen(false);
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {

    setAction("edit");
    if (item?.vendorOrderItems?.length === 0) {
      const data = { ...item }
      data?.vendorOrderItems.push(
        {
          materialId: "",
          quantity: "",
          unitPrice: "",

        }
      )
      setObject(data);
    }
    setObject(item);
    setOpen(true);
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorOrderDelete,
        { VendorOrderId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
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

  const handlestatus = async (item) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorOrderActiveInActive,
        { VendorId: item.vendorId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, search, e.target.value,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleview = (item) => {
    navigate(`/vendors/detail/${item.vendorOrderId}`);
  };
  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    TenantlistAPI(
     1, rowsPerPage, search, filter.status,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };
  
const handlesearchChange = (columnKey, value = null) => {
  let updatedFilters = [...filter.columnFilters];
  if (value !== null) {
    const index = updatedFilters.findIndex((f) => f.field === columnKey);
    if (index > -1) {
      updatedFilters[index].value = value;
    } else {
      updatedFilters.push({ field: columnKey, value });
    }
  }
       

  setFilter((val) => {
      return {
        ...val,
        columnFilters: updatedFilters
      };
    });
  
};

  return (
    <>
      {loder && <ApiLoder />}
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
          maxWidth: '100%',
        }}
      >
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: 'space-between', 
          mb: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 0 },
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: '#1e293b',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Manage Vendor Orders
          </Typography>
          {HasPermission("VendorOrderAdd") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setAction("add");
                setOpen(true);
              }}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.25)',
                  transform: 'translateY(-1px)',
                },
                minHeight: { xs: '44px', sm: '48px' }, // Touch-friendly
              }}
            >
              {isMobile ? 'Add Order' : 'Add Vendor Order'}
            </Button>
          )}
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: { xs: 3, sm: 4 }
        }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Search vendor orders..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              variant="outlined"
              size={isMobile ? "medium" : "medium"}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ minWidth: { xs: '100%', md: '200px' } }}>
            <FormControl fullWidth variant="outlined" size={isMobile ? "medium" : "medium"}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                name="status"
                value={filter.status}
                onChange={handleChange}
                label="Status"
                sx={{
                  borderRadius: '8px',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <MenuItem value="2">All Status</MenuItem>
                <MenuItem value="1">Approved</MenuItem>
                <MenuItem value="0">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Compact Table Section - Responsive */}
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'auto',
              border: '1px solid #e3f2fd',
              maxHeight: '70vh',
              width: '100%',
              '&::-webkit-scrollbar': {
                height: '8px',
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#94a3b8',
                },
              },
            }}
          >
            <Table 
              sx={{ 
                minWidth: isMobile ? 320 : isTablet ? 800 : 1200,
                '& .MuiTableCell-root': {
                  padding: isMobile ? '6px 4px' : isTablet ? '8px 6px' : '12px',
                  fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem',
                },
              }} 
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  {isMobile ? (
                    // Mobile - Compact 3 column layout
                    <>
                      <TableCell
                        sx={{
                          backgroundColor: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#1e293b',
                          borderBottom: '2px solid #e2e8f0',
                          py: 1,
                          position: 'sticky',
                          top: 0,
                          zIndex: 3,
                          minWidth: '120px',
                        }}
                      >
                        Vendor / Order
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#1e293b',
                          borderBottom: '2px solid #e2e8f0',
                          py: 1,
                          position: 'sticky',
                          top: 0,
                          zIndex: 3,
                          textAlign: 'center',
                          minWidth: '90px',
                        }}
                      >
                        Amount / Status
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#1e293b',
                          borderBottom: '2px solid #e2e8f0',
                          py: 1,
                          position: 'sticky',
                          top: 0,
                          zIndex: 3,
                          textAlign: 'center',
                          minWidth: '70px',
                        }}
                      >
                        Actions
                      </TableCell>
                    </>
                  ) : isTablet ? (
                    // Tablet - 5 column layout
                    <>
                      <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 3 }}>
                        Vendor
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 3 }}>
                        Job / Order
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 3 }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 3 }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', py: 1.5, position: 'sticky', top: 0, zIndex: 3, textAlign: 'center' }}>
                        Actions
                      </TableCell>
                    </>
                  ) : (
                    // Desktop - Full columns
                    columns.map((column) => (
                      <TableCell
                        key={column.key}
                        sx={{
                          backgroundColor: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#1e293b',
                          borderBottom: '2px solid #e2e8f0',
                          py: 2,
                          position: 'sticky',
                          top: 0,
                          zIndex: 3,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="inherit" sx={{ fontWeight: 700 }}>
                            {column.label}
                          </Typography>
                          {column.sort && (
                            <IconButton
                              size="small"
                              onClick={() => handleFilterSortChange(column.key)}
                              sx={{
                                color: filter.sortColumn === column.key ? theme.palette.primary.main : '#94a3b8',
                                '&:hover': { color: theme.palette.primary.main },
                              }}
                            >
                              {filter.sortColumn === column.key && filter.sortDirection === 'desc' ? (
                                <ArrowDownward fontSize="small" />
                              ) : (
                                <ArrowUpward fontSize="small" />
                              )}
                            </IconButton>
                          )}
                        </Box>
                        {column.sort && (
                          <TextField
                            size="small"
                            placeholder={`Search ${column.label.toLowerCase()}...`}
                            variant="outlined"
                            onChange={(e) => handlesearchChange(column.key, e.target.value)}
                            value={filter.columnFilters?.find(f => f.field === column.key)?.value || ''}
                            sx={{
                              mt: 1,
                              '& .MuiOutlinedInput-root': {
                                height: '32px',
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                },
                              },
                            }}
                          />
                        )}
                      </TableCell>
                    ))
                  )}
                  {!isMobile && !isTablet && (
                    <TableCell
                      sx={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        borderBottom: '2px solid #e2e8f0',
                        py: 2,
                        position: 'sticky',
                        top: 0,
                        zIndex: 3,
                        textAlign: 'center',
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantList && tenantList.length > 0 ? (
                  tenantList.map((order, index) => (
                    <TableRow
                      key={order.vendorOrderId || index}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: '#fafbfc',
                        },
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          transform: isMobile ? 'none' : 'scale(1.001)',
                          boxShadow: isMobile ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isMobile ? (
                        // Mobile - Compact layout
                        <>
                          <TableCell sx={{ py: 0.5 }}>
                            <Box>
                              <MuiLink
                                component="button"
                                variant="body2"
                                onClick={() => handleview(order)}
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.primary.main,
                                  textDecoration: 'none',
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                  display: 'block',
                                  textAlign: 'left',
                                  mb: 0.25,
                                }}
                              >
                                {order.firstName}
                              </MuiLink>
                              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', mb: 0.25 }}>
                                {order.jobName}
                              </Typography>
                              <Chip
                                label={order.orderNumber}
                                size="small"
                                sx={{
                                  backgroundColor: '#e0f2fe',
                                  color: '#0277bd',
                                  fontWeight: 600,
                                  fontSize: '0.6rem',
                                  height: '16px',
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 0.5, textAlign: 'center' }}>
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#059669',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  mb: 0.25,
                                }}
                              >
                                ${order.totalAmount}
                              </Typography>
                              <Chip
                                label={order.vendorOrderStatus}
                                size="small"
                                sx={{
                                  backgroundColor: order.vendorOrderStatus === 'Approved' ? '#dcfce7' : '#fef3c7',
                                  color: order.vendorOrderStatus === 'Approved' ? '#16a34a' : '#d97706',
                                  fontWeight: 600,
                                  fontSize: '0.6rem',
                                  height: '16px',
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 0.5, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'center', flexWrap: 'wrap' }}>
                              {HasPermission("VendorOrderEdit") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleedit(order)}
                                  sx={{
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.primary.main + '10',
                                    '&:hover': {
                                      backgroundColor: theme.palette.primary.main + '20',
                                    },
                                    width: 24,
                                    height: 24,
                                  }}
                                >
                                  <Edit sx={{ fontSize: '12px' }} />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleview(order)}
                                sx={{
                                  color: '#059669',
                                  backgroundColor: '#f0fdf4',
                                  '&:hover': {
                                    backgroundColor: '#dcfce7',
                                  },
                                  width: 24,
                                  height: 24,
                                }}
                              >
                                <Visibility sx={{ fontSize: '12px' }} />
                              </IconButton>
                              {HasPermission("VendorOrderDelete") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handledelete(order)}
                                  sx={{
                                    color: '#ef4444',
                                    backgroundColor: '#fef2f2',
                                    '&:hover': {
                                      backgroundColor: '#fee2e2',
                                    },
                                    width: 24,
                                    height: 24,
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: '12px' }} />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </>
                      ) : isTablet ? (
                        // Tablet - 5 column layout
                        <>
                          <TableCell sx={{ py: 1 }}>
                            <MuiLink
                              component="button"
                              variant="body2"
                              onClick={() => handleview(order)}
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {order.firstName}
                            </MuiLink>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', mb: 0.5 }}>
                              {order.jobName}
                            </Typography>
                            <Chip
                              label={order.orderNumber}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0277bd',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: '18px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#059669',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                              }}
                            >
                              ${order.totalAmount}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              label={order.vendorOrderStatus}
                              size="small"
                              sx={{
                                backgroundColor: order.vendorOrderStatus === 'Approved' ? '#dcfce7' : '#fef3c7',
                                color: order.vendorOrderStatus === 'Approved' ? '#16a34a' : '#d97706',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: '18px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              {HasPermission("VendorOrderEdit") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleedit(order)}
                                  sx={{
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.primary.main + '10',
                                    '&:hover': {
                                      backgroundColor: theme.palette.primary.main + '20',
                                      transform: 'scale(1.1)',
                                    },
                                    width: 28,
                                    height: 28,
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleview(order)}
                                sx={{
                                  color: '#059669',
                                  backgroundColor: '#f0fdf4',
                                  '&:hover': {
                                    backgroundColor: '#dcfce7',
                                    transform: 'scale(1.1)',
                                  },
                                  width: 28,
                                  height: 28,
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              {HasPermission("VendorOrderDelete") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handledelete(order)}
                                  sx={{
                                    color: '#ef4444',
                                    backgroundColor: '#fef2f2',
                                    '&:hover': {
                                      backgroundColor: '#fee2e2',
                                      transform: 'scale(1.1)',
                                    },
                                    width: 28,
                                    height: 28,
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </>
                      ) : (
                        // Desktop - Full columns
                        <>
                          <TableCell sx={{ py: 2 }}>
                            <MuiLink
                              component="button"
                              variant="body2"
                              onClick={() => handleview(order)}
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {order.firstName}
                            </MuiLink>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem' }}>
                              {order.jobName}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={order.orderNumber}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0277bd',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#059669',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                              }}
                            >
                              ${order.totalAmount}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem' }}>
                              {order.orderDate}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem' }}>
                              {order.expectedDeliveryDate}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem' }}>
                              {order.actualDeliveryDate}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={order.vendorOrderStatus}
                              size="small"
                              sx={{
                                backgroundColor: order.vendorOrderStatus === 'Approved' ? '#dcfce7' : '#fef3c7',
                                color: order.vendorOrderStatus === 'Approved' ? '#16a34a' : '#d97706',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              {HasPermission("VendorOrderEdit") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleedit(order)}
                                  sx={{
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.primary.main + '10',
                                    '&:hover': {
                                      backgroundColor: theme.palette.primary.main + '20',
                                      transform: 'scale(1.1)',
                                    },
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleview(order)}
                                sx={{
                                  color: '#059669',
                                  backgroundColor: '#f0fdf4',
                                  '&:hover': {
                                    backgroundColor: '#dcfce7',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              {HasPermission("VendorOrderDelete") && (
                                <IconButton
                                  size="small"
                                  onClick={() => handledelete(order)}
                                  sx={{
                                    color: '#ef4444',
                                    backgroundColor: '#fef2f2',
                                    '&:hover': {
                                      backgroundColor: '#fee2e2',
                                      transform: 'scale(1.1)',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={isMobile ? 3 : isTablet ? 5 : columns.length + 1} 
                      sx={{ textAlign: 'center', py: 6 }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                          No vendor orders found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          Try adjusting your search criteria or add a new vendor order
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        {tenantList && tenantList?.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 3,
            '& .MuiTablePagination-root': {
              overflow: 'visible',
            },
            '& .MuiTablePagination-toolbar': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 },
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              margin: 0,
            },
            '& .MuiTablePagination-select': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            },
            '& .MuiIconButton-root': {
              padding: { xs: '6px', sm: '8px' },
            },
          }}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={paginatedItems}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
            />
          </Box>
        )}
      </Container>

      {/* Modals */}
      {open && (
        <VenderOrderAddEdit
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={handleapi}
          object={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object?.firstName + " " + object?.lastName}
          id={object?.vendorOrderId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}