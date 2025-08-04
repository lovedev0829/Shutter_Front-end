import Header from "../../../Layout/header";
import React, { useEffect, useState } from "react";
import TableTitle from "../../Form/TableTitle";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import PartnerDropdown from "../../../helpers/PartnerDropdown";
import {
  Box,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  Collapse,
  Typography,
  Stack,
  Chip,
  Button,
  Tooltip,
  useTheme,
  alpha,
  Backdrop,
  CircularProgress
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import { defaultConfig } from "../../../config";
import { useParams } from "react-router-dom";

export default function ProductEdit() {
  const theme = useTheme();
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [editedRows, setEditedRows] = useState(new Set());
  const [prices, setPrices] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [prices2, setPrices2] = useState({});
  const [optionPrice, setOptionPrice] = useState({});
  const [filter, setFilter] = useState({
    tenantId: "",
    productType: "",
  });
  const [originalTenantList, setOriginalTenantList] = useState([]);

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(
      filter.tenantId,
      newPage + 1,
      rowsPerPage,
      filter.productType
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      filter.tenantId,
      pageNo,
      parseInt(event.target.value, 10),
      filter.productType
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const TenantlistAPI = async (tenantId, page, perpage, productType) => {
    let query = {
      tenantId: tenantId ? tenantId : "",
      searchValue: "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      productType: productType ? productType : "",
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllManagePartnerProduct,
        {},
        "POST",
        query
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setEditedRows(new Set());
        const data = apiResponse.data.data;
        const deepCopiedData = JSON.parse(JSON.stringify(data));
        setTenantList(apiResponse?.data?.data);
        setOriginalTenantList(deepCopiedData);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);

        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    let pageNo = 1;
    if (e.target.name === "tenantId") {
      TenantlistAPI(e.target.value, pageNo, rowsPerPage, filter.productType);
    }
    if (e.target.name === "productType") {
      TenantlistAPI(filter.tenantId, pageNo, rowsPerPage, e.target.value);
    }
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const toggleMilestone = (index) => {
    setExpandedMilestone(expandedMilestone === index ? null : index);
  };

  const Getproduct = (id) => {
    TenantlistAPI(
      param.tenantId ? param.tenantId : filter.tenantId,
      page,
      rowsPerPage,
      id
    );
    setFilter((val) => {
      return { ...val, productType: id };
    });
  };

  const param = useParams();

  useEffect(() => {
    if (param.tenantId) {
      TenantlistAPI(param.tenantId, page, rowsPerPage, param.tenantId);
      setFilter((val) => {
        return { ...val, tenantId: param.tenantId };
      });
    }
    // eslint-disable-next-line
  }, []);

  // tenantId
  const markEdited = (i) => {
    setEditedRows((prev) => {
      const s = new Set(prev);
      s.add(i);
      return s;
    });
  };

  const handleChanges = (e, productIndex, field) => {
    const { value, type, checked } = e.target;
    const updatedTenantList = [...tenantList];
    updatedTenantList[productIndex][field] =
      type === "checkbox" ? checked : value;
    setTenantList(updatedTenantList);
    markEdited(productIndex);
  };

  // Handle nested optionType changes
  const handleOptionChange = (
    e,
    productIndex,
    optionIndex,
    optionTypeIndex,
    field
  ) => {
    const { value, type, checked } = e.target;
    const updatedTenantList = [...tenantList];
    updatedTenantList[productIndex].options[optionIndex].optionTypes[
      optionTypeIndex
    ][field] = type === "checkbox" ? checked : value;
    setTenantList(updatedTenantList);
    markEdited(productIndex);
  };

  const ProductAdd = async (data) => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(
        apiUrls.ManagePartnersProducts,
        {},
        "POST",
        data
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        SuccessMessage(apiResponse?.data?.message);
        await TenantlistAPI(
          filter.tenantId,
          page,
          rowsPerPage,
          filter.productType
        );
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const clearEdited = (i) => {
    setEditedRows((prev) => {
      const s = new Set(prev);
      s.delete(i);
      return s;
    });
  };

  const handleSubmit = (index) => {
    clearEdited(index);
    const product = tenantList[index];
    const permission = HasPermission("SubTenantView");
    const payload = {
      productId: product.productId,
      ...(permission && {
        wholeSalePrice: product.wholeSalePrice || 0,
      }),
      ...(permission && {
        maxPartnerPrice: product.maxPartnerPrice || 0,
      }),
      ...(!permission && {
        partnerSellingPrice: product.partnerSellingPrice || 0,
      }),
      ...(permission && {
        isAvailable: product.isAvailable,
      }),
      ...(permission && {
        tenantId: filter.tenantId,
      }),
      ...(!permission && {
        taxRateId: product.taxRateId || null,
      }),

      ...(!permission && {
        markupType: product.markupType || "",
      }),
      ...(permission && {
        priceType: product.priceType || "",
      }),

      managePartnerProductOptions: product.options.flatMap((option) =>
        option.optionTypes.map((optionType) => ({
          optionId: option.optionId,
          optionTypeId: optionType.optionTypeId,

          ...(permission && {
            isAvailable: optionType.isAvailable,
          }),
          ...(permission && {
            wholeSalePrice: optionType.wholeSalePrice || 0,
          }),
          ...(permission && {
            maxPrice: optionType.maxPrice || 0,
          }),

          ...(!permission && {
            partnerSellingPrice: optionType.partnerSellingPrice || 0,
          }),
          ...(!permission && {
            markupOptionType: optionType.markupOptionType,
          }),
          ...(permission && {
            priceType: optionType.priceType,
          }),
          ...(!permission && {
            taxRateId: optionType.taxRateId || null,
          }),

          ...(permission && {
            tenantId: filter.tenantId,
          }),
        }))
      ),
    };
    ProductAdd(payload);
  };

  //   const handleSubmit = () => {
  //   const permission = HasPermission("SubTenantView");

  //   const createManagePartnerProducts = tenantList.map((product, index) => {
  //     clearEdited(index);

  //     return {
  //       productId: product.productId,
  //       ...(permission && {
  //         wholeSalePrice: product.wholeSalePrice || 0,
  //       }),
  //       ...(permission && {
  //         maxPartnerPrice: product.maxPartnerPrice || 0,
  //       }),
  //       ...(!permission && {
  //         partnerSellingPrice: product.partnerSellingPrice || 0,
  //       }),
  //       ...(permission && {
  //         isAvailable: product.isAvailable,
  //       }),
  //       ...(permission && {
  //         tenantId: filter.tenantId,
  //       }),
  //       ...(!permission && {
  //         taxRateId: product.taxRateId || null,
  //       }),
  //       ...(!permission && {
  //         markupType: product.markupType || "",
  //       }),
  //       ...(permission && {
  //         priceType: product.priceType || "",
  //       }),

  //       managePartnerProductOptions: product.options?.flatMap((option) =>
  //         option.optionTypes?.map((optionType) => ({
  //           optionId: option.optionId,
  //           optionTypeId: optionType.optionTypeId,
  //           ...(permission && {
  //             isAvailable: optionType.isAvailable,
  //           }),
  //           ...(permission && {
  //             wholeSalePrice: optionType.wholeSalePrice || 0,
  //           }),
  //           ...(permission && {
  //             maxPrice: optionType.maxPrice || 0,
  //           }),
  //           ...(!permission && {
  //             partnerSellingPrice: optionType.partnerSellingPrice || 0,
  //           }),
  //           ...(!permission && {
  //             markupOptionType: optionType.markupOptionType,
  //           }),
  //           ...(permission && {
  //             priceType: optionType.priceType,
  //           }),
  //           ...(!permission && {
  //             taxRateId: optionType.taxRateId || null,
  //           }),
  //           ...(permission && {
  //             tenantId: filter.tenantId,
  //           }),
  //         }))
  //       ) || [],
  //     };
  //   });

  //   const payload = {
  //     createManagePartnerProducts,
  //   };
  //   console.log(payload)

  //   ProductAdd(payload);
  // };

  const Getmsrp = async (ProductId) => {
    if (!ProductId) return;

    setLoadingProductId(ProductId);
    try {
      const apiResponse = await callAPI(
        apiUrls.ManagePartnersProductsGetMSRP,
        { ProductId },
        "GET",
        {}
      );
      setLoadingProductId(null);
      if (apiResponse?.data?.isSuccess) {
        setExpandedProducts((prev) => new Set(prev).add(ProductId));
        setPrices((prev) => ({
          ...prev,
          [ProductId]: apiResponse?.data?.data?.msrp || 0,
        }));

        setOptionPrice((prev) => ({
          ...prev,
          [ProductId]: apiResponse?.data?.data,
        }));

        setPrices2((prev) => ({
          ...prev,
          [ProductId]: apiResponse?.data?.data?.basecost || 0,
        }));
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoadingProductId(null);
    }
  };

  // const handleClear = (index) => {
  //   const product = tenantList[index];
  //   const permission = HasPermission("SubTenantView");
  //   clearEdited(index);
  //   const updatedProduct = {
  //     productId: product.productId,
  //     isComponentAvailable: product.isComponentAvailable,
  //     manageProductId: product.manageProductId,
  //     productName: product.productName,
  //     ...(permission && { wholeSalePrice: 0 }),
  //     ...(!permission && { wholeSalePrice: product.wholeSalePrice }),
  //     ...(permission && { maxPartnerPrice: 0 }),
  //     ...(!permission && { partnerSellingPrice: 0 }),
  //     ...(permission && { isAvailable: false }),
  //     ...(permission && { tenantId: filter.tenantId }),
  //     ...(!permission && { markupType: "Fixed" }),
  //     ...(permission && { priceType: "Fixed" }),
  //     ...(!permission && {
  //       taxRateId: null,
  //     }),

  //     options: product.options.map((option) => ({
  //       optionId: option.optionId,
  //       optionName: option.optionName,
  //       optionTypes: option.optionTypes.map((optionType) => ({
  //         optionId: option.optionId,
  //         optionTypeId: optionType.optionTypeId,
  //         optionTypeName: optionType.optionTypeName,
  //         price: optionType.price, // preserve original price if needed
  //         ...(permission && { wholeSalePrice: 0 }),
  //         ...(!permission && { wholeSalePrice: optionType.wholeSalePrice }),
  //         ...(permission && { maxPrice: 0 }),
  //         ...(permission && { isAvailable: false }),
  //         ...(permission && { priceType: "Fixed" }),
  //         ...(!permission && { partnerSellingPrice: 0 }),
  //         ...(!permission && { markupOptionType: "Fixed" }),
  //          ...(!permission && {
  //           taxRateId: null,
  //         }),
  //       })),
  //     })),
  //   };

  //   const updatedList = [...tenantList];
  //   updatedList[index] = updatedProduct;
  //   setTenantList(updatedList);
  // };

  const handleClear = (index) => {
    const originalProduct = originalTenantList[index];
    const updatedList = [...tenantList];
    updatedList[index] = JSON.parse(JSON.stringify(originalProduct)); // deep copy to avoid mutation
    setTenantList(updatedList);
    clearEdited(index);
  };

  const handleParentTaxRateChange = (e, productIndex, optionIndex) => {
    markEdited(productIndex);
    const taxRateId = e.target.value;

    setTenantList((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = { ...updatedProducts[productIndex] };
      const option = { ...product.options[optionIndex] };

      // Optional: store selected tax at option level for dropdown value
      option.taxRateId = taxRateId;

      // Update each optionType's taxRateId
      option.optionTypes = option.optionTypes.map((ot) => ({
        ...ot,
        taxRateId: taxRateId,
      }));

      product.options[optionIndex] = option;
      updatedProducts[productIndex] = product;

      return updatedProducts;
    });
  };

  const CountryList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllTax, {}, "GET");

      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
      }
    } catch (error) {
      setCountryList([]);
    }
  };

  useEffect(() => {
    CountryList();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <div className="intersight_content">
        <Header title="Manage Product" />
        <div className="body_content">
          <div className="contact-profile">
            <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0 }}>
              <Container maxWidth="xl" sx={{ py: 3 }}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
              {/* Header Section */}
              <div className="d-flex align-items-center justify-content-between mb-30">
                <TableTitle title="Manage Product" />
              </div>

              {/* Filters Section */}
              <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                <div className="filter-dropdown dropdown">
                  <ProductTypeDropdown
                    value={filter.productType}
                    fn={handleChange}
                    load={true}
                    className="selectboxdropdown"
                    Getproduct={Getproduct}
                  />
                </div>
                <div className="filter-dropdown dropdown">
                  {HasPermission("SubTenantView") && (
                    <PartnerDropdown value={filter.tenantId} fn={handleChange} />
                  )}
                </div>
              </div>
              {/* Table Section */}
              <div className="task_table mb-30">
                <div className="table-responsive">
                  <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>SN</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Product Name</TableCell>
                        {HasPermission("SubTenantView") && (
                          <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>IsVisible</TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Price Type</TableCell>
                        {HasPermission("SubTenantView") && (
                          <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>
                            Wholesale Price{" "}
                            {HasPermission("SubTenantView") ? "Markup" : ""}
                          </TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>
                          {HasPermission("SubTenantView")
                            ? "Max Partner Price Markup"
                            : "Selling price Markup"}
                        </TableCell>
                        {!HasPermission("SubTenantView") && (
                          <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Tax</TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Options</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '14px' }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tenantList?.map((val, i) => (
                        <React.Fragment key={i}>
                          <TableRow 
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              },
                              backgroundColor: editedRows.has(i) ? alpha(theme.palette.warning.main, 0.1) : 'inherit',
                            }}
                          >
                            <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {val?.productName}
                              </Typography>
                            </TableCell>
                          {/* <td>
                            {val.isComponentAvailable ? (
                              <span
                                className="color-blue"
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                                onClick={() => {
                                  if (expandedProducts.has(val.productId)) {
                                    const newSet = new Set(expandedProducts);
                                    newSet.delete(val.productId);
                                    setExpandedProducts(newSet);
                                  } else {
                                    Getmsrp(val.productId);
                                  }
                                }}
                              >
                                {loadingProductId === val.productId ? (
                                  <span className="loaderproduct" /> // Replace with spinner component if you have one
                                ) : expandedProducts.has(val.productId) ? (
                                  HasPermission("SubTenantView") ? (
                                    `${defaultConfig?.currencySign} ${
                                      prices[val.productId]
                                    } /  ${defaultConfig?.currencySign} ${
                                      val?.priceType === "Fixed"
                                        ? Number(
                                            (
                                              Number(prices2[val.productId]) +
                                              Number(val.wholeSalePrice)
                                            ).toFixed(2)
                                          )
                                        : Number(
                                            (
                                              Number(prices2[val.productId]) *
                                              (1 +
                                                Number(val.wholeSalePrice) /
                                                  100)
                                            ).toFixed(2)
                                          )
                                    } `
                                  ) : (
                                    `${defaultConfig?.currencySign} ${
                                      prices[val.productId]
                                    }`
                                  )
                                ) : (
                                  "Show"
                                )}
                              </span>
                            ) : (
                              <span className="color-blue">
                                Pricing at Estimation Screen
                              </span>
                            )}
                          </td> */}
                            {HasPermission("SubTenantView") && (
                              <TableCell>
                                <Checkbox
                                  checked={val.isAvailable}
                                  onChange={(e) => handleChanges(e, i, "isAvailable")}
                                  color="primary"
                                  sx={{
                                    '&.Mui-checked': {
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                />
                              </TableCell>
                            )}

                            {!HasPermission("SubTenantView") ? (
                              <TableCell>
                                <FormControl size="small" sx={{ minWidth: 137 }}>
                                  <Select
                                    value={val?.markupType}
                                    onChange={(e) => handleChanges(e, i, "markupType")}
                                    disabled
                                    name="markupType"
                                  >
                                    <MenuItem value="Fixed">Fixed</MenuItem>
                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                            ) : (
                              <TableCell>
                                {val.isComponentAvailable ? (
                                  <FormControl size="small" sx={{ minWidth: 137 }}>
                                    <Select
                                      value={val?.priceType}
                                      onChange={(e) => handleChanges(e, i, "priceType")}
                                      disabled={!val.isComponentAvailable}
                                      name="priceType"
                                    >
                                      <MenuItem value="Fixed">Fixed</MenuItem>
                                      <MenuItem value="Percentage">Percentage</MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Typography variant="body2" color="primary">
                                    Pricing at Estimation Screen
                                  </Typography>
                                )}
                              </TableCell>
                            )}

                            {HasPermission("SubTenantView") && (
                              <TableCell>
                                {val.isComponentAvailable ? (
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={val?.wholeSalePrice}
                                    onChange={(e) => handleChanges(e, i, "wholeSalePrice")}
                                    disabled={!val.isAvailable}
                                    sx={{ width: 120 }}
                                    variant="outlined"
                                  />
                                ) : (
                                  <Typography variant="body2" color="primary">
                                    Pricing at Estimation Screen
                                  </Typography>
                                )}
                              </TableCell>
                            )}

                            <TableCell>
                              {HasPermission("SubTenantView") ? (
                                <>
                                  {val.isComponentAvailable ? (
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={val?.maxPartnerPrice}
                                      disabled={!val.isAvailable}
                                      onChange={(e) => handleChanges(e, i, "maxPartnerPrice")}
                                      sx={{ width: 120 }}
                                      variant="outlined"
                                    />
                                  ) : (
                                    <Typography variant="body2" color="primary">
                                      Pricing at Estimation Screen
                                    </Typography>
                                  )}
                                </>
                              ) : (
                                <TextField
                                  type="number"
                                  size="small"
                                  value={val?.partnerSellingPrice}
                                  onChange={(e) => handleChanges(e, i, "partnerSellingPrice")}
                                  disabled={val.isComponentAvailable ? false : true}
                                  sx={{ width: 120 }}
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                            {!HasPermission("SubTenantView") && (
                              <TableCell>
                                <FormControl size="small" sx={{ minWidth: 137 }}>
                                  <Select
                                    value={val?.taxRateId || ""}
                                    onChange={(e) => handleChanges(e, i, "taxRateId")}
                                    name="taxRateId"
                                    displayEmpty
                                  >
                                    <MenuItem value="">Select Tax</MenuItem>
                                    {countryList?.map((item, index) => (
                                      <MenuItem
                                        key={index}
                                        value={item?.taxRateId}
                                      >
                                        {item?.taxName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                            )}

                            <TableCell>
                              {val?.options?.length > 0 ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => toggleMilestone(i)}
                                  startIcon={expandedMilestone === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                  sx={{
                                    textTransform: 'none',
                                    color: theme.palette.primary.main,
                                    borderColor: theme.palette.primary.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    }
                                  }}
                                >
                                  {expandedMilestone === i ? 'Hide Options' : 'Show Options'}
                                </Button>
                              ) : (
                                <Typography variant="body2" color="textSecondary">
                                  No Options
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {HasPermission("ManageProductEdit") && editedRows.has(i) && (
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Tooltip title="Save Changes">
                                    <IconButton
                                      color="success"
                                      onClick={() => handleSubmit(i)}
                                      size="small"
                                      sx={{
                                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.success.main, 0.2),
                                        }
                                      }}
                                    >
                                      <SaveIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Clear Changes">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleClear(i)}
                                      size="small"
                                      sx={{
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.error.main, 0.2),
                                        }
                                      }}
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              )}
                            </TableCell>
                          </TableRow>
                          {expandedMilestone === i && (
                            <TableRow>
                              <TableCell
                                colSpan={HasPermission("SubTenantView") ? 9 : 9}
                                sx={{ p: 0, border: 'none' }}
                              >
                                <Collapse in={expandedMilestone === i} timeout="auto" unmountOnExit>
                                  <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.grey[50], 0.3) }}>
                                    {val?.options?.map((vals, ind) =>
                                      vals?.optionTypes?.length > 0 ? (
                                        <Card key={ind} sx={{ mb: 2, boxShadow: 1 }}>
                                          <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ mb: 3 }}>
                                              <Stack 
                                                direction={{ xs: 'column', sm: 'row' }}
                                                justifyContent="space-between"
                                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                spacing={2}
                                              >
                                                <Typography 
                                                  variant="h6" 
                                                  sx={{ 
                                                    fontWeight: 600,
                                                    color: theme.palette.primary.main,
                                                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                                                    pl: 2
                                                  }}
                                                >
                                                  Option Name: 
                                                  <Typography component="span" sx={{ color: 'text.primary', ml: 1 }}>
                                                    {vals?.optionName}
                                                  </Typography>
                                                </Typography>
                                                {!HasPermission("SubTenantView") && (
                                                  <FormControl size="small" sx={{ minWidth: 200 }}>
                                                    <InputLabel>Select Tax</InputLabel>
                                                    <Select
                                                      value={vals?.taxRateId || ""}
                                                      onChange={(e) => handleParentTaxRateChange(e, i, ind)}
                                                      label="Select Tax"
                                                    >
                                                      <MenuItem value="">Select Tax</MenuItem>
                                                      {countryList?.map((item, index) => (
                                                        <MenuItem key={index} value={item?.taxRateId}>
                                                          {item?.taxName}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                                )}
                                              </Stack>
                                            </Box>
                                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                              <Table size="small">
                                                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                                  <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Option Value</TableCell>
                                                    {HasPermission("SubTenantView") && (
                                                      <TableCell sx={{ fontWeight: 600 }}>IsVisible</TableCell>
                                                    )}
                                                    <TableCell sx={{ fontWeight: 600 }}>Price Type</TableCell>
                                                    {HasPermission("SubTenantView") && (
                                                      <TableCell sx={{ fontWeight: 600 }}>
                                                        Wholesale Price{" "}
                                                        {HasPermission("SubTenantView") ? "Markup" : ""}
                                                      </TableCell>
                                                    )}
                                                    <TableCell sx={{ fontWeight: 600 }}>
                                                      {HasPermission("SubTenantView")
                                                        ? "Max Price Markup"
                                                        : "Selling Price Markup"}
                                                    </TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {vals?.optionTypes?.map((valss, inds) => (
                                                    <TableRow key={inds}>
                                                      <TableCell>
                                                        <Typography variant="body2" fontWeight={500}>
                                                          {valss?.optionTypeName}
                                                        </Typography>
                                                      </TableCell>
                                                  {/* <td>
                                                    {val.isComponentAvailable ? (
                                                      <span
                                                        className="color-blue"
                                                        style={{
                                                          cursor: "pointer",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: "5px",
                                                        }}
                                                        onClick={() => {
                                                          if (
                                                            expandedProducts.has(
                                                              val.productId
                                                            )
                                                          ) {
                                                            const newSet =
                                                              new Set(
                                                                expandedProducts
                                                              );
                                                            newSet.delete(
                                                              val.productId
                                                            );
                                                            setExpandedProducts(
                                                              newSet
                                                            );
                                                          } else {
                                                            Getmsrp(
                                                              val.productId
                                                            );
                                                          }
                                                        }}
                                                      >
                                                        {loadingProductId ===
                                                        val.productId ? (
                                                          <span className="loaderproduct" /> // Replace with spinner component if you have one
                                                        ) : expandedProducts.has(
                                                            val.productId
                                                          ) ? (
                                                          HasPermission(
                                                            "SubTenantView"
                                                          ) ? (
                                                            `${
                                                              optionPrice?.[
                                                                val.productId
                                                              ]?.optionMSRP?.[
                                                                valss
                                                                  .optionTypeId
                                                              ]
                                                            } /
                                                            ${
                                                              valss?.priceType ===
                                                              "Fixed"
                                                                ? Number(
                                                                    (
                                                                      Number(
                                                                        optionPrice?.[
                                                                          val
                                                                            .productId
                                                                        ]
                                                                          ?.optionWholesale?.[
                                                                          valss
                                                                            .optionTypeId
                                                                        ]
                                                                      ) +
                                                                      Number(
                                                                        valss?.wholeSalePrice
                                                                      )
                                                                    ).toFixed(2)
                                                                  )
                                                                : (
                                                                    Number(
                                                                      optionPrice?.[
                                                                        val
                                                                          .productId
                                                                      ]
                                                                        ?.optionWholesale?.[
                                                                        valss
                                                                          .optionTypeId
                                                                      ] ?? 0
                                                                    ) *
                                                                    (1 +
                                                                      Number(
                                                                        valss?.wholeSalePrice ??
                                                                          0
                                                                      ) /
                                                                        100)
                                                                  ).toFixed(2)
                                                            }`
                                                          ) : (
                                                            `${
                                                              optionPrice?.[
                                                                val.productId
                                                              ]?.optionMSRP?.[
                                                                valss
                                                                  .optionTypeId
                                                              ]
                                                            }`
                                                          )
                                                        ) : (
                                                          "Show"
                                                        )}
                                                      </span>
                                                    ) : (
                                                      <span className="color-blue">
                                                        Pricing at Estimation
                                                        Screen
                                                      </span>
                                                    )}
                                                  </td> */}
                                                      {HasPermission("SubTenantView") && (
                                                        <TableCell>
                                                          <Checkbox
                                                            disabled={!val.isAvailable}
                                                            checked={valss?.isAvailable}
                                                            onChange={(e) =>
                                                              handleOptionChange(e, i, ind, inds, "isAvailable")
                                                            }
                                                            color="primary"
                                                            sx={{
                                                              '&.Mui-checked': {
                                                                color: theme.palette.primary.main,
                                                              },
                                                            }}
                                                          />
                                                        </TableCell>
                                                      )}

                                                      <TableCell>
                                                        {HasPermission("SubTenantView") ? (
                                                          <FormControl size="small" sx={{ minWidth: 137 }}>
                                                            <Select
                                                              value={valss?.priceType}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "priceType")
                                                              }
                                                              disabled={val.isComponentAvailable ? false : true}
                                                              name="priceType"
                                                            >
                                                              <MenuItem value="Fixed">Fixed</MenuItem>
                                                              <MenuItem value="Percentage">Percentage</MenuItem>
                                                            </Select>
                                                          </FormControl>
                                                        ) : (
                                                          <FormControl size="small" sx={{ minWidth: 137 }}>
                                                            <Select
                                                              value={valss?.markupOptionType}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "markupOptionType")
                                                              }
                                                              disabled
                                                              name="markupOptionType"
                                                            >
                                                              <MenuItem value="Fixed">Fixed</MenuItem>
                                                              <MenuItem value="Percentage">Percentage</MenuItem>
                                                            </Select>
                                                          </FormControl>
                                                        )}
                                                      </TableCell>

                                                      {HasPermission("SubTenantView") && (
                                                        <TableCell>
                                                          {val.isComponentAvailable ? (
                                                            <TextField
                                                              type="number"
                                                              size="small"
                                                              value={valss?.wholeSalePrice}
                                                              disabled={!valss?.isAvailable}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "wholeSalePrice")
                                                              }
                                                              sx={{ width: 120 }}
                                                              variant="outlined"
                                                            />
                                                          ) : (
                                                            <TextField
                                                              type="number"
                                                              size="small"
                                                              value={valss?.wholeSalePrice}
                                                              disabled={true}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "wholeSalePrice")
                                                              }
                                                              sx={{ width: 120 }}
                                                              variant="outlined"
                                                            />
                                                          )}
                                                        </TableCell>
                                                      )}

                                                      <TableCell>
                                                        {HasPermission("SubTenantView") ? (
                                                          <>
                                                            {val.isComponentAvailable ? (
                                                              <TextField
                                                                type="number"
                                                                size="small"
                                                                value={valss?.maxPrice}
                                                                disabled={!valss?.isAvailable}
                                                                onChange={(e) =>
                                                                  handleOptionChange(e, i, ind, inds, "maxPrice")
                                                                }
                                                                sx={{ width: 120 }}
                                                                variant="outlined"
                                                              />
                                                            ) : (
                                                              <TextField
                                                                type="number"
                                                                size="small"
                                                                value={valss?.maxPrice}
                                                                disabled={true}
                                                                onChange={(e) =>
                                                                  handleOptionChange(e, i, ind, inds, "maxPrice")
                                                                }
                                                                sx={{ width: 120 }}
                                                                variant="outlined"
                                                              />
                                                            )}
                                                          </>
                                                        ) : (
                                                          <TextField
                                                            type="number"
                                                            size="small"
                                                            value={valss?.partnerSellingPrice}
                                                            disabled={val.isComponentAvailable ? false : true}
                                                            onChange={(e) =>
                                                              handleOptionChange(e, i, ind, inds, "partnerSellingPrice")
                                                            }
                                                            sx={{ width: 120 }}
                                                            variant="outlined"
                                                          />
                                                        )}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </TableContainer>
                                          </CardContent>
                                        </Card>
                                      ) : null
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                      </React.Fragment>
                    ))}
                      {(!tenantList || tenantList?.length === 0) && (
                        <TableRow>
                          <TableCell 
                            colSpan={HasPermission("SubTenantView") ? 9 : 8} 
                            sx={{ 
                              border: 'none',
                              textAlign: 'center', 
                              padding: 6,
                              color: 'text.secondary'
                            }}
                          >
                            <Box
                              sx={{
                                textAlign: 'center',
                                padding: 6,
                                color: 'text.secondary',
                              }}
                            >
                              <img
                                src="/image/no-records.svg"
                                alt="No records"
                                loading="lazy"
                                style={{ maxWidth: '200px', opacity: 0.6 }}
                              />
                              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                                No Products Found
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Pagination */}
                {tenantList && tenantList?.length > 0 && (
                  <div className="d-flex align-items-center justify-content-end bottom_nav">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15, 25, 100]}
                          component="div"
                          count={paginatedItems}
                          rowsPerPage={rowsPerPage}
                          page={page - 1}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          sx={{
                            '& .MuiTablePagination-toolbar': {
                              paddingLeft: 0,
                              paddingRight: 0,
                            }
                          }}
                        />
                      </ul>
                    </nav>
                  </div>
                )}
                  </Paper>
                </div>
              </div>
                  </CardContent>
                </Card>
              </Container>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
