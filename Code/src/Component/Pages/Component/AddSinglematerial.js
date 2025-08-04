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
import { Link } from "react-router-dom";
import AddEditMaterial from "../Material/AddEditMaterial";
import Select from "react-select";
import AddEditExpression from "../Expression/AddEditExpression";
const AddSinglematerial = ({
  open,
  handleclose,
  LanguageListAPI,
  componentId,
  object,
  Listmaterial,
  produttype,
}) => {
  const defaultState = {
    componentId: componentId,
    materials: [
      {
        materialId: "",
        qty: null,
        wasteFactor: null,
        materialPricingExpression: "",
      },
    ],
  };

  const [value, setValue] = useState(
    object
      ? {
          componentId: componentId,
          materials: [
            {
              materialId: object.rawMaterialId,
              materialPricingExpression: object.materialPricingExpression,
              qty: object.quantity,
              wasteFactor: object.wasteFactor,
            },
          ],
        }
      : defaultState
  );
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [countryList, setCountryList] = useState([]);
  const [expression, setexpression] = useState(false);
  const [formula, setFormula] = useState([]);
  const [vendor, setvendor] = useState(false);
  const languageAdd = async (e) => {
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
            materialPricingExpression: material.materialPricingExpression,
            qty: !material.qty ? null : material.qty,
            wasteFactor: !material.wasteFactor ? null : material.wasteFactor,
          })),
        };
        const apiResponse = await callAPI(
          !object
            ? apiUrls.AddComponentMaterial
            : apiUrls.UpdateComponentMaterial,
          {},
          "POST",
          !object
            ? sanitizedValue
            : {
                componentMaterialId: object.componentMaterialId,
                rawMaterialId: value?.materials[0].materialId,
                quantity: value?.materials[0].qty
                  ? value?.materials[0].qty
                  : null,
                wasteFactor: value?.materials[0].wasteFactor
                  ? value?.materials[0].wasteFactor
                  : null,
                materialPricingExpression:
                  value?.materials[0].materialPricingExpression ?  value?.materials[0].materialPricingExpression : null,
                componentId: componentId,
              }
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          setValue(defaultState);
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  const AddContactPerson = () => {
    const newArray = value?.materials;
    newArray.push({
      materialId: "",
      materialPricingExpression: "",
      qty: null,
      wasteFactor: null,
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
      simpleValidator.current.purgeFields([
        "materialId",
        "qty",
        "wasteFactor",
        "materialPricingExpression",
      ]);
    }
  };

  const handleContactPerson = (e, i) => {
    const newArray = value.materials;
    const key = e.target.name;
    if (key === "materialId") newArray[i].materialId = e.target.value;
    else if (key === "qty") newArray[i].qty = e.target.value;
    else if (key === "materialPricingExpression")
      newArray[i].materialPricingExpression = e.target.value;
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

  const CountryList = async (produttype) => {
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllMeterial,
        { ProductType: produttype },
        "GET"
      );
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
      }
    } catch (error) {
      setCountryList([]);
    }
  };

  useEffect(() => {
    if (produttype) {
      CountryList(produttype);
      ExpressionList(produttype);
    }

    // eslint-disable-next-line
  }, [open, produttype]);

  useEffect(() => {
    if (object) {
      setValue({
        componentId: componentId,
        materials: [
          {
            materialId: object.rawMaterialId,
            materialPricingExpression: object.materialPricingExpression,
            qty: object.quantity,
            wasteFactor: object.wasteFactor,
          },
        ],
      });
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [object, open]);

  const handleapi = () => {
    CountryList(produttype);
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
      const apiResponse = await callAPI(apiUrls.GetAllExpression, {}, "POST", {
        productType: ProductId,
        isOptionExpression: false,
      });
      if (apiResponse?.data?.isSuccess) {
        setFormula(apiResponse?.data?.data);
      } else {
        setFormula([]);
      }
    } catch (error) {
      setFormula([]);
    }
  };

  const handleapi2 = () => {
    ExpressionList(produttype);
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
                  Add Material
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.purgeFields([
                      "materialId",
                      "qty",
                      "wasteFactor",
                    ]);
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                ></i>
              </div>
              <form onSubmit={languageAdd}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      {value.materials !== undefined &&
                        value.materials.length > 0 &&
                        value?.materials?.map((val, i) => {
                          const options = countryList?.map((vals) => {
                            const isDisabled = Listmaterial?.some(
                              (material) =>
                                material?.rawMaterialId === vals?.materialId &&
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

                          const expressionOptions = formula?.map((vals) => ({
                            value: vals.expressionId,
                            label: vals.expressionName,
                          }));

                          // Get the selected option
                          const selectedExpression =
                            expressionOptions?.find(
                              (opt) =>
                                opt?.value === val?.materialPricingExpression
                            ) || null;

                          // onChange handler
                          const handleExpressionChange = (selectedOption) => {
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
                                  {/* <select
                                    className="form-select "
                                    aria-label="Default select example"
                                    name="materialId"
                                    value={val?.materialId}
                                    onChange={(e) => {
                                      handleContactPerson(e, i);
                                    }}
                                  >
                                    <option value="">Choose Material - sku</option>
                                    {countryList?.map((vals, idx) => {
                                          const isDisabled =
                                          Listmaterial?.some(
                                              (material) =>
                                                material?.rawMaterialId ===
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
                                              {vals.materialName} {vals.sku?`-${vals.sku}`:""}
                                            </option>
                                          );
                                        })}
                                  </select> */}
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
                                          onClick={() => setexpression(true)}
                                        />
                                      )}
                                    </label>
                                  )}

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
                                    <label className="font-14">Waste %</label>
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
                              {!object && (
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
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
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
                        simpleValidator.current.purgeFields([
                          "materialId",
                          "qty",
                          "wasteFactor",
                        ]);
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                    >
                      Cancel
                    </Link>
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={"Submit"}
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

      {expression && (
        <AddEditExpression
          open={expression}
          handleclose={() => setexpression(false)}
          action={"add"}
          LanguageListAPI={handleapi2}
          object={""}
        />
      )}
    </>
  );
};

export default AddSinglematerial;
