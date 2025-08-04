import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import { Tooltip } from "@mui/material";
import AddEditComponent from "../Component/AddEditComponent";
import AddEditExpression from "../Expression/AddEditExpression";
import AddEditProductType from "../ProductType/AddEditProductType";
import TaxListDropdown from "../../../helpers/TaxListDropdown";
import AddEditTaxes from "../Taxes/AddEditTaxes";
import Select from "react-select";

const AddEditProduct = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = {
    productName: "",
    productType: "",
    notes: "",
    markup: "",
    isComponentAvailable: true,
    isTaxAvailable: true,
    taxId: null,
    productComponents: [
      {
        quantity: 1,
        componentId: "",
        pricingExpression: "",
      },
    ],
  };

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [countryList, setCountryList] = useState([]);
  const [formula, setFormula] = useState([]);
  const [show, setShow] = useState(false);
  const [vendor, setvendor] = useState(false);
  const [expression, setexpression] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);
  const [tax, settax] = useState(false);
  const [taxlist, settaxlist] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "productType") {
      CountryList(e.target.value);
      ExpressionList(e.target.value);
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const ProductsAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);

       const sanitizedValue = {
          ...value,
          productComponents: value?.productComponents?.map((material) => ({
            ...material,
            quantity: material.quantity?material.quantity:1,
            componentId: material.componentId ? material.componentId : null,
             pricingExpression:material.pricingExpression ? material.pricingExpression : null
          })),
        };

        const apiResponse = await callAPI(
          action === "add" ? apiUrls.ProductCreate : apiUrls.ProductUpdate,
          {},
          "POST",
          sanitizedValue
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue(defaultState);
          simpleValidator.current.hideMessages();
          forceUpdate();
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    if (action === "edit") {
      setValue(object);
      simpleValidator.current.purgeFields([
        "quantity",
        "componentId",
        "pricingExpression",
      ]);
    } else {
      setValue(defaultState);
    }
    setproducttypelist(false);
    settaxlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const AddContactPerson = () => {
    const newArray = value?.productComponents;
    newArray.push({
      quantity: 1,
      componentId: "",
      pricingExpression: "",
    });
    setValue((val) => {
      return { ...val, productComponents: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = value.productComponents;
    newArray.splice(i, 1);
    setValue((val) => {
      return { ...val, productComponents: newArray };
    });

    if (newArray?.length <= 0) {
      simpleValidator.current.purgeFields([
        "quantity",
        "componentId",
        "pricingExpression",
      ]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = value.productComponents;
    const key = e.target.name;

    if (key === "quantity") newArray[i].quantity = e.target.value;
    else if (key === "componentId") newArray[i].componentId = e.target.value;
    else if (key === "pricingExpression")
      newArray[i].pricingExpression = e.target.value;
    setValue((val) => {
      return { ...val, productComponents: newArray };
    });
  };

  const CountryList = async (ProductType) => {
    try {
      setShow(true);
      setValue((val) => {
        return {
          ...val,
          productComponents: [
            {
              quantity: 1,
              componentId: "",
              pricingExpression: "",
            },
          ],
        };
      });
      const apiResponse = await callAPI(
        apiUrls.GetAllComponent,
        { ProductType: ProductType },
        "GET"
      );
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setShow(false);
      setCountryList([]);
    }
  };

  const ExpressionList = async (ProductId) => {
    try {
      setShow(true);
      setValue((val) => {
        return {
          ...val,
          productComponents: [
            {
              quantity: 1,
              componentId: "",
              pricingExpression: "",
            },
          ],
        };
      });
      const apiResponse = await callAPI(apiUrls.GetAllExpression, {}, "POST", {
        productType: ProductId,
        isOptionExpression: false,
      });
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setFormula(apiResponse?.data?.data);
      } else {
        setFormula([]);
      }
    } catch (error) {
      setShow(false);
      setFormula([]);
    }
  };

  const handleapi = () => {
    CountryList(value.productType);
  };
  const handleapi2 = () => {
    ExpressionList(value.productType);
  };

  const Getproduct = (id) => {
    if (action !== "edit") {
      CountryList(id);
      ExpressionList(id);
      setValue((val) => {
        return { ...val, productType: id };
      });
    }
  };

  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
  };
  const handleapitax = () => {
    settaxlist((prev) => !prev);
  };

  const handleRadioChange = (e) => {
    const isAvailable = e.target.value === "true";

    const newValue = {
      ...value,
      isComponentAvailable: isAvailable,
    };

    if (!isAvailable) {
      newValue.productComponents = [];
      simpleValidator.current.purgeFields([
        "quantity",
        "componentId",
        "pricingExpression",
      ]);
    } else {
      newValue.productComponents = [
        {
          quantity: 1,
          componentId: "",
          pricingExpression: "",
        },
      ];
    }

    setValue(newValue);
  };

  const handleTaxChange = (e) => {
    const isAvailable = e.target.value === "true";
    const newValue = {
      ...value,
      isTaxAvailable: isAvailable,
      taxId: null,
    };
    if (!isAvailable) {
      simpleValidator.current.purgeFields(["taxId"]);
    }
    setValue(newValue);
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      position: "absolute", // key change
      zIndex: 9999, // ensure it's above other elements
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <Dialog
        open={open}
        scroll="paper"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className="modal fade show"
          id="contactModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", backgroundColor: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered filter_modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  {action === "add" ? "Add Product" : "Update Product"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setCountryList([]);
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                ></i>
              </div>
              <form onSubmit={ProductsAddUpdate}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Product Type <sup>*</sup>{" "}
                            </span>
                            {action === "edit" &&
                              value?.productComponents?.length > 0 && (
                                <Tooltip title="The Product Type is already linked to a component with this product name and cannot be changed.">
                                  <span className="product_question">?</span>
                                </Tooltip>
                              )}
                            {HasPermission("ProductTypeAdd") &&
                              action !== "edit" && (
                                <img
                                  src="/image/plusblue.svg"
                                  alt=""
                                  loading="lazy"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setproducttype(true)}
                                />
                              )}
                          </label>
                          <ProductTypeDropdown
                            value={value.productType}
                            fn={handleChange}
                            load={producttypelist}
                            Getproduct={Getproduct}
                            disabled={
                              action === "edit" &&
                              value?.productComponents?.length > 0
                                ? true
                                : false
                            }
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "productType",
                              value?.productType,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Product Name"}
                            placeholderName={"Enter Product Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"productName"}
                            name={"productName"}
                            value={value.productName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Product Name",
                              value?.productName,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Markup %"}
                            placeholderName={"Enter Markup %"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"markup"}
                            name={"markup"}
                            value={value.markup}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Markup %",
                              value?.markup,
                              `required|numeric`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Notes"}
                            placeholderName={"Enter Notes"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"notes"}
                            name={"notes"}
                            value={value.notes}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Is Component Available
                          </label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                value="true"
                                checked={value.isComponentAvailable === true}
                                onChange={handleRadioChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault2"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                value="false"
                                checked={value.isComponentAvailable === false}
                                onChange={handleRadioChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault1"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">Apply Tax</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="isTaxAvailable"
                                id="flexRadioDefault3"
                                value="true"
                                checked={value.isTaxAvailable === true}
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
                                checked={value.isTaxAvailable === false}
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
                      </div>
                      {value.isTaxAvailable && (
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <label className="font-14 d-flex align-items-center justify-content-between">
                              <span>
                                {" "}
                                Select Tax <sup>*</sup>{" "}
                              </span>
                              {HasPermission("TaxAdd") && (
                                <img
                                  src="/image/plusblue.svg"
                                  alt=""
                                  loading="lazy"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => settax(true)}
                                />
                              )}
                            </label>
                            <TaxListDropdown
                              value={value.taxId}
                              fn={handleChange}
                              load={taxlist}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                "Tax",
                                value?.taxId,
                                `required`
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {action !== "edit" && value.isComponentAvailable && (
                        <>
                          <h1 className="font-18 mb-30 mt-3">Add Component</h1>
                          {value.productComponents !== undefined &&
                            value.productComponents.length > 0 &&
                            value?.productComponents?.map((val, i) => {
                              const options = countryList?.map((vals) => {
                                const isDisabled =
                                  value?.productComponents?.some(
                                    (material) =>
                                      material?.componentId ===
                                        vals?.componentId &&
                                      vals?.componentId !== val?.componentId
                                  );

                                return {
                                  value: vals.componentId,
                                  label: vals.componentName,
                                  isDisabled,
                                };
                              });

                              const selectedOption =
                                options?.find(
                                  (opt) => opt?.value === val?.componentId
                                ) || null;

                              const handleComponentChange = (
                                selectedOption
                              ) => {
                                const syntheticEvent = {
                                  target: {
                                    name: "componentId",
                                    value: selectedOption?.value || "",
                                  },
                                };
                                handleContactPerson(syntheticEvent, i);
                              };

                              const expressionOptions = formula?.map(
                                (vals) => ({
                                  value: vals.expressionId,
                                  label: vals.expressionName,
                                })
                              );

                              const selectedExpression =
                                expressionOptions?.find(
                                  (opt) => opt?.value === val?.pricingExpression
                                ) || null;

                              const handleExpressionChange = (
                                selectedOption
                              ) => {
                                const syntheticEvent = {
                                  target: {
                                    name: "pricingExpression",
                                    value: selectedOption?.value || "",
                                  },
                                };
                                handleContactPerson(syntheticEvent, i);
                              };
                              return (
                                <React.Fragment key={i}>
                                  <div className="col-lg-4 col-md-4">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14 d-flex align-items-center justify-content-between">
                                          <span>
                                            Component Name <sup>*</sup>
                                          </span>
                                          {HasPermission("ComponentAdd") && (
                                            <img
                                              src="/image/plusblue.svg"
                                              alt=""
                                              loading="lazy"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => setvendor(true)}
                                            />
                                          )}
                                        </label>
                                      )}
                                      <div className="position-relative">
                                        {show && <SelectBoxLoader />}
                                        <Select
                                          name="componentId"
                                          value={selectedOption}
                                          onChange={handleComponentChange}
                                          options={options}
                                          placeholder="Choose Component"
                                          classNamePrefix="react-select"
                                          isOptionDisabled={(option) =>
                                            option.isDisabled
                                          }
                                          menuPortalTarget={document.body}
                                          menuPosition="fixed"
                                          styles={customStyles}
                                        />
                                        {/* <select
                                          className="form-select "
                                          aria-label="Default select example"
                                          name="componentId"
                                          value={val?.componentId}
                                          onChange={(e) => {
                                            handleContactPerson(e, i);
                                          }}
                                        >
                                          <option value="">
                                            Choose Component
                                          </option>
                                          {countryList?.map((vals, idx) => {
                                            const isDisabled =
                                              value?.productComponents?.some(
                                                (material) =>
                                                  material?.componentId ===
                                                  vals?.componentId
                                              );

                                            return (
                                              <option
                                                value={vals.componentId}
                                                key={idx}
                                                disabled={
                                                  isDisabled &&
                                                  vals.componentId !==
                                                    val?.componentId
                                                }
                                                selected={
                                                  vals.componentId ===
                                                  val?.componentId
                                                    ? true
                                                    : false
                                                }
                                              >
                                                {vals.componentName}
                                              </option>
                                            );
                                          })}
                                        </select> */}
                                      </div>
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Component",
                                          val?.componentId,
                                          "required"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14 d-flex align-items-center justify-content-between">
                                          <span>
                                            Pricing Expression 
                                          </span>
                                          {HasPermission("ExpressionAdd") && (
                                            <img
                                              src="/image/plusblue.svg"
                                              alt=""
                                              loading="lazy"
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                setexpression(true)
                                              }
                                            />
                                          )}
                                        </label>
                                      )}

                                      <div className="position-relative">
                                        {show && <SelectBoxLoader />}
                                        <Select
                                          name="pricingExpression"
                                          value={selectedExpression}
                                          onChange={handleExpressionChange}
                                          options={expressionOptions}
                                          placeholder="Choose Expression"
                                          classNamePrefix="react-select"
                                          menuPortalTarget={document.body}
                                          menuPosition="fixed"
                                          styles={customStyles}
                                          isClearable
                                        />
                                        {/* <select
                                          className="form-select "
                                          aria-label="Default select example"
                                          name="pricingExpression"
                                          value={val?.pricingExpression}
                                          onChange={(e) => {
                                            handleContactPerson(e, i);
                                          }}
                                        >
                                          <option value="">
                                            Choose Expression
                                          </option>
                                          {formula?.map((vals, idx) => {
                                            return (
                                              <option
                                                value={vals.expressionId}
                                                key={idx}
                                                selected={
                                                  vals.expressionId ===
                                                  val?.pricingExpression
                                                    ? true
                                                    : false
                                                }
                                              >
                                                {vals?.expressionName}
                                              </option>
                                            );
                                          })}
                                        </select> */}
                                      </div>

                                      
                                    </div>
                                  </div>
                                  {/* <div className="col-lg-2 col-md-2">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14">
                                          Qty <sup>*</sup>
                                        </label>
                                      )}
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter qty"
                                        name="quantity"
                                        value={val?.quantity}
                                        onChange={(e) => {
                                          handleContactPerson(e, i);
                                        }}
                                      />
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Qty",
                                          val?.quantity,
                                          "required|numeric"
                                        )}
                                      </div>
                                    </div>
                                  </div> */}

                                  <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-start deledit mb-3">
                                    {i ===
                                      value.productComponents.length - 1 && (
                                      <div
                                        onClick={AddContactPerson}
                                        className="me-3"
                                      >
                                        <img
                                          src="/image/plusblue.svg"
                                          alt=""
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                    {value.productComponents.length > 1 && (
                                      <div
                                        onClick={() => {
                                          deleteContactPerson(i);
                                        }}
                                      >
                                        <img
                                          src="/image/deletered.svg"
                                          alt=""
                                        />
                                      </div>
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setCountryList([]);
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                    >
                      Cancel
                    </Link>
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={action === "add" ? "Submit" : "Update"}
                      disabled={loader}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {vendor &&<AddEditComponent
        open={vendor}
        handleclose={() => setvendor(false)}
        action={"add"}
        LanguageListAPI={handleapi}
        object={""}
      />
}
      {expression &&<AddEditExpression
        open={expression}
        handleclose={() => setexpression(false)}
        action={"add"}
        LanguageListAPI={handleapi2}
        object={""}
      />
}
      {producttype &&<AddEditProductType
        open={producttype}
        handleclose={() => setproducttype(false)}
        action={"add"}
        LanguageListAPI={handleapiproduct}
        object={""}
      />
}
      {tax &&<AddEditTaxes
        open={tax}
        handleclose={() => settax(false)}
        action={"add"}
        LanguageListAPI={handleapitax}
        object={""}
      />
}
    </>
  );
};

export default AddEditProduct;
