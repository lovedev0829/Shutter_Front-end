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
  useMediaQuery,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            isWholeSaleAppliedOption: optionType.isWholeSaleAppliedOption,
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
              <Container 
                maxWidth="xl" 
                sx={{ 
                  py: isMobile ? 1 : 3,
                  px: isMobile ? 1 : 3
                }}
              >
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
              {/* Header Section */}
              <Box sx={{ mb: isMobile ? 2 : 3 }}>
                <TableTitle title="Manage Product" />
              </Box>

              {/* Filters Section */}
              <Stack 
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ mb: isMobile ? 2 : 3 }}
              >
                <Box sx={{ minWidth: { xs: '100%', md: 200 } }}>
                  <ProductTypeDropdown
                    value={filter.productType}
                    fn={handleChange}
                    load={true}
                    className="selectboxdropdown"
                    Getproduct={Getproduct}
                  />
                </Box>
                {HasPermission("SubTenantView") && (
                  <Box sx={{ minWidth: { xs: '100%', md: 200 } }}>
                    <PartnerDropdown value={filter.tenantId} fn={handleChange} />
                  </Box>
                )}
              </Stack>
              {/* Table Section */}
              <Box sx={{ mb: isMobile ? 2 : 3 }}>
                <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <TableContainer sx={{ 
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: 4,
                      '&:hover': {
                        backgroundColor: '#a8a8a8',
                      },
                    },
                  }}>
                    <Table sx={{ minWidth: isMobile ? 800 : 650 }}>
                      <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2
                          }}>
                            SN
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            minWidth: isMobile ? 120 : 150
                          }}>
                            Product Name
                          </TableCell>
                          {HasPermission("SubTenantView") && (
                            <TableCell sx={{ 
                              fontWeight: 600, 
                              fontSize: isMobile ? '12px' : '14px',
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2
                            }}>
                              IsVisible
                            </TableCell>
                          )}
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            minWidth: isMobile ? 100 : 120
                          }}>
                            Price Type
                          </TableCell>
                          {HasPermission("SubTenantView") && (
                            <TableCell sx={{ 
                              fontWeight: 600, 
                              fontSize: isMobile ? '12px' : '14px',
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                              minWidth: isMobile ? 120 : 150
                            }}>
                              Wholesale Price{" "}
                              {HasPermission("SubTenantView") ? "Markup" : ""}
                            </TableCell>
                          )}
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            minWidth: isMobile ? 140 : 180
                          }}>
                            {HasPermission("SubTenantView")
                              ? "Max Partner Price Markup"
                              : "Selling price Markup"}
                          </TableCell>
                          {!HasPermission("SubTenantView") && (
                            <TableCell sx={{ 
                              fontWeight: 600, 
                              fontSize: isMobile ? '12px' : '14px',
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                              minWidth: isMobile ? 100 : 120
                            }}>
                              Tax
                            </TableCell>
                          )}
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            minWidth: isMobile ? 100 : 120
                          }}>
                            Options
                          </TableCell>
                          <TableCell align="center" sx={{ 
                            fontWeight: 600, 
                            fontSize: isMobile ? '12px' : '14px',
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            minWidth: isMobile ? 80 : 100
                          }}>
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
                              <TableCell sx={{ 
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2,
                                fontSize: isMobile ? '12px' : '14px'
                              }}>
                                {(page - 1) * rowsPerPage + i + 1}
                              </TableCell>
                              <TableCell sx={{ 
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2
                              }}>
                                <Typography 
                                  variant={isMobile ? "caption" : "body2"} 
                                  fontWeight={500}
                                  sx={{ 
                                    fontSize: isMobile ? '12px' : '14px',
                                    lineHeight: isMobile ? 1.2 : 1.5
                                  }}
                                >
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
                                <TableCell sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 1 : 2
                                }}>
                                  <Checkbox
                                    checked={val.isAvailable}
                                    onChange={(e) => handleChanges(e, i, "isAvailable")}
                                    color="primary"
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                      '&.Mui-checked': {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                  />
                                </TableCell>
                              )}

                              {!HasPermission("SubTenantView") ? (
                                <TableCell sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 1 : 2
                                }}>
                                  <FormControl 
                                    size="small" 
                                    sx={{ 
                                      minWidth: isMobile ? 100 : 137,
                                      width: '100%'
                                    }}
                                  >
                                    <Select
                                      value={val?.markupType}
                                      onChange={(e) => handleChanges(e, i, "markupType")}
                                      disabled
                                      name="markupType"
                                      sx={{ fontSize: isMobile ? '12px' : '14px' }}
                                    >
                                      <MenuItem value="Fixed">Fixed</MenuItem>
                                      <MenuItem value="Percentage">Percentage</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                              ) : (
                                <TableCell sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 1 : 2
                                }}>
                                  
                                    <FormControl 
                                      size="small" 
                                      sx={{ 
                                        minWidth: isMobile ? 100 : 137,
                                        width: '100%'
                                      }}
                                    >
                                      <Select
                                        value={val?.priceType}
                                        onChange={(e) => handleChanges(e, i, "priceType")}
                                        // disabled={!val.isComponentAvailable}
                                        name="priceType"
                                        sx={{ fontSize: isMobile ? '12px' : '14px' }}
                                      >
                                        <MenuItem value="Fixed">Fixed</MenuItem>
                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                      </Select>
                                    </FormControl>
                                  
                                </TableCell>
                              )}

                              {HasPermission("SubTenantView") && (
                                <TableCell sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 1 : 2
                                }}>
                                  
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={val?.wholeSalePrice}
                                      onChange={(e) => handleChanges(e, i, "wholeSalePrice")}
                                      disabled={!val.isAvailable}
                                      sx={{ 
                                        width: isMobile ? 80 : 120,
                                        '& .MuiInputBase-input': {
                                          fontSize: isMobile ? '12px' : '14px',
                                          padding: isMobile ? '6px 8px' : '8px 12px'
                                        }
                                      }}
                                      variant="outlined"
                                    />
                                 
                                </TableCell>
                              )}

                              <TableCell sx={{ 
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2
                              }}>
                                {HasPermission("SubTenantView") ? (
                                  <>
                                   
                                      <TextField
                                        type="number"
                                        size="small"
                                        value={val?.maxPartnerPrice}
                                        disabled={!val.isAvailable}
                                        onChange={(e) => handleChanges(e, i, "maxPartnerPrice")}
                                        sx={{ 
                                          width: isMobile ? 80 : 120,
                                          '& .MuiInputBase-input': {
                                            fontSize: isMobile ? '12px' : '14px',
                                            padding: isMobile ? '6px 8px' : '8px 12px'
                                          }
                                        }}
                                        variant="outlined"
                                      />
                                   
                                     
                                    
                                  </>
                                ) : (
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={val?.partnerSellingPrice}
                                    onChange={(e) => handleChanges(e, i, "partnerSellingPrice")}
                                   
                                    sx={{ 
                                      width: isMobile ? 80 : 120,
                                      '& .MuiInputBase-input': {
                                        fontSize: isMobile ? '12px' : '14px',
                                        padding: isMobile ? '6px 8px' : '8px 12px'
                                      }
                                    }}
                                    variant="outlined"
                                  />
                                )}
                              </TableCell>
                              {!HasPermission("SubTenantView") && (
                                <TableCell sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 1 : 2
                                }}>
                                  <FormControl 
                                    size="small" 
                                    sx={{ 
                                      minWidth: isMobile ? 100 : 137,
                                      width: '100%'
                                    }}
                                  >
                                    <Select
                                      value={val?.taxRateId || ""}
                                      onChange={(e) => handleChanges(e, i, "taxRateId")}
                                      name="taxRateId"
                                      displayEmpty
                                      sx={{ fontSize: isMobile ? '12px' : '14px' }}
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

                              <TableCell sx={{ 
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2
                              }}>
                                {val?.options?.length > 0 ? (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => toggleMilestone(i)}
                                    startIcon={!isSmallMobile && (expandedMilestone === i ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                    sx={{
                                      textTransform: 'none',
                                      color: theme.palette.primary.main,
                                      borderColor: theme.palette.primary.main,
                                      fontSize: isMobile ? '11px' : '13px',
                                      padding: isMobile ? '4px 8px' : '6px 12px',
                                      minWidth: isMobile ? 'auto' : 'unset',
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    {isSmallMobile ? (expandedMilestone === i ? '−' : '+') : (expandedMilestone === i ? 'Hide Options' : 'Show Options')}
                                  </Button>
                                ) : (
                                  <Typography 
                                    variant={isMobile ? "caption" : "body2"} 
                                    color="textSecondary"
                                    sx={{ 
                                      fontSize: isMobile ? '11px' : '14px'
                                    }}
                                  >
                                    No Options
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell 
                                align="center"
                                sx={{ 
                                  py: isMobile ? 1 : 2,
                                  px: isMobile ? 0.5 : 2
                                }}
                              >
                                {HasPermission("ManageProductEdit") && editedRows.has(i) && (
                                  <Stack 
                                    direction={isMobile ? "column" : "row"} 
                                    spacing={isMobile ? 0.5 : 1} 
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                    <Tooltip title="Save Changes">
                                      <IconButton
                                        color="success"
                                        onClick={() => handleSubmit(i)}
                                        size={isMobile ? "small" : "small"}
                                        sx={{
                                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                                          padding: isMobile ? '4px' : '8px',
                                          '&:hover': {
                                            backgroundColor: alpha(theme.palette.success.main, 0.2),
                                          }
                                        }}
                                      >
                                        <SaveIcon fontSize={isMobile ? "small" : "small"} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Clear Changes">
                                      <IconButton
                                        color="error"
                                        onClick={() => handleClear(i)}
                                        size={isMobile ? "small" : "small"}
                                        sx={{
                                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                                          padding: isMobile ? '4px' : '8px',
                                          '&:hover': {
                                            backgroundColor: alpha(theme.palette.error.main, 0.2),
                                          }
                                        }}
                                      >
                                        <ClearIcon fontSize={isMobile ? "small" : "small"} />
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
                                    <Box sx={{ 
                                      p: isMobile ? 1.5 : 3, 
                                      backgroundColor: alpha(theme.palette.grey[50], 0.3) 
                                    }}>
                                      {val?.options?.map((vals, ind) =>
                                        vals?.optionTypes?.length > 0 ? (
                                          <Card key={ind} sx={{ mb: isMobile ? 1 : 2, boxShadow: 1 }}>
                                            <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
                                              <Box sx={{ mb: isMobile ? 2 : 3 }}>
                                                <Stack 
                                                  direction="column"
                                                  spacing={2}
                                                >
                                                  <Typography 
                                                    variant={isMobile ? "subtitle2" : "h6"} 
                                                    sx={{ 
                                                      fontWeight: 600,
                                                      color: theme.palette.primary.main,
                                                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                                                      pl: 2,
                                                      fontSize: isMobile ? '14px' : '18px'
                                                    }}
                                                  >
                                                    Option Name: 
                                                    <Typography 
                                                      component="span" 
                                                      sx={{ 
                                                        color: 'text.primary', 
                                                        ml: 1,
                                                        fontSize: isMobile ? '14px' : '18px'
                                                      }}
                                                    >
                                                      {vals?.optionName}
                                                    </Typography>
                                                  </Typography>
                                                  {!HasPermission("SubTenantView") && (
                                                    <FormControl 
                                                      size="small" 
                                                      sx={{ 
                                                        minWidth: isMobile ? 150 : 200,
                                                        width: isMobile ? '100%' : 'auto'
                                                      }}
                                                    >
                                                      <InputLabel sx={{ fontSize: isMobile ? '12px' : '14px' }}>
                                                        Select Tax
                                                      </InputLabel>
                                                      <Select
                                                        value={vals?.taxRateId || ""}
                                                        onChange={(e) => handleParentTaxRateChange(e, i, ind)}
                                                        label="Select Tax"
                                                        sx={{ fontSize: isMobile ? '12px' : '14px' }}
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
                                              <TableContainer 
                                                component={Paper} 
                                                sx={{ 
                                                  mt: 2,
                                                  overflowX: 'auto',
                                                  '&::-webkit-scrollbar': {
                                                    height: 6,
                                                  },
                                                  '&::-webkit-scrollbar-track': {
                                                    backgroundColor: '#f1f1f1',
                                                    borderRadius: 3,
                                                  },
                                                  '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: '#c1c1c1',
                                                    borderRadius: 3,
                                                  },
                                                }}
                                              >
                                                <Table size="small" sx={{ minWidth: isMobile ? 600 : 500 }}>
                                                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                                    <TableRow>
                                                      <TableCell sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: isMobile ? '11px' : '14px',
                                                        py: isMobile ? 0.5 : 1,
                                                        px: isMobile ? 1 : 2
                                                      }}>
                                                        Option Value
                                                      </TableCell>
                                                      {HasPermission("SubTenantView") && (
                                                        <TableCell sx={{ 
                                                          fontWeight: 600,
                                                          fontSize: isMobile ? '11px' : '14px',
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                          IsVisible
                                                        </TableCell>
                                                      )}
                                                      {HasPermission("SubTenantView") && (
                                                        <TableCell sx={{ 
                                                          fontWeight: 600,
                                                          fontSize: isMobile ? '11px' : '14px',
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                         Enable for Calculations
                                                        </TableCell>
                                                      )}
                                                      <TableCell sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: isMobile ? '11px' : '14px',
                                                        py: isMobile ? 0.5 : 1,
                                                        px: isMobile ? 1 : 2
                                                      }}>
                                                        Price Type
                                                      </TableCell>
                                                      {HasPermission("SubTenantView") && (
                                                        <TableCell sx={{ 
                                                          fontWeight: 600,
                                                          fontSize: isMobile ? '11px' : '14px',
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                          Wholesale Price{" "}
                                                          {HasPermission("SubTenantView") ? "Markup" : ""}
                                                        </TableCell>
                                                      )}
                                                      <TableCell sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: isMobile ? '11px' : '14px',
                                                        py: isMobile ? 0.5 : 1,
                                                        px: isMobile ? 1 : 2
                                                      }}>
                                                        {HasPermission("SubTenantView")
                                                          ? "Max Price Markup"
                                                          : "Selling Price Markup"}
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {vals?.optionTypes?.map((valss, inds) => (
                                                      <TableRow key={inds}>
                                                        <TableCell sx={{ 
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                          <Typography 
                                                            variant={isMobile ? "caption" : "body2"} 
                                                            fontWeight={500}
                                                            sx={{ 
                                                              fontSize: isMobile ? '11px' : '14px',
                                                              lineHeight: isMobile ? 1.2 : 1.5
                                                            }}
                                                          >
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
                                                          <TableCell sx={{ 
                                                            py: isMobile ? 0.5 : 1,
                                                            px: isMobile ? 1 : 2
                                                          }}>
                                                            <Checkbox
                                                              disabled={!val.isAvailable}
                                                              checked={valss?.isAvailable}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "isAvailable")
                                                              }
                                                              color="primary"
                                                              size={isMobile ? "small" : "medium"}
                                                              sx={{
                                                                '&.Mui-checked': {
                                                                  color: theme.palette.primary.main,
                                                                },
                                                              }}
                                                            />
                                                          </TableCell>
                                                        )}
                                                        {HasPermission("SubTenantView") && (
                                                          <TableCell sx={{ 
                                                            py: isMobile ? 0.5 : 1,
                                                            px: isMobile ? 1 : 2
                                                          }}>
                                                            <Checkbox
                                                              disabled={!val.isAvailable}
                                                              checked={valss?.isWholeSaleAppliedOption}
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "isWholeSaleAppliedOption")
                                                              }
                                                              color="primary"
                                                              size={isMobile ? "small" : "medium"}
                                                              sx={{
                                                                '&.Mui-checked': {
                                                                  color: theme.palette.primary.main,
                                                                },
                                                              }}
                                                            />
                                                          </TableCell>
                                                        )}
                                                        <TableCell sx={{ 
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                          {HasPermission("SubTenantView") ? (
                                                            <FormControl 
                                                              size="small" 
                                                              sx={{ 
                                                                minWidth: isMobile ? 90 : 137,
                                                                width: '100%'
                                                              }}
                                                            >
                                                              <Select
                                                                value={valss?.priceType}
                                                                onChange={(e) =>
                                                                  handleOptionChange(e, i, ind, inds, "priceType")
                                                                }
                                                               
                                                                name="priceType"
                                                                sx={{ fontSize: isMobile ? '11px' : '14px' }}
                                                              >
                                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                                              </Select>
                                                            </FormControl>
                                                          ) : (
                                                            <FormControl 
                                                              size="small" 
                                                              sx={{ 
                                                                minWidth: isMobile ? 90 : 137,
                                                                width: '100%'
                                                              }}
                                                            >
                                                              <Select
                                                                value={valss?.markupOptionType}
                                                                onChange={(e) =>
                                                                  handleOptionChange(e, i, ind, inds, "markupOptionType")
                                                                }
                                                                disabled
                                                                name="markupOptionType"
                                                                sx={{ fontSize: isMobile ? '11px' : '14px' }}
                                                              >
                                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                                              </Select>
                                                            </FormControl>
                                                          )}
                                                        </TableCell>

                                                        {HasPermission("SubTenantView") && (
                                                          <TableCell sx={{ 
                                                            py: isMobile ? 0.5 : 1,
                                                            px: isMobile ? 1 : 2
                                                          }}>
                                                            
                                                              <TextField
                                                                type="number"
                                                                size="small"
                                                                value={valss?.wholeSalePrice}
                                                                disabled={!valss?.isAvailable}
                                                                onChange={(e) =>
                                                                  handleOptionChange(e, i, ind, inds, "wholeSalePrice")
                                                                }
                                                                sx={{ 
                                                                  width: isMobile ? 70 : 120,
                                                                  '& .MuiInputBase-input': {
                                                                    fontSize: isMobile ? '11px' : '14px',
                                                                    padding: isMobile ? '4px 6px' : '8px 12px'
                                                                  }
                                                                }}
                                                                variant="outlined"
                                                              />
                                                          
                                                             
                                                          </TableCell>
                                                        )}

                                                        <TableCell sx={{ 
                                                          py: isMobile ? 0.5 : 1,
                                                          px: isMobile ? 1 : 2
                                                        }}>
                                                          {HasPermission("SubTenantView") ? (
                                                            <>
                                                              
                                                                <TextField
                                                                  type="number"
                                                                  size="small"
                                                                  value={valss?.maxPrice}
                                                                  disabled={!valss?.isAvailable}
                                                                  onChange={(e) =>
                                                                    handleOptionChange(e, i, ind, inds, "maxPrice")
                                                                  }
                                                                  sx={{ 
                                                                    width: isMobile ? 70 : 120,
                                                                    '& .MuiInputBase-input': {
                                                                      fontSize: isMobile ? '11px' : '14px',
                                                                      padding: isMobile ? '4px 6px' : '8px 12px'
                                                                    }
                                                                  }}
                                                                  variant="outlined"
                                                                />
                                                             
                                                            </>
                                                          ) : (
                                                            <TextField
                                                              type="number"
                                                              size="small"
                                                              value={valss?.partnerSellingPrice}
                                                             
                                                              onChange={(e) =>
                                                                handleOptionChange(e, i, ind, inds, "partnerSellingPrice")
                                                              }
                                                              sx={{ 
                                                                width: isMobile ? 70 : 120,
                                                                '& .MuiInputBase-input': {
                                                                  fontSize: isMobile ? '11px' : '14px',
                                                                  padding: isMobile ? '4px 6px' : '8px 12px'
                                                                }
                                                              }}
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
                                padding: isMobile ? 3 : 6,
                                color: 'text.secondary'
                              }}
                            >
                              <Box
                                sx={{
                                  textAlign: 'center',
                                  padding: isMobile ? 3 : 6,
                                  color: 'text.secondary',
                                }}
                              >
                                <img
                                  src="/image/no-records.svg"
                                  alt="No records"
                                  loading="lazy"
                                  style={{ 
                                    maxWidth: isMobile ? '150px' : '200px', 
                                    opacity: 0.6 
                                  }}
                                />
                                <Typography 
                                  variant={isMobile ? "body2" : "body1"} 
                                  sx={{ 
                                    mt: 2, 
                                    color: 'text.secondary',
                                    fontSize: isMobile ? '14px' : '16px'
                                  }}
                                >
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
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    mt: isMobile ? 1 : 2,
                    px: isMobile ? 1 : 0
                  }}>
                    <TablePagination
                      rowsPerPageOptions={isMobile ? [5, 10, 15] : [5, 10, 15, 25, 100]}
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
                          fontSize: isMobile ? '12px' : '14px',
                          flexWrap: isMobile ? 'wrap' : 'nowrap',
                        },
                        '& .MuiTablePagination-selectLabel': {
                          fontSize: isMobile ? '12px' : '14px',
                          marginBottom: isMobile ? '4px' : 0,
                        },
                        '& .MuiTablePagination-displayedRows': {
                          fontSize: isMobile ? '12px' : '14px',
                          marginBottom: isMobile ? '4px' : 0,
                        },
                        '& .MuiTablePagination-select': {
                          fontSize: isMobile ? '12px' : '14px',
                        },
                        '& .MuiTablePagination-actions': {
                          marginLeft: isMobile ? '8px' : '20px',
                        },
                        '& .MuiIconButton-root': {
                          padding: isMobile ? '4px' : '12px',
                        }
                      }}
                    />
                  </Box>
                )}
                  </Paper>
                </Box>
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
