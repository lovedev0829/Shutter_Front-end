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
  Stack
} from "@mui/material";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder } from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import { defaultConfig } from "../../../config";
import ExportFile from "../../../helpers/ExportFile";

export default function TaxReport() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), search);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const TenantlistAPI = async (page, perpage, serach) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: 2,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetTaxReport,
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

  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  return (
    <>
      {loder && <ApiLoder />}
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              All Tax Report
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'success.main', 
                fontWeight: 500,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              Total Number Of All Tax Report: {paginatedItems}
            </Typography>
          </Box>

          {/* Filters Section */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Search handleSearch={handleSearch} />
            </Box>

            <ExportFile
              type="tax"
              serach={search}
              page={page}
              perpage={rowsPerPage}
              status={"2"}
              Url={apiUrls.ExportContacts}
            />
          </Stack>

          {/* Table Section */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Estimation Code
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Job Code
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Contact Name
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Tax Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantList?.map((val, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                      {val?.estimateCode}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                      {val?.jobDetails?.jobUniqueId}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                      {val?.jobDetails?.firstName + " " + val?.jobDetails?.lastName + " " + (val?.jobDetails?.suffix ?? "")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                      {defaultConfig.currencySign} {val?.tax}
                    </TableCell>
                  </TableRow>
                ))}

                {(!tenantList || tenantList?.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src="/image/no-records.svg"
                          alt="No records"
                          loading="lazy"
                          style={{ width: 120, marginBottom: 16 }}
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}
                        >
                          No Tax Report
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
              sx={{
                '& .MuiTablePagination-toolbar': {
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }
              }}
            />
          )}
        </Box>
      </Paper>
    </>
  );
}
