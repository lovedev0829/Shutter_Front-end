import { Link } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
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
  Button,
  TextField,
  IconButton,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  Divider,
  Alert
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Archive } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import StatusDropdown from "../../../helpers/StatusDropdown";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import moment from "moment";
import ArchivePopup from "./ArchivePopup";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    status: "2",
    tenantId: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(
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
    TenantlistAPI(
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
  const TenantlistAPI = async (
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
      tenantId: tenantId ? tenantId : "",
      status: status ? status : 2,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllArchiveContacts,
        {},
        "POST",
        query
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  useEffect(() => {
    TenantlistAPI(
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
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(
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

  const handledelclosee = () => {
    setApproved(false);
    setObject("");
  };

  const handlestatus = async (archiveType) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.ArchiveContacts, {}, "POST", {
        contactId: object.contactId ? object.contactId : null,
        status: true,
        archiveType: archiveType,
      });
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI(
          page,
          rowsPerPage,
          search,
          filter.tenantId,
           filter.status,
          filter.sortColumn,
          filter.sortDirection,
          filter.columnFilters
        );
        setObject("");
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
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
      1,
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

  const columns = [
    { key: "contactUniqueId", label: "Customer ID", sort: true },
    { key: "firstName", label: "Name", sort: true },
    { key: "contactType", label: "Type", sort: true },
    { key: "streetAddress", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State"},
    { key: "zipCode", label: "Zip Code" },
    { key: "createdAt", label: "Created Date" },
    { key: "isActive", label: "Status" },
    { key: "isActive", label: "Action" },
  ];

  return (
    <>
      <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Archive Customer" />
        <div className="body_content">
          <Container 
            maxWidth={false}
            sx={{ 
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
              maxWidth: '100%'
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: isMobile ? 3 : 4 }}>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'stretch' : 'center'}
                spacing={isMobile ? 2 : 3}
                sx={{ mb: 3 }}
              >
                <Box>
                  <TableTitle title="Archive Customer Tool" />
                </Box>
                
                <Alert 
                  severity="warning" 
                  variant={isMobile ? "filled" : "outlined"}
                  sx={{
                    minWidth: isMobile ? '100%' : 'auto',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    py: isMobile ? 0.5 : 1,
                    '& .MuiAlert-message': {
                      fontSize: 'inherit',
                      fontWeight: 500,
                    },
                    backgroundColor: isMobile ? '#fef3c7' : 'transparent',
                    color: isMobile ? '#92400e' : '#d97706',
                    borderColor: '#f59e0b',
                  }}
                >
                  Note: Only inactive customers will be archived
                </Alert>
              </Stack>

              {/* Filters and Actions Section */}
              <Stack
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'stretch' : 'center'}
                spacing={isMobile ? 2 : 3}
              >
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={isMobile ? 1.5 : 2}
                  sx={{ 
                    width: isMobile ? '100%' : 'auto',
                    minWidth: isMobile ? 'unset' : '400px'
                  }}
                >
                  <Box sx={{ flex: isMobile ? 1 : 'unset', minWidth: isMobile ? 'unset' : '200px' }}>
                    <Search handleSearch={handleSearch} />
                  </Box>
                  <Box sx={{ flex: isMobile ? 1 : 'unset', minWidth: isMobile ? 'unset' : '150px' }}>
                    <StatusDropdown value={filter.status} fn={handleChange} />
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<Archive />}
                  onClick={() => {
                    setApproved(true);
                    setObject("");
                  }}
                  size={isMobile ? 'large' : 'medium'}
                  sx={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: isMobile ? '0.875rem' : '0.9375rem',
                    padding: isMobile ? '12px 20px' : '10px 16px',
                    minHeight: isMobile ? '48px' : '40px',
                    width: isMobile ? '100%' : 'auto',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                    },
                  }}
                >
                  Archive All Inactive
                </Button>
              </Stack>
            </Box>

            {/* Table Section */}
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: '100%', 
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <TableContainer 
                component={Paper} 
                sx={{
                  borderRadius: isMobile ? '8px' : '12px',
                  boxShadow: isMobile 
                    ? '0 2px 12px rgba(0, 0, 0, 0.08)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  border: '1px solid #e3f2fd',
                  maxHeight: isMobile ? '60vh' : '70vh',
                  width: '100%',
                  maxWidth: isMobile 
                    ? '100vw' 
                    : isTablet 
                      ? 'calc(100vw - 200px)' 
                      : 'calc(100vw - 300px)',
                  display: 'block',
                  '&::-webkit-scrollbar': {
                    height: isMobile ? '6px' : '8px',
                    width: isMobile ? '6px' : '8px',
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
                    minWidth: isMobile ? '800px' : '100%', 
                    width: 'max-content', 
                    tableLayout: 'auto' 
                  }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      {columns.map((val, i) => (
                        <TableCell
                          key={i}
                          sx={{
                            fontWeight: 700,
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            color: '#374151',
                            borderBottom: '2px solid #e5e7eb',
                            backgroundColor: '#f8fafc',
                            padding: isMobile ? '12px 8px' : '16px 12px',
                            whiteSpace: 'nowrap',
                            minWidth: isMobile 
                              ? (val.key === 'contactUniqueId' ? 100 : 
                                 val.key === 'firstName' ? 120 : 
                                 val.key === 'streetAddress' ? 140 : 
                                 val.key === 'contactType' ? 80 : 90)
                              : (val.key === 'contactUniqueId' ? 120 : 
                                 val.key === 'firstName' ? 150 : 
                                 val.key === 'streetAddress' ? 180 : 
                                 val.key === 'contactType' ? 100 : 120),
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.5 : 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: '#374151',
                                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                                  lineHeight: isMobile ? 1.3 : 1.2,
                                }}
                              >
                                {val.label}
                              </Typography>
                              {val.sort && (
                                <IconButton
                                  size="small"
                                  onClick={() => val.sort ? handleFilterSortChange(val.key) : null}
                                  sx={{
                                    padding: isMobile ? '1px' : '2px',
                                    minWidth: isMobile ? '20px' : '24px',
                                    minHeight: isMobile ? '20px' : '24px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    },
                                  }}
                                >
                                  {filter.sortColumn === val.key ? (
                                    filter.sortDirection === "asc" ? (
                                      <ArrowUpward sx={{ fontSize: isMobile ? 12 : 16, color: '#3b82f6' }} />
                                    ) : (
                                      <ArrowDownward sx={{ fontSize: isMobile ? 12 : 16, color: '#3b82f6' }} />
                                    )
                                  ) : (
                                    <ArrowUpward sx={{ fontSize: isMobile ? 12 : 16, color: '#9ca3af' }} />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                            {val.sort && (
                              <TextField
                                size="small"
                                placeholder={isMobile ? "Search" : "Search here"}
                                value={
                                  filter.columnFilters.find(
                                    (f) => f.field === val.key
                                  )?.value || ""
                                }
                                onChange={(e) =>
                                  handlesearchChange(val.key, e.target.value)
                                }
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: isMobile ? '28px' : '32px',
                                    fontSize: isMobile ? '0.6875rem' : '0.75rem',
                                    backgroundColor: 'white',
                                    '& fieldset': {
                                      borderColor: '#d1d5db',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#3b82f6',
                                    },
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    padding: isMobile ? '4px 6px' : '6px 8px',
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenantList?.map((val, i) => (
                      <TableRow 
                        key={i}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: '#fafbfc',
                          },
                          '&:hover': {
                            backgroundColor: '#f0f9ff',
                            transform: isMobile ? 'none' : 'translateY(-1px)',
                            boxShadow: isMobile ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          {val.isArchive ? (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6b7280', 
                                fontWeight: 500,
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                                lineHeight: isMobile ? 1.3 : 1.2,
                              }}
                            >
                              {val?.contactUniqueId}
                            </Typography>
                          ) : (
                            <MuiLink
                              component={Link}
                              onClick={() => {
                                localStorage.setItem(
                                  "activeTab2",
                                  "#pills-overview"
                                );
                              }}
                              to={`/contacts/detail/${val.contactId}`}
                              sx={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                                lineHeight: isMobile ? 1.3 : 1.2,
                                '&:hover': {
                                  color: '#1d4ed8',
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {val?.contactUniqueId}
                            </MuiLink>
                          )}
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: val.isArchive ? '#ef4444' : '#374151',
                              fontWeight: 500,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {val?.firstName +
                              " " +
                              val?.lastName +
                              " " +
                              (val?.suffix ?? "")}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {val?.contactType}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                              maxWidth: isMobile ? '120px' : 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {val?.billingAddressVm?.streetAddress}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {val?.billingAddressVm?.city}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {val?.billingAddressVm?.state}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {val?.billingAddressVm?.zipCode}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280', 
                              fontWeight: 500,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {moment(val?.createdAt).format("MM-DD-YYYY") || ""}
                          </Typography>
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          <Chip
                            label={val?.isActive ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              backgroundColor: val?.isActive ? '#dcfce7' : '#fee2e2',
                              color: val?.isActive ? '#166534' : '#991b1b',
                              fontWeight: 600,
                              fontSize: isMobile ? '0.6875rem' : '0.75rem',
                              height: isMobile ? '20px' : '24px',
                              '& .MuiChip-label': {
                                padding: isMobile ? '0 6px' : '0 8px',
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell 
                          sx={{ 
                            padding: isMobile ? '8px 6px' : '12px', 
                            borderBottom: '1px solid #e5e7eb' 
                          }}
                        >
                          {!val.isArchive && !val?.isActive && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setApproved(true);
                                setObject(val);
                              }}
                              sx={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '6px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: isMobile ? '0.6875rem' : '0.75rem',
                                padding: isMobile ? '3px 8px' : '4px 12px',
                                minWidth: 'auto',
                                minHeight: isMobile ? '24px' : '28px',
                                boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                  backgroundColor: '#2563eb',
                                  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                                },
                              }}
                            >
                              Archive
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!tenantList || tenantList?.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          sx={{
                            textAlign: 'center',
                            padding: isMobile ? '24px 16px' : '40px 20px',
                            borderBottom: 'none',
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              padding: isMobile ? '16px' : '24px',
                              backgroundColor: '#f9fafb',
                              border: '2px dashed #d1d5db',
                              borderRadius: isMobile ? '8px' : '12px',
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 1.5 : 2 }}>
                              <img
                                src="/image/no-records.svg"
                                alt="No records"
                                loading="lazy"
                                style={{ 
                                  width: isMobile ? '48px' : '64px', 
                                  height: isMobile ? '48px' : '64px', 
                                  opacity: 0.5 
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                                  lineHeight: isMobile ? 1.3 : 1.2,
                                }}
                              >
                                No Archive Customer Found
                              </Typography>
                            </Box>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {tenantList && tenantList?.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: isMobile ? 'center' : 'flex-end', 
                  mt: isMobile ? 2 : 3,
                  backgroundColor: 'white',
                  borderRadius: isMobile ? '6px' : '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  p: isMobile ? 0.5 : 1
                }}>
                  <TablePagination
                    rowsPerPageOptions={isMobile ? [10, 25, 50] : [10, 25, 50, 100]}
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-toolbar': {
                        minHeight: isMobile ? '48px' : '52px',
                        padding: isMobile ? '0 8px' : '0 16px',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                      },
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        color: '#374151',
                        fontWeight: 500,
                        marginBottom: isMobile ? '4px' : '0',
                      },
                      '& .MuiTablePagination-select': {
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        fontWeight: 500,
                      },
                      '& .MuiTablePagination-actions': {
                        marginLeft: isMobile ? '8px' : '16px',
                      },
                      '& .MuiIconButton-root': {
                        color: '#6b7280',
                        padding: isMobile ? '6px' : '8px',
                        '&:hover': {
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                        },
                        '&.Mui-disabled': {
                          color: '#d1d5db',
                        },
                      },
                      '& .MuiTablePagination-spacer': {
                        display: isMobile ? 'none' : 'flex',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Container>
        </div>
      </div>
      <ArchivePopup
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        loder={loder}
        object={object}
        title={`You want to Archive (${
          object.firstName
            ? object?.firstName +
              " " +
              object?.lastName +
              " " +
              (object?.suffix ?? "")
            : "All Inactive"
        }) Customer?`}
        subtitle={"Please click the Confirm button to Archive the Customer."}
      />
    </>
  );
}
