import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Divider,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  StickyNote2 as NotesIcon,
  VpnKey as AccessCodeIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";

import AddEditAddress from "./AddEditAddress";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  FormatPhoneNumber,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { Link, useParams } from "react-router-dom";

// Modern Pagination Component
function ModernPagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange, 
  onItemsPerPageChange 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        mt: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        {/* Results Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing <strong>{startItem}-{endItem}</strong> of <strong>{totalItems}</strong> addresses
          </Typography>
        </Box>

        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Items per page selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Show:
            </Typography>
            <Select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(e.target.value)}
              size="small"
              sx={{
                minWidth: 70,
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontSize: '14px'
                }
              }}
            >
              {[5, 10, 15, 25, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Modern Pagination */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPagination-ul': {
                gap: 0.5,
              },
              '& .MuiPaginationItem-root': {
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderColor: 'primary.main',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

// Address Card Component
function AddressCard({ address, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getAddressIcon = (label) => {
    switch(label) {
      case "Home":
        return <HomeIcon />;
      case "Office":
        return <BusinessIcon />;
      default:
        return <LocationIcon />;
    }
  };

  const getAddressColor = (label) => {
    switch(label) {
      case "Home":
        return "success";
      case "Office":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {address?.firstName} {address?.lastName}
              </Typography>
            </Box>
            <Chip 
              icon={getAddressIcon(address?.label)}
              label={address?.label} 
              size="small" 
              color={getAddressColor(address?.label)}
              variant="outlined"
            />
          </Box>
          
          {(HasPermission("AddressEdit") || HasPermission("AddressDelete")) && (
            <>
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVertIcon />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                }}
              >
                {HasPermission("AddressEdit") && (
                  <MenuItem onClick={() => { onEdit(address); handleMenuClose(); }}>
                    <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                    Edit
                  </MenuItem>
                )}
                {HasPermission("AddressDelete") && !address.isBillingAddress && (
                  <MenuItem onClick={() => { onDelete(address); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                    Delete
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>

        {/* Address */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1, mt: 0.2 }} />
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.4 }}>
            {address?.zipCode} {address?.streetAddress}, {address?.stateName}, {address?.city}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contact Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 600, 
                  textTransform: 'uppercase' 
                }}>
                  Phone No.
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, pl: 2.5 }}>
                {FormatPhoneNumber(address?.phone || "")}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 600, 
                  textTransform: 'uppercase' 
                }}>
                  Email Address
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, pl: 2.5 }}>
                {address?.email || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <NotesIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 600, 
                  textTransform: 'uppercase' 
                }}>
                  Additional Directions
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, pl: 2.5 }}>
                {address?.notes || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <AccessCodeIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 600, 
                  textTransform: 'uppercase' 
                }}>
                  Access Codes
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, pl: 2.5 }}>
                {address?.accessCode || "—"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function Addresslist() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const handleChangePage = (newPage) => {
    TenantlistAPI(newPage, rowsPerPage, "");
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    const pageNo = 1; // Reset to first page
    TenantlistAPI(pageNo, newRowsPerPage, "");
    setRowsPerPage(newRowsPerPage);
    setPage(pageNo);
  };
  
  const param = useParams();
  
  const TenantlistAPI = async (page, perpage, serach) => {
    let query = {
      searchValue: param.contactId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Address, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, "");
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    const pageNo = 1; // Reset to first page
    TenantlistAPI(pageNo, rowsPerPage, "");
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
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.AddressDelete,
        { Id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        const pageNo = 1; // Reset to first page after delete
        TenantlistAPI(pageNo, rowsPerPage, "");
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

  return (
    <>
      <ApiLoder open={loder} />
      
      <Box sx={{ p: 0 }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Manage Address
              </Typography>
            </Box>
            
            {HasPermission("AddressAdd") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAction("add");
                  setOpen(true);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Add New Address
              </Button>
            )}
          </Box>
        </Paper>

        {/* Address Grid */}
        <Grid container spacing={3}>
          {tenantList.map((address, i) => (
            <Grid item xs={12} lg={6} key={i}>
              <AddressCard
                address={address}
                onEdit={handleedit}
                onDelete={handledelete}
              />
            </Grid>
          ))}

          {/* No Records */}
          {(!tenantList || tenantList?.length === 0) && (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <LocationIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                  No Addresses Found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  There are no addresses associated with this contact yet.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Modern Pagination */}
        {tenantList && tenantList?.length > 0 && (
          <ModernPagination
            totalItems={paginatedItems}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
            onItemsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>

      {open && (
        <AddEditAddress
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={handleapi}
          object={object}
        />
      )}
      
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.label}
        id={object?.addressId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}
