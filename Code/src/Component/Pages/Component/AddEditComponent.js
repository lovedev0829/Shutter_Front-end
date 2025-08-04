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
// import FormulaDropdown from "../../../helpers/FormulaDropdown";
import Select from "react-select";
import AddEditMaterial from "../Material/AddEditMaterial";
import AddEditProductType from "../ProductType/AddEditProductType";
import AddEditExpression from "../Expression/AddEditExpression";

const AddEditComponent = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = {
    componentName: "",
    productType: "",
    markupPercentage: "",
    materialPricingExpression: "",
    notes: "",
    materials: [
      {
        materialId: "",
        qty: null,
        wasteFactor: null,
         materialPricingExpression:""
      },
    ],
  };

  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);
  const [vendor, setvendor] = useState(false);
   const [expression, setexpression] = useState(false);
    const [formula, setFormula] = useState([]);
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);
  const handleChange = (e) => {
    if (e.target.name === "productType") {
      CountryList(e.target.value);
       ExpressionList(e.target.value);
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const ComponentAddUpdate = async (e) => {
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
          materials: value?.materials?.map((material) => ({
            ...material,
            materialId: material.materialId,
            qty: !material.qty ? null : material.qty,
            wasteFactor: !material.wasteFactor ? null : material.wasteFactor,
             materialPricingExpression:material.materialPricingExpression ? material.materialPricingExpression : null
          })),
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.ComponentCreate : apiUrls.ComponentUpdate,
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
      simpleValidator.current.purgeFields(["materialId", "qty", "wasteFactor","materialPricingExpression"]);
    } else {
      setValue(defaultState);
    }
    setproducttypelist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const AddContactPerson = () => {
    const newArray = value?.materials;
    newArray.push({
      materialId: "",
      qty: null,
      wasteFactor: null,
      materialPricingExpression:""
    });
    setValue((val) => {
      return { ...val, materials: newArray };
    });
  };

  const deleteContactPerson = (i) => {
    const newArray = value.materials;
    newArray.splice(i, 1);
    setValue((val) => {
      return { ...val, materials: newArray };
    });

    if (newArray?.length <= 0) {
      simpleValidator.current.purgeFields(["materialId", "qty", "wasteFactor","materialPricingExpression"]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = value.materials;
    const key = e.target.name;
    if (key === "materialId") newArray[i].materialId = e.target.value;
    else if (key === "qty") newArray[i].qty = e.target.value;
    else if (key === "materialPricingExpression") newArray[i].materialPricingExpression = e.target.value;
    else if (key === "wasteFactor") {
      if (e.target.value > 99) {
        ErrorMessage("Waste factor cannot exceed 99!");
        return;
      }
      newArray[i].wasteFactor = e.target.value;
    }

    setValue((val) => {
      return { ...val, materials: newArray };
    });
  };

  const CountryList = async (ProductType) => {
    try {
      setShow(true);
      setValue((val) => {
        return {
          ...val,
          materials: [
            {
              materialId: "",
              qty: null,
              wasteFactor: null,
              materialPricingExpression:""
            },
          ],
        };
      });
      const apiResponse = await callAPI(
        apiUrls.GetAllMeterial,
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

  const handleapi = () => {
    CountryList(value.productType);
  };

  const Getproduct = (id) => {
    if (action !== "edit") {
       ExpressionList(id);
      setValue((val) => {
        return { ...val, productType: id };
      });
      CountryList(id);
    }
  };
  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
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


   const ExpressionList = async (ProductId) => {
      try {
        setShow(true);
       setValue((val) => {
        return {
          ...val,
          materials: [
            {
              materialId: "",
              qty: null,
              wasteFactor: null,
              materialPricingExpression:""
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

   const handleapi2 = () => {
    ExpressionList(value.productType);
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
                  {action === "add" ? "Add Component" : "Update Component"}
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
              <form onSubmit={ComponentAddUpdate}>
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
                              value?.componentMaterials?.length > 0 && (
                                <Tooltip title="The Product Type is already linked to a material with this component name and cannot be changed.">
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
                              value?.componentMaterials?.length > 0
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

                      {/* <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">Pricing Expression</label>
                          <FormulaDropdown
                            value={value.pricingExpression}
                            fn={handleChange}
                            load={action}
                            ProductId={value.productType}
                          />
                        </div>
                      </div> */}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Component Name"}
                            placeholderName={"Enter Component Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"componentName"}
                            name={"componentName"}
                            value={value.componentName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Component Name",
                              value?.componentName,
                              `required|min:3`
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
                            id={"markupPercentage"}
                            name={"markupPercentage"}
                            value={value.markupPercentage}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Markup %",
                              value?.markupPercentage,
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
                      {action !== "edit" && (
                        <>
                          <h1 className="font-18 mb-30 mt-3">Add Material</h1>
                          {value.materials !== undefined &&
                            value.materials.length > 0 &&
                            value?.materials?.map((val, i) => {
                              const options = countryList?.map((vals) => {
                                const isDisabled = value?.materials?.some(
                                  (material) =>
                                    material?.materialId === vals?.materialId &&
                                    vals?.materialId !== val?.materialId
                                );

                                return {
                                  value: vals.materialId,
                                  label: `${vals.materialName}${
                                    vals.sku ? ` - ${vals.sku}` : ""
                                  }`,
                                  isDisabled,
                                };
                              });

                              const selectedOption =
                                options?.find(
                                  (opt) => opt?.value === val?.materialId
                                ) || null;

                              const handleMaterialChange = (selectedOption) => {
                                const syntheticEvent = {
                                  target: {
                                    name: "materialId",
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
                                  (opt) => opt?.value === val?.materialPricingExpression
                                ) || null;

                              const handleExpressionChange = (
                                selectedOption
                              ) => {
                                const syntheticEvent = {
                                  target: {
                                    name: "materialPricingExpression",
                                    value: selectedOption?.value || "",
                                  },
                                };
                                handleContactPerson(syntheticEvent, i);
                              };

                              return (
                                <React.Fragment key={i}>
                                  <div className="col-lg-3 col-md-3">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14 d-flex align-items-center justify-content-between">
                                          <span>
                                            Raw Material <sup>*</sup>
                                          </span>
                                          {HasPermission("MaterialAdd") && (
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
                                          name="materialId"
                                          value={selectedOption}
                                          onChange={handleMaterialChange}
                                          options={options}
                                          placeholder="Choose Material - sku"
                                          classNamePrefix="react-select"
                                          isOptionDisabled={(option) =>
                                            option.isDisabled
                                          }
                                          menuPortalTarget={document.body}
                                          menuPosition="fixed"
                                          styles={customStyles}
                                        />

                                        {/* <select
                                          className="form-select"
                                          aria-label="Default select example"
                                          name="materialId"
                                          value={val?.materialId}
                                          onChange={(e) => {
                                            handleContactPerson(e, i);
                                          }}
                                        >
                                          <option value="">
                                            Choose Material - sku
                                          </option>
                                          {countryList?.map((vals, idx) => {
                                            const isDisabled =
                                              value?.materials?.some(
                                                (material) =>
                                                  material?.materialId ===
                                                  vals?.materialId
                                              );

                                            return (
                                              <option
                                                value={vals.materialId}
                                                key={idx}
                                                disabled={
                                                  isDisabled &&
                                                  vals.materialId !==
                                                    val?.materialId
                                                }
                                                selected={
                                                  vals.materialId ===
                                                  val?.materialId
                                                    ? true
                                                    : false
                                                }
                                              >
                                                {vals.materialName}{" "}
                                                {vals.sku ? `-${vals.sku}` : ""}
                                              </option>
                                            );
                                          })}
                                        </select> */}
                                      </div>
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Material",
                                          val?.materialId,
                                          "required"
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-3 col-md-3">
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
                                          name="materialPricingExpression"
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
                                      </div>

                                     
                                    </div>
                                  </div>

                                  <div className="col-lg-2 col-md-2">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14">Qty</label>
                                      )}
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter qty"
                                        name="qty"
                                        value={val?.qty}
                                        onChange={(e) => {
                                          handleContactPerson(e, i);
                                        }}
                                      />
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Qty",
                                          val?.qty,
                                          "numeric"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-2">
                                    <div className="form-group">
                                      {i === 0 && (
                                        <label className="font-14">
                                          Waste %
                                        </label>
                                      )}
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter waste"
                                        name="wasteFactor"
                                        value={val?.wasteFactor}
                                        onChange={(e) => {
                                          handleContactPerson(e, i);
                                        }}
                                      />
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Waste",
                                          val?.wasteFactor,
                                          "numeric"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-1 col-md-1 d-flex align-items-center justify-content-start deledit mb-3">
                                    {i === value.materials.length - 1 && (
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
                                    {value.materials.length > 1 && (
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
      {vendor && (
        <AddEditMaterial
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          LanguageListAPI={handleapi}
          object={""}
        />
      )}
      {producttype && (
        <AddEditProductType
          open={producttype}
          handleclose={() => setproducttype(false)}
          action={"add"}
          LanguageListAPI={handleapiproduct}
          object={""}
        />
      )}
      {expression &&<AddEditExpression
              open={expression}
              handleclose={() => setexpression(false)}
              action={"add"}
              LanguageListAPI={handleapi2}
              object={""}
            />
      }
    </>
  );
};

export default AddEditComponent;
