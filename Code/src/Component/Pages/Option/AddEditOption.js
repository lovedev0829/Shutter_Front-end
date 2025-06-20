import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import AddEditProductType from "../ProductType/AddEditProductType";
import AllProductDropdown from "../../../helpers/AllProductDropdown";
import AddEditProduct from "../Products/AddEditProduct";
import FormulaDropdown from "../../../helpers/FormulaDropdown";
import TaxListDropdown from "../../../helpers/TaxListDropdown";
import AddEditExpression from "../OptionExpression/AddEditExpression";
import AddEditTaxes from "../Taxes/AddEditTaxes";

const AddEditOption = ({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const defaultState = {
    productTypeId: "",
    optionName: "",
    productId: "",
    optionExpression: "",
    markup: "",
    unit: "",
    isTaxAvailable: true,
    taxId: null,
    options: [
      {
        optionType: "",
        additionalCost: "",
        isDefault: false,
        sortOrder: 0,
      },
    ],
  };

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [vendor, setvendor] = useState(false);
  const [tax, setTax] = useState(false);
  const [taxlist, setTaxlist] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);
  const [alltax, setallTax] = useState(false);
  const [alltaxlist, setallTaxlist] = useState(false);

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const languageAdd = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.OptionCreate : apiUrls.OptionUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue(defaultState);
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
    } else {
      setValue(defaultState);
    }
    setproducttypelist(false);
    setvendorlist(false);
    setTaxlist(false);
    setallTaxlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const AddContactPerson = () => {
    const newArray = value?.options;
    const maxSortOrder = newArray.length
      ? Math.max(...newArray.map((opt) => opt.sortOrder || 0))
      : 0;
    newArray.push({
      optionType: "",
      additionalCost: "",
      isDefault: false,
      sortOrder: maxSortOrder + 1,
    });
    setValue((val) => {
      return { ...val, options: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = [...value.options];
    newArray.splice(i, 1); // Remove the item

    // Recalculate sort order
    const updatedArray = newArray.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    // // Ensure one default
    // if (updatedArray.length > 0) {
    //   // Check if there's no default anymore
    //   const hasDefault = updatedArray.some(opt => opt.isDefault);
    //   if (!hasDefault) {
    //     updatedArray[0].isDefault = true; // Set first item as default
    //   }
    // }

    // Update state
    setValue((val) => ({
      ...val,
      options: updatedArray,
    }));

    // Purge validation if needed
    if (updatedArray.length === 0) {
      simpleValidator.current.purgeFields([
        "optionType",
        "additionalCost",
        "isDefault",
      ]);
    }
  };

  const remove = () => {
    const updatedArray = value.options.map((item) => ({
      ...item,
      isDefault: false,
    }));

    setValue((val) => ({
      ...val,
      options: updatedArray,
    }));
  };

  const handleContactPerson = (e, i) => {
    const newArray = [...value.options];
    const key = e.target.name;
    if (key === "isDefault") {
      newArray.forEach((item, index) => {
        item.isDefault = index === i;
      });
    } else if (key === "optionType") {
      newArray[i].optionType = e.target.value;
    } else if (key === "additionalCost") {
      newArray[i].additionalCost = e.target.value;
    }

    setValue((val) => ({
      ...val,
      options: newArray,
    }));
  };

  const Getproduct = (id) => {
    if (action !== "edit") {
      setValue((val) => {
        return { ...val, productTypeId: id };
      });
    }
  };

  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
  };
  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };
  const handleapi2 = () => {
    setTaxlist((prev) => !prev);
  };
  const handleapi3 = () => {
    setallTaxlist((prev) => !prev);
  };

  const handleTaxChange = (e) => {
    const isAvailable = e.target.value === "true";
    const newValue = {
      ...value,
      isTaxAvailable: isAvailable,
      taxId: null,
    };

    setValue(newValue);
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
                  {action === "add" ? "Add Option" : "Update Option"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                ></i>
              </div>
              <form onSubmit={languageAdd}>
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
                            {HasPermission("ProductTypeAdd") && (
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
                            value={value.productTypeId}
                            fn={handleChange}
                            load={producttypelist}
                            name="productTypeId"
                            Getproduct={Getproduct}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Product Type",
                              value?.productTypeId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Product <sup>*</sup>{" "}
                            </span>
                            {HasPermission("ProductsAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setvendor(true)}
                              />
                            )}
                          </label>

                          <AllProductDropdown
                            fn={handleChange}
                            value={value.productId}
                            name="productId"
                            load={vendorlist}
                            producttypeId={value.productTypeId}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Product",
                              value?.productId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Option Name"}
                            placeholderName={"Enter Option Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"optionName"}
                            name={"optionName"}
                            value={value.optionName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Option Name",
                              value?.optionName,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Pricing Expression <sup>*</sup>{" "}
                            </span>
                            {HasPermission("OptionExpressionAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setTax(true)}
                              />
                            )}
                          </label>
                          <FormulaDropdown
                            value={value.optionExpression}
                            fn={handleChange}
                            load={taxlist}
                            ProductId={value.productTypeId}
                            name="optionExpression"
                            isOptionExpression={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Pricing Expression",
                              value?.optionExpression,
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
                          <label className="font-14">
                            Unit <sup>*</sup>
                          </label>

                          <select
                            value={value?.unit}
                            className={`form-select`}
                            name="unit"
                            onChange={handleChange}
                          >
                            <option value="">Choose Unit </option>
                            <option value="Per Unit">Per Unit</option>
                            <option value="Each Job">Each Job</option>
                            <option value="Inch">Inch</option>
                            <option value="CM">CM</option>
                            <option value="Sqft">Sqft</option>
                            <option value="lbs">lbs</option>
                          </select>

                          <div className="error">
                            {simpleValidator.current.message(
                              "Unit",
                              value?.unit,
                              "required"
                            )}
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
                              <span> Select Tax </span>
                              {HasPermission("TaxAdd") && (
                                <img
                                  src="/image/plusblue.svg"
                                  alt=""
                                  loading="lazy"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setallTax(true)}
                                />
                              )}
                            </label>
                            <TaxListDropdown
                              value={value.taxId}
                              fn={handleChange}
                              load={alltaxlist}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="row">
                      {value.options !== undefined &&
                        value.options.length > 0 &&
                        value?.options?.map((val, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div className="col-lg-4 col-md-4">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14">
                                      Option Value <sup>*</sup>
                                    </label>
                                  )}
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Option Value"
                                    name="optionType"
                                    value={val?.optionType}
                                    onChange={(e) => {
                                      handleContactPerson(e, i);
                                    }}
                                  />
                                  <div className="error">
                                    {simpleValidator.current.message(
                                      "Option Type",
                                      val?.optionType,
                                      "required"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-4">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14">
                                      Price <sup>*</sup>
                                    </label>
                                  )}
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Price"
                                    name="additionalCost"
                                    value={val?.additionalCost}
                                    onChange={(e) => {
                                      handleContactPerson(e, i);
                                    }}
                                  />
                                  <div className="error">
                                    {simpleValidator.current.message(
                                      "Price",
                                      val?.additionalCost,
                                      "required|integer"
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-2 col-md-2 d-flex align-items-end">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14">
                                      <img
                                        src="/image/cross.png"
                                        alt=""
                                        style={{
                                          width: "17px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => remove()}
                                      ></img>
                                    </label>
                                  )}

                                  <div className="d-flex align-items-center gap-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        id={`flexRadioDefaultYes${i}`}
                                        name="isDefault"
                                        value={true}
                                        onChange={(e) => {
                                          handleContactPerson(e, i);
                                        }}
                                        checked={val.isDefault === true}
                                      />
                                      <label
                                        className="form-check-label mb-2"
                                        htmlFor={`flexRadioDefaultYes${i}`}
                                      >
                                        Make Default
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-2 col-md-2 d-flex align-items-center justify-content-start deledit">
                                {i === value.options.length - 1 && (
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
                                {value.options.length > 1 && (
                                  <div
                                    onClick={() => {
                                      deleteContactPerson(i);
                                    }}
                                  >
                                    <img
                                      src="/image/deletered.svg"
                                      alt=""
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
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
      {producttype && (
        <AddEditProductType
          open={producttype}
          handleclose={() => setproducttype(false)}
          action={"add"}
          LanguageListAPI={handleapiproduct}
          object={""}
        />
      )}
      {vendor && (
        <AddEditProduct
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          LanguageListAPI={handleapi}
          object={""}
        />
      )}
      {tax && (
        <AddEditExpression
          open={tax}
          handleclose={() => setTax(false)}
          action={"add"}
          LanguageListAPI={handleapi2}
          object={""}
        />
      )}
      {alltax && (
        <AddEditTaxes
          open={alltax}
          handleclose={() => setallTax(false)}
          action={"add"}
          LanguageListAPI={handleapi3}
          object={""}
        />
      )}
    </>
  );
};

export default AddEditOption;
