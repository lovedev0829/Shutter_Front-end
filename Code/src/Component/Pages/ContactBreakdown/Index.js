import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import ContactBreakdown from "../../../helpers/ContactBreakdown";
import ContactUniqueIdBreakdown from "../../../helpers/ContactUniqueIdBreakdown";
import ContactJobBreakdown from "../../../helpers/ContactJobBreakdown";
import ContactEstimatioBreakdown from "../../../helpers/ContactEstimatioBreakdown";
import ExportFile from "../../../helpers/ExportFile";
import GetProductBreakdown from "../../../helpers/GetProductBreakdown";
import { defaultConfig } from "../../../config";
import { Link } from "react-router-dom";
import {
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
  Link as MuiLink,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';

export default function Index() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [filter, setFilter] = useState({
    ContactName: "",
    contactUniqueId: "",
    JobId: "",
    EstimationId: "",
    windowProdcutId: "",
  });

  const TenantlistAPI = async (EstimationId, WindowProdcutId) => {
    let query = {
      EstimationId: EstimationId ? EstimationId : "",
      WindowProdcutId: WindowProdcutId ? WindowProdcutId : "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.ContactEstimationProductBreakdown,
        query,
        "GET"
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "EstimationId") {
      TenantlistAPI(e.target.value, filter.windowProdcutId);
    }
    if (e.target.name === "windowProdcutId") {
      TenantlistAPI(filter.EstimationId, e.target.value);
    }
    if (
      e.target.name !== "windowProdcutId" ||
      e.target.name !== "EstimationId"
    ) {
      setTenantList([]);
    }
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  // Group by windowProdcutId
  const groupedData = tenantList.reduce((result, item) => {
    if (!result[item.windowProdcutId]) {
      result[item.windowProdcutId] = [];
    }
    result[item.windowProdcutId].push(item);
    return result;
  }, {});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <ApiLoder open={loder} />
      <Box className="intersight_content">
        <Header title="Estimate Cost Break Down" />
        <Box className="body_content" sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems={isMobile ? "flex-start" : "center"}
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              mb={3}
            >
              <TableTitle title="Breakdown List" />
              {tenantList?.length !== 0 && (
                <Box>
                  <ExportFile
                    type="breakdown"
                    serach={""}
                    page={1}
                    perpage={10}
                    tenantId={""}
                    status={"2"}
                    Url={apiUrls.ExportContacts}
                    jobStatus={""}
                    vendor={""}
                    productType={""}
                    WindowProductId={
                      filter.windowProdcutId ? filter.windowProdcutId : ""
                    }
                    EstimationId={
                      filter.windowProdcutId ? "" : filter.EstimationId
                    }
                  />
                </Box>
              )}
            </Box>

            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e3f2fd'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  Filter Options
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ minHeight: { xs: 'auto', sm: '56px' } }}>
                      <ContactBreakdown
                        value={filter.ContactName}
                        fn={handleChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ minHeight: { xs: 'auto', sm: '56px' } }}>
                      <ContactUniqueIdBreakdown
                        value={filter.contactUniqueId}
                        fn={handleChange}
                        ContactId={filter.ContactName}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ minHeight: { xs: 'auto', sm: '56px' } }}>
                      <ContactJobBreakdown
                        value={filter.JobId}
                        fn={handleChange}
                        ContactId={filter.contactUniqueId}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ minHeight: { xs: 'auto', sm: '56px' } }}>
                      <ContactEstimatioBreakdown
                        value={filter.EstimationId}
                        fn={handleChange}
                        JobId={filter.JobId}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Box sx={{ minHeight: { xs: 'auto', sm: '56px' } }}>
                      <GetProductBreakdown
                        value={filter.windowProdcutId}
                        fn={handleChange}
                        EstimationId={filter.EstimationId}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {Object.entries(groupedData).map(([key, items]) => (
              <Box key={key} sx={{ mb: 4, width: '100%' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2c3e50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? 3 : 4,
                        height: isMobile ? 20 : 24,
                        backgroundColor: '#1976d2',
                        borderRadius: '2px'
                      }}
                    />
                    {items[0]?.label}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  overflowX: 'auto',
                  width: '100%',
                  ...(isMobile && {
                    marginLeft: '-16px',
                    marginRight: '-16px',
                    width: 'calc(100vw - 32px)',
                    maxWidth: 'calc(100vw - 32px)',
                  })
                }}>
                  <TableContainer 
                    component={Paper} 
                    sx={{
                      borderRadius: isMobile ? '0px' : '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #e3f2fd',
                      maxHeight: isMobile ? '60vh' : '70vh',
                      width: '100%',
                      minWidth: isMobile ? '800px' : 'auto',
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
                  <Table 
                    sx={{ 
                      minWidth: isMobile ? 800 : '100%', 
                      width: isMobile ? 'max-content' : '100%', 
                      tableLayout: 'auto'
                    }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#f8fafc',
                          '& .MuiTableCell-head': {
                            fontWeight: 600,
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            color: '#475569',
                            borderBottom: '2px solid #e2e8f0',
                            padding: isMobile ? '12px 8px' : '16px 12px',
                          }
                        }}
                      >
                        <TableCell sx={{ 
                          minWidth: isMobile ? 100 : 120, 
                          position: 'sticky', 
                          left: 0, 
                          backgroundColor: '#f8fafc', 
                          zIndex: 3 
                        }}>
                          Product Type
                        </TableCell>
                        <TableCell sx={{ 
                          minWidth: isMobile ? 120 : 150, 
                          position: 'sticky', 
                          left: isMobile ? 100 : 120, 
                          backgroundColor: '#f8fafc', 
                          zIndex: 3 
                        }}>
                          Product
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: isMobile ? 80 : 100 }}>Window Qty</TableCell>
                        <TableCell align="center" sx={{ minWidth: isMobile ? 60 : 80 }}>Width</TableCell>
                        <TableCell align="center" sx={{ minWidth: isMobile ? 60 : 80 }}>Height</TableCell>

                        {items?.map(
                          (vals, ind) =>
                            vals.componentId && (
                              <TableCell key={ind} align="center" sx={{ minWidth: isMobile ? 100 : 120 }}>
                                <MuiLink
                                  component={Link}
                                  to={`/component/detail/${vals.componentId}`}
                                  sx={{
                                    color: '#1976d2',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    '&:hover': {
                                      textDecoration: 'underline',
                                    }
                                  }}
                                >
                                  {vals?.componentName}
                                </MuiLink>
                              </TableCell>
                            )
                        )}
                        {items &&
                          items
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <TableCell key={idx} align="center" sx={{ minWidth: isMobile ? 110 : 140 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 500, 
                                      fontSize: isMobile ? '0.7rem' : '0.8rem' 
                                    }}
                                  >
                                    {opt.optionName}
                                  </Typography>
                                  <Chip
                                    label={opt.optionTypeName}
                                    size="small"
                                    sx={{
                                      fontSize: isMobile ? '0.6rem' : '0.7rem',
                                      height: isMobile ? '16px' : '18px',
                                      backgroundColor: '#e3f2fd',
                                      color: '#1976d2'
                                    }}
                                  />
                                </Box>
                              </TableCell>
                            ))}
                        <TableCell align="right" sx={{ 
                          fontWeight: 600, 
                          minWidth: isMobile ? 90 : 120, 
                          position: 'sticky', 
                          right: isMobile ? 180 : 240, 
                          backgroundColor: '#f8fafc', 
                          zIndex: 3,
                          fontSize: isMobile ? '0.7rem' : '0.875rem',
                          px: isMobile ? 1 : 1.5
                        }}>
                          Sub Total
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 600, 
                          minWidth: isMobile ? 90 : 120, 
                          position: 'sticky', 
                          right: isMobile ? 90 : 120, 
                          backgroundColor: '#f8fafc', 
                          zIndex: 3,
                          fontSize: isMobile ? '0.7rem' : '0.875rem',
                          px: isMobile ? 1 : 1.5
                        }}>
                          Over Head
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 600, 
                          color: '#1976d2', 
                          minWidth: isMobile ? 90 : 120, 
                          position: 'sticky', 
                          right: 0, 
                          backgroundColor: '#f8fafc', 
                          zIndex: 3,
                          fontSize: isMobile ? '0.7rem' : '0.875rem',
                          px: isMobile ? 1 : 1.5
                        }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:hover': {
                            backgroundColor: '#fafbfc',
                          },
                          '& .MuiTableCell-root': {
                            padding: isMobile ? '12px 8px' : '16px 12px',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                          }
                        }}
                      >
                        <TableCell sx={{ 
                          position: 'sticky', 
                          left: 0, 
                          backgroundColor: 'white', 
                          zIndex: 2 
                        }}>
                          <Chip
                            label={items[0]?.productTypeName}
                            sx={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 500,
                              fontSize: isMobile ? '0.7rem' : '0.8rem',
                              height: isMobile ? '24px' : '28px'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ 
                          position: 'sticky', 
                          left: isMobile ? 100 : 120, 
                          backgroundColor: 'white', 
                          zIndex: 2 
                        }}>
                          <MuiLink
                            component={Link}
                            to={`/products/detail/${items[0]?.productId}`}
                            sx={{
                              color: '#1976d2',
                              textDecoration: 'none',
                              fontWeight: 500,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              '&:hover': {
                                textDecoration: 'underline',
                              }
                            }}
                          >
                            {items[0]?.productName}
                          </MuiLink>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: isMobile ? '28px' : '32px',
                              height: isMobile ? '28px' : '32px',
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32',
                              borderRadius: isMobile ? '6px' : '8px',
                              fontWeight: 600,
                              fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }}
                          >
                            {items[0]?.quantity}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ 
                          fontWeight: 500,
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}>
                          {items[0]?.buildWidth}
                        </TableCell>
                        <TableCell align="center" sx={{ 
                          fontWeight: 500,
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}>
                          {items[0]?.buildHeight}
                        </TableCell>
                        {items?.map(
                          (vals, ind) =>
                            vals.componentId && (
                              <TableCell key={ind} align="center" sx={{ minWidth: isMobile ? 100 : 120 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#059669',
                                    backgroundColor: '#ecfdf5',
                                    padding: isMobile ? '3px 6px' : '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    fontSize: isMobile ? '0.7rem' : '0.8rem'
                                  }}
                                >
                                  {defaultConfig.currencySign} {vals?.price}
                                </Typography>
                              </TableCell>
                            )
                        )}
                        {items &&
                          items
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <TableCell key={idx} align="center" sx={{ minWidth: isMobile ? 110 : 140 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#7c3aed',
                                    backgroundColor: '#f3e8ff',
                                    padding: isMobile ? '3px 6px' : '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    fontSize: isMobile ? '0.7rem' : '0.8rem'
                                  }}
                                >
                                  {defaultConfig.currencySign} {opt.optionPrice || 0}
                                </Typography>
                              </TableCell>
                            ))}
                        <TableCell align="right" sx={{ 
                          position: 'sticky', 
                          right: isMobile ? 180 : 240, 
                          backgroundColor: 'white', 
                          zIndex: 2,
                          px: isMobile ? 1 : 1.5
                        }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#374151',
                              whiteSpace: 'nowrap',
                              fontSize: isMobile ? '0.7rem' : '0.9rem'
                            }}
                          >
                            {defaultConfig.currencySign}{" "}
                            {(
                              Number(
                                items[0]?.productPrice ||
                                  items[0]?.totalPrice ||
                                  0
                              ) + Number(items[0]?.additionalCost || 0)
                            )?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          position: 'sticky', 
                          right: isMobile ? 90 : 120, 
                          backgroundColor: 'white', 
                          zIndex: 2,
                          px: isMobile ? 1 : 1.5
                        }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#f59e0b',
                              whiteSpace: 'nowrap',
                              fontSize: isMobile ? '0.7rem' : '0.9rem'
                            }}
                          >
                            {(
                              Number(items[0]?.componentMarkup || 0) +
                              Number(items[0]?.productMarkup || 0) +
                              Number(items[0]?.optionMarkup || 0)
                            )?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          position: 'sticky', 
                          right: 0, 
                          backgroundColor: 'white', 
                          zIndex: 2,
                          px: isMobile ? 1 : 1.5
                        }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#1976d2',
                              whiteSpace: 'nowrap',
                              backgroundColor: '#e3f2fd',
                              padding: isMobile ? '3px 5px' : '6px 10px',
                              borderRadius: isMobile ? '4px' : '8px',
                              display: 'inline-block',
                              fontSize: isMobile ? '0.7rem' : '0.95rem'
                            }}
                          >
                            {defaultConfig.currencySign}{" "}
                            {(
                              Number(
                                items[0]?.productPrice ||
                                  items[0]?.totalPrice ||
                                  0
                              ) +
                              Number(items[0]?.additionalCost || 0) +
                              Number(items[0]?.componentMarkup || 0) +
                              Number(items[0]?.productMarkup || 0) +
                              Number(items[0]?.optionMarkup || 0)
                            )?.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                </Box>
              </Box>
            ))}
            {(!tenantList || tenantList?.length === 0) && (
              <Paper
                sx={{
                  textAlign: 'center',
                  py: isMobile ? 4 : 8,
                  borderRadius: isMobile ? '8px' : '12px',
                  backgroundColor: '#fafbfc',
                  border: '2px dashed #cbd5e1'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Box
                    component="img"
                    src="/image/no-records.svg"
                    alt="No records"
                    sx={{
                      width: isMobile ? 80 : 120,
                      height: isMobile ? 80 : 120,
                      opacity: 0.6
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    No Breakdown available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94a3b8',
                      maxWidth: isMobile ? 280 : 400,
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      px: isMobile ? 2 : 0
                    }}
                  >
                    Select filters above to view cost breakdown details
                  </Typography>
                </Box>
              </Paper>
            )}
          </Container>
        </Box>
      </Box>
    </>
  );
}
