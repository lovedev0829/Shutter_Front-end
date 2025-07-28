import React, { useEffect } from "react";
import { useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder } from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import ReportFilter from "./ReportFilter";
import moment from "moment";
import { defaultConfig } from "../../../config";
import ExportFile from "../../../helpers/ExportFile";

export default function FinanceReport() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ toDate: null, formDate: null });
  const [value, setValue] = useState({
    orderStatus: 0,
    orderReport: "Outstanding Invoice",
  });
  
  const JobStatus = [
    {
      jobStatusId: 0,
      jobStatusName: "Outstanding Invoice",
      isActive: true,
    },
    {
      jobStatusId: 2,
      jobStatusName: "Outstanding Invoice (Due Date)",
      isActive: true,
    },
    {
      jobStatusId: 1,
      jobStatusName: "Payment Received",
      isActive: true,
    },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search, value.orderStatus, filter.toDate, filter.formDate);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      value.orderStatus,
      filter.toDate
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const TenantlistAPI = async (page, perpage, serach, Type, toDate, formDate) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      toDate: toDate ? toDate : null,
      formDate: formDate ? formDate : null,
      status: 2,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetInvoiceReport,
        { Type: Type ? Type : 0 },
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

  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch, value.orderStatus, filter.toDate, filter.formDate);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handleStatuschange = (value, name) => {
    setValue((val) => {
      return { ...val, orderStatus: value, orderReport: name };
    });
    TenantlistAPI(1, rowsPerPage, search, value, filter.toDate, filter.formDate);
    setPage(1);
  };

  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      rowsPerPage,
      search,
      value.orderStatus,
      e.target.name === "toDate" ? e.target.value : filter.toDate,
      e.target.name === "formDate" ? e.target.value : filter.formDate
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  return (
    <>
      {loder && <ApiLoder />}
      <ReportFilter
        handleStatuschange={handleStatuschange}
        value={value}
        JobStatus={JobStatus}
      />
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {value.orderReport ? value.orderReport : "All Finance Report"}
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
              Total Number Of {value.orderReport ? value.orderReport : "All Finance Report"}: {paginatedItems}
            </Typography>
          </Box>

          {/* Filters Section */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Search handleSearch={handleSearch} />
            </Box>
            
            <Box sx={{ position: 'relative' }}>
              <input
                style={{ color: "white" }}
                type="date"
                onChange={handleChange}
                className="form-control selectboxdropdown"
                name="formDate"
                value={moment(filter.formDate).format("YYYY-MM-DD") || ""}
              />
              <span
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#212529",
                  pointerEvents: "none",
                }}
              >
                {filter.formDate ? moment(filter.formDate).format("MM-DD-YYYY") : "From Date"}
              </span>
              <img src="/image/calendar-alt.svg" alt="" loading="lazy" style={{top:"4px"}}/>
            </Box>
            
            <Box sx={{ position: 'relative' }}>
              <input
                style={{ color: "white" }}
                type="date"
                onChange={handleChange}
                className="form-control selectboxdropdown"
                name="toDate"
                value={moment(filter.toDate).format("YYYY-MM-DD") || ""}
              />
              <span
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#212529",
                  pointerEvents: "none",
                }}
              >
                {filter.toDate ? moment(filter.toDate).format("MM-DD-YYYY") : "To Date"}
              </span>
              <img src="/image/calendar-alt.svg" alt="" loading="lazy" style={{top:"4px"}}/>
            </Box>

            <ExportFile 
              type="invoice"  
              serach={search} 
              page={page} 
              perpage={rowsPerPage}  
              status={"2"} 
              Url={apiUrls.ExportContacts} 
              toDate={filter.toDate} 
              formDate={filter.formDate}
            />
          </Stack>

          {/* Table Section */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Amount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantList?.map((val, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{val?.invoiceNumber}</TableCell>
                    <TableCell>{val?.contactFirstName + " " + val?.contactLastName + " " + (val?.suffix ?? "")}</TableCell>
                    <TableCell>{moment(val?.issueDate).format("MM-DD-YYYY")}</TableCell>
                    <TableCell 
                      sx={{
                        color: moment(val?.dueDate).isSame(moment(), "day") ? "error.main" : "inherit",
                        fontWeight: moment(val?.dueDate).isSame(moment(), "day") ? 600 : 400
                      }}
                    >
                      {moment(val?.dueDate).format("MM-DD-YYYY")}
                    </TableCell>
                    <TableCell>
                      {defaultConfig.currencySign} {val?.balanceDue}
                    </TableCell>
                    <TableCell align="right">
                      {defaultConfig.currencySign} {val?.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!tenantList || tenantList?.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src="/image/no-records.svg"
                          alt="No records"
                          loading="lazy"
                          style={{ width: 120, marginBottom: 16 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No Finance Report
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {tenantList && tenantList?.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25, 100]}
              component="div"
              count={paginatedItems}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Box>
      </Paper>
    </>
  );
}
