import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddSinglematerial from "./AddSinglematerial";
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
    try {
      let query = {
        searchValue: param.componentId,
        pageNo: 1,
        recordPerPage: 10,
        tenantId: "",
        status: "2",
      };
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.Component, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setObject("");
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, [param.componentId]);

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
        apiUrls.DeleteComponentMaterial,
        { Id: id },
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

      <ApiLoder open={loder} />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header title="Component" />

        <Box  className="body_content">
          <Box sx={{ mb: 3 }}>
            <BackButton link="/component" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <TableTitle title="Component Details" />
          </Box>

          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2.4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                      Component Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {tenantList[0]?.componentName || '-'}
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
                      {tenantList[0]?.markupPercentage ? `${tenantList[0]?.markupPercentage}%` : '-'}
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
                      color={tenantList[0]?.isActive ? "success" : "error"}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500 }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2
              }}
            >
              Material Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {HasPermission("ComponentAdd") && (
                <AddEditButton
                  handleClick={() => {
                    setOpen(true);
                  }}
                  title="Add Material"
                />
              )}
            </Box>
          </Box>

          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Raw Material</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Expression Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Pricing Expression</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Waste %</TableCell>
                    {(HasPermission("ComponentEdit") ||
                      HasPermission("ComponentDelete")) && (
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
                  {tenantList[0]?.componentMaterials?.map((val, i) => (
                    <TableRow 
                      key={i}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&:last-child td, &:last-child th': { border: 0 } 
                      }}
                    >
                      <TableCell>
                        <Typography
                          component={Link}
                          to={`/material`}
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                              color: 'primary.dark'
                            }
                          }}
                        >
                          {val?.materialName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {val?.expressionName || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {val?.displayArray?.join("") || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {val?.quantity || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {val?.wasteFactor ? `${val?.wasteFactor}%` : '-'}
                        </Typography>
                      </TableCell>
                      {(HasPermission("ComponentEdit") ||
                        HasPermission("ComponentDelete")) && (
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            {HasPermission("ComponentEdit") && (
                              <IconButton
                                size="small"
                                onClick={() => handleedit(val)}
                                sx={{
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            {HasPermission("ComponentDelete") && (
                              <IconButton
                                size="small"
                                onClick={() => handledelete(val)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'error.dark'
                                  }
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
      </Box>

      {open && (
        <AddSinglematerial
          open={open}
          handleclose={handleclose}
          LanguageListAPI={TenantlistAPI}
          componentId={param.componentId}
          object={object}
          Listmaterial={tenantList[0]?.componentMaterials}
          produttype={tenantList[0]?.productType}
        />
      )}
      
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.materialName}
          id={object?.componentMaterialId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </div>
  );
}
