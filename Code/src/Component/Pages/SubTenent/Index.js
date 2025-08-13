import React, { useEffect } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
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
  Button,
  TextField,
  IconButton,
  Avatar,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Edit,
  Delete as DeleteIcon,
  ToggleOn,
  ToggleOff,
  Business,
  Sync,
} from "@mui/icons-material";
import AddEditSubTenent from "./AddEditSubTenent";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import StatusDropdown from "../../../helpers/StatusDropdown";
import { Link } from "react-router-dom";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [subtenantList, setsubtenantList] = useState([]);
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
    { key: "logo", label: "Logo" },
    { key: "primaryColor", label: "Site Color" },
    { key: "companyName", label: "Company Name", sort: true },
    { key: "firstName", label: "Name", sort: true },
    { key: "email", label: "Email", sort: true },
    { key: "code", label: "Code", sort: true },
    { key: "markup", label: "Markup", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    SubTenantlistAPI(
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
    SubTenantlistAPI(
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
  const SubTenantlistAPI = async (
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
      const apiResponse = await callAPI(apiUrls.SubTenant, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setsubtenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setsubtenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    SubTenantlistAPI(
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
    setObject("");
  };

  const refreshSubTenantlistAPI = () => {
    let pageNo = 1;
    SubTenantlistAPI(
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
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.SubTenantDelete,
        { TenantId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        SubTenantlistAPI(
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
        apiUrls.SubTenantActiveInActive,
        { TenantId: item.tenantId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        SubTenantlistAPI(
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
    SubTenantlistAPI(
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

    SubTenantlistAPI(
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
      <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Partners" />
        <div className="body_content">
          <Container
            maxWidth={false}
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
              maxWidth: "100%",
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: isMobile ? 3 : 4 }}>
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "stretch" : "center"}
                spacing={isMobile ? 2 : 3}
                sx={{ mb: 3 }}
              >
                <Box>
                  <TableTitle title="Manage Partners" />
                </Box>

                {HasPermission("SubTenantAdd") && (
                  <Box sx={{ width: isMobile ? "100%" : "auto" }}>
                    <AddEditButton
                      handleClick={() => {
                        setAction("add");
                        setOpen(true);
                      }}
                      title="Add New Partners"
                    />
                  </Box>
                )}
              </Stack>

              {/* Filters Section */}
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={isMobile ? 1.5 : 2}
                sx={{
                  width: "100%",
                  maxWidth: isMobile ? "100%" : "500px",
                }}
              >
                <Box sx={{ flex: 1, minWidth: isMobile ? "unset" : "200px" }}>
                  <Search handleSearch={handleSearch} />
                </Box>
                <Box sx={{ flex: 1, minWidth: isMobile ? "unset" : "150px" }}>
                  <StatusDropdown value={filter.status} fn={handleChange} />
                </Box>
              </Stack>
            </Box>

            {/* Table Section */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: isMobile ? "8px" : "12px",
                  boxShadow: isMobile
                    ? "0 2px 12px rgba(0, 0, 0, 0.08)"
                    : "0 4px 20px rgba(0, 0, 0, 0.08)",
                  overflowX: "auto",
                  overflowY: "hidden",
                  border: "1px solid #e3f2fd",
                  maxHeight: isMobile ? "60vh" : "70vh",
                  width: "100%",
                  maxWidth: isMobile
                    ? "100vw"
                    : isTablet
                    ? "calc(100vw - 200px)"
                    : "calc(100vw - 300px)",
                  display: "block",
                  "&::-webkit-scrollbar": {
                    height: isMobile ? "6px" : "8px",
                    width: isMobile ? "6px" : "8px",
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
                  sx={{
                    minWidth: isMobile ? "900px" : "100%",
                    width: "max-content",
                    tableLayout: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      {columns.map((column, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            fontWeight: 700,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                            backgroundColor: "#f8fafc",
                            padding: isMobile ? "12px 8px" : "16px 12px",
                            whiteSpace: "nowrap",
                            minWidth: isMobile
                              ? column.key === "logo"
                                ? 60
                                : column.key === "primaryColor"
                                ? 80
                                : column.key === "companyName"
                                ? 140
                                : column.key === "firstName"
                                ? 120
                                : column.key === "email"
                                ? 160
                                : 100
                              : column.key === "logo"
                              ? 80
                              : column.key === "primaryColor"
                              ? 100
                              : column.key === "companyName"
                              ? 180
                              : column.key === "firstName"
                              ? 150
                              : column.key === "email"
                              ? 200
                              : 120,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: isMobile ? 0.5 : 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#374151",
                                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                                  lineHeight: isMobile ? 1.3 : 1.2,
                                }}
                              >
                                {column.label}
                              </Typography>
                              {column.sort && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleFilterSortChange(column.key)
                                  }
                                  sx={{
                                    padding: isMobile ? "1px" : "2px",
                                    minWidth: isMobile ? "20px" : "24px",
                                    minHeight: isMobile ? "20px" : "24px",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(59, 130, 246, 0.1)",
                                    },
                                  }}
                                >
                                  {filter.sortColumn === column.key ? (
                                    filter.sortDirection === "asc" ? (
                                      <ArrowUpward
                                        sx={{
                                          fontSize: isMobile ? 12 : 16,
                                          color: "#3b82f6",
                                        }}
                                      />
                                    ) : (
                                      <ArrowDownward
                                        sx={{
                                          fontSize: isMobile ? 12 : 16,
                                          color: "#3b82f6",
                                        }}
                                      />
                                    )
                                  ) : (
                                    <ArrowUpward
                                      sx={{
                                        fontSize: isMobile ? 12 : 16,
                                        color: "#9ca3af",
                                      }}
                                    />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                            {column.sort && (
                              <TextField
                                size="small"
                                placeholder={
                                  isMobile ? "Search" : "Search here"
                                }
                                value={
                                  filter.columnFilters.find(
                                    (f) => f.field === column.key
                                  )?.value || ""
                                }
                                onChange={(e) =>
                                  handlesearchChange(column.key, e.target.value)
                                }
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "28px" : "32px",
                                    fontSize: isMobile
                                      ? "0.6875rem"
                                      : "0.75rem",
                                    backgroundColor: "white",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                    },
                                  },
                                  "& .MuiOutlinedInput-input": {
                                    padding: isMobile ? "4px 6px" : "6px 8px",
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      ))}
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          color: "#374151",
                          borderBottom: "2px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          padding: isMobile ? "12px 8px" : "16px 12px",
                          whiteSpace: "nowrap",
                          minWidth: isMobile ? 120 : 150,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "#374151",
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          }}
                        >
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subtenantList?.map((partner, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#fafbfc",
                          },
                          "&:hover": {
                            backgroundColor: "#f0f9ff",
                            transform: isMobile ? "none" : "translateY(-1px)",
                            boxShadow: isMobile
                              ? "none"
                              : "0 2px 8px rgba(0, 0, 0, 0.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {partner.logo ? (
                            <Avatar
                              src={partner.logo}
                              alt={partner.companyName}
                              sx={{
                                width: isMobile ? 32 : 40,
                                height: isMobile ? 32 : 40,
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: isMobile ? 32 : 40,
                                height: isMobile ? 32 : 40,
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                              }}
                            >
                              <Business sx={{ fontSize: isMobile ? 16 : 20 }} />
                            </Avatar>
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {partner.primaryColor ? (
                            <Box
                              sx={{
                                width: isMobile ? 24 : 32,
                                height: isMobile ? 24 : 32,
                                backgroundColor: partner.primaryColor,
                                borderRadius: "6px",
                                border: "2px solid #e5e7eb",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#9ca3af",
                                fontSize: isMobile ? "0.6875rem" : "0.75rem",
                              }}
                            >
                              No Color
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#374151",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {partner.companyName}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#374151",
                              fontWeight: 500,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {partner.firstName} {partner.lastName}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              lineHeight: isMobile ? 1.3 : 1.2,
                              maxWidth: isMobile ? "140px" : "none",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {partner.email}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Chip
                            label={partner.code}
                            size="small"
                            sx={{
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.6875rem" : "0.75rem",
                              height: isMobile ? "20px" : "24px",
                              fontFamily: "monospace",
                              "& .MuiChip-label": {
                                padding: isMobile ? "0 6px" : "0 8px",
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#059669",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              lineHeight: isMobile ? 1.3 : 1.2,
                            }}
                          >
                            {partner.markup}%
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: isMobile ? 0.5 : 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handlestatus(partner)}
                              sx={{
                                color: partner.isActive ? "#16a34a" : "#dc2626",
                                padding: isMobile ? "4px" : "6px",
                                "&:hover": {
                                  backgroundColor: partner.isActive
                                    ? "rgba(34, 197, 94, 0.1)"
                                    : "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              {partner.isActive ? (
                                <ToggleOn
                                  sx={{ fontSize: isMobile ? 16 : 20 }}
                                />
                              ) : (
                                <ToggleOff
                                  sx={{ fontSize: isMobile ? 16 : 20 }}
                                />
                              )}
                            </IconButton>
                            <Chip
                              label={partner.isActive ? "Active" : "Inactive"}
                              size="small"
                              sx={{
                                backgroundColor: partner.isActive
                                  ? "#dcfce7"
                                  : "#fee2e2",
                                color: partner.isActive ? "#166534" : "#991b1b",
                                fontWeight: 600,
                                fontSize: isMobile ? "0.6875rem" : "0.75rem",
                                height: isMobile ? "20px" : "24px",
                                "& .MuiChip-label": {
                                  padding: isMobile ? "0 6px" : "0 8px",
                                },
                              }}
                            />
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: isMobile ? "8px 6px" : "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: isMobile ? 0.5 : 1,
                              flexWrap: "wrap",
                            }}
                          >
                            {HasPermission("SubTenantEdit") && (
                              <IconButton
                                size="small"
                                onClick={() => handleedit(partner)}
                                sx={{
                                  backgroundColor: "#e3f2fd",
                                  color: "#1976d2",
                                  padding: isMobile ? "4px" : "6px",
                                  minWidth: isMobile ? "24px" : "28px",
                                  minHeight: isMobile ? "24px" : "28px",
                                  "&:hover": {
                                    backgroundColor: "#bbdefb",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Edit sx={{ fontSize: isMobile ? 12 : 16 }} />
                              </IconButton>
                            )}
                            {HasPermission("SubTenantDelete") && (
                              <IconButton
                                size="small"
                                onClick={() => handledelete(partner)}
                                sx={{
                                  backgroundColor: "#ffebee",
                                  color: "#d32f2f",
                                  padding: isMobile ? "4px" : "6px",
                                  minWidth: isMobile ? "24px" : "28px",
                                  minHeight: isMobile ? "24px" : "28px",
                                  "&:hover": {
                                    backgroundColor: "#ffcdd2",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <DeleteIcon
                                  sx={{ fontSize: isMobile ? 12 : 16 }}
                                />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!subtenantList || subtenantList?.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length + 1}
                          sx={{
                            textAlign: "center",
                            padding: isMobile ? "24px 16px" : "40px 20px",
                            borderBottom: "none",
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              padding: isMobile ? "16px" : "24px",
                              backgroundColor: "#f9fafb",
                              border: "2px dashed #d1d5db",
                              borderRadius: isMobile ? "8px" : "12px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: isMobile ? 1.5 : 2,
                              }}
                            >
                              <img
                                src="/image/no-records.svg"
                                alt="No records"
                                loading="lazy"
                                style={{
                                  width: isMobile ? "48px" : "64px",
                                  height: isMobile ? "48px" : "64px",
                                  opacity: 0.5,
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#6b7280",
                                  fontWeight: 500,
                                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                                  lineHeight: isMobile ? 1.3 : 1.2,
                                }}
                              >
                                No Partners Found
                              </Typography>
                            </Box>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {subtenantList && subtenantList?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "flex-end",
                    mt: isMobile ? 2 : 3,
                    backgroundColor: "white",
                    borderRadius: isMobile ? "6px" : "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    p: isMobile ? 0.5 : 1,
                  }}
                >
                  <TablePagination
                    rowsPerPageOptions={
                      isMobile ? [10, 25, 50] : [10, 25, 50, 100]
                    }
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      "& .MuiTablePagination-toolbar": {
                        minHeight: isMobile ? "48px" : "52px",
                        padding: isMobile ? "0 8px" : "0 16px",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      },
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          color: "#374151",
                          fontWeight: 500,
                          marginBottom: isMobile ? "4px" : "0",
                        },
                      "& .MuiTablePagination-select": {
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        fontWeight: 500,
                      },
                      "& .MuiTablePagination-actions": {
                        marginLeft: isMobile ? "8px" : "16px",
                      },
                      "& .MuiIconButton-root": {
                        color: "#6b7280",
                        padding: isMobile ? "6px" : "8px",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                        },
                        "&.Mui-disabled": {
                          color: "#d1d5db",
                        },
                      },
                      "& .MuiTablePagination-spacer": {
                        display: isMobile ? "none" : "flex",
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Container>
        </div>
      </div>
      {open && (
        <AddEditSubTenent
          open={open}
          handleclose={handleclose}
          action={action}
          SubTenantlistAPI={refreshSubTenantlistAPI}
          object={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.firstName + " " + object.lastName}
          id={object?.tenantId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
