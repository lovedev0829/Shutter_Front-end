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
import SimpleReactValidator from "simple-react-validator";
import JobTab from "../../Form/JobTab";
import Breakdown from "../Estimate/Breakdown";
import { defaultConfig } from "../../../config";

export default function Index() {
  const [tenantList, setTenantList] = useState([]);
  const [coupan, setCoupan] = useState([]);
  const [cupondata, setCoupandata] = useState({});
  const [list, setList] = useState({ WindowProductId: [] });
  const [loder, setLoader] = useState(false);
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();
  const [totalTax, settotalTax] = useState(0);
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
    isTaxApplicable: true,
  });
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  const startLoading = () => setLoader((prev) => prev + 1);
  const stopLoading = () => setLoader((prev) => Math.max(0, prev - 1));

  const languageAdd = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      startLoading();
      try {
        const apiResponse = await callAPI(
          apiUrls.OrderUpdate,
          {},
          "POST",
          value
        );
        stopLoading();
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          navigate(`/contacts/job/${param.JobId}`);
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        stopLoading();
      }
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

  const EstimatelistAPI = async () => {
    startLoading();
    let query = {
      searchValue: param.orderId,
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
      const apiResponse = await callAPI(apiUrls.Order, {}, "POST", query);

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
              price: item?.price || item?.productPrice,
              quantity: item?.windowQty,
              additionalCost: item.additionalCost || 0,
              wholesalePrice: item.wholesalePrice || 0,
              componentMarkup: item.componentMarkup || 0,
              productMarkup: item.productMarkup || 0,
              optionMarkup: item.optionMarkup || 0,
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

  useEffect(() => {
    TenantlistAPI();
    EstimatelistAPI();
    // eslint-disable-next-line
  }, [param.orderId]);

  const handleChangecupan = (e) => {
    if (e.target.value) {
      setCoupandata(JSON.parse(e.target.value));
    } else {
      setValue((val) => ({
        ...val,
       grandTotal : value?.subTotal + (value.isTaxApplicable ? (totalTax || 0) : (value.tax || 0)),
        discount: 0,
        discountCoupon: null,
        discountId: null,
      }));
      setCoupandata({});
    }
  };
  const Applycopan = () => {
    if (
      cupondata &&
      (cupondata.discountTypeName ||
        cupondata.fixedAmount ||
        cupondata.percentageDiscount)
    ) {
      let discount = 0;
      let grandTotal = 0;
      if (cupondata?.discountTypeName === "Fixed") {
        discount =
          Number(cupondata?.fixedAmount) >
          Number(value.subTotal) 
            ? Number(value.subTotal)
            : Number(cupondata?.fixedAmount);
        grandTotal = Math.max(
          0,
          (value.subTotal || 0) +
             (value.isTaxApplicable ? totalTax || 0 : value.tax || 0)  -
            (discount || 0)
        );
      } else if (cupondata?.discountTypeName === "Percentage") {
        discount =
          ((value.subTotal) *
            Number(cupondata?.percentageDiscount)) /
          100;
        grandTotal = Math.max(
          0,
          (value.subTotal || 0)  - (discount || 0) + (value.isTaxApplicable ? totalTax||0 : value.tax || 0)
        );
      }
      setValue((val) => ({
        ...val,
        grandTotal: Number(grandTotal),
        discount: Number(discount),
        discountCoupon: cupondata?.couponCode,
        discountId: cupondata?.discountId,
      }));
      SuccessMessage(
        `Applied coupon code ${cupondata?.couponCode} successfully!`
      );
    }
  };
  const handleTaxChange = (e) => {
    const isAvailable = e.target.value === "true";
    const newValue = {
      ...value,
      isTaxApplicable: isAvailable,
    };
    if (!isAvailable) {
      newValue.tax = 0;
      newValue.grandTotal =
        value.subTotal  - value.discount ||
        0;
    } else {
      newValue.tax = totalTax;
     newValue.grandTotal = (value.subTotal + totalTax - value.discount) || 0;
    }
    //totalTax

    setValue(newValue);
  };

  const user = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <ApiLoder open={loder > 0} />
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
                <div className="d-flex align-items-center justify-content-between mb-30">
                  <div className="heading_width_search d-flex align-items-center gap-3">
                    <h2 className="body_heading width-left-border mb-0">
                      Order Number
                    </h2>
                    <div className="estimate-input">
                      <input type="text" disabled value={value?.orderNumber} />
                    </div>
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
                            {!user?.isTenant &&  <th scope="col">Wholesale Price</th>}
                          <th scope="col" className=" text-center">
                            Retail Price
                          </th>
                          {user?.isTenant && (
                            <th scope="col" className=" text-center">
                              Breakdown
                            </th>
                          )}
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
                            {!user?.isTenant &&    <td>
                              {defaultConfig.currencySign} {val?.wholesalePrice}
                            </td>}
                            <td className=" text-center">
                              {defaultConfig.currencySign}{" "}
                              
                              {parseFloat((Number(val?.price ?? 0) + Number(val?.additionalCost ?? 0)+ Number(val?.componentMarkup ?? 0)+ Number(val?.productMarkup ?? 0)+ Number(val?.optionMarkup ?? 0))?.toFixed(2))}
                            </td>
                            {user?.isTenant && (
                              <td
                                className="text-center"
                                onClick={() => {
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
                                No window Found for this Order
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
                            onClick={Applycopan}
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
                                disabled
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
                                disabled
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
                      <div className="row mb-4">
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
                        {HasPermission("OrderEdit") && (
                          <Link
                            to="#"
                            className="btn blue-btn"
                            onClick={languageAdd}
                          >
                            Update
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
      {history &&<Breakdown
        open={history}
        handleClose={() => setHistory(false)}
        data={object}
        EstimateId={value.estimateId ? value.estimateId : ""}
        IsView={true}
        isestimate={false}
      />
}
    </>
  );
}
