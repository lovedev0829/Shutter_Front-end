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
  Link as MuiLink
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

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Estimate Cost Break Down" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Breakdown List" />
              {tenantList?.length !== 0 && (
                <div className="heading_width_search d-flex align-items-center gap-3">
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
                </div>
              )}
            </div>

            <div className="d-block d-md-flex align-items-center gap-2 mb-30">
              <div className="filter-dropdown dropdown">
                <ContactBreakdown
                  value={filter.ContactName}
                  fn={handleChange}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactUniqueIdBreakdown
                  value={filter.contactUniqueId}
                  fn={handleChange}
                  ContactId={filter.ContactName}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactJobBreakdown
                  value={filter.JobId}
                  fn={handleChange}
                  ContactId={filter.contactUniqueId}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <ContactEstimatioBreakdown
                  value={filter.EstimationId}
                  fn={handleChange}
                  JobId={filter.JobId}
                />
              </div>
              <div className="filter-dropdown dropdown">
                <GetProductBreakdown
                  value={filter.windowProdcutId}
                  fn={handleChange}
                  EstimationId={filter.EstimationId}
                />
              </div>
            </div>

            {Object.entries(groupedData).map(([key, items]) => (
              <Box key={key} sx={{ mb: 4, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2c3e50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        backgroundColor: '#1976d2',
                        borderRadius: '2px'
                      }}
                    />
                    {items[0]?.label}
                  </Typography>
                </Box>
                
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
                    maxWidth: 'calc(100vw - 300px)', // Account for sidebar
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
                      <TableRow
                        sx={{
                          backgroundColor: '#f8fafc',
                          '& .MuiTableCell-head': {
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#475569',
                            borderBottom: '2px solid #e2e8f0',
                            padding: '16px 12px',
                          }
                        }}
                      >
                        <TableCell sx={{ minWidth: 120, position: 'sticky', left: 0, backgroundColor: '#f8fafc', zIndex: 3 }}>Product Type</TableCell>
                        <TableCell sx={{ minWidth: 150, position: 'sticky', left: 120, backgroundColor: '#f8fafc', zIndex: 3 }}>Product</TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>Window Qty</TableCell>
                        <TableCell align="center" sx={{ minWidth: 80 }}>Width</TableCell>
                        <TableCell align="center" sx={{ minWidth: 80 }}>Height</TableCell>

                        {items?.map(
                          (vals, ind) =>
                            vals.componentId && (
                              <TableCell key={ind} align="center" sx={{ minWidth: 120 }}>
                                <MuiLink
                                  component={Link}
                                  to={`/component/detail/${vals.componentId}`}
                                  sx={{
                                    color: '#1976d2',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
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
                              <TableCell key={idx} align="center" sx={{ minWidth: 140 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    {opt.optionName}
                                  </Typography>
                                  <Chip
                                    label={opt.optionTypeName}
                                    size="small"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: '18px',
                                      backgroundColor: '#e3f2fd',
                                      color: '#1976d2'
                                    }}
                                  />
                                </Box>
                              </TableCell>
                            ))}
                        <TableCell align="right" sx={{ fontWeight: 600, minWidth: 120, position: 'sticky', right: 240, backgroundColor: '#f8fafc', zIndex: 3 }}>Sub Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, minWidth: 120, position: 'sticky', right: 120, backgroundColor: '#f8fafc', zIndex: 3 }}>Over Head</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#1976d2', minWidth: 120, position: 'sticky', right: 0, backgroundColor: '#f8fafc', zIndex: 3 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:hover': {
                            backgroundColor: '#fafbfc',
                          },
                          '& .MuiTableCell-root': {
                            padding: '16px 12px',
                            borderBottom: '1px solid #f1f5f9',
                          }
                        }}
                      >
                        <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 2 }}>
                          <Chip
                            label={items[0]?.productTypeName}
                            sx={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 500,
                              fontSize: '0.8rem'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', left: 120, backgroundColor: 'white', zIndex: 2 }}>
                          <MuiLink
                            component={Link}
                            to={`/products/detail/${items[0]?.productId}`}
                            sx={{
                              color: '#1976d2',
                              textDecoration: 'none',
                              fontWeight: 500,
                              fontSize: '0.875rem',
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
                              minWidth: '32px',
                              height: '32px',
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32',
                              borderRadius: '8px',
                              fontWeight: 600
                            }}
                          >
                            {items[0]?.quantity}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                          {items[0]?.buildWidth}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                          {items[0]?.buildHeight}
                        </TableCell>
                        {items?.map(
                          (vals, ind) =>
                            vals.componentId && (
                              <TableCell key={ind} align="center" sx={{ minWidth: 120 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#059669',
                                    backgroundColor: '#ecfdf5',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    fontSize: '0.8rem'
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
                              <TableCell key={idx} align="center" sx={{ minWidth: 140 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#7c3aed',
                                    backgroundColor: '#f3e8ff',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {defaultConfig.currencySign} {opt.optionPrice || 0}
                                </Typography>
                              </TableCell>
                            ))}
                        <TableCell align="right" sx={{ position: 'sticky', right: 240, backgroundColor: 'white', zIndex: 2 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#374151',
                              whiteSpace: 'nowrap',
                              fontSize: '0.9rem'
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
                        <TableCell align="right" sx={{ position: 'sticky', right: 120, backgroundColor: 'white', zIndex: 2 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#f59e0b',
                              whiteSpace: 'nowrap',
                              fontSize: '0.9rem'
                            }}
                          >
                            {(
                              Number(items[0]?.componentMarkup || 0) +
                              Number(items[0]?.productMarkup || 0) +
                              Number(items[0]?.optionMarkup || 0)
                            )?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ position: 'sticky', right: 0, backgroundColor: 'white', zIndex: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#1976d2',
                              whiteSpace: 'nowrap',
                              backgroundColor: '#e3f2fd',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              display: 'inline-block',
                              fontSize: '0.95rem'
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
            ))}
            {(!tenantList || tenantList?.length === 0) && (
              <Paper
                sx={{
                  textAlign: 'center',
                  py: 8,
                  borderRadius: '12px',
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
                      width: 120,
                      height: 120,
                      opacity: 0.6
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500
                    }}
                  >
                    No Breakdown available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94a3b8',
                      maxWidth: 400
                    }}
                  >
                    Select filters above to view cost breakdown details
                  </Typography>
                </Box>
              </Paper>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
