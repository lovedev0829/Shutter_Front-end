import React, { useEffect } from "react";
import { useState } from "react";
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
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  Add,
  Search as SearchIcon,
  ToggleOn,
  ToggleOff,
  ExpandMore,
  FilterList,
} from "@mui/icons-material";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../../helpers/common";
import { useDebounce } from "use-debounce";
import { callAPI } from "../../../../utils/apiUtils";
import { apiUrls } from "../../../../utils/apiUrls";
import TableTitle from "../../../Form/TableTitle";
import Search from "../../../Form/Search";
import StatusDropdown from "../../../../helpers/StatusDropdown";
import AddEditGroupTax from "./AddEditGroupTax";

export default function Taxgrouplist() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [grouptaxList, setgrouptaxList] = useState([]);
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

  const columns = [
    { key: "groupName", label: "Group Name", sort: true },
    { key: "taxAuthorityName", label: "Tax" },
    { key: "isActive", label: "Status" },
  ];
  const handleSearch = (value) => {
    setsearch(value);
  };
  const handleChangePage = (event, newPage) => {
    TaxGrouplistAPI(
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
    TaxGrouplistAPI(
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
  const TaxGrouplistAPI = async (
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
      const apiResponse = await callAPI(apiUrls.TaxGroup, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setgrouptaxList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setgrouptaxList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    TaxGrouplistAPI(
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

  const TaxGrouplistAPIRefreshapi = () => {
    let pageNo = 1;
    TaxGrouplistAPI(
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
    if (item?.vendorOrderItems?.length === 0) {
      const data = { ...item };
      data?.vendorOrderItems.push({
        materialId: "",
        quantity: "",
        unitPrice: "",
      });
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
        apiUrls.TaxGroupDelete,
        { id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TaxGrouplistAPI(
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
        apiUrls.TaxGroupActiveInActive,
        { id: item.id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TaxGrouplistAPI(
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
    TaxGrouplistAPI(
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

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    TaxGrouplistAPI(
      1,
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
      <>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          <TableTitle title="Manage Tax Groups" />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {HasPermission("TaxGroupAdd") && (
              <Button
                variant="contained"
                startIcon={isMobile ? null : <Add />}
                onClick={() => {
                  setAction("add");
                  setOpen(true);
                }}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                  },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.5, sm: 1 },
                  minWidth: { xs: "auto", sm: "auto" },
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.25)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Add Tax Group
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 3 }}>
          <Accordion
            defaultExpanded={!isMobile}
            sx={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px !important",
              "&:before": { display: "none" },
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMore
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                />
              }
              sx={{
                backgroundColor: "#f8fafc",
                minHeight: { xs: 44, sm: 48, md: 56 },
                px: { xs: 2, sm: 3 },
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                  margin: { xs: "8px 0", sm: "12px 0" },
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "#3b82f6",
                },
              }}
            >
              <FilterList
                sx={{
                  color: "#3b82f6",
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  color: "#1e293b",
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
                  <StatusDropdown value={filter.status} fn={handleChange} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Modern Table Section */}
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              overflow: "auto",
              border: "1px solid #e3f2fd",
              maxHeight: "70vh",
              width: "100%",
              "&::-webkit-scrollbar": {
                height: "8px",
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f5f9",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#94a3b8",
                },
              },
            }}
          >
            <Table
              sx={{ minWidth: { xs: 800, sm: 1000, md: 1200 } }}
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.875rem",
                          md: "1rem",
                        },
                        color: "#1e293b",
                        borderBottom: "2px solid #e2e8f0",
                        py: { xs: 1, sm: 2 },
                        px: { xs: 1, sm: 2 },
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        minWidth: {
                          xs: "100px",
                          sm: "120px",
                          md: "auto",
                        },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="inherit"
                          sx={{
                            fontWeight: 700,
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.875rem",
                              md: "1rem",
                            },
                          }}
                        >
                          {column.label}
                        </Typography>
                        {column.sort && (
                          <IconButton
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handleFilterSortChange(column.key)}
                            sx={{
                              color:
                                filter.sortColumn === column.key
                                  ? "#3b82f6"
                                  : "#94a3b8",
                              "&:hover": { color: "#3b82f6" },
                              p: { xs: 0.5, sm: 1 },
                            }}
                          >
                            {filter.sortColumn === column.key &&
                            filter.sortDirection === "desc" ? (
                              <ArrowDownward
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            ) : (
                              <ArrowUpward
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            )}
                          </IconButton>
                        )}
                      </Box>
                      {column.sort && (
                        <TextField
                          size={isMobile ? "small" : "small"}
                          placeholder={`Search ${column.label.toLowerCase()}...`}
                          variant="outlined"
                          onChange={(e) =>
                            handlesearchChange(column.key, e.target.value)
                          }
                          value={
                            filter.columnFilters?.find(
                              (f) => f.field === column.key
                            )?.value || ""
                          }
                          sx={{
                            mt: 1,
                            minWidth: {
                              xs: "80px",
                              sm: "100px",
                              md: "150px",
                            },
                            maxWidth: {
                              xs: "120px",
                              sm: "150px",
                              md: "none",
                            },
                            "& .MuiOutlinedInput-root": {
                              height: {
                                xs: "24px",
                                sm: "28px",
                                md: "32px",
                              },
                              fontSize: {
                                xs: "0.625rem",
                                sm: "0.6875rem",
                                md: "0.75rem",
                              },
                              borderRadius: "6px",
                              backgroundColor: "white",
                              "& input": {
                                py: { xs: "2px", sm: "4px" },
                                px: { xs: "6px", sm: "8px" },
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3b82f6",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#3b82f6",
                                },
                            },
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      backgroundColor: "#f8fafc",
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.875rem",
                        md: "1rem",
                      },
                      color: "#1e293b",
                      borderBottom: "2px solid #e2e8f0",
                      py: { xs: 1, sm: 2 },
                      px: { xs: 1, sm: 2 },
                      position: "sticky",
                      top: 0,
                      zIndex: 3,
                      textAlign: "center",
                      minWidth: {
                        xs: "80px",
                        sm: "100px",
                        md: "auto",
                      },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grouptaxList && grouptaxList.length > 0 ? (
                  grouptaxList.map((vendor, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#fafbfc",
                        },
                        "&:hover": {
                          backgroundColor: "#f1f5f9",
                          transform: "scale(1.001)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 0.5, sm: 1, md: 2 },
                          px: { xs: 0.5, sm: 1, md: 2 },
                          minWidth: {
                            xs: "100px",
                            sm: "120px",
                            md: "auto",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: {
                              xs: "0.6875rem",
                              sm: "0.75rem",
                              md: "0.875rem",
                            },
                          }}
                        >
                          <Box component="span" sx={{ color: "#5476df" }}>
                            {vendor.groupName}
                          </Box>
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          py: { xs: 0.5, sm: 1, md: 2 },
                          px: { xs: 0.5, sm: 1, md: 2 },
                          minWidth: {
                            xs: "70px",
                            sm: "80px",
                            md: "auto",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#059669",
                            fontSize: {
                              xs: "0.6875rem",
                              sm: "0.75rem",
                              md: "0.875rem",
                            },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Box>
                            {vendor?.taxes?.map((opt, optIndex) => (
                              <Chip
                                key={optIndex}
                                label={`${opt.taxName} ($${opt.taxRate})`}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          py: { xs: 0.5, sm: 1, md: 2 },
                          px: { xs: 0.5, sm: 1, md: 2 },
                          minWidth: {
                            xs: "80px",
                            sm: "100px",
                            md: "auto",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.5, sm: 1 },
                          }}
                        >
                          <IconButton
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handlestatus(vendor)}
                            sx={{
                              color: vendor.isActive ? "#16a34a" : "#94a3b8",
                              "&:hover": {
                                backgroundColor: vendor.isActive
                                  ? "#f0fdf4"
                                  : "#f8fafc",
                              },
                              p: { xs: 0.5, sm: 1 },
                            }}
                          >
                            {vendor.isActive ? (
                              <ToggleOn
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            ) : (
                              <ToggleOff
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            )}
                          </IconButton>
                          <Chip
                            label={vendor.isActive ? "Active" : "Inactive"}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              backgroundColor: vendor.isActive
                                ? "#dcfce7"
                                : "#f1f5f9",
                              color: vendor.isActive ? "#16a34a" : "#64748b",
                              fontWeight: 600,
                              fontSize: {
                                xs: "0.5625rem",
                                sm: "0.625rem",
                                md: "0.75rem",
                              },
                              height: {
                                xs: "20px",
                                sm: "24px",
                                md: "32px",
                              },
                              "& .MuiChip-label": {
                                px: { xs: 0.5, sm: 1 },
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 0.5, sm: 1, md: 2 },
                          px: { xs: 0.5, sm: 1, md: 2 },
                          textAlign: "center",
                          minWidth: {
                            xs: "70px",
                            sm: "80px",
                            md: "auto",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: { xs: 0.5, sm: 1 },
                            justifyContent: "center",
                          }}
                        >
                          {HasPermission("TaxGroupEdit") && (
                            <IconButton
                              size={isMobile ? "small" : "medium"}
                              onClick={() => handleedit(vendor)}
                              sx={{
                                color: "#3b82f6",
                                backgroundColor: "#eff6ff",
                                p: { xs: 0.5, sm: 1 },
                                "&:hover": {
                                  backgroundColor: "#dbeafe",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <Edit fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          )}
                          {HasPermission("TaxGroupDelete") && (
                            <IconButton
                              size={isMobile ? "small" : "medium"}
                              onClick={() => handledelete(vendor)}
                              sx={{
                                color: "#ef4444",
                                backgroundColor: "#fef2f2",
                                p: { xs: 0.5, sm: 1 },
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <DeleteIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
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
                      sx={{ textAlign: "center", py: 6 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#64748b", fontWeight: 600 }}
                        >
                          No Tax Group found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          Try adjusting your search criteria or add a new Tax
                          Group
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Simple taxauthority-style Pagination */}
          {grouptaxList && grouptaxList?.length > 0 && (
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
      </>

      {/* Modals */}
      {open && (
        <AddEditGroupTax
          open={open}
          handleclose={handleclose}
          action={action}
          TaxGrouplistAPI={TaxGrouplistAPIRefreshapi}
          object={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object?.groupName}
          id={object?.id}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
