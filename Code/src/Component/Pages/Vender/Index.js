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
} from "@mui/material";
import { 
  Edit,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  ToggleOn,
  ToggleOff,
  Add,
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
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Vendor" />
        <div className="body_content">
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={getCurrentTabIndex()}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  '&.Mui-selected': {
                    fontWeight: 600,
                  },
                },
              }}
            >
              {Tablist.filter(Boolean).map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.svg}
                  label={tab.title}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>

            <Box sx={{ p: 0 }}>
              {/* Tab Content */}
              {tabdata === "#vendorlisttabd" && (
                <Box sx={{ p: 3 }}>
                    {/* Header Section */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      mb: 4 
                    }}>
                      <TableTitle title="Manage Vendor" />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {HasPermission("VendorsAdd") && (
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
                              px: 3,
                              py: 1,
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
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      gap: 2,
                      mb: 4
                    }}>
                      <Box sx={{ flexGrow: 1, maxWidth: { xs: '100%', md: '300px' } }}>
                        <Search handleSearch={handleSearch} />
                      </Box>
                      <Box sx={{ minWidth: { xs: '100%', md: '200px' } }}>
                        <StatusDropdown
                          value={filter.status}
                          fn={handleChange}
                        />
                      </Box>
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
                        <Table sx={{ minWidth: 1200 }} stickyHeader>
                          <TableHead>
                            <TableRow>
                              {columns.map((column) => (
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
                                          color: filter.sortColumn === column.key ? '#3b82f6' : '#94a3b8',
                                          '&:hover': { color: '#3b82f6' },
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
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                      {vendor.companyName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.firstName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Chip
                                      label={vendor.vendorCode}
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
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.email}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.phoneNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.streetAddress}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.stateName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.city}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                      {vendor.zipCode}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handlestatus(vendor)}
                                        sx={{
                                          color: vendor.isActive ? '#16a34a' : '#94a3b8',
                                          '&:hover': {
                                            backgroundColor: vendor.isActive ? '#f0fdf4' : '#f8fafc',
                                          },
                                        }}
                                      >
                                        {vendor.isActive ? <ToggleOn /> : <ToggleOff />}
                                      </IconButton>
                                      <Chip
                                        label={vendor.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        sx={{
                                          backgroundColor: vendor.isActive ? '#dcfce7' : '#f1f5f9',
                                          color: vendor.isActive ? '#16a34a' : '#64748b',
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ py: 2, textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                      {HasPermission("VendorsEdit") && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handleedit(vendor)}
                                          sx={{
                                            color: '#3b82f6',
                                            backgroundColor: '#eff6ff',
                                            '&:hover': {
                                              backgroundColor: '#dbeafe',
                                              transform: 'scale(1.1)',
                                            },
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      )}
                                      {HasPermission("VendorsDelete") && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handledelete(vendor)}
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
                <Box sx={{ p: 3 }}>
                  <VendorOrderList />
                </Box>
              )}
            </Box>
          </Paper>
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
