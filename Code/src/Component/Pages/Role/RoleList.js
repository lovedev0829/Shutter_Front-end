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
  Card,
  CardContent,
  Stack,
  Grid,
  Container,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <ApiLoder open={loder} />
      <Container maxWidth={false} sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
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
            Manage Roles
          </Typography>
          {HasPermission("RolesAdd") && (
            <Button
              variant="contained"
              startIcon={<Add />}
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
              Add New Role
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
                <StatusDropdown value={filter.status} fn={handleChange} />
              </Grid>
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
            <Table sx={{ minWidth: isMobile ? 600 : 'auto' }}>
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
                        minWidth: isMobile ? '120px' : 'auto',
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
                            sx={{
                              color: '#9ca3af',
                              padding: '2px',
                              '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              },
                            }}
                          >
                            <ArrowUpward sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />
                          </IconButton>
                        )}
                      </Box>
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
                      <TableCell sx={{ 
                        padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                        borderBottom: '1px solid #f1f5f9',
                        minWidth: isMobile ? '120px' : 'auto',
                      }}>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: '#1f2937',
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {role.roleName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ 
                        padding: { xs: '6px 6px', sm: '8px 12px', md: '12px 16px' },
                        borderBottom: '1px solid #f1f5f9',
                        minWidth: isMobile ? '120px' : 'auto',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handlestatus(role)}
                            sx={{
                              color: role.isActive ? '#10b981' : '#ef4444',
                              padding: { xs: '2px', sm: '4px' },
                              '&:hover': {
                                backgroundColor: role.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            {role.isActive ? (
                              <ToggleOn sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                            ) : (
                              <ToggleOff sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                            )}
                          </IconButton>
                          <Chip
                            label={role.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              backgroundColor: role.isActive ? '#dcfce7' : '#fee2e2',
                              color: role.isActive ? '#166534' : '#dc2626',
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
                          {HasPermission("RolesEdit") && (
                            <IconButton
                              size="small"
                              onClick={() => handleedit(role)}
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
                          {HasPermission("RolesDelete") && (
                            <IconButton
                              size="small"
                              onClick={() => handledelete(role)}
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
                          No Roles Found
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
      </Container>

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
