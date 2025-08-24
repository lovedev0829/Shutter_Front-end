import React, { useEffect, useState } from "react";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddEditButton from "../../Form/AddEditButton";
import AddEditWindow from "./AddEditWindow";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { 
  TablePagination,
  Box,
  Typography,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  FormControlLabel,
  Chip,
  Stack
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Window } from "../../../Redux/Redux/Action/Action";
import Imagepreview from "../../MultiImage/Imagepreview";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from "../../Form/MaterialUIComponents";
import { useNavigate } from "react-router-dom";

function WindowTable({ listdata }) {
  const [multiImage, setMultiImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const [selectedParentId, setSelectedParentId] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItemIndex, setMenuItemIndex] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuildEstimate = () => {
    if (selectedParentId.length > 0) {
      navigate(`/contacts/estimate/${listdata?.jobId}`);
    }
  };
  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage) => {
    let query = {
      searchValue: listdata?.jobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: "2",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Window, {}, "POST", query);
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
    if (listdata?.jobId) {
      TenantlistAPI(1, rowsPerPage);
      setPage(1);
    }

    // eslint-disable-next-line
  }, [listdata?.jobId]);

  const handleclose = () => {
    setOpen(false);
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    const windowdata =
      item?.productDetails?.map((product, productIndex) => {
        var optionTypes =
          product?.windowOptions?.map((option) => {
            return option?.optionTypeId;
          }) || [];

        return {
          productId: product?.productId,
          productTypeId: product?.productTypeId,
          optionTypeId: optionTypes,
          buildWidth: product?.buildWidth,
          buildHeight: product?.buildHeight,
        };
      }) || [];

    // Extract additional costs from window options
    const additionalCosts = [];
    item?.productDetails?.forEach((product, productIndex) => {
      const additionalCostData = {};
      
      product?.windowOptions?.forEach((option) => {
        if (option?.additionalCost && option?.additionalCost > 0) {
          const costKey = `${option?.optionName}-${productIndex}`;
          additionalCostData[costKey] = {
            optionTypeId: option?.optionTypeId,
            optionGroupName: option?.optionName,
            optionType: option?.optionName,
            additionalCost: option?.additionalCost.toString(),
            requirePriceAtEstimatePreview: true
          };
        }
      });

      if (Object.keys(additionalCostData).length > 0) {
        additionalCosts.push({
          indexId: productIndex,
          data: additionalCostData
        });
      }
    });

    const defaultState = {
      windowId: item?.windowId,
      contactId: listdata?.contactId,
      addressId: item?.addressId,
      jobId: item?.jobId,
      quantity: item?.quantity,
      label: item?.label,
      width: item?.width,
      height: item?.height,
      archHeight: item?.archHeight,
      notes: item?.notes,
      photo: item?.photo,
      // isRated:item?.isRated,
      windowProducts: windowdata,
      additionalCosts: additionalCosts,
      productDetails: item?.productDetails, // Add raw product details for window options
    };

    setAction("edit");
    setObject(defaultState);
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
        apiUrls.WindowDelete,
        { WindowId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage);
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

  const handleRadioChange = (
    id,
    parentIndex,
    label,
    height,
    width,
    archHeight
  ) => {
    setSelectedParentId((prev) => {
      const updatedSelection = prev.filter(
        (existingId) => existingId.parentIndex !== parentIndex
      );
      return [
        ...updatedSelection,
        { ...id, parentIndex, label, height, width, archHeight },
      ];
    });
  };
  useEffect(() => {
    dispatch(Window(selectedParentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentId]);

  const handleRemoveRadio = (parentIndex) => {
  setSelectedParentId((prev) =>
    prev.filter((item) => item.parentIndex !== parentIndex)
  );
};



  const resetObject = () => {
    setObject("");
  };
  
  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuItemIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemIndex(null);
  };

  const HandleImagePreview = () => setMultiImage(false);
  const Loginuser = JSON.parse(localStorage.getItem("userData"));
  
  return (
    <>
      <ApiLoder open={loder} />
      <PageHeader
        title="Window Measurements"
        subtitle="Manage window specifications and measurements for your project"
        actions={
          <Stack direction="row" spacing={2} alignItems="center">
            {HasPermission("EstimateAdd") && listdata?.tenantId === Loginuser?.tenantId && selectedParentId.length > 0 && (
              <Button
                variant="contained"
                onClick={handleBuildEstimate}
                disabled={selectedParentId.length === 0}
                startIcon={<AddIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2
                }}
              >
                Build Estimate ({selectedParentId.length})
              </Button>
            )}
            {HasPermission("WindowAdd") && listdata?.tenantId === Loginuser?.tenantId && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAction("add");
                  setOpen(true);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2
                }}
              >
                Add Window
              </Button>
            )}
          </Stack>
        }
      />


      {tenantList?.map((val, i) => (
        <Paper key={i} sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 500, fontSize: '1rem' }}>
              {val?.label}
            </Typography>
            {(HasPermission("WindowEdit") || HasPermission("WindowDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
              <Box>
                <IconButton
                  onClick={(event) => handleMenuClick(event, i)}
                  sx={{ 
                    color: '#666',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuItemIndex === i}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      mt: 1
                    }
                  }}
                >
                  {HasPermission("WindowEdit") && (
                    <MenuItem 
                      onClick={() => {
                        handleedit(val);
                        handleMenuClose();
                      }}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />
                      Edit
                    </MenuItem>
                  )}
                  {HasPermission("WindowDelete") && (
                    <MenuItem 
                      onClick={() => {
                        handledelete(val);
                        handleMenuClose();
                      }}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            )}
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#333' }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Product Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Dimensions</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Build Width</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Build Height</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333' }}>Photo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {val?.productDetails?.map((vals, ind) => (
                  <TableRow 
                    key={ind}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {listdata?.tenantId === Loginuser?.tenantId && (
                          <FormControlLabel
                            control={
                              <Radio
                                size="small"
                                name={`parentRadio-${i}`}
                                checked={selectedParentId.some(
                                  (id) =>
                                    id.windowProductId === vals.windowProductId &&
                                    id.parentIndex === i
                                )}
                                onChange={() =>
                                  handleRadioChange(
                                    vals,
                                    i,
                                    val?.label,
                                    val?.height,
                                    val?.width,
                                    val?.archHeight
                                  )
                                }
                                sx={{
                                  color: '#1976d2',
                                  '&.Mui-checked': {
                                    color: '#1976d2',
                                  }
                                }}
                              />
                            }
                            label={val.quantity}
                            sx={{ margin: 0 }}
                          />
                        )}
                        {selectedParentId.some(
                          (id) =>
                            id.windowProductId === vals.windowProductId &&
                            id.parentIndex === i
                        ) && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveRadio(i)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{vals?.productTypeName}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/products/detail/${vals.productId}`}
                        variant="text"
                        sx={{
                          textTransform: 'none',
                          color: '#1976d2',
                          padding: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {vals?.productName}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        W: {val?.width}", H: {val?.height}", A: {val?.archHeight}"
                      </Typography>
                    </TableCell>
                    <TableCell>{vals?.buildWidth}</TableCell>
                    <TableCell>{vals?.buildHeight}</TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          cursor: 'pointer' 
                        }}
                        onClick={() => {
                          setSelectedImages(val || {});
                          setMultiImage(true);
                        }}
                      >
                        <Box
                          component="img"
                          src={val?.photo[0] || "/image/no-image.jpg"}
                          alt=""
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        {val?.photo?.length > 1 && (
                          <Chip
                            label={`+${val?.photo?.length - 1}`}
                            size="small"
                            sx={{
                              backgroundColor: '#1976d2',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {multiImage && (
            <Imagepreview
              imagesData={selectedImages}
              imageopen={multiImage}
              handlecloseImage={HandleImagePreview}
            />
          )}
        </Paper>
      ))}
      {(!tenantList || tenantList?.length === 0) && (
        <Paper sx={{ 
          textAlign: 'center', 
          p: 6, 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Box
            component="img"
            src="/image/no-records.svg"
            alt="No records found"
            sx={{
              maxWidth: 100,
              width: '100%',
              height: 'auto',
              mb: 2
            }}
          />
          <Typography variant="body1" color="text.secondary">
            No Windows Found
          </Typography>
        </Paper>
      )}
      {tenantList && tenantList?.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 3,
          mb: 2
        }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 100]}
            component="div"
            count={paginatedItems}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-toolbar': {
                paddingLeft: 0,
                paddingRight: 0
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: '#666',
                fontSize: '0.875rem'
              }
            }}
          />
        </Box>
      )}
      {open && (
        <AddEditWindow
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={handleapi}
          object={object}
          listdata={listdata}
          resetObject={resetObject}
        />
      )}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.label}
        id={object?.windowId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}

export default WindowTable;
