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
} from "@mui/material";
import { 
  Edit,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  ToggleOn,
  ToggleOff,
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

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Users Admin" />
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
              {Tablist.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.svg}
                  label={tab.title}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tabdata === "#manageapplication" && (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-30">
                        <TableTitle title="Manage Application Users" />
                        <div className="heading_width_search d-flex align-items-center gap-3">
                          {!filter.tenantId && (
                            <>
                              {HasPermission("UsersAdd") && (
                                <AddEditButton
                                  handleClick={() => {
                                    setAction("add");
                                    setOpen(true);
                                  }}
                                  title="Add New User"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                        <div className="filter-dropdown dropdown">
                          <Search handleSearch={handleSearch} />
                        </div>
                        <div className="filter-dropdown dropdown">
                          <StatusDropdown
                            value={filter.status}
                            fn={handleChange}
                          />
                        </div>
                        <div className="filter-dropdown dropdown">
                          {HasPermission("SubTenantView") && (
                            <PartnerDropdown
                              value={filter.tenantId}
                              fn={handleChange}
                            />
                          )}
                        </div>
                      </div>

                      <Box sx={{ mt: 3 }}>
                        {/* Modern Material UI Table */}
                        <TableContainer 
                          component={Paper} 
                          sx={{ 
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9',
                          }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                {columns.map((column) => (
                                  <TableCell
                                    key={column.key}
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.875rem',
                                      color: '#374151',
                                      borderBottom: '2px solid #e5e7eb',
                                      padding: '16px',
                                      position: 'relative',
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
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
                                            <ArrowDownward sx={{ fontSize: 16 }} />
                                          ) : (
                                            <ArrowUpward sx={{ fontSize: 16 }} />
                                          )}
                                        </IconButton>
                                      )}
                                    </Box>
                                    {/* Search Field for each column */}
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
                                          fontSize: '0.75rem',
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
                                          padding: '6px 8px',
                                          fontSize: '0.75rem',
                                        },
                                      }}
                                    />
                                  </TableCell>
                                ))}
                                <TableCell
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    color: '#374151',
                                    borderBottom: '2px solid #e5e7eb',
                                    padding: '16px',
                                    textAlign: 'center',
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
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                                        {user.firstName} {user.lastName}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Typography sx={{ color: '#6b7280' }}>
                                        {user.email}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Typography sx={{ color: '#6b7280' }}>
                                        {user.phone || '-'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Typography sx={{ color: '#6b7280' }}>
                                        {user.ghlUserName || '-'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Chip
                                        label={user.roleName || 'No Role'}
                                        size="small"
                                        sx={{
                                          backgroundColor: user.roleName ? '#dbeafe' : '#f3f4f6',
                                          color: user.roleName ? '#1e40af' : '#6b7280',
                                          fontWeight: 500,
                                          fontSize: '0.75rem',
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton
                                          onClick={() => handlestatus(user)}
                                          sx={{
                                            color: user.isActive ? '#10b981' : '#ef4444',
                                            '&:hover': {
                                              backgroundColor: user.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            },
                                          }}
                                        >
                                          {user.isActive ? (
                                            <ToggleOn sx={{ fontSize: 24 }} />
                                          ) : (
                                            <ToggleOff sx={{ fontSize: 24 }} />
                                          )}
                                        </IconButton>
                                        <Chip
                                          label={user.isActive ? 'Active' : 'Inactive'}
                                          size="small"
                                          sx={{
                                            backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                                            color: user.isActive ? '#166534' : '#dc2626',
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                          }}
                                        />
                                      </Box>
                                    </TableCell>
                                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        {!filter.tenantId && HasPermission("UsersEdit") && (
                                          <IconButton
                                            onClick={() => handleedit(user)}
                                            sx={{
                                              color: '#3b82f6',
                                              backgroundColor: '#eff6ff',
                                              '&:hover': {
                                                backgroundColor: '#dbeafe',
                                              },
                                            }}
                                          >
                                            <Edit sx={{ fontSize: 18 }} />
                                          </IconButton>
                                        )}
                                        {!filter.tenantId && HasPermission("UsersDelete") && (
                                          <IconButton
                                            onClick={() => handledelete(user)}
                                            sx={{
                                              color: '#ef4444',
                                              backgroundColor: '#fef2f2',
                                              '&:hover': {
                                                backgroundColor: '#fee2e2',
                                              },
                                            }}
                                          >
                                            <DeleteIcon sx={{ fontSize: 18 }} />
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
                                        }}
                                      >
                                        No Users Found
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: '#9ca3af',
                                          mt: 1,
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
                        {/* Modern Pagination */}
                        {UsersList && UsersList?.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            mt: 3,
                            p: 2,
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f1f5f9',
                            position: 'relative',
                            minHeight: '60px',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                              borderRadius: '12px 12px 0 0',
                            }
                          }}>
                            {/* Compact Results Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                              }}>
                                <Typography sx={{ 
                                  color: 'white', 
                                  fontWeight: 700, 
                                  fontSize: '0.75rem'
                                }}>
                                  {UsersList.length}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#1e293b',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                }}
                              >
                                {(() => {
                                  if (!UsersList || UsersList.length === 0) {
                                    return `No users found`;
                                  }
                                  const startItem = ((page - 1) * rowsPerPage) + 1;
                                  const actualItemsOnPage = UsersList.length;
                                  const endItem = ((page - 1) * rowsPerPage) + actualItemsOnPage;
                                  return `${startItem} - ${endItem} of ${paginatedItems} users`;
                                })()}
                              </Typography>
                            </Box>

                            {/* Compact Pagination */}
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
                              labelRowsPerPage="Show:"
                              sx={{
                                '& .MuiTablePagination-toolbar': {
                                  minHeight: '44px',
                                  padding: '0 4px',
                                  alignItems: 'baseline',
                                },
                                '& .MuiTablePagination-selectLabel': {
                                  fontSize: '0.8rem',
                                  color: '#374151',
                                  fontWeight: 600,
                                  marginRight: '6px',
                                },
                                '& .MuiTablePagination-displayedRows': {
                                  fontSize: '0.8rem',
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  margin: '0 12px',
                                },
                                '& .MuiTablePagination-select': {
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  backgroundColor: '#f8fafc',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  padding: '4px 24px 4px 8px',
                                  minWidth: '60px',
                                  height: '32px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    borderColor: '#3b82f6',
                                    backgroundColor: '#f1f5f9',
                                  },
                                  '&:focus': {
                                    borderColor: '#3b82f6',
                                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
                                  },
                                },
                                '& .MuiSelect-icon': {
                                  color: '#6b7280',
                                  fontSize: '16px',
                                  right: '6px',
                                },
                                '& .MuiIconButton-root': {
                                  width: '32px',
                                  height: '32px',
                                  color: '#6b7280',
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  margin: '0 2px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: '#3b82f6',
                                    borderColor: '#3b82f6',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#f1f5f9',
                                    borderColor: '#e2e8f0',
                                    color: '#cbd5e1',
                                    transform: 'none',
                                    boxShadow: 'none',
                                  },
                                },
                              }}
                              />
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
              
              {(tabdata === "#manageroletab" || initialActiveTab === "#manageroletab") && 
               tabdata === "#manageroletab" && <RoleList handleApihit={handleApihit} />}
            </Box>
          </Paper>
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
