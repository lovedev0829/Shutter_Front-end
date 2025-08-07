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
  useTheme,
  useMediaQuery
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      <ApiLoder open={loder} />
      
      <Paper sx={{ 
        width: '100%', 
        mb: { xs: 1, md: 3 },
        mx: { xs: 0, md: 0 },
        borderRadius: { xs: 1, md: 2 }
      }}>
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: { xs: 2, md: 3 },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"}
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                lineHeight: 1.2
              }}
            >
              All Tax Report
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'success.main', 
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              Total: {paginatedItems}
            </Typography>
          </Box>

          {/* Filters Section */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={{ xs: 1.5, md: 2 }} 
            sx={{ mb: { xs: 2, md: 3 } }}
          >
            <Box sx={{ flexGrow: 1, order: { xs: 1, md: 1 } }}>
              <Search handleSearch={handleSearch} />
            </Box>

            <Box sx={{ order: { xs: 2, md: 2 } }}>
              <ExportFile
                type="tax"
                serach={search}
                page={page}
                perpage={rowsPerPage}
                status={"2"}
                Url={apiUrls.ExportContacts}
              />
            </Box>
          </Stack>

          {/* Table Section */}
          <TableContainer sx={{ 
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.400',
              borderRadius: 4,
            },
          }}>
            <Table sx={{ minWidth: { xs: 500, md: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    py: { xs: 1, md: 2 },
                    px: { xs: 1, md: 2 }
                  }}>
                    Estimation Code
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    py: { xs: 1, md: 2 },
                    px: { xs: 1, md: 2 }
                  }}>
                    Job Code
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    py: { xs: 1, md: 2 },
                    px: { xs: 1, md: 2 }
                  }}>
                    Contact Name
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    py: { xs: 1, md: 2 },
                    px: { xs: 1, md: 2 }
                  }}>
                    Tax Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantList?.map((val, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ 
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                      py: { xs: 1, md: 2 },
                      px: { xs: 1, md: 2 }
                    }}>
                      {val?.estimateCode}
                    </TableCell>
                    <TableCell sx={{ 
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                      py: { xs: 1, md: 2 },
                      px: { xs: 1, md: 2 }
                    }}>
                      {val?.jobDetails?.jobUniqueId}
                    </TableCell>
                    <TableCell sx={{ 
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                      py: { xs: 1, md: 2 },
                      px: { xs: 1, md: 2 }
                    }}>
                      {val?.jobDetails?.firstName + " " + val?.jobDetails?.lastName + " " + (val?.jobDetails?.suffix ?? "")}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                      py: { xs: 1, md: 2 },
                      px: { xs: 1, md: 2 }
                    }}>
                      {defaultConfig.currencySign} {val?.tax}
                    </TableCell>
                  </TableRow>
                ))}

                {(!tenantList || tenantList?.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: { xs: 4, md: 8 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src="/image/no-records.svg"
                          alt="No records"
                          loading="lazy"
                          style={{ 
                            width: isMobile ? 80 : 120, 
                            marginBottom: isMobile ? 8 : 16 
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' }
                          }}
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
                mt: { xs: 1, md: 0 },
                '& .MuiTablePagination-toolbar': {
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  px: { xs: 1, md: 2 },
                  minHeight: { xs: 48, md: 52 },
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                },
                '& .MuiTablePagination-select': {
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                },
                '& .MuiTablePagination-actions': {
                  '& button': {
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  },
                },
              }}
            />
          )}
        </Box>
      </Paper>
    </>
  );
}
