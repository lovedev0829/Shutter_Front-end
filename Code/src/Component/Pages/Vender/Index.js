import React, { useEffect } from "react";
import Header from "../../../Layout/header";
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
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Container,
  Divider,
} from "@mui/material";
import { 
  Edit,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  ToggleOn,
  ToggleOff,
  Add,
  ExpandMore,
  FilterList,
} from "@mui/icons-material";
import AddEditVender from "./AddEditVender";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import StatusDropdown from "../../../helpers/StatusDropdown";
import VendorOrderList from "../Vendor-Order/VendorOrderList";
import { Manageapplication, Vendororder } from "../../../SvgFile/Index";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [VendorList, setVendorList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [filter, setFilter] = useState({
    status: "2",
    tenantId: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });
  const [tabdata, setTabdata] = useState("#vendorlisttabd");
  const columns = [
    { key: "companyName", label: "Company Name", sort: true },
    { key: "firstName", label: "Name", sort: true },
    { key: "vendorCode", label: "Code", sort: true },
    { key: "email", label: "Email", sort: true },
    { key: "phoneNumber", label: "Phone", phoneformate: true, sort: true },
    { key: "streetAddress", label: "Address", sort: true },
    { key: "stateName", label: "State", sort: true },
    { key: "city", label: "City", sort: true },
    { key: "zipCode", label: "Zip Code", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    VendorlistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    VendorlistAPI(
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
  const VendorlistAPI = async (
    page,
    perpage,
    serach,
    status,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: status,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Vendor, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setVendorList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setVendorList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  
  useEffect(() => {
    VendorlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedSearchcolumn]);

  const handleclose = () => {
    setOpen(false);
  };

  const refreshVendorlistAPI = () => {
    let pageNo = 1;
    VendorlistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
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
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorDelete,
        { VendorId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        VendorlistAPI(
          pageNo,
          rowsPerPage,
          search,
          filter.status,
          filter.sortColumn,
          filter.sortDirection,
          filter.columnFilters
        );
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
        apiUrls.VendorActiveInActive,
        { VendorId: item.vendorId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        VendorlistAPI(
          page,
          rowsPerPage,
          search,
          filter.status,
          filter.sortColumn,
          filter.sortDirection,
          filter.columnFilters
        );
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    let pageNo = 1;
    VendorlistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.value,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const Tablist = [
    {
      status: true,
      id: "#vendorlisttabd",
      svg: <Manageapplication />,
      title: "Manage Vendor",
    },
    HasPermission("VendorOrderView") && {
      status: false,
      id: "#addvendortab",
      svg: <Vendororder />,
      title: "Vendor Order",
    },
  ];

  const handleTabchnage = (value) => {
    setTabdata(value || Tablist[0].id);
  };

  const handleTabChange = (event, newValue) => {
    const filteredTablist = Tablist.filter(Boolean);
    const selectedTab = filteredTablist[newValue];
    setTabdata(selectedTab.id);
  };

  const getCurrentTabIndex = () => {
    const filteredTablist = Tablist.filter(Boolean);
    return Math.max(0, filteredTablist.findIndex(tab => tab.id === tabdata));
  };

  const initialActiveTab = localStorage.getItem("activeTab2") || "#vendorlisttabd";

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    let pageNo = 1;
    VendorlistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.status,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };

  const handlesearchChange = (columnKey, value = null) => {
    let updatedFilters = [...filter.columnFilters];
    if (value !== null) {
      if (columnKey === "phoneNumber") {
        // Remove all formatting characters first
        value = value.replace(/[()+\-\s]/g, "");

        // Remove leading '1' if it follows a '+'
        if (value.startsWith("1")) {
          value = value.substring(1);
        }
      }
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
        columnFilters: updatedFilters,
      };
    });
  };

  return (
    <>
      <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Vendor" />
        <div className="body_content">
          <Container
            maxWidth={false}
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
              maxWidth: "100%",
            }}
          >
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={getCurrentTabIndex()}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: { xs: 44, sm: 48 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 44, sm: 48 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  minWidth: { xs: 'auto', sm: 160 },
                  px: { xs: 1, sm: 2 },
                  '&.Mui-selected': {
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-scrollButtons': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {Tablist.filter(Boolean).map((tab, index) => (
                <Tab
                  key={index}
                  icon={isMobile ? null : tab.svg}
                  label={tab.title}
                  iconPosition="start"
                  sx={{ 
                    gap: { xs: 0.5, sm: 1 },
                    '& .MuiTab-iconWrapper': {
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                    },
                  }}
                />
              ))}
            </Tabs>

            <Box sx={{ p: 0 }}>
              {/* Tab Content */}
              {tabdata === "#vendorlisttabd" && (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Header Section */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 0 },
                      mb: { xs: 3, sm: 4 }
                    }}>
                      <TableTitle title="Manage Vendor" />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {HasPermission("VendorsAdd") && (
                          <Button
                            variant="contained"
                            startIcon={isMobile ? null : <Add />}
                            onClick={() => {
                              setAction("add");
                              setOpen(true);
                            }}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                              px: { xs: 2, sm: 3 },
                              py: { xs: 0.5, sm: 1 },
                              minWidth: { xs: 'auto', sm: 'auto' },
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                              '&:hover': {
                                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.25)',
                                transform: 'translateY(-1px)',
                              },
                            }}
                          >
                            Add Vendor
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Search and Filter Section */}
                    <Box sx={{ mb: 3 }}>
                      <Accordion 
                        defaultExpanded={!isMobile}
                        sx={{
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px !important',
                          '&:before': { display: 'none' },
                          overflow: 'hidden',
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMore sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
                          sx={{
                            backgroundColor: '#f8fafc',
                            minHeight: { xs: 44, sm: 48, md: 56 },
                            px: { xs: 2, sm: 3 },
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                              gap: { xs: 0.5, sm: 1 },
                              margin: { xs: '8px 0', sm: '12px 0' },
                            },
                            '& .MuiAccordionSummary-expandIconWrapper': {
                              color: '#3b82f6',
                            },
                          }}
                        >
                          <FilterList sx={{ color: '#3b82f6', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                              color: '#1e293b',
                            }}
                          >
                            Search & Filters
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
                          <Grid container spacing={{ xs: 2, sm: 3 }}>
                            <Grid item xs={12} md={6}>
                              <Search handleSearch={handleSearch} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <StatusDropdown
                                value={filter.status}
                                fn={handleChange}
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Box>

                    {/* Modern Table Section */}
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
                        <Table sx={{ minWidth: { xs: 800, sm: 1000, md: 1200 } }} stickyHeader>
                          <TableHead>
                            <TableRow>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.key}
                                  sx={{
                                    backgroundColor: '#f8fafc',
                                    fontWeight: 700,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    color: '#1e293b',
                                    borderBottom: '2px solid #e2e8f0',
                                    py: { xs: 1, sm: 2 },
                                    px: { xs: 1, sm: 2 },
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 3,
                                    minWidth: { xs: '100px', sm: '120px', md: 'auto' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="inherit" sx={{ 
                                      fontWeight: 700,
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    }}>
                                      {column.label}
                                    </Typography>
                                    {column.sort && (
                                      <IconButton
                                        size={isMobile ? 'small' : 'medium'}
                                        onClick={() => handleFilterSortChange(column.key)}
                                        sx={{
                                          color: filter.sortColumn === column.key ? '#3b82f6' : '#94a3b8',
                                          '&:hover': { color: '#3b82f6' },
                                          p: { xs: 0.5, sm: 1 },
                                        }}
                                      >
                                        {filter.sortColumn === column.key && filter.sortDirection === 'desc' ? (
                                          <ArrowDownward fontSize={isMobile ? 'small' : 'medium'} />
                                        ) : (
                                          <ArrowUpward fontSize={isMobile ? 'small' : 'medium'} />
                                        )}
                                      </IconButton>
                                    )}
                                  </Box>
                                  {column.sort && (
                                    <TextField
                                      size={isMobile ? "small" : "small"}
                                      placeholder={`Search ${column.label.toLowerCase()}...`}
                                      variant="outlined"
                                      onChange={(e) => handlesearchChange(column.key, e.target.value)}
                                      value={filter.columnFilters?.find(f => f.field === column.key)?.value || ''}
                                      sx={{
                                        mt: 1,
                                        minWidth: { xs: '80px', sm: '100px', md: '150px' },
                                        maxWidth: { xs: '120px', sm: '150px', md: 'none' },
                                        '& .MuiOutlinedInput-root': {
                                          height: { xs: '24px', sm: '28px', md: '32px' },
                                          fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' },
                                          borderRadius: '6px',
                                          backgroundColor: 'white',
                                          '& input': {
                                            py: { xs: '2px', sm: '4px' },
                                            px: { xs: '6px', sm: '8px' },
                                          },
                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                          },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                </TableCell>
                              ))}
                              <TableCell
                                sx={{
                                  backgroundColor: '#f8fafc',
                                  fontWeight: 700,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                  color: '#1e293b',
                                  borderBottom: '2px solid #e2e8f0',
                                  py: { xs: 1, sm: 2 },
                                  px: { xs: 1, sm: 2 },
                                  position: 'sticky',
                                  top: 0,
                                  zIndex: 3,
                                  textAlign: 'center',
                                  minWidth: { xs: '80px', sm: '100px', md: 'auto' },
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {VendorList && VendorList.length > 0 ? (
                              VendorList.map((vendor, index) => (
                                <TableRow
                                  key={vendor.vendorId || index}
                                  sx={{
                                    '&:nth-of-type(odd)': {
                                      backgroundColor: '#fafbfc',
                                    },
                                    '&:hover': {
                                      backgroundColor: '#f1f5f9',
                                      transform: 'scale(1.001)',
                                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '100px', sm: '120px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: { xs: '80px', sm: '120px', md: 'auto' },
                                      }}
                                    >
                                      {vendor.companyName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '70px', sm: '80px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.firstName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '70px', sm: '80px', md: 'auto' },
                                  }}>
                                    <Chip
                                      label={vendor.vendorCode}
                                      size={isMobile ? 'small' : 'medium'}
                                      sx={{
                                        backgroundColor: '#e0f2fe',
                                        color: '#0277bd',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.5625rem', sm: '0.625rem', md: '0.75rem' },
                                        height: { xs: '20px', sm: '24px', md: '32px' },
                                        '& .MuiChip-label': {
                                          px: { xs: 0.5, sm: 1 },
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '100px', sm: '120px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.email}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '80px', sm: '100px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.phoneNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '100px', sm: '120px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.streetAddress}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '70px', sm: '80px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.stateName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '70px', sm: '80px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.city}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '60px', sm: '70px', md: 'auto' },
                                  }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#475569',
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {vendor.zipCode}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    minWidth: { xs: '80px', sm: '100px', md: 'auto' },
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                      <IconButton
                                        size={isMobile ? 'small' : 'medium'}
                                        onClick={() => handlestatus(vendor)}
                                        sx={{
                                          color: vendor.isActive ? '#16a34a' : '#94a3b8',
                                          '&:hover': {
                                            backgroundColor: vendor.isActive ? '#f0fdf4' : '#f8fafc',
                                          },
                                          p: { xs: 0.5, sm: 1 },
                                        }}
                                      >
                                        {vendor.isActive ? 
                                          <ToggleOn fontSize={isMobile ? 'small' : 'medium'} /> : 
                                          <ToggleOff fontSize={isMobile ? 'small' : 'medium'} />
                                        }
                                      </IconButton>
                                      <Chip
                                        label={vendor.isActive ? 'Active' : 'Inactive'}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                          backgroundColor: vendor.isActive ? '#dcfce7' : '#f1f5f9',
                                          color: vendor.isActive ? '#16a34a' : '#64748b',
                                          fontWeight: 600,
                                          fontSize: { xs: '0.5625rem', sm: '0.625rem', md: '0.75rem' },
                                        height: { xs: '20px', sm: '24px', md: '32px' },
                                        '& .MuiChip-label': {
                                          px: { xs: 0.5, sm: 1 },
                                        },
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    py: { xs: 0.5, sm: 1, md: 2 }, 
                                    px: { xs: 0.5, sm: 1, md: 2 },
                                    textAlign: 'center',
                                    minWidth: { xs: '70px', sm: '80px', md: 'auto' },
                                  }}>
                                    <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, justifyContent: 'center' }}>
                                      {HasPermission("VendorsEdit") && (
                                        <IconButton
                                          size={isMobile ? 'small' : 'medium'}
                                          onClick={() => handleedit(vendor)}
                                          sx={{
                                            color: '#3b82f6',
                                            backgroundColor: '#eff6ff',
                                            p: { xs: 0.5, sm: 1 },
                                            '&:hover': {
                                              backgroundColor: '#dbeafe',
                                              transform: 'scale(1.1)',
                                            },
                                          }}
                                        >
                                          <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                        </IconButton>
                                      )}
                                      {HasPermission("VendorsDelete") && (
                                        <IconButton
                                          size={isMobile ? 'small' : 'medium'}
                                          onClick={() => handledelete(vendor)}
                                          sx={{
                                            color: '#ef4444',
                                            backgroundColor: '#fef2f2',
                                            p: { xs: 0.5, sm: 1 },
                                            '&:hover': {
                                              backgroundColor: '#fee2e2',
                                              transform: 'scale(1.1)',
                                            },
                                          }}
                                        >
                                          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 6 }}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                                      No vendors found
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                      Try adjusting your search criteria or add a new vendor
                                    </Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Simple Vendor-style Pagination */}
                        {VendorList && VendorList?.length > 0 && (
                          <div className="d-flex align-items-center justify-content-end bottom_nav">
                            <nav aria-label="Page navigation example">
                              <ul className="pagination">
                                <TablePagination
                                  rowsPerPageOptions={[10, 25, 50, 100]}
                                  component="div"
                                  count={paginatedItems}
                                  rowsPerPage={rowsPerPage}
                                  page={page - 1}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                              </ul>
                            </nav>
                          </div>
                        )}
                    </Box>
                </Box>
              )}
                {/* vendorlisttab */}

                              {HasPermission("VendorOrderView") && tabdata === "#addvendortab" && (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <VendorOrderList />
                </Box>
              )}
            </Box>
          </Paper>
          </Container>
        </div>
      </div>

      {/* Modals */}
      {open && (
        <AddEditVender
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={refreshVendorlistAPI}
          object={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.companyName}
          id={object?.vendorId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
