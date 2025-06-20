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
import { TablePagination } from "@mui/material";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import { defaultConfig } from "../../../config";
import { useParams } from "react-router-dom";

export default function ProductEdit() {
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
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Manage Product" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Product" />
            </div>

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
            <div className="task_table mb-30">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">SN</th>
                      <th scope="col">Product Name</th>
                      {/* <th scope="col">
                        {HasPermission("SubTenantView")
                          ? "MSRP / Wholesale Price"
                          : "MSRP"}
                      </th> */}
                      {HasPermission("SubTenantView") && (
                        <th scope="col">IsVisible</th>
                      )}

                      <th scope="col">Price Type</th>

                      {HasPermission("SubTenantView") && (
                        <th scope="col">
                          Wholesale Price{" "}
                          {HasPermission("SubTenantView") ? "Markup" : ""}
                        </th>
                      )}
                      <th scope="col">
                        {" "}
                        {HasPermission("SubTenantView")
                          ? "Max Partner Price Markup"
                          : "Selling price Markup"}
                      </th>
                      {!HasPermission("SubTenantView") && (
                        <th scope="col">Tax</th>
                      )}
                      <th scope="col"></th>

                      <th scope="col" className="text-end">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantList?.map((val, i) => (
                      <React.Fragment key={i}>
                        <tr>
                          <td>{(page - 1) * rowsPerPage + i + 1}</td>
                          <td>{val?.productName}</td>
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
                            <td>
                              <input
                                type="checkbox"
                                style={{ border: "1px solid #8f8b8b" }}
                                className="form-check-input"
                                checked={val.isAvailable}
                                onChange={(e) =>
                                  handleChanges(e, i, "isAvailable")
                                }
                              />
                            </td>
                          )}

                          {!HasPermission("SubTenantView") ? (
                            <td>
                              <select
                                class="form-select"
                                name="productType"
                                style={{ width: "137px" }}
                                value={val?.markupType}
                                onChange={(e) =>
                                  handleChanges(e, i, "markupType")
                                }
                                disabled
                              >
                                <option value="Fixed">Fixed</option>
                                <option value="Percentage">Percentage</option>
                              </select>
                            </td>
                          ) : (
                            <td>
                              {val.isComponentAvailable ? (
                                <select
                                  class="form-select"
                                  name="productType"
                                  style={{ width: "137px" }}
                                  value={val?.priceType}
                                  onChange={(e) =>
                                    handleChanges(e, i, "priceType")
                                  }
                                  disabled={!val.isComponentAvailable}
                                >
                                  <option value="Fixed">Fixed</option>
                                  <option value="Percentage">Percentage</option>
                                </select>
                              ) : (
                                "Pricing at Estimation Screen"
                              )}
                            </td>
                          )}

                          {HasPermission("SubTenantView") && (
                            <td>
                              {val.isComponentAvailable ? (
                                <input
                                  type="number"
                                  style={{ width: "120px" }}
                                  className="form-control"
                                  value={val?.wholeSalePrice}
                                  onChange={(e) =>
                                    handleChanges(e, i, "wholeSalePrice")
                                  }
                                  disabled={!val.isAvailable}
                                />
                              ) : (
                                "Pricing at Estimation Screen"
                              )}
                            </td>
                            // ) : (
                            //   <p>
                            //     {" "}
                            //     {defaultConfig?.currencySign}{" "}
                            //     {val?.wholeSalePrice}
                            //   </p>
                          )}

                          <td>
                            {HasPermission("SubTenantView") ? (
                              <>
                                {val.isComponentAvailable ? (
                                  <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: "120px" }}
                                    value={val?.maxPartnerPrice}
                                    disabled={!val.isAvailable}
                                    onChange={(e) =>
                                      handleChanges(e, i, "maxPartnerPrice")
                                    }
                                  />
                                ) : (
                                  "Pricing at Estimation Screen"
                                )}
                              </>
                            ) : (
                              <input
                                type="number"
                                className="form-control"
                                style={{ width: "120px" }}
                                value={val?.partnerSellingPrice}
                                onChange={(e) =>
                                  handleChanges(e, i, "partnerSellingPrice")
                                }
                                disabled={
                                  val.isComponentAvailable ? false : true
                                }
                              />
                            )}
                          </td>
                          {!HasPermission("SubTenantView") && (
                            <td>
                              <select
                                class="form-select"
                                name="taxRateId"
                                style={{ width: "137px" }}
                                value={val?.taxRateId}
                                onChange={(e) =>
                                  handleChanges(e, i, "taxRateId")
                                }
                              >
                                <option value="">Select Tax</option>
                                {countryList?.map((item, i) => {
                                  return (
                                    <option
                                      key={i}
                                      value={item?.taxRateId}
                                      selected={
                                        item?.taxRateId === val?.taxRateId
                                          ? true
                                          : false
                                      }
                                    >
                                      {item?.taxName}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                          )}

                          {val?.options?.length > 0 ? (
                            <td
                              style={{ cursor: "pointer" }}
                              onClick={() => toggleMilestone(i)}
                            >
                              Show Options{" "}
                              <i
                                className="fa fa-angle-down me-2"
                                aria-hidden="true"
                              ></i>
                            </td>
                          ) : (
                            <td></td>
                          )}
                          <td className="text-end">
                            {HasPermission("ManageProductEdit") &&
                              editedRows.has(i) && (
                                <>
                                  <img
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    src="/image/submit.png"
                                    onClick={() => handleSubmit(i)}
                                  />
                                  <img
                                    alt=""
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "5px",
                                    }}
                                    src="/image/cross.png"
                                    onClick={() => handleClear(i)}
                                  />
                                </>
                              )}
                          </td>
                        </tr>
                        {expandedMilestone === i && (
                          <React.Fragment>
                            {val?.options?.map((vals, ind) =>
                              vals?.optionTypes?.length > 0 ? (
                                <tr key={ind}>
                                  <td
                                    style={{ padding: "0px" }}
                                    colSpan={
                                      HasPermission("SubTenantView") ? 9 : 9
                                    }
                                  >
                                    <div className="product-table-new">
                                      <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h2 className="body_heading width-left-border mb-0 new-table-heading">
                                          Option Name{" "}
                                          <span className="text-black">
                                            : {vals?.optionName}
                                          </span>
                                        </h2>
                                        {!HasPermission("SubTenantView") && (
                                          <div style={{ marginTop: "10px" }}>
                                            <select
                                              className="form-select"
                                              style={{ width: "200px" }}
                                              value={vals?.taxRateId || ""}
                                              onChange={(e) =>
                                                handleParentTaxRateChange(
                                                  e,
                                                  i,
                                                  ind
                                                )
                                              }
                                            >
                                              <option value="">
                                                Select Tax
                                              </option>
                                              {countryList?.map(
                                                (item, index) => (
                                                  <option
                                                    key={index}
                                                    value={item?.taxRateId}
                                                  >
                                                    {item?.taxName}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th scope="col">Option Value</th>
                                            {/* <th scope="col">
                                              {HasPermission("SubTenantView")
                                                ? "MSRP / Wholesale Price"
                                                : "MSRP"}
                                            </th> */}

                                            {HasPermission("SubTenantView") && (
                                              <th scope="col">IsVisible</th>
                                            )}
                                            <th scope="col">Price Type</th>
                                            {HasPermission("SubTenantView") && (
                                              <th scope="col">
                                                Wholesale Price{" "}
                                                {HasPermission("SubTenantView")
                                                  ? "Markup"
                                                  : ""}
                                              </th>
                                            )}

                                            <th scope="col">
                                              {HasPermission("SubTenantView")
                                                ? "Max Price Markup"
                                                : "Selling Price Markup"}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {vals?.optionTypes?.map(
                                            (valss, inds) => (
                                              <React.Fragment key={inds}>
                                                <tr>
                                                  <td>
                                                    {valss?.optionTypeName}
                                                  </td>
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
                                                  {HasPermission(
                                                    "SubTenantView"
                                                  ) && (
                                                    <td>
                                                      <input
                                                        type="checkbox"
                                                        style={{
                                                          border:
                                                            "1px solid #8f8b8b",
                                                        }}
                                                        disabled={
                                                          !val.isAvailable
                                                        }
                                                        checked={
                                                          valss?.isAvailable
                                                        }
                                                        onChange={(e) =>
                                                          handleOptionChange(
                                                            e,
                                                            i,
                                                            ind,
                                                            inds,
                                                            "isAvailable"
                                                          )
                                                        }
                                                        className="form-check-input"
                                                      />
                                                    </td>
                                                  )}

                                                  <td>
                                                    {HasPermission(
                                                      "SubTenantView"
                                                    ) ? (
                                                      <select
                                                        class="form-select"
                                                        name="productType"
                                                        style={{
                                                          width: "137px",
                                                        }}
                                                        value={valss?.priceType}
                                                        onChange={(e) =>
                                                          handleOptionChange(
                                                            e,
                                                            i,
                                                            ind,
                                                            inds,
                                                            "priceType"
                                                          )
                                                        }
                                                        disabled={
                                                          val.isComponentAvailable
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        <option value="Fixed">
                                                          Fixed
                                                        </option>
                                                        <option value="Percentage">
                                                          Percentage
                                                        </option>
                                                      </select>
                                                    ) : (
                                                      <select
                                                        class="form-select"
                                                        name="productType"
                                                        style={{
                                                          width: "137px",
                                                        }}
                                                        value={
                                                          valss?.markupOptionType
                                                        }
                                                        onChange={(e) =>
                                                          handleOptionChange(
                                                            e,
                                                            i,
                                                            ind,
                                                            inds,
                                                            "markupOptionType"
                                                          )
                                                        }
                                                        disabled
                                                      >
                                                        <option value="Fixed">
                                                          Fixed
                                                        </option>
                                                        <option value="Percentage">
                                                          Percentage
                                                        </option>
                                                      </select>
                                                    )}
                                                  </td>

                                                  {HasPermission(
                                                    "SubTenantView"
                                                  ) && (
                                                    <td>
                                                      {val.isComponentAvailable ? (
                                                        <input
                                                          type="number"
                                                          style={{
                                                            width: "120px",
                                                          }}
                                                          className="form-control"
                                                          value={
                                                            valss?.wholeSalePrice
                                                          }
                                                          disabled={
                                                            !valss?.isAvailable
                                                          }
                                                          onChange={(e) =>
                                                            handleOptionChange(
                                                              e,
                                                              i,
                                                              ind,
                                                              inds,
                                                              "wholeSalePrice"
                                                            )
                                                          }
                                                        />
                                                      ) : (
                                                        <input
                                                          type="number"
                                                          style={{
                                                            width: "120px",
                                                          }}
                                                          className="form-control"
                                                          value={
                                                            valss?.wholeSalePrice
                                                          }
                                                          disabled={true}
                                                          onChange={(e) =>
                                                            handleOptionChange(
                                                              e,
                                                              i,
                                                              ind,
                                                              inds,
                                                              "wholeSalePrice"
                                                            )
                                                          }
                                                        />
                                                      )}
                                                    </td>
                                                    // ) : (
                                                    //   <p>
                                                    //     {
                                                    //       defaultConfig?.currencySign
                                                    //     }{" "}
                                                    //     {valss?.wholeSalePrice}
                                                    //   </p>
                                                  )}

                                                  <td>
                                                    {HasPermission(
                                                      "SubTenantView"
                                                    ) ? (
                                                      <>
                                                        {val.isComponentAvailable ? (
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            style={{
                                                              width: "120px",
                                                            }}
                                                            value={
                                                              valss?.maxPrice
                                                            }
                                                            disabled={
                                                              !valss?.isAvailable
                                                            }
                                                            onChange={(e) =>
                                                              handleOptionChange(
                                                                e,
                                                                i,
                                                                ind,
                                                                inds,
                                                                "maxPrice"
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            style={{
                                                              width: "120px",
                                                            }}
                                                            value={
                                                              valss?.maxPrice
                                                            }
                                                            disabled={true}
                                                            onChange={(e) =>
                                                              handleOptionChange(
                                                                e,
                                                                i,
                                                                ind,
                                                                inds,
                                                                "maxPrice"
                                                              )
                                                            }
                                                          />
                                                        )}
                                                      </>
                                                    ) : (
                                                      <input
                                                        type="number"
                                                        className="form-control"
                                                        style={{
                                                          width: "120px",
                                                        }}
                                                        value={
                                                          valss?.partnerSellingPrice
                                                        }
                                                        disabled={
                                                          val.isComponentAvailable
                                                            ? false
                                                            : true
                                                        }
                                                        onChange={(e) =>
                                                          handleOptionChange(
                                                            e,
                                                            i,
                                                            ind,
                                                            inds,
                                                            "partnerSellingPrice"
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  </td>
                                                </tr>
                                              </React.Fragment>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              ) : null
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ))}
                    {(!tenantList || tenantList?.length === 0) && (
                      <tr>
                        <td
                          className="text-center border-0 no-records"
                          colSpan={7}
                        >
                          <img
                            src="/image/no-records.svg"
                            alt=" "
                            loading="lazy"
                            className="img-fluid"
                          />
                          <p className="font-14">No Product Found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                        />
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
