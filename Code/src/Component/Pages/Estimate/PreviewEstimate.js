import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
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
  Stack,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as BackIcon
} from "@mui/icons-material";

export default function PreviewEstimate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState("");
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();
  const [msg, setMsg] = useState("");

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
      const response = await callAPI(
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

  const getStatusChip = (status) => {
    switch (status) {
      case "Approved":
        return <Chip label="Approved" color="success" variant="filled" />;
      case "Rejected":
        return <Chip label="Rejected" color="error" variant="filled" />;
      case "GenerateOrder":
        return <Chip label="Order Generated" color="info" variant="filled" />;
      default:
        return null;
    }
  };

  return (
    <>
      {loder && <ApiLoder />}
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: tenantList[0]?.primarycolor || theme.palette.primary.main,
            color: 'white',
            borderRadius: 0,
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2 }
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 2, sm: 1 }
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'inherit',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {tenantList[0]?.companyName}
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {token && (
                  <Button
                    component={Link}
                    to={`/contacts/job/${tenantList[0]?.jobId}`}
                    variant="outlined"
                    startIcon={<BackIcon />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {getStatusChip(tenantList[0]?.status)}

                {tenantList[0]?.status !== "Approved" &&
                  tenantList[0]?.status !== "Rejected" &&
                  tenantList[0]?.status !== "GenerateOrder" && (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<ApproveIcon />}
                        onClick={() => {
                          setApproved(true);
                          setReject("");
                        }}
                        sx={{
                          backgroundColor: 'success.main',
                          '&:hover': { backgroundColor: 'success.dark' },
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<RejectIcon />}
                        onClick={() => {
                          setApproved(true);
                          setReject("yes");
                        }}
                        sx={{
                          backgroundColor: 'error.main',
                          '&:hover': { backgroundColor: 'error.dark' },
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
              </Stack>
            </Box>
          </Container>
        </Paper>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
          {/* Job Details Section */}
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3, borderRadius: 2 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Job Details
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Job Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.jobName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Job Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.jobType}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Assigned Personnel
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.assignedPersonnel}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Job Notes
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.jobNotes || "---"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Schedule Date & Time
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.scheduleTime
                        ? `${moment(tenantList[0]?.jobDetails?.scheduleTime).format("MM-DD-YYYY")} | ${moment(tenantList[0]?.jobDetails?.scheduleTime).format("hh:mm A")}`
                        : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Estimate Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.estimateName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Estimate Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {moment(tenantList[0]?.createdDate).format("MM-DD-YYYY") || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Powder Coating Color
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {tenantList[0]?.jobDetails?.powderCoatColor}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Estimate Table */}
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                p: { xs: 2, sm: 3 },
                fontWeight: 600,
                backgroundColor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Estimate Details
            </Typography>
            
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Window Label</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Window Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Product Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Retail Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenantList[0]?.estimateProductList?.map((val, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{val?.label}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{val?.windowQty}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{val?.productName}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            W: {val?.estimateWindowDetails?.width}", H: {val?.estimateWindowDetails?.height}", A: {val?.estimateWindowDetails?.archHeight}"
                          </Typography>
                          {val?.options?.some((opt, ind) => !val?.hidePreviews?.[ind]) && (
                            <List dense sx={{ pl: 2, mt: 1 }}>
                              {val?.options?.map((vals, ind) =>
                                !val?.hidePreviews?.[ind] && (
                                  <ListItem key={ind} sx={{ py: 0, px: 0 }}>
                                    <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                      → {vals}
                                    </Typography>
                                  </ListItem>
                                )
                              )}
                            </List>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {defaultConfig.currencySign}
                        {parseFloat(
                          (
                            (val?.totalPrice ?? val?.productPrice ?? 0) +
                            (val?.additionalCost ?? 0) +
                            (val?.componentMarkup ?? 0) +
                            (val?.productMarkup ?? 0) +
                            (val?.optionMarkup ?? 0)
                          ).toFixed(2)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Summary Section */}
            <Grid container sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default' }}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                  Order Notes
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                  Terms and Conditions
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {tenantList[0]?.termsCondition}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                  Additional Notes
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {tenantList[0]?.notes}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Subtotal:</Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {defaultConfig.currencySign} {tenantList[0]?.subTotal}
                        </Typography>
                      </Box>
                      
                      {Number(tenantList[0]?.discount) > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Discount:</Typography>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {defaultConfig.currencySign} {tenantList[0]?.discount}
                          </Typography>
                        </Box>
                      )}
                      
                      {tenantList[0]?.isTaxApplicable && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Taxes:</Typography>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {defaultConfig.currencySign} {tenantList[0]?.tax}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>Grand Total:</Typography>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                          {defaultConfig.currencySign} {tenantList[0]?.grandTotal}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Payment History */}
          {msg && msg.invoices && msg.invoices.length > 0 && (
            <Paper elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  p: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  backgroundColor: 'background.default',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Payment History
              </Typography>
              
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {msg.invoices.map((val, i) => (
                  <Accordion key={i} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                          {val?.invoiceNumber}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              <strong>Invoice Amount:</strong> {defaultConfig.currencySign} {val?.totalAmount}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              <strong>Paid Amount:</strong> {defaultConfig.currencySign} {val?.paidAmount}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Chip 
                              label={val?.status} 
                              size="small" 
                              color={val?.status === 'Paid' ? 'success' : 'warning'}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {val?.payments?.length > 0 && (
                        <Stack spacing={2}>
                          {val?.payments?.map((payment, paymentIndex) => (
                            <Card key={paymentIndex} variant="outlined">
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      <strong>Payment Date:</strong><br />
                                      {moment(payment?.paymentDate).format("MM-DD-YYYY hh:mm A")}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      <strong>Paid Amount:</strong><br />
                                      {defaultConfig.currencySign} {payment?.amount}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      <strong>Transaction ID:</strong><br />
                                      {payment?.transactionId}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      <strong>Payment Method:</strong><br />
                                      {payment?.paymentMethod}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      <strong>Status:</strong><br />
                                      <Chip 
                                        label={payment?.status} 
                                        size="small" 
                                        color={payment?.status === 'Paid' ? 'success' : 'warning'}
                                      />
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Modals */}
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
      {history && (
        <Breakdown
          open={history}
          handleClose={() => setHistory(false)}
          data={{
            windowProdcutId: object.windowProductId,
            label: object.label,
          }}
          EstimateId={tenantList[0]?.estimateId}
          IsView={true}
        />
      )}
    </>
  );
}
