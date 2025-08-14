import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ApiLoder,
  BackButton,
  ErrorMessage,
  HasPermission,
  JobUi,
  SuccessMessage,
} from "../../../helpers/common";
import Header from "../../../Layout/header";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import AddnewWindow from "./AddnewWindow";
import SimpleReactValidator from "simple-react-validator";
import { Window } from "../../../Redux/Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import JobTab from "../../Form/JobTab";
import Breakdown from "./Breakdown";
import { defaultConfig } from "../../../config";
import AddEditDiscount from "../Discount/AddEditDiscount";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
  IconButton,
  Divider,
  Alert,
  Stack,
  Fade,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Analytics as BreakdownIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tenantList, setTenantList] = useState([]);

  const [coupan, setCoupan] = useState([]);
  const [totalTax, settotalTax] = useState(0);
  const [cupondata, setCoupandata] = useState({});
  const [list, setList] = useState({ WindowProductId: [] });
  const [loder, setLoader] = useState(0);
  const [open, setOpen] = useState(false);
  const [discountopen, setDiscountopen] = useState(false);
  const [isview, setisview] = useState(false);
  const param = useParams();
  const [refresh, setRefresh] = useState(true);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");

  const loginuser = JSON.parse(localStorage.getItem("userData"));

  const [value, setValue] = useState({
    estimateName: "",
    termsCondition: "",
    notes: "",
    jobId: param.JobId,
    windowProductId: [],
    discountCoupon: null,
    discountId: null,
    subTotal: 0,
    tax: 0,
    discount: 0,
    grandTotal: 0,
    taxRateId: null,
    additionalCost: 0,
    productsList: [],
    isTaxApplicable: true,
    preparedBy: loginuser?.userId,
  });
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  const dispatch = useDispatch();

  const startLoading = () => setLoader((prev) => prev + 1);
  const stopLoading = () => setLoader((prev) => Math.max(0, prev - 1));

  const handlestatus = async (estimateId) => {
    try {
      let body = {
        documentType: 0,
        templateId: null,
        contactId: tenantList[0]?.contactId,
        estimationId: estimateId,
      };
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", body);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {}
  };

  const languageAdd = async (isend = false) => {
    if (refresh) {
      const formValid = simpleValidator.current.allValid();
      if (!formValid) {
        simpleValidator.current.showMessages();
        forceUpdate(1);
      } else {
        startLoading();
        try {
          const apiResponse = await callAPI(
            !param.estimateId ? apiUrls.EstimateCreate : apiUrls.EstimateUpdate,
            {},
            "POST",
            value
          );
          stopLoading();
          if (apiResponse?.data?.isSuccess) {
            if (isend) {
              handlestatus(apiResponse?.data?.data);
            }

            dispatch(Window([]));
            localStorage.setItem("activeTab", "#estimate");
            SuccessMessage(apiResponse?.data?.message);
            navigate(`/contacts/job/${param.JobId}`);
          } else {
            ErrorMessage(apiResponse?.data?.message);
          }
        } catch (error) {
          stopLoading();
        }
      }
    } else {
      ErrorMessage("Please click the Refresh button, then submit.");
    }
  };

  const TenantlistAPI = async () => {
    startLoading();
    let query = {
      tenantId: "",
      searchValue: param.JobId,
      pageNo: 1,
      recordPerPage: 10,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
    };
    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        CouponlistAPI(apiResponse?.data?.data[0].contactId);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      stopLoading();
    }
  };

  const Wholesalepriceget = async (data, productIndex) => {
    const payload = {
      discountId: cupondata?.discountId ? cupondata?.discountId : null,
      products: [
        {
          windowProductId: data.windowProdcutId,
          productPrice: data.totalPrice || 0,
        },
      ],
    };
    try {
      const apiResponse = await callAPI(
        apiUrls.BuildEstimateAfterDiscount,
        {},
        "POST",
        payload
      );

      if (apiResponse?.data?.isSuccess) {
        const wholesalePrice = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.wholesalePrice || 0,
          0
        );
        const updatedTenantList = [...list.WindowProductId];
        updatedTenantList[productIndex]["wholesalePrice"] = wholesalePrice;
        setList((val) => {
          return { ...val, WindowProductId: updatedTenantList };
        });
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {}
  };

  const BuildEstimate = async (windowProductId) => {
    startLoading();
    try {
      const apiResponse = await callAPI(apiUrls.BuildEstimate, {}, "POST", {
        WindowProductIds: windowProductId,
        IsBreakDown: false,
      });
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setList((val) => {
          return { ...val, WindowProductId: apiResponse?.data?.data };
        });
        const totalPriceSum = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.totalPrice || 0,
          0
        );
        const additionalCost = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.additionalCost,
          0
        );

        const componentMarkup = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.componentMarkup || 0,
          0
        );
        const productMarkup = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.productMarkup || 0,
          0
        );
        const optionMarkup = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.optionMarkup || 0,
          0
        );

        const taxcost = apiResponse?.data?.data.reduce(
          (sum, item) => sum + item.totalTaxAmount || 0,
          0
        );

        let totaltax = parseFloat(taxcost);
        settotalTax(totaltax);

        setValue((val) => ({
          ...val,
          subTotal:
            parseFloat(totalPriceSum) +
            parseFloat(additionalCost) +
            parseFloat(componentMarkup) +
            parseFloat(productMarkup) +
            parseFloat(optionMarkup),
          grandTotal:
            parseFloat(totalPriceSum) +
            parseFloat(additionalCost) +
            parseFloat(componentMarkup) +
            parseFloat(productMarkup) +
            parseFloat(optionMarkup) +
            totaltax,
          // additionalCost: parseFloat(additionalCost),
          tax: totaltax,
          taxRateId: null,
          discount: 0,
          discountCoupon: null,
          discountId: null,
          isTaxApplicable: true,
        }));
      } else {
        // settotalTax(0);
        setValue((val) => ({
          ...val,
          subTotal: 0,
          grandTotal: 0,
          additionalCost: 0,
          tax: 0,
          taxRateId: null,
          discount: 0,
          discountCoupon: null,
          discountId: null,
        }));
      }
    } catch (error) {
      stopLoading();
    }
  };

  const EstimatelistAPI = async () => {
    startLoading();
    let query = {
      jobId: param.JobId,
      searchValue: "",
      estimationId: param.estimateId,
      pageNo: 1,
      recordPerPage: 10,
      status: 2,
      tenantId: "",
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
      region: "",
    };

    try {
      const apiResponse = await callAPI(apiUrls.Estimate, {}, "POST", query);

      if (apiResponse?.data?.isSuccess) {
        let datas = apiResponse?.data?.data[0];
        setValue(datas);
        settotalTax(datas.tax);
        const transformedData = datas?.estimateProductList.map(
          (item, index) => {
            return {
              windowProdcutId: datas?.windowProductId[index],
              productName: item?.productName,
              productTypeName: item?.productTypeName,
              label: item?.label,
              height: item?.estimateWindowDetails?.height,
              width: item?.estimateWindowDetails?.width,
              archHeight: item?.estimateWindowDetails?.archHeight,
              options: item?.options,
              totalPrice: item?.totalPrice || item?.productPrice,
              quantity: item?.windowQty,
              isviewedit: true,
              isComponentAvailable: item.isComponentAvailable,
              additionalCost: item.additionalCost || 0,
              wholesalePrice: item.wholesalePrice || 0,
              componentMarkup: item.componentMarkup || 0,
              productMarkup: item.productMarkup || 0,
              optionMarkup: item.optionMarkup || 0,
              markup: item.markup || 0,
            };
          }
        );
        setList((val) => {
          return { ...val, WindowProductId: transformedData };
        });
        stopLoading();
      } else {
        stopLoading();
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      stopLoading();
    }
  };
  const windowsdata = useSelector((state) => state.Windowsadd.window);

  const CouponlistAPI = async (contactId) => {
    try {
      console.log('Loading discount coupons for contactId:', contactId);
      const apiResponse = await callAPI(
        apiUrls.GetAllDiscount,
        { CustomerId: contactId },
        "GET"
      );
      if (apiResponse?.data?.isSuccess) {
        console.log('Discount coupons loaded:', apiResponse?.data?.data);
        setCoupan(apiResponse?.data?.data);
      } else {
        console.log('No discount coupons found or API error:', apiResponse?.data?.message);
        setCoupan([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      console.error('Error loading discount coupons:', error);
    }
  };

  const EstimationUniquename = async () => {
    startLoading();
    try {
      const apiResponse = await callAPI(
        apiUrls.EstimationUniquename,
        {},
        "GET"
      );
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setValue((val) => {
          return { ...val, estimateName: apiResponse?.data?.data };
        });
      } else {
      }
    } catch (error) {
      stopLoading();
    }
  };

  const GetAllTenantAnd_Users = async () => {
    startLoading();
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllTenantAnd_Users,
        {},
        "GET"
      );
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setUsers(apiResponse?.data?.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
      stopLoading();
    }
  };

  useEffect(() => {
    TenantlistAPI();
    GetAllTenantAnd_Users();
    if (param.estimateId) {
      setRefresh(false);
      EstimatelistAPI();
    }
    if (!param.estimateId) {
      EstimationUniquename();
    }

    if (windowsdata?.length > 0) {
      const ids = windowsdata.map((item) => item.windowProductId);
      setValue((val) => {
        return {
          ...val,
          windowProductId: [...(val.windowProductId || []), ...ids],
        };
      });

      BuildEstimate(ids);
    }

    // eslint-disable-next-line
  }, []);

  const handleSenddata = (data) => {
    const ids = data.map((item) => item.windowProductId);
    setValue((val) => {
      return {
        ...val,
        windowProductId: [...(val.windowProductId || []), ...ids],
      };
    });

    BuildEstimate([...(value.windowProductId || []), ...ids]);
  };

  const handledeletedata = (data) => {
    setValue((val) => {
      return {
        ...val,
        windowProductId: (val.windowProductId || []).filter(
          (item) => item !== data.windowProdcutId
        ),
      };
    });
    setList((val) => {
      return {
        ...val,
        WindowProductId: (val.WindowProductId || []).filter(
          (item) => item !== data
        ),
      };
    });
    BuildEstimate(
      (value.windowProductId || []).filter(
        (item) => item !== data.windowProdcutId
      )
    );
  };

  const handleChangecupan = (e) => {
    const selectedValue = e.target.value;
    
    if (selectedValue) {
      try {
        // Parse the JSON string to get the full coupon object
        const selectedCoupon = JSON.parse(selectedValue);
        setCoupandata(selectedCoupon);
        setValue((val) => ({
          ...val,
          discountCoupon: selectedCoupon.couponCode,
          discountId: selectedCoupon.discountId,
        }));
      } catch (error) {
        console.error('Error parsing coupon data:', error);
      }
    } else {
      setValue((val) => ({
        ...val,
        grandTotal:
          value?.subTotal +
          (value.isTaxApplicable ? totalTax || 0 : value.tax || 0),
        discount: 0,
        discountCoupon: null,
        discountId: null,
      }));
      setCoupandata({});
    }
  };

  const Applycopan = async (updatedTenantList = [], isapply = false) => {
    if (
      cupondata &&
      (cupondata.discountTypeName ||
        cupondata.fixedAmount ||
        cupondata.percentageDiscount)
    ) {
      const data = updatedTenantList.map((item) => ({
        windowProductId: item.windowProdcutId,
        productPrice: item.totalPrice,
      }));

      const payload = {
        discountId: cupondata?.discountId,
        products: isapply ? updatedTenantList : data,
      };

      try {
        const apiResponse = await callAPI(
          apiUrls.BuildEstimateAfterDiscount,
          {},
          "POST",
          payload
        );

        if (apiResponse?.data?.isSuccess) {
          const taxcost = apiResponse?.data?.data.reduce(
            (sum, item) => sum + item.totalTaxAmount || 0,
            0
          );

          let totaltaxs = parseFloat(taxcost);
          settotalTax(totaltaxs);

          let grandTotal = 0;

          const TotaldiscountAmount = apiResponse?.data?.data.reduce(
            (sum, item) => sum + item.discountAmount || 0,
            0
          );

          grandTotal = Math.max(
            0,
            (value.subTotal || 0) +
              (value.isTaxApplicable ? totaltaxs || 0 : value.tax || 0) -
              (TotaldiscountAmount || 0)
          );

          setValue((val) => ({
            ...val,
            grandTotal: Number(grandTotal),
            discount: Number(TotaldiscountAmount),
            discountCoupon: cupondata?.couponCode,
            discountId: cupondata?.discountId,
            tax: totaltaxs,
          }));
          if (isapply) {
            SuccessMessage(
              `Applied coupon code ${cupondata?.couponCode} successfully!`
            );
          }
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {}
    }
  };

  const Refresh = () => {
    setRefresh(true);
    BuildEstimate(value?.windowProductId || []);
  };
  const debounceTimeout = useRef();

  const handleChanges = (e, productIndex, field) => {
    const { type, checked } = e.target;
    const updatedTenantList = [...list.WindowProductId];
    updatedTenantList[productIndex][field] =
      type === "checkbox" ? checked : Number(e.target.value);

    const totalmarkup = updatedTenantList.reduce((sum, item) => {
      if (!item.isComponentAvailable) {
        const markupValue =
          (Number(item.totalPrice || 0) * (Number(item.markup) || 0)) / 100;
        return sum + markupValue;
      }
      return sum;
    }, 0);

    setList((val) => {
      return { ...val, WindowProductId: updatedTenantList };
    });

    // Debounce API call
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      Wholesalepriceget(updatedTenantList[productIndex], productIndex);
    }, 500); // wait 500ms after typing stops

    const totalPriceSum = updatedTenantList.reduce((sum, item) => {
      return sum + (Number(item.totalPrice) || 0);
    }, 0);

    const additionalCost = updatedTenantList.reduce(
      (sum, item) => sum + item.additionalCost,
      0
    );

    const componentMarkup = updatedTenantList.reduce(
      (sum, item) => sum + item.componentMarkup || 0,
      0
    );
    const productMarkup = updatedTenantList.reduce(
      (sum, item) => sum + item.productMarkup || 0,
      0
    );
    const optionMarkup = updatedTenantList.reduce(
      (sum, item) => sum + item.optionMarkup || 0,
      0
    );
    //console.log(totalPriceSum,additionalCost,componentMarkup,productMarkup,optionMarkup,totalmarkup)
    const totals = calculateTotals({
      subTotal:
        totalPriceSum +
        additionalCost +
        componentMarkup +
        productMarkup +
        optionMarkup +
        totalmarkup,
      additionalCost: 0,
      cupondata,
    });

    setValue((prev) => ({
      ...prev,
      ...totals,
    }));

    // if (
    //   cupondata &&
    //   (cupondata.discountTypeName ||
    //     cupondata.fixedAmount ||
    //     cupondata.percentageDiscount)
    // ) {
    //   setTimeout(() => {
    //     Applycopan(updatedTenantList, false);
    //   }, 500); // Delay of 500ms
    // }
  };

  const calculateTotals = ({ subTotal, additionalCost = 0, cupondata }) => {
    const parsedSubTotal = Number(subTotal) || 0;
    const parsedAdditionalCost = Number(additionalCost) || 0;

    const baseAmount = parsedSubTotal + parsedAdditionalCost;

    // ----- Discount Calculation -----
    let discount = 0;
    if (cupondata?.discountTypeName === "Fixed") {
      const fixedAmount = Number(cupondata?.fixedAmount) || 0;
      discount = Math.min(fixedAmount, baseAmount);
    } else if (cupondata?.discountTypeName === "Percentage") {
      const percentage = Number(cupondata?.percentageDiscount) || 0;
      discount = (baseAmount * percentage) / 100;
    }

    // ----- Tax Calculation -----
    const taxableAmount = Math.max(0, baseAmount - discount);

    // ----- Grand Total Calculation -----

    const grandTotal = Math.max(
      0,
      taxableAmount + (value.isTaxApplicable ? totalTax || 0 : value.tax)
    );

    return {
      subTotal: parsedSubTotal,
      additionalCost: parsedAdditionalCost,
      discount,
      grandTotal,
    };
  };

  useEffect(() => {
    const transformedData = list?.WindowProductId?.map((item, index) => {
      return {
        windowProductId: item?.windowProdcutId,
        productPrice: item.totalPrice || 0,
      };
    });

    setValue((val) => ({
      ...val,
      productsList: transformedData || [],
    }));
    // eslint-disable-next-line
  }, [list]);

  const user = JSON.parse(localStorage.getItem("userData"));

  const handleTaxChange = (e) => {
    const isAvailable = e.target.value === "true";
    const newValue = {
      ...value,
      isTaxApplicable: isAvailable,
    };
    if (!isAvailable) {
      newValue.tax = 0;
      newValue.grandTotal = value.subTotal - value.discount || 0;
    } else {
      newValue.tax = totalTax || 0;

      newValue.grandTotal = value.subTotal + totalTax - value.discount || 0;
    }
    if (param.estimateId && isAvailable) {
      BuildEstimate(value?.windowProductId || []);
    }

    //totalTax

    setValue(newValue);
  };

  return (
    <div className="intersight_content">
      <ApiLoder open={loder > 0} />
      <Header
          title={`Contacts / ${
            tenantList[0]?.contactFirstName +
            " " +
            tenantList[0]?.contactLasttName
          }`}
        />
      <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2, md: 3 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Card elevation={2} sx={{ mb: isMobile ? 2 : 3 }}>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <JobTab contactId={tenantList[0]?.contactId} />
            </Box>

            <Box sx={{ mb: isMobile ? 2 : 3 }}>
                <IconButton
                  onClick={() => navigate(`/contacts/job/${tenantList[0]?.jobId}`)}
                  sx={{
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 2, sm: 0 },
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    width: { xs: 35, sm: 35 },
                    height: { xs: 35, sm: 35 },
                    alignSelf: { xs: 'flex-start', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateX(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: { xs: '18px', sm: '24px' } }} />
                </IconButton>

              <Box sx={{ mt: 2 }}>
                <JobUi tenantList={tenantList[0]} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: isMobile ? 2 : 3,
                mb: isMobile ? 3 : 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  alignItems: { xs: "stretch", lg: "center" },
                  gap: isMobile ? 2 : 3,
                  flex: 1,
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    borderLeft: "4px solid",
                    borderColor: "primary.main",
                    pl: 2,
                    mb: { xs: 0, lg: 0 },
                    fontSize: isMobile ? "20px" : "24px",
                  }}
                >
                  {param.estimateId ? "Update" : "Create"} Estimate
                  <Typography
                    component="span"
                    sx={{ color: "error.main", ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>

                <TextField
                  label="Estimate Title"
                  placeholder="Enter Estimate Title"
                  name="estimateName"
                  value={value?.estimateName || ""}
                  onChange={handleChange}
                  size={isMobile ? "medium" : "small"}
                  sx={{
                    minWidth: isMobile ? "100%" : 250,
                    "& .MuiInputBase-input": {
                      fontSize: isMobile ? "16px" : "14px",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: isMobile ? "16px" : "14px",
                    },
                  }}
                  error={
                    !!simpleValidator.current.message(
                      "Estimate Title",
                      value?.estimateName,
                      "required"
                    )
                  }
                  helperText={simpleValidator.current.message(
                    "Estimate Title",
                    value?.estimateName,
                    "required"
                  )}
                />

                <FormControl
                  size={isMobile ? "medium" : "small"}
                  sx={{
                    minWidth: isMobile ? "100%" : 250,
                    "& .MuiInputBase-input": {
                      fontSize: isMobile ? "16px" : "14px",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: isMobile ? "16px" : "14px",
                    },
                  }}
                >
                  <InputLabel>Prepared by</InputLabel>
                  <Select
                    name="preparedBy"
                    value={value?.preparedBy || ""}
                    onChange={handleChange}
                    label="Prepared by"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: isMobile ? 250 : 300,
                          "& .MuiMenuItem-root": {
                            fontSize: isMobile ? "16px" : "14px",
                            minHeight: isMobile ? "44px" : "36px",
                            padding: isMobile ? "12px 16px" : "8px 16px",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select User</em>
                    </MenuItem>
                    {users?.map((val, i) => (
                      <MenuItem value={val.userId} key={i}>
                        {`${val?.firstName} ${val?.lastName} ${
                          val?.suffix || ""
                        }`.trim()}
                      </MenuItem>
                    ))}
                  </Select>
                  {simpleValidator.current.message(
                    "Prepared by",
                    value?.preparedBy,
                    "required"
                  ) && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{
                        mt: 0.5,
                        ml: 1.5,
                        fontSize: isMobile ? "12px" : "11px",
                      }}
                    >
                      {simpleValidator.current.message(
                        "Prepared by",
                        value?.preparedBy,
                        "required"
                      )}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{
                  width: isMobile ? "100%" : "auto",
                  "& .MuiButton-root": {
                    minHeight: isMobile ? "44px" : "36px",
                    fontSize: isMobile ? "14px" : "13px",
                  },
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    <AddIcon fontSize={isMobile ? "small" : "medium"} />
                  }
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  {isMobile ? "Add Window" : "Add Window"}
                </Button>
                {param.estimateId && (
                  <Button
                    variant="outlined"
                    startIcon={
                      <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
                    }
                    onClick={() => Refresh()}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    {isMobile ? "Refresh" : "Refresh"}
                  </Button>
                )}
              </Stack>
            </Box>
            <Card elevation={1} sx={{ mb: isMobile ? 3 : 4 }}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer
                  sx={{
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1",
                      borderRadius: 4,
                      "&:hover": {
                        backgroundColor: "#a8a8a8",
                      },
                    },
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      minWidth: isMobile ? 1200 : 650,
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Window Label
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Window Qty
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Product Type
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Product
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Dimension
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Options
                        </TableCell>
                        {!user?.isTenant && (
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              bgcolor: "grey.50",
                              fontSize: isMobile ? "12px" : "14px",
                              py: isMobile ? 1.5 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            Wholesale Price
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            textAlign: "center",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Retail Price
                        </TableCell>
                        {user?.isTenant && (
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              bgcolor: "grey.50",
                              textAlign: "center",
                              fontSize: isMobile ? "12px" : "14px",
                              py: isMobile ? 1.5 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            Breakdown
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: "grey.50",
                            textAlign: "center",
                            fontSize: isMobile ? "12px" : "14px",
                            py: isMobile ? 1.5 : 2,
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          Delete
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list?.WindowProductId?.map((val, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "grey.25" },
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: isMobile ? "12px" : "14px",
                              }}
                            >
                              {val?.label}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Chip
                              label={val?.quantity}
                              size={isMobile ? "small" : "small"}
                              color="primary"
                              variant="outlined"
                              sx={{
                                fontSize: isMobile ? "11px" : "12px",
                                height: isMobile ? "24px" : "32px",
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: isMobile ? "12px" : "14px" }}
                            >
                              {val?.productTypeName}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: isMobile ? "12px" : "14px" }}
                            >
                              {val?.productName}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: isMobile ? "11px" : "13px",
                              }}
                            >
                              W: {val?.width}", H: {val?.height}", A:{" "}
                              {val?.archHeight}"
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {val?.options?.map((vals, ind) => (
                                <Chip
                                  key={ind}
                                  label={vals}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: isMobile ? "10px" : "12px",
                                    height: isMobile ? "20px" : "auto",
                                    py: 0.5,
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          {!user?.isTenant && (
                            <TableCell
                              sx={{
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: isMobile ? "12px" : "14px",
                                }}
                              >
                                {defaultConfig.currencySign}{" "}
                                {val?.wholesalePrice}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell
                            sx={{
                              textAlign: "center",
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            {val?.isComponentAvailable ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "success.main",
                                  fontFamily: "monospace",
                                  fontSize: isMobile ? "12px" : "14px",
                                }}
                              >
                                {defaultConfig.currencySign}
                                {(
                                  Number(val?.totalPrice ?? 0) +
                                  Number(val?.additionalCost ?? 0) +
                                  Number(val?.componentMarkup ?? 0) +
                                  Number(val?.productMarkup ?? 0) +
                                  Number(val?.optionMarkup ?? 0)
                                )?.toFixed(2)}
                              </Typography>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "center",
                                  flexDirection: isMobile ? "column" : "row",
                                }}
                              >
                                <TextField
                                  type="number"
                                  size={isMobile ? "small" : "small"}
                                  value={val?.totalPrice || ""}
                                  onChange={(e) =>
                                    handleChanges(e, i, "totalPrice")
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "+" || e.key === "-") {
                                      e.preventDefault();
                                    }
                                  }}
                                  onPaste={(e) => {
                                    const pasted =
                                      e.clipboardData.getData("text");
                                    if (/[+-]/.test(pasted)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                  sx={{
                                    width: isMobile ? 100 : 120,
                                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                      {
                                        display: "none",
                                      },
                                    "& input[type=number]": {
                                      MozAppearance: "textfield",
                                    },
                                    "& .MuiInputBase-input": {
                                      fontSize: isMobile ? "12px" : "14px",
                                    },
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: isMobile ? "10px" : "12px",
                                  }}
                                >
                                  + {defaultConfig.currencySign}{" "}
                                  {(
                                    Number(val?.additionalCost ?? 0) +
                                    Number(val?.componentMarkup ?? 0) +
                                    Number(val?.productMarkup ?? 0) +
                                    Number(val?.optionMarkup ?? 0)
                                  )?.toFixed(2)}
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          {user?.isTenant && (
                            <TableCell
                              sx={{
                                textAlign: "center",
                                py: isMobile ? 1 : 2,
                                px: isMobile ? 1 : 2,
                              }}
                            >
                              {val?.isComponentAvailable ? (
                                <Tooltip title="View Breakdown">
                                  <IconButton
                                    color="primary"
                                    size={isMobile ? "small" : "medium"}
                                    onClick={() => {
                                      setisview(val?.isviewedit ? true : false);
                                      setHistory(true);
                                      setObject(val);
                                    }}
                                    sx={{
                                      "&:hover": {
                                        bgcolor: "primary.light",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    <BreakdownIcon
                                      fontSize={isMobile ? "small" : "medium"}
                                    />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </TableCell>
                          )}
                          <TableCell
                            sx={{
                              textAlign: "center",
                              py: isMobile ? 1 : 2,
                              px: isMobile ? 1 : 2,
                            }}
                          >
                            <Tooltip title="Delete Window">
                              <IconButton
                                color="error"
                                size={isMobile ? "small" : "medium"}
                                onClick={() => handledeletedata(val)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "error.light",
                                    color: "white",
                                  },
                                }}
                              >
                                <DeleteIcon
                                  fontSize={isMobile ? "small" : "medium"}
                                />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}

                      {list?.WindowProductId?.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={user?.isTenant ? 9 : 8}
                            sx={{
                              textAlign: "center",
                              py: isMobile ? 4 : 8,
                              border: "none",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: isMobile ? 1 : 2,
                              }}
                            >
                              <img
                                src="/image/no-records.svg"
                                alt="No records"
                                loading="lazy"
                                style={{
                                  maxWidth: isMobile ? "150px" : "200px",
                                  opacity: 0.6,
                                }}
                              />
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              >
                                Please add a window to create an Estimate
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {simpleValidator.current.message(
                  "Windows",
                  value?.windowProductId,
                  "required"
                ) && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      mx: isMobile ? 1 : 2,
                      mb: 2,
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {simpleValidator.current.message(
                      "Windows",
                      value?.windowProductId,
                      "required"
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12} md={6}>
                {/* Empty column for spacing on desktop */}
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      component="h2"
                      sx={{
                        mb: isMobile ? 2 : 3,
                        fontWeight: 600,
                        color: "primary.main",
                        borderBottom: 2,
                        borderColor: "primary.main",
                        pb: 1,
                        fontSize: isMobile ? "18px" : "20px",
                      }}
                    >
                      Summary
                    </Typography>

                    <Box sx={{ mb: isMobile ? 2 : 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? 1 : 2,
                          mb: 2,
                          flexWrap: isMobile ? "wrap" : "nowrap",
                        }}
                      >
                        {HasPermission("DiscountAdd") && (
                          <Tooltip title="Add New Discount">
                            <IconButton
                              color="primary"
                              size={isMobile ? "small" : "medium"}
                              onClick={() => setDiscountopen(true)}
                              sx={{
                                bgcolor: "primary.light",
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  color: "white",
                                },
                              }}
                            >
                              <AddIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                        )}

                        <FormControl
                          fullWidth
                          size={isMobile ? "medium" : "small"}
                          disabled={!coupan || coupan.length === 0}
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                          }}
                        >
                          <Select
                            onChange={handleChangecupan}
                            value={
                              value.discountCoupon
                                ? JSON.stringify(
                                    coupan.find(
                                      (c) =>
                                        c.couponCode === value.discountCoupon
                                    ) || {}
                                  )
                                : ""
                            }
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: isMobile ? 250 : 300,
                                  "& .MuiMenuItem-root": {
                                    fontSize: isMobile ? "16px" : "14px",
                                    minHeight: isMobile ? "44px" : "36px",
                                    padding: isMobile
                                      ? "12px 16px"
                                      : "8px 16px",
                                  },
                                },
                              },
                            }}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em style={{ color: '#999' }}>Select promotional discount, bulk order...</em>;
                              }
                              try {
                                const selectedCoupon = JSON.parse(selected);
                                return `${selectedCoupon.couponCode} (${selectedCoupon.discountTypeName} - ${
                                  selectedCoupon.discountTypeName === "Percentage"
                                    ? `${selectedCoupon.percentageDiscount}%`
                                    : `${defaultConfig.currencySign}${selectedCoupon.fixedAmount}`
                                })`;
                              } catch (error) {
                                // Fallback in case of parsing error
                                return selected;
                              }
                            }}
                          >
                            <MenuItem value="">
                              <em>
                                Select promotional discount, bulk order...
                              </em>
                            </MenuItem>
                            {coupan?.map((val, i) => (
                              <MenuItem value={JSON.stringify(val)} key={i}>
                                {val?.couponCode} ({val?.discountTypeName} -{" "}
                                {val?.discountTypeName === "Percentage"
                                  ? `${val?.percentageDiscount}%`
                                  : `${defaultConfig.currencySign}${val?.fixedAmount}`}
                                )
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                          variant="contained"
                          onClick={() => Applycopan(value.productsList, true)}
                          disabled={!cupondata || Object.keys(cupondata).length === 0}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            minWidth: isMobile ? 80 : 100,
                            minHeight: isMobile ? "44px" : "36px",
                            fontSize: isMobile ? "14px" : "15px",
                          }}
                        >
                          Apply
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ mb: isMobile ? 2 : 3 }}>
                      <FormControl component="fieldset">
                        <FormLabel
                          component="legend"
                          sx={{
                            fontSize: isMobile ? "15px" : "16px",
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 1,
                          }}
                        >
                          Apply Tax
                        </FormLabel>
                        <RadioGroup
                          row
                          name="isTaxAvailable"
                          value={value.isTaxApplicable.toString()}
                          onChange={handleTaxChange}
                          sx={{ gap: isMobile ? 2 : 3 }}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label="Yes"
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontWeight: 500,
                                fontSize: isMobile ? "14px" : "15px",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label="No"
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontWeight: 500,
                                fontSize: isMobile ? "14px" : "15px",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Card
                      variant="outlined"
                      sx={{ bgcolor: "grey.50", mb: isMobile ? 2 : 3 }}
                    >
                      <CardContent sx={{ py: isMobile ? 1.5 : 2 }}>
                        <Stack spacing={isMobile ? 1.5 : 2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                fontSize: isMobile ? "14px" : "16px",
                              }}
                            >
                              Subtotal:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                fontSize: isMobile ? "14px" : "16px",
                              }}
                            >
                              {defaultConfig.currencySign}{" "}
                              {Number(value?.subTotal)?.toFixed(2)}
                            </Typography>
                          </Box>

                          {Number(value?.discount) > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  color: "error.main",
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              >
                                Discount:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  fontFamily: "monospace",
                                  color: "error.main",
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              >
                                -{defaultConfig.currencySign}{" "}
                                {Number(value?.discount)?.toFixed(2)}
                              </Typography>
                            </Box>
                          )}

                          {value.isTaxApplicable && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              >
                                Taxes:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  fontFamily: "monospace",
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              >
                                {defaultConfig.currencySign}{" "}
                                {Number(value?.tax)?.toFixed(2)}
                              </Typography>
                            </Box>
                          )}

                          <Divider />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant={isMobile ? "subtitle1" : "h6"}
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: isMobile ? "16px" : "18px",
                              }}
                            >
                              Grand Total:
                            </Typography>
                            <Typography
                              variant={isMobile ? "subtitle1" : "h6"}
                              sx={{
                                fontWeight: 700,
                                fontFamily: "monospace",
                                color: "primary.main",
                                fontSize: isMobile ? "16px" : "18px",
                              }}
                            >
                              {defaultConfig.currencySign}{" "}
                              {Number(value?.grandTotal)?.toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      component="h2"
                      sx={{
                        mb: isMobile ? 2 : 3,
                        fontWeight: 600,
                        color: "primary.main",
                        borderBottom: 2,
                        borderColor: "primary.main",
                        pb: 1,
                        fontSize: isMobile ? "18px" : "20px",
                      }}
                    >
                      Estimate Notes
                    </Typography>

                    <Grid
                      container
                      spacing={isMobile ? 2 : 3}
                      sx={{ mb: isMobile ? 3 : 4 }}
                    >
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Terms and Conditions"
                          multiline
                          rows={isMobile ? 3 : 4}
                          fullWidth
                          name="termsCondition"
                          value={value?.termsCondition || ""}
                          onChange={handleChange}
                          placeholder="Payment terms, warranty information, and any disclaimers"
                          variant="outlined"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Additional Notes"
                          multiline
                          rows={isMobile ? 3 : 4}
                          fullWidth
                          name="notes"
                          value={value?.notes || ""}
                          onChange={handleChange}
                          placeholder="Add any other relevant information for the customer"
                          variant="outlined"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: isMobile ? "16px" : "14px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isMobile ? "center" : "flex-end",
                        alignItems: "center",
                        gap: isMobile ? 1 : 2,
                        pt: isMobile ? 2 : 3,
                        borderTop: 1,
                        borderColor: "divider",
                        flexDirection: isMobile ? "column" : "row",
                        "& .MuiButton-root": {
                          minHeight: isMobile ? "44px" : "36px",
                          fontSize: isMobile ? "14px" : "15px",
                          width: isMobile ? "100%" : "auto",
                        },
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/contacts/job/${tenantList[0]?.jobId}`}
                        variant="text"
                        startIcon={
                          <CancelIcon
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        }
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          textDecoration: "underline",
                        }}
                      >
                        Cancel
                      </Button>

                      {HasPermission("EstimateAdd") && (
                        <Button
                          variant="contained"
                          startIcon={
                            <SaveIcon
                              fontSize={isMobile ? "small" : "medium"}
                            />
                          }
                          onClick={() => languageAdd(false)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            px: isMobile ? 2 : 3,
                          }}
                        >
                          {param.estimateId ? "Update" : "Save"}
                        </Button>
                      )}

                      {HasPermission("EstimateAdd") && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={
                            <SendIcon
                              fontSize={isMobile ? "small" : "medium"}
                            />
                          }
                          onClick={() => languageAdd(true)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            px: isMobile ? 2 : 3,
                          }}
                        >
                          {param.estimateId ? "Update" : "Save"} & Send
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
      {open && (
        <AddnewWindow
          open={open}
          handleclose={() => setOpen(false)}
          jobid={param.JobId}
          handleSenddata={handleSenddata}
          Addedwindows={list.WindowProductId}
          listdata={tenantList[0]}
        />
      )}
      {history && (
        <Breakdown
          open={history}
          handleClose={() => setHistory(false)}
          data={object}
          EstimateId={param.estimateId ? param.estimateId : ""}
          IsView={isview}
        />
      )}

      {discountopen && (
        <AddEditDiscount
          open={discountopen}
          handleclose={() => setDiscountopen(false)}
          action={"add"}
          LanguageListAPI={() => CouponlistAPI(tenantList[0]?.contactId)}
          object={{}}
        />
      )}
    </div>
  );
}
