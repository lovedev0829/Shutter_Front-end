import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import EditVendorMaterial from "./EditVendorMaterial";
import { defaultConfig } from "../../../config";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit,
  Delete as DeleteIcon,
  Email,
  Business,
  DateRange,
  AttachMoney,
  MoreVert,
  Inventory,
  ArrowBack,
} from "@mui/icons-material";

function VendorOrderDetail() {
  const { vendorId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  
  const TenantlistAPI = async (pageNo = 1, recordPerPage = 10) => {
    let query = {
      searchValue: vendorId,
      pageNo: pageNo,
      recordPerPage: recordPerPage,
      tenantId: "",
      status: 2,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.VendorOrder, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords || 0);
      } else {
        setTenantList([]);
        setPaginatedItems(0);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handlesendInvoice = async () => {
    const isConfirmed = window.confirm("Are you sure you want to send the order?");
    if (isConfirmed) {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorOrderInvoice,
        {},
        "POST",
        {
          vendorOrderId: tenantList[0]?.vendorOrderId,
          vendorId: tenantList[0]?.vendorId,
        }
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  }
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.deleteVendorOrderItem,
        { VendorOrderItemId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        TenantlistAPI();
        SuccessMessage(response.data.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  
  const handleclose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);
  
  const handleedit = (item) => {
    setAction("edit");
    setObject({ ...item });
    setOpen(true);
    setAnchorEl(null);
  };
  
  const handledelclose = () => {
    setDelOpen(false);
  };
  
  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
    setAnchorEl(null);
  };
  
  const handleapi = () => {
    TenantlistAPI(page, rowsPerPage);
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    TenantlistAPI(1, newRowsPerPage);
  };

  // Mobile Material Card Component for materials
  const MobileMaterialCard = ({ item, index }) => (
    <Card 
      sx={{ 
        mb: 1.5, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e3f2fd',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#1e293b',
            }}
          >
            {item?.materialName}
          </Typography>
          {(HasPermission("VendorOrderEdit") || HasPermission("VendorOrderDelete")) && (
            <IconButton 
              size="small"
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setObject(item);
              }}
              sx={{ 
                color: '#64748b',
                p: 0.5,
                '&:hover': { backgroundColor: '#f1f5f9' }
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Quantity
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                fontSize: '0.8rem',
                color: '#1e293b',
              }}
            >
              {item?.quantity}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Unit Price
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.8rem',
                color: '#059669',
              }}
            >
              {defaultConfig.currencySign} {item?.unitPrice}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      {loder && <ApiLoder />}
      <div className="main_container">
        <div className="limani_body">
          <div className="intersight_content">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: { xs: 2, sm: 3 },
              borderBottom: '1px solid #e2e8f0',
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  color: '#1e293b',
                }}
              >
                Vendor Order
              </Typography>
            </Box>
            <div className="body_content">
              <Container maxWidth={false} sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Navigation & Back Button */}
                <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/vendors"
                    startIcon={<ArrowBack />}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Back to Vendors
                  </Button>
                  <Button
                    startIcon={<Inventory />}
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    }}
                  >
                        Vendor Order
                  </Button>
                </Stack>

                {/* Header Section */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' }, 
                  justifyContent: 'space-between', 
                  mb: { xs: 3, sm: 4 },
                  gap: { xs: 2, sm: 0 },
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      color: '#1e293b',
                      borderLeft: '4px solid',
                      borderColor: theme.palette.primary.main,
                      pl: 2,
                    }}
                  >
                          Vendor Order Items
                  </Typography>
                  {HasPermission("VendorOrderEdit") && (
                    <Button
                      variant="contained"
                      startIcon={<Email />}
                            onClick={handlesendInvoice}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(25, 118, 210, 0.25)',
                          transform: 'translateY(-1px)',
                        },
                        minHeight: { xs: '44px', sm: '48px' },
                      }}
                          >
                            Send Order
                    </Button>
                  )}
                </Box>

                {/* Main Content Grid */}
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  {/* Vendor Details Card */}
                  <Grid item xs={12} lg={4}>
                    <Card 
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e3f2fd',
                        height: 'fit-content',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: { xs: 48, sm: 56 },
                              height: { xs: 48, sm: 56 },
                              mr: 2,
                            }}
                          >
                            <Business fontSize={isMobile ? "medium" : "large"} />
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                color: '#1e293b',
                              }}
                            >
                              Vendor Details
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#64748b',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              }}
                            >
                              Order Information
                            </Typography>
                          </Box>
                        </Box>

                        <Stack spacing={2.5}>
                          {[
                            {
                              icon: <Business fontSize="small" />,
                              label: "Vendor Name",
                              value: `${tenantList[0]?.firstName || ''} ${tenantList[0]?.lastName || ''}`.trim() || '---',
                            },
                            {
                              icon: <Inventory fontSize="small" />,
                              label: "Job Name",
                              value: tenantList[0]?.jobName || '---',
                            },
                            {
                              icon: <DateRange fontSize="small" />,
                              label: "Order Number",
                              value: tenantList[0]?.orderNumber || '---',
                            },
                            {
                              icon: <DateRange fontSize="small" />,
                              label: "Order Date",
                              value: tenantList[0]?.orderDate
                                ? moment(tenantList[0].orderDate).format("MMM DD, YYYY")
                                : "---",
                            },
                            {
                              icon: <DateRange fontSize="small" />,
                              label: "Expected Delivery",
                              value: tenantList[0]?.expectedDeliveryDate
                                ? moment(tenantList[0].expectedDeliveryDate).format("MMM DD, YYYY")
                                : "---",
                            },
                            {
                              icon: <DateRange fontSize="small" />,
                              label: "Actual Delivery",
                              value: tenantList[0]?.actualDeliveryDate
                                ? moment(tenantList[0].actualDeliveryDate).format("MMM DD, YYYY")
                                : "---",
                            },
                            {
                              icon: <AttachMoney fontSize="small" />,
                              label: "Total Cost",
                              value: tenantList[0]?.totalAmount ? `${defaultConfig.currencySign} ${tenantList[0]?.totalAmount}` : '---',
                            },
                          ].map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box 
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  backgroundColor: theme.palette.primary.main + '10',
                                  borderRadius: '50%',
                                  p: 1,
                                  minWidth: 32,
                                  height: 32,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {item.icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: '#64748b',
                                    fontWeight: 500,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                  }}
                                >
                                  {item.label}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#1e293b',
                                    fontWeight: item.label === 'Total Cost' ? 700 : 500,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    mt: 0.5,
                                  }}
                                >
                                  {item.value}
                                </Typography>
                              </Box>
                            </Box>
                          ))}

                          {/* Status */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box 
                              sx={{ 
                                color: '#8b5cf6',
                                backgroundColor: '#8b5cf610',
                                borderRadius: '50%',
                                p: 1,
                                minWidth: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Business fontSize="small" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#64748b',
                                  fontWeight: 500,
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                Status
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                <Chip
                                  label={tenantList[0]?.vendorOrderStatus || 'Unknown'}
                                  size="small"
                                  sx={{
                                    backgroundColor: tenantList[0]?.vendorOrderStatus === 'Approved' ? '#dcfce7' : '#fef3c7',
                                    color: tenantList[0]?.vendorOrderStatus === 'Approved' ? '#16a34a' : '#d97706',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          {/* Notes */}
                          {tenantList[0]?.notes && (
                            <Box>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#64748b',
                                  fontWeight: 500,
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                Notes
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#475569',
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  mt: 1,
                                  fontStyle: 'italic',
                                }}
                              >
                                {tenantList[0]?.notes}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Materials List */}
                  <Grid item xs={12} lg={8}>
                    <Card 
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e3f2fd',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: '#059669',
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 },
                              mr: 2,
                            }}
                          >
                            <Inventory fontSize={isMobile ? "small" : "medium"} />
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                color: '#1e293b',
                              }}
                            >
                              Order Materials
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#64748b',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              }}
                            >
                              {tenantList[0]?.vendorOrderItems?.length || 0} materials
                            </Typography>
                          </Box>
                        </Box>

                        {/* Materials Content */}
                        {isMobile ? (
                          // Mobile Card View
                          <Box>
                            {tenantList[0]?.vendorOrderItems && tenantList[0]?.vendorOrderItems?.length > 0 ? (
                              <Stack spacing={1.5}>
                                {tenantList[0]?.vendorOrderItems?.map((item, index) => (
                                  <MobileMaterialCard key={index} item={item} index={index} />
                                ))}
                              </Stack>
                            ) : (
                              <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <Inventory sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                                  No materials found
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  This order doesn't have any materials yet
                                </Typography>
                              </Card>
                            )}
                          </Box>
                        ) : (
                          // Desktop Table View
                          <TableContainer
                            sx={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              overflow: 'auto',
                            }}
                          >
                            <Table 
                              sx={{
                                '& .MuiTableCell-root': {
                                  padding: isTablet ? '8px' : '12px',
                                  fontSize: isTablet ? '0.8rem' : '0.875rem',
                                },
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  {['Material Name', 'Quantity', 'Unit Price', 'Actions'].map((header) => (
                                    <TableCell
                                      key={header}
                                      sx={{
                                        backgroundColor: '#f8fafc',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        borderBottom: '2px solid #e2e8f0',
                                      }}
                                    >
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {tenantList[0]?.vendorOrderItems && tenantList[0]?.vendorOrderItems?.length > 0 ? (
                                  tenantList[0]?.vendorOrderItems?.map((item, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        '&:nth-of-type(odd)': {
                                          backgroundColor: '#fafbfc',
                                        },
                                        '&:hover': {
                                          backgroundColor: '#f1f5f9',
                                        },
                                        transition: 'all 0.2s ease',
                                      }}
                                    >
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            fontWeight: 600,
                                            color: '#1e293b',
                                          }}
                                        >
                                          {item?.materialName}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            color: '#475569',
                                          }}
                                        >
                                          {item?.quantity}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            color: '#059669',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {defaultConfig.currencySign} {item?.unitPrice}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            setAnchorEl(e.currentTarget);
                                            setObject(item);
                                          }}
                                          sx={{
                                            color: '#64748b',
                                            '&:hover': {
                                              backgroundColor: '#f1f5f9',
                                            },
                                          }}
                                        >
                                          <MoreVert fontSize="small" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <Inventory sx={{ fontSize: 48, color: '#94a3b8' }} />
                                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                                          No materials found
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                          This order doesn't have any materials yet
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}

                        {/* Total */}
                        {tenantList[0]?.vendorOrderItems && tenantList[0]?.vendorOrderItems?.length > 0 && (
                          <Box sx={{ 
                            mt: 3, 
                            pt: 2, 
                            borderTop: '2px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: '#059669',
                                  fontWeight: 700,
                                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                }}
                              >
                                Total: {defaultConfig.currencySign} {tenantList[0]?.totalAmount}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#64748b',
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                }}
                              >
                                Including all materials
                              </Typography>
                            </Box>
                          </Box>
                                                )}

                        {/* Original Pagination */}
                        {tenantList[0]?.vendorOrderItems && tenantList[0]?.vendorOrderItems?.length > 0 && (
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
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Container>
            </div>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          }
        }}
      >
        {HasPermission("VendorOrderEdit") && (
          <MenuItem onClick={() => handleedit(object)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {HasPermission("VendorOrderDelete") && (
          <MenuItem onClick={() => handledelete(object)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Modals */}
      {open && (
        <EditVendorMaterial
        open={open}
        handleclose={handleclose}
        action={action}
        object={object}
        LanguageListAPI={handleapi}
        vendorOrderId={tenantList[0]?.vendorOrderId}
        materials={tenantList[0]?.vendorOrderItems}
        vendorId={tenantList[0]?.vendorId}
      />
      )}
      {delOpen && (
        <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.materialName}
        id={object?.vendorOrderItemId}
        handleDelete={handleDelete}
        loder={loder}
      />
      )}
    </>
  );
}

export default VendorOrderDetail;