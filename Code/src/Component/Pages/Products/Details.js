import React, { useEffect, useState } from "react";
import {  Link, useParams } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, BackButton, Delete, ErrorMessage, HasPermission, SuccessMessage } from "../../../helpers/common";
import AddSinglecomponent from "./AddSinglecomponent";
import AddEditButton from "../../Form/AddEditButton";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Details() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [object, setObject] = useState("");
  
  const param = useParams();

  const TenantlistAPI = async () => {
    let query = {
      searchValue: param.productId,
      pageNo: 1,
      recordPerPage: 10,
      tenantId: ""
      ,status:"2"
    };
    setLoader(true);
   try {
    const apiResponse = await callAPI(apiUrls.Product, {}, "POST", query);
    setLoader(false);
    if (apiResponse?.data?.isSuccess) {
        setObject("");
      setTenantList(apiResponse?.data?.data);
    } else {
      setTenantList([]);
      ErrorMessage(apiResponse?.data?.message)
    }
   } catch (error) {
    setLoader(false)
   }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, [param.productId]);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.DeleteProductComponent,
        { id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        TenantlistAPI();
       
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

  const handleedit = (item) => {
    setObject(item);
    setOpen(true);
  };


  return (
    <div className="intersight_content">
      {loder && <ApiLoder />}
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header title="Products" />

        <Box className="body_content">
          <Box sx={{ mb: 3 }}>
            <BackButton link="/products"/>
          </Box>
         
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <TableTitle title="Products Details" />
          </Box>

          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Product Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {tenantList[0]?.productName || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Product Type
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {tenantList[0]?.productTypeName || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Markup %
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {tenantList[0]?.markup ? `${tenantList[0]?.markup}%` : '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={tenantList[0]?.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{ 
                        backgroundColor: tenantList[0]?.isActive ? 'success.main' : 'error.main',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {tenantList[0]?.notes || '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {tenantList[0]?.isComponentAvailable && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Component Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {HasPermission("ProductsAdd") && (
                    <AddEditButton
                      handleClick={() => {
                        setOpen(true);
                      }}
                      title="Add Component"
                    />
                  )}
                </Box>
              </Box>

              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.default' }}>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Component Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Expression Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Pricing Expression
                        </TableCell>
                        {(HasPermission("ProductsEdit") || HasPermission("ProductsDelete")) && (
                          <TableCell 
                            align="right" 
                            sx={{ fontWeight: 600, color: 'text.primary' }}
                          >
                            Action
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tenantList[0]?.productComponents?.map((val, i) => (
                        <TableRow 
                          key={i}
                          sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell>
                            <Link 
                              to={`/component/detail/${val.componentId}`}
                              style={{ 
                                color: '#1976d2', 
                                textDecoration: 'none',
                                fontWeight: 500
                              }}
                            >
                              {val?.componentName}
                            </Link>
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {val?.pricingExpressionName || '---'}
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {val?.pricingExpressionFormula?.join("") || '--'}
                          </TableCell>
                          {(HasPermission("ProductsEdit") || HasPermission("ProductsDelete")) && (
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                {HasPermission("ProductsEdit") && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleedit(val)}
                                    sx={{ 
                                      color: 'primary.main',
                                      '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                )}
                                {HasPermission("ProductsDelete") && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handledelete(val)}
                                    sx={{ 
                                      color: 'error.main',
                                      '&:hover': { backgroundColor: 'error.light', color: 'white' }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      {open && (
        <AddSinglecomponent
          open={open}
          handleclose={handleclose}
          LanguageListAPI={TenantlistAPI}
          ProductId={param.productId}
          object={object}
          produttype={tenantList[0]?.productType}
          Listmaterial={tenantList[0]?.productComponents}
        />
      )}
      <Delete 
        open={delOpen} 
        handleClose={handledelclose} 
        title={object.componentName} 
        id={object?.productComponentId} 
        handleDelete={handleDelete} 
        loder={loder}
      />
    </div>
  );
}
