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
import AddEditRole from "./AddEditRole";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import StatusDropdown from "../../../helpers/StatusDropdown";

export default function RoleList({ handleApihit }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [RolesList, setRolesList] = useState([]);
  const [permission, setPermission] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ status: "2", tenantId: "" });

  const columns = [
    { key: "roleName", label: "Role Name", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    RolelistAPI(newPage + 1, rowsPerPage, search, filter.status);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    RolelistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.status
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const RolelistAPI = async (page, perpage, serach, status) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Role, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setRolesList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setRolesList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const PermissionlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.permissionlist, {}, "GET");
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setPermission(apiResponse?.data?.data);
      } else {
        setPermission([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    RolelistAPI(1, rowsPerPage, debouncedSearch, filter.status);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  useEffect(() => {
    PermissionlistAPI();
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const refreshRolelistAPI = () => {
    let pageNo = 1;
    RolelistAPI(pageNo, rowsPerPage, search, filter.status);
    setPage(pageNo);
    setObject("");
    handleApihit();
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
        apiUrls.RoleDelete,
        { RoleId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        RolelistAPI(pageNo, rowsPerPage, search, filter.status);
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
        apiUrls.RoleActiveInActive,
        { RoleId: item.roleId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        RolelistAPI(page, rowsPerPage, search, filter.status);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    let pageNo = 1;
    RolelistAPI(pageNo, rowsPerPage, search, e.target.value);
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="d-flex align-items-center justify-content-between mb-30">
        <TableTitle title="Manage Roles" />

        <div className="heading_width_search d-flex align-items-center gap-3">
          {HasPermission("RolesAdd") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setAction("add");
                setOpen(true);
              }}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                },
              }}
            >
              Add New Role
            </Button>
          )}
        </div>
      </div>
      <div className="d-block d-md-flex align-items-center gap-2 mb-30">
        <div className="filter-dropdown dropdown">
          <Search handleSearch={handleSearch} />
        </div>
        <div className="filter-dropdown dropdown">
          <StatusDropdown value={filter.status} fn={handleChange} />
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
                          sx={{
                            color: '#9ca3af',
                            padding: '2px',
                            '&:hover': {
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            },
                          }}
                        >
                          <ArrowUpward sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Box>
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
              {RolesList && RolesList.length > 0 ? (
                RolesList.map((role, index) => (
                  <TableRow
                    key={role.roleId || index}
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
                        {role.roleName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handlestatus(role)}
                          sx={{
                            color: role.isActive ? '#10b981' : '#ef4444',
                            '&:hover': {
                              backgroundColor: role.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          {role.isActive ? (
                            <ToggleOn sx={{ fontSize: 24 }} />
                          ) : (
                            <ToggleOff sx={{ fontSize: 24 }} />
                          )}
                        </IconButton>
                        <Chip
                          label={role.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            backgroundColor: role.isActive ? '#dcfce7' : '#fee2e2',
                            color: role.isActive ? '#166534' : '#dc2626',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {HasPermission("RolesEdit") && (
                          <IconButton
                            onClick={() => handleedit(role)}
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
                        {HasPermission("RolesDelete") && (
                          <IconButton
                            onClick={() => handledelete(role)}
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
                        No Roles Found
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

        {/* Simple Vendor-style Pagination */}
        {RolesList && RolesList?.length > 0 && (
          <div className="d-flex align-items-center justify-content-end bottom_nav">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 25, 100]}
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
      {open && (
        <AddEditRole
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={refreshRolelistAPI}
          object={object}
          permission={permission}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.roleName}
          id={object?.roleId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
