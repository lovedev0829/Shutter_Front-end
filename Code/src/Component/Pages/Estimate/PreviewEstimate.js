import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Receipt as EstimateIcon,
  Palette as PaletteIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import { callAPI, callAPIWithoutAuth } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import moment from "moment";
import SendApproved from "./SendApproved";
import { defaultConfig } from "../../../config";
import Breakdown from "./Breakdown";

export default function PreviewEstimate() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState("");
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();
  const [msg, setMsg] = useState("");
  const theme = useTheme();

  const TenantlistAPI = async () => {
    setLoader(true);
    let query = {
      EstimationId: param.estimateId,
    };
    try {
      const apiResponse = await callAPIWithoutAuth(
        apiUrls.ViewEstimate,
        query,
        "POST",
        {}
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        console.log(apiResponse?.data?.data)
        setTenantList(apiResponse?.data?.data);
      } else {
         ErrorMessage(apiResponse.data.message);
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const Paymentget = async () => {
    try {
      const apiResponse = await callAPI(
        apiUrls.EstimateAmmount,
        { EstimateId: param.estimateId },
        "GET",
        {}
      );

      if (apiResponse?.data?.isSuccess) {
        setMsg(apiResponse?.data?.data);
      } else {
        setMsg("");
      }
    } catch (error) {
      setMsg("");
    }
  };
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      Paymentget();
    }
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPIWithoutAuth(
        apiUrls.EstimateApproved,
        { EstimationId: param.estimateId, Status: reject ? 3 : 2 },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI();
        setReject("");
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  return (
    <>
      <ApiLoder open={loder} />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: tenantList[0]?.primarycolor || theme.palette.primary.main,
            color: 'white',
            borderRadius: 0,
            py: 3
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}
              >
                {tenantList[0]?.companyName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {token && (
                  <Button
                    component={Link}
                    to={`/contacts/job/${tenantList[0]?.jobId}`}
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {!token && tenantList[0]?.status === "Approved" && (
                  <Chip 
                    label="Approved" 
                    sx={{ 
                      backgroundColor: '#4caf50', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}

                {!token && tenantList[0]?.status === "Rejected" && (
                  <Chip 
                    label="Rejected" 
                    sx={{ 
                      backgroundColor: '#f44336', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
                
                {!token && tenantList[0]?.status === "GenerateOrder" && (
                  <Chip 
                    label="Order Generated" 
                    sx={{ 
                      backgroundColor: '#2196f3', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
                
                {!token &&
                  tenantList[0]?.status !== "Approved" &&
                  tenantList[0]?.status !== "Rejected" &&
                  tenantList[0]?.status !== "GenerateOrder" && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => {
                          setApproved(true);
                          setReject("");
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => {
                          setApproved(true);
                          setReject("yes");
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
              </Box>
            </Box>
          </Container>
        </Paper>
        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Address */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Address
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          lineHeight: 1.4
                        }}
                      >
                        {tenantList[0]?.jobDetails?.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Job Name */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Job Name
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.jobDetails?.jobName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Job Type */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Job Type
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.jobDetails?.jobType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Assigned Personnel */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Assigned Personnel
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.jobDetails?.assignedPersonnel}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Schedule Date & Time */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Schedule Date & Time
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.jobDetails?.scheduleTime
                          ? `${moment(tenantList[0]?.jobDetails?.scheduleTime).format(
                              "MM-DD-YYYY"
                            )} | ${moment(tenantList[0]?.jobDetails?.scheduleTime).format("hh:mm A")}`
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Estimate Name */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <EstimateIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Estimate Name
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.estimateName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Estimate Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <EstimateIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Estimate Date
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {moment(tenantList[0]?.createdDate).format("MM-DD-YYYY") || ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Powder Coating Color */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <PaletteIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Powder Coating Color
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {tenantList[0]?.jobDetails?.powderCoatColor}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Job Notes */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Job Notes
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.primary,
                          fontStyle: tenantList[0]?.jobDetails?.jobNotes ? 'normal' : 'italic'
                        }}
                      >
                        {tenantList[0]?.jobDetails?.jobNotes || "---"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/* Estimate Table */}
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        Window Label
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        Window Qty
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        Product Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        Product
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="right">
                        Retail Price
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenantList[0]?.estimateProductList?.map((val, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {val?.label}
                        </TableCell>
                        <TableCell>
                          {val?.windowQty}
                        </TableCell>
                        <TableCell>
                          {val?.productName}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              W: {val?.estimateWindowDetails?.width}", H: {val?.estimateWindowDetails?.height}", A: {val?.estimateWindowDetails?.archHeight}"
                            </Typography>
                            {val?.options?.map((vals, ind) => (
                              !val?.hidePreviews?.[ind] && (
                                <Typography 
                                  key={ind} 
                                  variant="body2" 
                                  sx={{ 
                                    color: theme.palette.text.secondary,
                                    fontSize: '0.8rem',
                                    ml: 1
                                  }}
                                >
                                  → {vals}
                                </Typography>
                              )
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                          {defaultConfig.currencySign} 
                          {parseFloat(((val?.totalPrice ?? val?.productPrice ?? 0) + (val?.additionalCost ?? 0) + (val?.componentMarkup ?? 0) + (val?.productMarkup ?? 0) + (val?.optionMarkup ?? 0)).toFixed(2))}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Summary Row */}
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell sx={{ verticalAlign: 'top', p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                          Terms and Conditions
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                          {tenantList[0]?.termsCondition}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top', p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                          Additional Notes
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                          {tenantList[0]?.notes}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top', p: 3 }}>
                        <Box sx={{ minWidth: 200 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Subtotal:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {defaultConfig.currencySign} {tenantList[0]?.subTotal}
                            </Typography>
                          </Box>
                          
                          {Number(tenantList[0]?.discount) > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Discount:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {defaultConfig.currencySign} {tenantList[0]?.discount}
                              </Typography>
                            </Box>
                          )}
                          
                          {tenantList[0]?.isTaxApplicable && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Taxes:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {defaultConfig.currencySign} {tenantList[0]?.tax}
                              </Typography>
                            </Box>
                          )}
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              Grand Total:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                              {defaultConfig.currencySign} {tenantList[0]?.grandTotal}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          {/* Invoice and Payment Information */}
          {msg && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Invoice & Payment Information
                    </Typography>
                    
                    {msg?.invoices?.map((val, i) => (
                      <Accordion key={i} sx={{ mb: 2 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${i}-content`}
                          id={`panel${i}-header`}
                          sx={{ 
                            backgroundColor: theme.palette.grey[50],
                            '&:hover': {
                              backgroundColor: theme.palette.grey[100]
                            }
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {val?.invoiceNumber}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                  <strong>Invoice Amount:</strong> {defaultConfig.currencySign} {val?.totalAmount}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                  <strong>Paid Amount:</strong> {defaultConfig.currencySign} {val?.paidAmount}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Chip
                                  label={val?.status}
                                  size="small"
                                  color={val?.status === 'Paid' ? 'success' : val?.status === 'Pending' ? 'warning' : 'default'}
                                  sx={{ fontWeight: 500 }}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {val?.payments?.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                Payment History
                              </Typography>
                              {val?.payments?.map((payment, idx) => (
                                <Card 
                                  key={idx} 
                                  variant="outlined" 
                                  sx={{ 
                                    mb: 2, 
                                    p: 2,
                                    backgroundColor: theme.palette.grey[25]
                                  }}
                                >
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Typography variant="body2">
                                        <strong>Payment Date:</strong>
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {moment(payment?.paymentDate).format("MM-DD-YYYY hh:mm A")}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Typography variant="body2">
                                        <strong>Amount:</strong>
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                                        {defaultConfig.currencySign} {payment?.amount}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Typography variant="body2">
                                        <strong>Transaction ID:</strong>
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {payment?.transactionId}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Typography variant="body2">
                                        <strong>Payment Method:</strong>
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {payment?.paymentMethod}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Typography variant="body2">
                                        <strong>Status:</strong>
                                      </Typography>
                                      <Chip
                                        label={payment?.status}
                                        size="small"
                                        color={payment?.status === 'Success' ? 'success' : 'default'}
                                        sx={{ fontWeight: 500 }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Card>
                              ))}
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <SendApproved
        open={approved}
        handleClose={() => setApproved(false)}
        handlestatus={handlestatus}
        estimateId={tenantList[0]?.estimateId}
                        isApproved={true}
                        loder={loder}
                        title={
                        reject
                            ? "You want to reject this estimate?"
                            : "You want to approve this estimate?"
                        }
                        subtitle={
                        reject
                            ? "Please click the Confirm button to reject this estimate."
                            : "Please click the Confirm button to approve this estimate."
                        }
                    />
                    {history &&<Breakdown
                        open={history}
                        handleClose={() => setHistory(false)}
                        data={{ windowProdcutId: object.windowProductId, label: object.label }}
                        EstimateId={tenantList[0]?.estimateId}
                        IsView={true}
                    />
                }
    </>
  );
}
