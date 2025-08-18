import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import ExportFile from "../../../helpers/ExportFile";
import { defaultConfig } from "../../../config";
import { Link } from "react-router-dom";

const Breakdown = ({
  open,
  handleClose,
  data,
  EstimateId = "",
  IsView = false,
}) => {
  const [tenantList, setTenantList] = useState([]);
  const [tenantList2, setTenantList2] = useState([]);
  const [shows, setShows] = useState(false);
  const [show, setShow] = useState(false);
   const [name, setname] = useState("");

  const TenantlistAPI = async () => {
    let query = {
      WindowProductIds: [data.windowProdcutId],
      IsBreakDown: true,
      EstimateId: EstimateId,
      IsView: IsView,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(
        apiUrls.BuildEstimate,
        {},
        "POST",
        query
      );
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        console.log("apiResponse?.data?.data", apiResponse?.data?.data)
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setShow(false);
    }
  };
  useEffect(() => {
    if (data.windowProdcutId) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [open]);

  const TenantlistAPI2 = async (componentId) => {
    let query = {
      WindowProductIds: [data.windowProdcutId],
      IsBreakDown: true,
      EstimateId: EstimateId,
      IsView: IsView,
      IsMaterialBreakdown: true,
    };
    try {
      setShow(true);
      const apiResponse = await callAPI(
        apiUrls.BuildEstimate,
        {},
        "POST",
        query
      );
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
       const filter = apiResponse?.data?.data.filter((val)=> val.componentId ===componentId)
        setTenantList2(filter);
      } else {
        setTenantList2([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setShow(false);
    }
  };

  const handlemat = (name,componentId)=>{
     setname(name)
     setShows(true)
    TenantlistAPI2(componentId);
  }
 

  const token = localStorage.getItem("accessToken");

  const componentprice = tenantList?.reduce(
    (sum, item) => sum + item.price || 0,
    0
  );

  const optionprice = tenantList
    .flatMap((val) => val?.optionTaxDetails || [])
    .sort((a, b) => a.optionName.localeCompare(b.optionName))
    .reduce((sum, item) => sum + (item.optionPrice || 0), 0);

  const overheadprice =
    Number(tenantList[0]?.componentMarkup || 0) +
    Number(tenantList[0]?.productMarkup || 0) +
    Number(tenantList[0]?.optionMarkup || 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(480));

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: isMobile ? "100%" : "90vw",
            margin: isMobile ? 0 : 2,
            height: isMobile ? "100%" : "auto",
            maxHeight: isMobile ? "100%" : "90vh",
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            p: isSmallMobile ? 1.5 : 2,
            fontSize: isExtraSmall ? '1rem' : isMobile ? '1.1rem' : '1.25rem',
            fontWeight: 600,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="span" sx={{ fontSize: 'inherit' }}>
              Breakdown
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 0,
            '&.MuiDialogContent-root': {
              paddingTop: 0
            }
          }}
        >
          <Box sx={{ p: isSmallMobile ? 1 : 2 }}>
            <Box>
              <ApiLoder open={show} />
              
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems={isMobile ? "flex-start" : "center"}
                flexDirection={isMobile ? "column" : "row"}
                gap={2}
                mb={3}
              >
                <Typography 
                  variant={isSmallMobile ? "subtitle1" : "h6"}
                  className="body_heading"
                  sx={{ 
                    fontSize: isExtraSmall ? '0.95rem' : isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    borderLeft: 3,
                    borderColor: 'primary.main',
                    pl: 2,
                    mb: 0,
                    wordBreak: 'break-word'
                  }}
                >
                  {data?.label}
                </Typography>
                
                {token && tenantList?.length !== 0 && (
                  <Box sx={{ alignSelf: isMobile ? 'stretch' : 'auto' }}>
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
                      WindowProductId={data.windowProdcutId}
                      EstimationId={""}
                    />
                  </Box>
                )}
              </Box>
              {/* Mobile Card Layout */}
              {isSmallMobile ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {/* Basic Information Card */}
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Product Information
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Product Type
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                            {tenantList[0]?.productTypeName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Product
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            <Link
                              to={`/products/detail/${tenantList[0]?.productId}`}
                              target="_blank"
                              style={{ 
                                color: theme.palette.primary.main, 
                                textDecoration: 'none',
                                wordBreak: 'break-word'
                              }}
                            >
                              {tenantList[0]?.productName}
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">
                            Qty
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tenantList[0]?.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">
                            Width
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tenantList[0]?.buildWidth}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">
                            Height
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tenantList[0]?.buildHeight}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Components */}
                  {tenantList?.filter(val => val.componentId).length > 0 && (
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Components
                        </Typography>
                        <Stack spacing={1}>
                          {tenantList?.map((val, i) =>
                            val.componentId && (
                              <Box key={i} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1
                              }}>
                                <Box sx={{ flex: 1, mr: 1 }}>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Link
                                      to={`/component/detail/${val.componentId}`}
                                      target="_blank"
                                      style={{ 
                                        color: theme.palette.primary.main, 
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        wordBreak: 'break-word'
                                      }}
                                    >
                                      {val?.componentName}
                                    </Link>
                                    {val.isMaterialBreakdown && (
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          handlemat(val?.componentName, val.componentId);
                                        }}
                                        sx={{ 
                                          bgcolor: '#fff',
                                          width: 20,
                                          height: 20,
                                          '&:hover': { bgcolor: 'grey.100' }
                                        }}
                                      >
                                        <img 
                                          src="/image/breakdown.svg" 
                                          alt="breakdown" 
                                          style={{ width: 12, height: 12 }}
                                        />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Box>
                                <Chip 
                                  label={`${defaultConfig.currencySign} ${val.price ?? 0}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            )
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                  {/* Options */}
                  {tenantList && 
                    tenantList.flatMap((val) => val?.optionTaxDetails || []).length > 0 && (
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Options
                        </Typography>
                        <Stack spacing={1}>
                          {tenantList
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) => a.optionName.localeCompare(b.optionName))
                            .map((opt, idx) => (
                              <Box key={idx} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1
                              }}>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word', flex: 1, mr: 1 }}>
                                  {opt.optionName} - {opt.optionTypeName}
                                </Typography>
                                <Chip 
                                  label={`${defaultConfig.currencySign} ${opt.optionPrice || 0}`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Box>
                            ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                  {/* Totals */}
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Totals
                      </Typography>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Sub Total
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {defaultConfig.currencySign} {(Number(componentprice) + Number(optionprice))?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Over Head
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {defaultConfig.currencySign} {overheadprice?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Total
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {defaultConfig.currencySign} {(Number(componentprice) + Number(optionprice) + overheadprice)?.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              ) : (
                /* Desktop/Tablet Table Layout */
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    mt: 2,
                    overflowX: 'auto',
                    '& .MuiTable-root': {
                      minWidth: isMobile ? 800 : 'auto'
                    }
                  }}
                >
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Product Type
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Window Qty
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Product Width
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Product Height
                        </TableCell>

                        {tenantList?.map(
                          (val, i) =>
                            val.componentId && (
                              <TableCell key={i} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Link
                                    to={`/component/detail/${val.componentId}`}
                                    target="_blank"
                                    style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                                  >
                                    {val?.componentName}
                                  </Link>
                                  {val.isMaterialBreakdown && (
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handlemat(val?.componentName, val.componentId);
                                      }}
                                      sx={{ 
                                        bgcolor: '#fff',
                                        width: isMobile ? 20 : 24,
                                        height: isMobile ? 20 : 24,
                                        '&:hover': { bgcolor: 'grey.100' }
                                      }}
                                    >
                                      <img 
                                        src="/image/breakdown.svg" 
                                        alt="breakdown" 
                                        style={{ width: isMobile ? 12 : 16, height: isMobile ? 12 : 16 }}
                                      />
                                    </IconButton>
                                  )}
                                </Box>
                              </TableCell>
                            )
                        )}

                        {tenantList &&
                          tenantList
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <TableCell key={idx} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {opt.optionName} - {opt.optionTypeName}
                              </TableCell>
                            ))}

                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Sub Total
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Over Head
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {tenantList[0]?.productTypeName}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          <Link
                            to={`/products/detail/${tenantList[0]?.productId}`}
                            target="_blank"
                            style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                          >
                            {tenantList[0]?.productName}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {tenantList[0]?.quantity}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {tenantList[0]?.buildWidth}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {tenantList[0]?.buildHeight}
                        </TableCell>
                        
                        {tenantList?.map((val, i) =>
                          val.componentId ? (
                            <TableCell key={i} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {defaultConfig.currencySign} {val.price ?? 0}
                            </TableCell>
                          ) : null
                        )}

                        {tenantList &&
                          tenantList
                            .flatMap((val) => val?.optionTaxDetails || [])
                            .sort((a, b) =>
                              a.optionName.localeCompare(b.optionName)
                            )
                            .map((opt, idx) => (
                              <TableCell key={idx} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                                {defaultConfig.currencySign}{" "}
                                {opt.optionPrice || 0}
                              </TableCell>
                        ))}

                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {defaultConfig.currencySign}{" "}
                          {(
                            Number(componentprice) + Number(optionprice)
                          )?.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {defaultConfig.currencySign}{" "}
                          {overheadprice?.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {defaultConfig.currencySign}{" "}
                          {(
                            Number(componentprice) +
                            Number(optionprice) +
                            overheadprice
                          )?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {(!tenantList || tenantList?.length === 0) && (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center"
                  py={4}
                  sx={{ textAlign: 'center' }}
                >
                  <img
                    src="/image/no-records.svg"
                    alt="No records"
                    loading="lazy"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      width: isMobile ? '120px' : '150px'
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      color: 'text.secondary'
                    }}
                  >
                    No Breakdown available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={shows}
        onClose={() => setShows(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: isMobile ? "100%" : "600px",
            margin: isMobile ? 0 : 2,
            height: isMobile ? "100%" : "auto",
            maxHeight: isMobile ? "100%" : "80vh",
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            p: isSmallMobile ? 1.5 : 2,
            fontSize: isExtraSmall ? '1rem' : isMobile ? '1.1rem' : '1.25rem',
            fontWeight: 600,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="span" sx={{ fontSize: 'inherit' }}>
              {data?.label}
            </Typography>
            <IconButton onClick={() => setShows(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 0,
            '&.MuiDialogContent-root': {
              paddingTop: 0
            }
          }}
        >
          <Box className="intersight_content" sx={{ p: isSmallMobile ? 1 : 2 }}>
            <Box className="body_content">
              <ApiLoder open={show} />
              
              <Box mb={3}>
                <Typography 
                  variant={isSmallMobile ? "subtitle1" : "h6"}
                  className="body_heading"
                  sx={{ 
                    fontSize: isExtraSmall ? '0.95rem' : isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    borderLeft: 3,
                    borderColor: 'primary.main',
                    pl: 2,
                    mb: 0,
                    wordBreak: 'break-word'
                  }}
                >
                  {name}
                </Typography>
              </Box>
              
              {/* Mobile Material Breakdown Card Layout */}
              {isSmallMobile ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {tenantList2?.filter(val => val.materialName && val.isMaterialBreakdown).length > 0 ? (
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Material Breakdown
                        </Typography>
                        <Stack spacing={1}>
                          {tenantList2?.map((val, i) =>
                            val.materialName && val.isMaterialBreakdown && (
                              <Box key={i} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1
                              }}>
                                <Typography variant="body2" sx={{ 
                                  wordBreak: 'break-word', 
                                  flex: 1, 
                                  mr: 1,
                                  fontWeight: 500
                                }}>
                                  {val?.materialName}
                                </Typography>
                                <Chip 
                                  label={`${defaultConfig.currencySign} ${val?.materialPrice}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            )
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ) : (
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      justifyContent="center"
                      py={4}
                      sx={{ textAlign: 'center' }}
                    >
                      <img
                        src="/image/no-records.svg"
                        alt="No records"
                        loading="lazy"
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto',
                          width: '120px'
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2,
                          fontSize: '0.75rem',
                          color: 'text.secondary'
                        }}
                      >
                        No Material Breakdown available
                      </Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                /* Desktop/Tablet Table Layout */
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    mt: 2,
                    overflowX: 'auto',
                    '& .MuiTable-root': {
                      minWidth: isMobile ? 400 : 'auto'
                    }
                  }}
                >
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        {tenantList2?.map(
                          (val, i) =>
                            val.materialName && val.isMaterialBreakdown && (
                              <TableCell 
                                key={i} 
                                sx={{ 
                                  fontSize: isMobile ? '0.75rem' : '0.875rem', 
                                  fontWeight: 600, 
                                  whiteSpace: 'nowrap' 
                                }}
                              >
                                {val?.materialName}
                              </TableCell>
                            )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {tenantList2?.map(
                          (val, i) =>
                            val.materialName && val.isMaterialBreakdown && (
                              <TableCell 
                                key={i} 
                                sx={{ 
                                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                                  fontWeight: 600
                                }}
                              >
                                {defaultConfig.currencySign} {val?.materialPrice}
                              </TableCell>
                            )
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* No records message is now handled within the mobile/desktop conditional layouts */}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Breakdown;
