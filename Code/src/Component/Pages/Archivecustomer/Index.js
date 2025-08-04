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
  Link as MuiLink
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
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
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Archive Customer" />
        <div className="body_content">
          <div className="awarded-jobs task_table">
            <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Archive Customer Tool" />
              <div className="heading_width_search d-flex align-items-center gap-3">
                <div className="red_btn">
                  Note: Only inactive customers will be archived
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mb-30">
              <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                <div className="filter-dropdown dropdown">
                  <Search handleSearch={handleSearch} />
                </div>
                <div className="filter-dropdown dropdown">
                  <StatusDropdown value={filter.status} fn={handleChange} />
                </div>
              </div>
              <Button
                variant="contained"
                onClick={() => {
                  setApproved(true);
                  setObject("");
                }}
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '8px 16px',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                Archive All Inactive
              </Button>
            </div>

            <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <TableContainer 
                component={Paper} 
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  border: '1px solid #e3f2fd',
                  maxHeight: '70vh',
                  width: '100%',
                  maxWidth: 'calc(100vw - 300px)',
                  display: 'block',
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
                <Table sx={{ minWidth: '100%', width: 'max-content', tableLayout: 'auto' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      {columns.map((val, i) => (
                        <TableCell
                          key={i}
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: '#374151',
                            borderBottom: '2px solid #e5e7eb',
                            backgroundColor: '#f8fafc',
                            padding: '16px 12px',
                            whiteSpace: 'nowrap',
                            minWidth: val.key === 'contactUniqueId' ? 120 : 
                                    val.key === 'firstName' ? 150 : 
                                    val.key === 'streetAddress' ? 180 : 
                                    val.key === 'contactType' ? 100 : 120,
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>
                                {val.label}
                              </Typography>
                              {val.sort && (
                                <IconButton
                                  size="small"
                                  onClick={() => val.sort ? handleFilterSortChange(val.key) : null}
                                  sx={{
                                    padding: '2px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    },
                                  }}
                                >
                                  {filter.sortColumn === val.key ? (
                                    filter.sortDirection === "asc" ? (
                                      <ArrowUpward sx={{ fontSize: 16, color: '#3b82f6' }} />
                                    ) : (
                                      <ArrowDownward sx={{ fontSize: 16, color: '#3b82f6' }} />
                                    )
                                  ) : (
                                    <ArrowUpward sx={{ fontSize: 16, color: '#9ca3af' }} />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                            {val.sort && (
                              <TextField
                                size="small"
                                placeholder="Search here"
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
                                    height: '32px',
                                    fontSize: '0.75rem',
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
                                    padding: '6px 8px',
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
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          {val.isArchive ? (
                            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
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

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: val.isArchive ? '#ef4444' : '#374151',
                              fontWeight: 500 
                            }}
                          >
                            {val?.firstName +
                              " " +
                              val?.lastName +
                              " " +
                              (val?.suffix ?? "")}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {val?.contactType}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {val?.billingAddressVm?.streetAddress}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {val?.billingAddressVm?.city}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {val?.billingAddressVm?.state}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {val?.billingAddressVm?.zipCode}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                            {moment(val?.createdAt).format("MM-DD-YYYY") || ""}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Chip
                            label={val?.isActive ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              backgroundColor: val?.isActive ? '#dcfce7' : '#fee2e2',
                              color: val?.isActive ? '#166534' : '#991b1b',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: '24px',
                              '& .MuiChip-label': {
                                padding: '0 8px',
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
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
                                fontSize: '0.75rem',
                                padding: '4px 12px',
                                minWidth: 'auto',
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
                            padding: '40px 20px',
                            borderBottom: 'none',
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              padding: '24px',
                              backgroundColor: '#f9fafb',
                              border: '2px dashed #d1d5db',
                              borderRadius: '12px',
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <img
                                src="/image/no-records.svg"
                                alt="No records"
                                loading="lazy"
                                style={{ width: '64px', height: '64px', opacity: 0.5 }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: '0.875rem',
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
                  justifyContent: 'flex-end', 
                  mt: 2,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  p: 1
                }}>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-toolbar': {
                        minHeight: '52px',
                      },
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: 500,
                      },
                      '& .MuiTablePagination-select': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      },
                      '& .MuiIconButton-root': {
                        color: '#6b7280',
                        '&:hover': {
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                        },
                        '&.Mui-disabled': {
                          color: '#d1d5db',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </div>
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
