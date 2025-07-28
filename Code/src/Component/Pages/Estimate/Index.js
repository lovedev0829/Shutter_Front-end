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

export default function Index() {
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
      const apiResponse = await callAPI(
        apiUrls.GetAllDiscount,
        { CustomerId: contactId },
        "GET"
      );
      if (apiResponse?.data?.isSuccess) {
        setCoupan(apiResponse?.data?.data);
      } else {
        setCoupan([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {}
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
    if (e.target.value) {
      setCoupandata(JSON.parse(e.target.value));
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
    <>
      {loder > 0 && <ApiLoder />}
      <div className="intersight_content">
        <Header
          title={`Contacts / ${
            tenantList[0]?.contactFirstName +
            " " +
            tenantList[0]?.contactLasttName
          }`}
        />
        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <JobTab contactId={tenantList[0]?.contactId} />
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div className="row mb-30">
                  <BackButton link={`/contacts/job/${tenantList[0]?.jobId}`} />
                  <div className="col-lg-12">
                    <div className="new-job_list">
                      <JobUi tenantList={tenantList[0]} />
                    </div>
                  </div>
                </div>
                <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
                  <div className="heading_width_search d-flex align-items-center gap-3 margin-for-mobile">
                    <h2 className="body_heading width-left-border mb-0">
                      {param.estimateId ? "Update" : "Create"} Estimate{" "}
                      <sup className="boldsup">*</sup>
                    </h2>
                    <div className="estimate-input">
                      <input
                        type="text"
                        placeholder="Enter Estimate Title"
                        name="estimateName"
                        onChange={handleChange}
                        value={value?.estimateName}
                      />

                      <div className="error">
                        {simpleValidator.current.message(
                          "Estimate Title",
                          value?.estimateName,
                          `required`
                        )}
                      </div>
                    </div>
                    <div className="estimate-input">
                      <select
                        className="form-select"
                        onChange={handleChange}
                        style={{
                          height: "30px",
                          fontSize: "12px",
                          minWidth: "244px",
                        }}
                        name="preparedBy"
                        value={value?.preparedBy}
                      >
                        <option value="">Prepared by</option>
                        {users?.map((val, i) => (
                          <option value={val.userId} key={i}>
                            {val?.firstName +
                              " " +
                              val?.lastName +
                              " " +
                              val?.suffix}
                          </option>
                        ))}
                      </select>

                      <div className="error">
                        {simpleValidator.current.message(
                          "Prepared by",
                          value?.preparedBy,
                          `required`
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="heading_width_search d-flex align-items-center gap-3">
                    <Link
                      to="#"
                      className="btn blue-outline-btn small_btn"
                      onClick={() => setOpen(true)}
                    >
                      Add Window
                    </Link>
                    {param.estimateId && (
                      <Link
                        to="#"
                        className="btn blue-outline-btn small_btn"
                        onClick={() => Refresh()}
                      >
                        Refresh
                      </Link>
                    )}
                  </div>
                </div>
                <div className="estimate-table task_table mb-30">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Window label</th>
                          <th scope="col">Window Qty</th>
                          <th scope="col">Product Type</th>
                          <th scope="col">Product</th>
                          <th scope="col">Dimension</th>
                          <th scope="col">Options</th>
                          {!user?.isTenant && (
                            <th scope="col">Wholesale Price</th>
                          )}
                          <th scope="col" className=" text-center">
                            Retail Price
                          </th>
                          {user?.isTenant && (
                            <th scope="col" className=" text-center">
                              Breakdown
                            </th>
                          )}

                          <th scope="col" className=" text-center">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {list?.WindowProductId?.map((val, i) => (
                          <tr key={i}>
                            <td>{val?.label}</td>
                            <td>{val?.quantity}</td>
                            <td>{val?.productTypeName}</td>
                            <td>{val?.productName}</td>
                            <td>
                              W: {val?.width}”, H: {val?.height}”, A:{" "}
                              {val?.archHeight}”
                            </td>
                            <td>
                              <span>
                                <ul className="colors">
                                  {val?.options?.map((vals, ind) => (
                                    <li className="color-item" key={ind}>
                                      {vals}
                                    </li>
                                  ))}
                                </ul>
                              </span>
                            </td>
                            {!user?.isTenant && (
                              <td>
                                {defaultConfig.currencySign}{" "}
                                {val?.wholesalePrice}
                              </td>
                            )}
                            <td className=" text-center">
                              {val?.isComponentAvailable ? (
                                <>
                                  {defaultConfig.currencySign}
                                  {(
                                    Number(val?.totalPrice ?? 0) +
                                    Number(val?.additionalCost ?? 0) +
                                    Number(val?.componentMarkup ?? 0) +
                                    Number(val?.productMarkup ?? 0) +
                                    Number(val?.optionMarkup ?? 0)
                                  )?.toFixed(2)}
                                </>
                              ) : (
                                <div className="d-flex taxwidth">
                                  <input
                                    type="number"
                                    style={{
                                      width: "120px",
                                      MozAppearance: "textfield",
                                    }}
                                    className="form-control no-spinner"
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
                                  />
                                  <span>
                                    {" "}
                                    + {defaultConfig.currencySign}{" "}
                                    {(
                                      Number(val?.additionalCost ?? 0) +
                                      Number(val?.componentMarkup ?? 0) +
                                      Number(val?.productMarkup ?? 0) +
                                      Number(val?.optionMarkup ?? 0)
                                    )?.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </td>
                            {user?.isTenant && (
                              <>
                                {!val?.isComponentAvailable ? (
                                  <td></td>
                                ) : (
                                  <td
                                    className="text-center"
                                    onClick={() => {
                                      setisview(val?.isviewedit ? true : false);
                                      setHistory(true);
                                      setObject(val);
                                    }}
                                  >
                                    <Link to="#">
                                      {" "}
                                      <img
                                        src="/image/breakdown.svg"
                                        alt=""
                                        loading="lazy"
                                      />
                                    </Link>
                                  </td>
                                )}
                              </>
                            )}
                            <td
                              className="text-center"
                              onClick={() => handledeletedata(val)}
                            >
                              <span style={{ cursor: "pointer" }}>
                                <img
                                  src="/image/deleteblue.svg"
                                  alt=""
                                  loading="lazy"
                                />
                              </span>
                            </td>
                          </tr>
                        ))}

                        {list?.WindowProductId?.length === 0 && (
                          <tr>
                            <td
                              className="text-center border-0 no-records"
                              colSpan={9}
                            >
                              <img
                                src="/image/no-records.svg"
                                alt=" "
                                loading="lazy"
                                className="img-fluid"
                              />
                              <p className="font-14">
                                Please add a window to create a Estimate
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="error">
                      {simpleValidator.current.message(
                        "Windows",
                        value?.windowProductId,
                        `required`
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6" />
                  <div className="col-md-6">
                    <div className="adjust-pricing">
                      <div className="middle-heading">
                        <h4>Summary</h4>
                      </div>
                      <div className="couponinput mb-2">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          {HasPermission("DiscountAdd") && (
                            <img
                              src="/image/plusblue.svg"
                              alt=""
                              loading="lazy"
                              style={{ cursor: "pointer" }}
                              onClick={() => setDiscountopen(true)}
                            />
                          )}
                          <select
                            className="form-select null"
                            onChange={handleChangecupan}
                          >
                            <option value="">
                              Discount coupon  (e.g., promotional discounts,
                              bulk order...
                            </option>
                            {coupan?.map((val, i) => (
                              <option
                                value={JSON.stringify(val)}
                                key={i}
                                selected={
                                  value.discountCoupon === val?.couponCode
                                    ? true
                                    : false
                                }
                              >
                                {val?.couponCode} ({val?.discountTypeName} -{" "}
                                {val?.discountTypeName === "Percentage"
                                  ? val?.percentageDiscount
                                  : val?.fixedAmount}
                                )
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="btn blue-btn small_btn"
                            onClick={() => Applycopan(value.productsList, true)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="price-content w-100 price-content-new">
                        <div className="form-group apply-tax-new">
                          <label className="font-14">Apply Tax</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="isTaxAvailable"
                                id="flexRadioDefault3"
                                value="true"
                                checked={value.isTaxApplicable === true}
                                onChange={handleTaxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault3"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="isTaxAvailable"
                                id="flexRadioDefault4"
                                value="false"
                                checked={value.isTaxApplicable === false}
                                onChange={handleTaxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault4"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="price-content-inner">
                          <div className="d-flex justify-content-between">
                            <h2 className="font-14 mb-0">Subtotal:</h2>
                            <span className="mb-0">
                              {defaultConfig.currencySign}{" "}
                              {Number(value?.subTotal)?.toFixed(2)}
                            </span>
                          </div>
                          {/* <div className="d-flex justify-content-between">
                            <h2 className="font-14 mb-0">Additional Cost:</h2>
                            <span className="mb-0">
                              {defaultConfig.currencySign}{" "}
                              {Number(value?.additionalCost)?.toFixed(2)}
                            </span>
                          </div> */}
                          {Number(value?.discount) > 0 && (
                            <div className="d-flex justify-content-between">
                              <h2 className="font-14 mb-0">Discount:</h2>
                              <span className="mb-0">
                                {defaultConfig.currencySign}{" "}
                                {Number(value?.discount)?.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {value.isTaxApplicable && (
                            <div className="d-flex justify-content-between">
                              <h2 className="font-14 mb-0">Taxes:</h2>
                              <span className="mb-0">
                                {defaultConfig.currencySign}{" "}
                                {Number(value?.tax)?.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between">
                            <h2 className="font-14 mb-0">Grand Total:</h2>
                            <span className="mb-0">
                              {defaultConfig.currencySign}{" "}
                              {Number(value?.grandTotal)?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="middle-heading">
                        <h4>Estimate Notes</h4>
                      </div>
                      <div className="row ">
                        <div className="col-md-6 mb-3">
                          <h2 className="font-14">Terms and Conditions</h2>
                          <div className="terms-content">
                            <textarea
                              className="form-control"
                              placeholder="payment terms, warranty information, and any disclaimers"
                              name="termsCondition"
                              onChange={handleChange}
                              value={value?.termsCondition}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <h2 className="font-14">Additional Notes</h2>
                          <div className="terms-content">
                            <textarea
                              className="form-control"
                              placeholder="Add any other relevant information for the customer"
                              name="notes"
                              onChange={handleChange}
                              value={value?.notes}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-style form-group d-flex align-items-center justify-content-end w-100">
                        <Link
                          to={`/contacts/job/${tenantList[0]?.jobId}`}
                          className="cancel text-decoration-underline"
                        >
                          Cancel
                        </Link>
                        {HasPermission("EstimateAdd") && (
                          <Link
                            to="#"
                            className="btn blue-btn me-2"
                            onClick={() => languageAdd(false)}
                          >
                            {param.estimateId ? "Update" : "Save"}
                          </Link>
                        )}
                        {HasPermission("EstimateAdd") && (
                          <Link
                            to="#"
                            className="btn blue-btn"
                            onClick={() => languageAdd(true)}
                          >
                            {param.estimateId ? "Update" : "Save"} & Send
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}
