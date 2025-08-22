import React, { useEffect } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import DynamicTable from "../../Form/DynamicTable";
import Search from "../../Form/Search";
import AddEditButton from "../../Form/AddEditButton";
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
  TextField,
  Link as MuiLink,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Collapse,
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
  ExpandMore,
  Search as SearchIcon,
  FilterList,
} from "@mui/icons-material";
import AddEditUser from "./AddEditUser";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import RoleList from "../Role/RoleList";
import { Manageapplication, Manageroletab } from "../../../SvgFile/Index";
import PartnerDropdown from "../../../helpers/PartnerDropdown";
import StatusDropdown from "../../../helpers/StatusDropdown";



export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [UsersList, setUsersList] = useState([]);
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
  const [tabdata, setTabdata] = useState("#manageapplication");

  const columns = [
    { key: "firstName", label: "Name", sort: true },
    { key: "email", label: "Email", sort: true },
    { key: "phone", label: "Phone Number", phoneformate: true, sort: true },
    { key: "ghlUserName", label: "GHL User Name", sort: true },
    { key: "roleName", label: "Role Name", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    UserslistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    UserslistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const UserslistAPI = async (
    page,
    perpage,
    serach,
    tenantId,
    status,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      status: status,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.User, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setUsersList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setUsersList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    UserslistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.tenantId,
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

  const refreshUserslistAPI = () => {
    let pageNo = 1;
    UserslistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.tenantId,
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
        apiUrls.UserDelete,
        { UserId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        UserslistAPI(
          pageNo,
          rowsPerPage,
          search,
          filter.tenantId,
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
        apiUrls.UserActiveInActive,
        { UserId: item.userId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        UserslistAPI(
          page,
          rowsPerPage,
          search,
          filter.tenantId,
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

  const Tablist = [
    {
      status: true,
      id: "#manageapplication",
      svg: <Manageapplication />,
      title: "Manage Application Users",
    },
    HasPermission("RolesView") &&
      !filter.tenantId && {
        status: false,
        id: "#manageroletab",
        svg: <Manageroletab />,
        title: "Manage Roles",
      },
  ].filter(Boolean);

  const handleApihit = () => {
    UserslistAPI(
      page,
      rowsPerPage,
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
  };

  const handleChange = (e) => {
    let pageNo = 1;
    UserslistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.name === "tenantId" ? e.target.value : filter.tenantId,
      e.target.name === "status" ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleTabChange = (event, newValue) => {
    const selectedTab = Tablist[newValue];
    setTabdata(selectedTab.id);
  };

  const getCurrentTabIndex = () => {
    return Tablist.findIndex(tab => tab.id === tabdata);
  };

  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0].id;

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    let pageNo = 1;
    UserslistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.tenantId,
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
      if (columnKey === "phone") {
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
    <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Users Admin" />
        <div className="body_content">
        <Container
            maxWidth={false}
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
              maxWidth: "100%",
            }}
          >
            <Paper sx={{ 
              width: '100%', 
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}>
              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: { xs: 40, sm: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    '&.Mui-selected': {
                      fontWeight: 600,
                    },
                  },
                  '& .MuiTabs-scrollButtons': {
                    color: '#6b7280',
                  },
                }}
              >
                {Tablist.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.svg}
                    label={tab.title}
                    iconPosition="start"
                    sx={{ 
                      gap: { xs: 0.5, sm: 1 },
                      px: { xs: 1, sm: 2, md: 3 },
                    }}
                  />
                ))}
              </Tabs>

              <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                {tabdata === "#manageapplication" && (
                  <>
                    {/* Header Section */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: { xs: 2, sm: 3 },
                      mb: 3,
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1f2937',
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        Manage Application Users
                      </Typography>
                      {!filter.tenantId && HasPermission("UsersAdd") && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            setAction("add");
                            setOpen(true);
                          }}
                          sx={{
                            backgroundColor: '#3b82f6',
                            '&:hover': {
                              backgroundColor: '#2563eb',
                            },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Add New User
                        </Button>
                      )}
                    </Box>

                    {/* Filters Section */}
                    <Accordion 
                      sx={{ 
                        mb: 3, 
                        borderRadius: '8px !important',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          '&.Mui-expanded': {
                            borderRadius: '8px 8px 0 0',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FilterList sx={{ color: '#6b7280', fontSize: { xs: 18, sm: 20 } }} />
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#374151',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}
                          >
                            Search & Filters
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Search handleSearch={handleSearch} />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <StatusDropdown
                              value={filter.status}
                              fn={handleChange}
                            />
                          </Grid>
                          {HasPermission("SubTenantView") && (
                            <Grid item xs={12} sm={6} md={4}>
                              <PartnerDropdown
                                value={filter.tenantId}
                                fn={handleChange}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Content Section - Responsive Table with Horizontal Scroll */}
                    <Box sx={{ mt: 3 }}>
                      <TableContainer 
                        component={Paper} 
                        sx={{ 
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                          overflow: 'auto',
                          border: '1px solid #f1f5f9',
                          // Mobile horizontal scroll
                          '&::-webkit-scrollbar': {
                            height: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d1d5db',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#9ca3af',
                          },
                        }}
                      >
                        <Table sx={{ minWidth: isMobile ? 800 : 'auto' }}>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.key}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    color: '#374151',
                                    borderBottom: '2px solid #e5e7eb',
                                    padding: { xs: '8px 6px', sm: '12px', md: '16px' },
                                    position: 'relative',
                                    minWidth: isMobile ? '100px' : 'auto',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ 
                                      fontWeight: 700, 
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    }}>
                                      {column.label}
                                    </Typography>
                                    {column.sort && (
                                      <IconButton
                                        size="small"
                                        onClick={() => handleFilterSortChange(column.key)}
                                        sx={{
                                          color: filter.sortColumn === column.key ? '#3b82f6' : '#9ca3af',
                                          padding: '2px',
                                          '&:hover': {
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                          },
                                        }}
                                      >
                                        {filter.sortColumn === column.key && filter.sortDirection === 'desc' ? (
                                          <ArrowDownward sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />
                                        ) : (
                                          <ArrowUpward sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />
                                        )}
                                      </IconButton>
                                    )}
                                  </Box>
                                  {!isMobile && (
                                    <TextField
                                      size="small"
                                      placeholder={`Search ${column.label}`}
                                      value={
                                        filter.columnFilters.find(f => f.field === column.key)?.value || ''
                                      }
                                      onChange={(e) => handlesearchChange(column.key, e.target.value)}
                                      sx={{
                                        mt: 1,
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                          backgroundColor: 'white',
                                          borderRadius: '6px',
                                          fontSize: { sm: '0.625rem', md: '0.75rem' },
                                          '& fieldset': {
                                            borderColor: '#e5e7eb',
                                          },
                                          '&:hover fieldset': {
                                            borderColor: '#3b82f6',
                                          },
                                          '&.Mui-focused fieldset': {
                                            borderColor: '#3b82f6',
                                            borderWidth: '1px',
                                          },
                                        },
                                        '& .MuiInputBase-input': {
                                          padding: { sm: '4px 6px', md: '6px 8px' },
                                          fontSize: { sm: '0.625rem', md: '0.75rem' },
                                        },
                                      }}
                                    />
                                  )}
                                </TableCell>
                              ))}
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                  color: '#374151',
                                  borderBottom: '2px solid #e5e7eb',
                                  padding: { xs: '8px 6px', sm: '12px', md: '16px' },
                                  textAlign: 'center',
                                  minWidth: isMobile ? '80px' : 'auto',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {UsersList && UsersList.length > 0 ? (
                              UsersList.map((user, index) => (
                                <TableRow
                                  key={user.userId || index}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: '#f9fafb',
                                    },
                                    '&:nth-of-type(even)': {
                                      backgroundColor: '#fafbfc',
                                    },
                                  }}
                                >
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '100px' : 'auto',
                                  }}>
                                    <Typography sx={{ 
                                      fontWeight: 600, 
                                      color: '#1f2937',
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}>
                                      {user.firstName} {user.lastName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '120px' : 'auto',
                                  }}>
                                    <Typography sx={{ 
                                      color: '#6b7280',
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}>
                                      {user.email}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '100px' : 'auto',
                                  }}>
                                    <Typography sx={{ 
                                      color: '#6b7280',
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                      whiteSpace: 'nowrap',
                                    }}>
                                      {user.phone || '-'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '100px' : 'auto',
                                  }}>
                                    <Typography sx={{ 
                                      color: '#6b7280',
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}>
                                      {user.ghlUserName || '-'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '80px' : 'auto',
                                  }}>
                                    <Chip
                                      label={user.roleName || 'No Role'}
                                      size="small"
                                      sx={{
                                        backgroundColor: user.roleName ? '#dbeafe' : '#f3f4f6',
                                        color: user.roleName ? '#1e40af' : '#6b7280',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                                        height: { xs: 18, sm: 20, md: 24 },
                                        '& .MuiChip-label': {
                                          px: { xs: 0.5, sm: 1 },
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '120px' : 'auto',
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handlestatus(user)}
                                        sx={{
                                          color: user.isActive ? '#10b981' : '#ef4444',
                                          padding: { xs: '2px', sm: '4px' },
                                          '&:hover': {
                                            backgroundColor: user.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                          },
                                        }}
                                      >
                                        {user.isActive ? (
                                          <ToggleOn sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                                        ) : (
                                          <ToggleOff sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                                        )}
                                      </IconButton>
                                      <Chip
                                        label={user.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        sx={{
                                          backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                                          color: user.isActive ? '#166534' : '#dc2626',
                                          fontWeight: 500,
                                          fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                                          height: { xs: 18, sm: 20, md: 24 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.5, sm: 1 },
                                          },
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ 
                                    padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                                    borderBottom: '1px solid #f1f5f9',
                                    minWidth: isMobile ? '80px' : 'auto',
                                  }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                      {!filter.tenantId && HasPermission("UsersEdit") && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handleedit(user)}
                                          sx={{
                                            color: '#3b82f6',
                                            backgroundColor: '#eff6ff',
                                            padding: { xs: '4px', sm: '6px' },
                                            '&:hover': {
                                              backgroundColor: '#dbeafe',
                                            },
                                          }}
                                        >
                                          <Edit sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                                        </IconButton>
                                      )}
                                      {!filter.tenantId && HasPermission("UsersDelete") && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handledelete(user)}
                                          sx={{
                                            color: '#ef4444',
                                            backgroundColor: '#fef2f2',
                                            padding: { xs: '4px', sm: '6px' },
                                            '&:hover': {
                                              backgroundColor: '#fee2e2',
                                            },
                                          }}
                                        >
                                          <DeleteIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell 
                                  colSpan={columns.length + 1} 
                                  sx={{ 
                                    textAlign: 'center', 
                                    padding: '40px',
                                    borderBottom: 'none',
                                  }}
                                >
                                  <Paper
                                    sx={{
                                      p: 4,
                                      backgroundColor: '#f9fafb',
                                      border: '2px dashed #d1d5db',
                                      borderRadius: '12px',
                                    }}
                                  >
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        color: '#6b7280',
                                        fontWeight: 500,
                                        fontSize: { xs: '1rem', sm: '1rem', md: '1.125rem' },
                                      }}
                                    >
                                      No Users Found
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#9ca3af',
                                        mt: 1,
                                        fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.875rem' },
                                      }}
                                    >
                                      Try adjusting your search or filter criteria
                                    </Typography>
                                  </Paper>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Original Pagination */}
                      {UsersList && UsersList?.length > 0 && (
                        <div className="d-flex align-items-center justify-content-end bottom_nav">
                          <nav aria-label="Page navigation example">
                            <ul className="pagination">
                              <TablePagination
                                rowsPerPageOptions={[
                                  { label: '10', value: 10 },
                                  { label: '25', value: 25 },
                                  { label: '50', value: 50 },
                                  { label: '100', value: 100 },
                                ]}
                                component="div"
                                count={paginatedItems || 0}
                                rowsPerPage={rowsPerPage}
                                page={Math.max(0, page - 1)}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                            </ul>
                          </nav>
                        </div>
                      )}
                    </Box>
                  </>
                )}
              
                {(tabdata === "#manageroletab" || initialActiveTab === "#manageroletab") && 
                 tabdata === "#manageroletab" && <RoleList handleApihit={handleApihit} />}
              </Box>
            </Paper>
          </Container>
        </div>
      </div>
      {open && (
        <AddEditUser
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={refreshUserslistAPI}
          object={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.firstName + " " + object.lastName}
          id={object?.userId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
