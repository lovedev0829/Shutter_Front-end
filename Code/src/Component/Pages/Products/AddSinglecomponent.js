import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Button, useTheme, alpha } from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";

import AddEditComponent from "../Component/AddEditComponent";
import AddEditExpression from "../Expression/AddEditExpression";
import Select from "react-select";

const AddSinglecomponent = ({
  open,
  handleclose,
  LanguageListAPI,
  ProductId,
  object,
  produttype,
  Listmaterial,
}) => {
  const defaultState = {
    productId: ProductId,
    productComponents: [
      {
        quantity: 1,
        componentId: "",
        pricingExpression: "",
      },
    ],
  };

  const [value, setValue] = useState(
    object
      ? {
          productId: ProductId,
          productComponents: [
            {
              componentId: object.componentId,
              quantity: object.quantity ? object.quantity : 1,
              pricingExpression: object.pricingExpression,
            },
          ],
        }
      : defaultState
  );
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [countryList, setCountryList] = useState([]);
  const [formula, setFormula] = useState([]);
  const [vendor, setvendor] = useState(false);
  const [expression, setexpression] = useState(false);
  const theme = useTheme();
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
          productComponents: value?.productComponents?.map((material) => ({
            ...material,
            quantity: material.quantity?material.quantity:1,
            componentId: material.componentId ? material.componentId : null,
             pricingExpression:material.pricingExpression ? material.pricingExpression : null
          })),
        };
        const apiResponse = await callAPI(
          !object
            ? apiUrls.AddProductComponent
            : apiUrls.UpdateProductComponent,
          {},
          "POST",
          !object
            ? sanitizedValue
            : {
                productComponentId: object.productComponentId,
                componentId: value?.productComponents[0].componentId,
                quantity: value?.productComponents[0].quantity
                  ? value?.productComponents[0].quantity
                  : 1,
                pricingExpression:
                  value?.productComponents[0].pricingExpression ?  value?.productComponents[0].pricingExpression : null,
                productId: ProductId,
              }
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
  const CountryList = async (produttype) => {
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllComponent,
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
        productId: ProductId,
        productComponents: [
          {
            componentId: object.componentId,
            quantity: object.quantity ? object.quantity : 1,
            pricingExpression: object.pricingExpression,
          },
        ],
      });
    }
    // eslint-disable-next-line
  }, [object, open]);

  const handleapi = () => {
    CountryList(produttype);
  };
  const handleapi2 = () => {
    ExpressionList(produttype);
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
                  Add Component
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue(defaultState);
                    handleclose();
                    simpleValidator.current.purgeFields([
                      "quantity",
                      "componentId",
                      "pricingExpression",
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
                      {value.productComponents !== undefined &&
                        value.productComponents.length > 0 &&
                        value?.productComponents?.map((val, i) => {
                          const componentOptions = countryList?.map((vals) => {
                            const isDisabled = Listmaterial?.some(
                              (material) =>
                                material?.componentId === vals?.componentId &&
                                vals?.componentId !== val?.componentId
                            );

                            return {
                              value: vals.componentId,
                              label: vals.componentName,
                              isDisabled,
                            };
                          });

                          // Match selected value
                          const selectedComponent =
                            componentOptions?.find(
                              (opt) => opt?.value === val?.componentId
                            ) || null;

                          // OnChange handler wrapper
                          const handleComponentChange = (selectedOption) => {
                            const syntheticEvent = {
                              target: {
                                name: "componentId",
                                value: selectedOption?.value || "",
                              },
                            };
                            handleContactPerson(syntheticEvent, i);
                          };
                          // Prepare options from formula array
                          const expressionOptions = formula?.map((vals) => ({
                            value: vals.expressionId,
                            label: vals.expressionName,
                          }));

                          // Get the selected option
                          const selectedExpression =
                            expressionOptions?.find(
                              (opt) => opt?.value === val?.pricingExpression
                            ) || null;

                          // onChange handler
                          const handleExpressionChange = (selectedOption) => {
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
                                  <Select
                                    name="componentId"
                                    value={selectedComponent}
                                    onChange={handleComponentChange}
                                    options={componentOptions}
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
                                    <option value="">Choose Component</option>


                                    {countryList?.map((vals, idx) => {
                                          const isDisabled =
                                          Listmaterial?.some(
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
                                          onClick={() => setexpression(true)}
                                        />
                                      )}
                                    </label>
                                  )}

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
                                    <option value="">Choose Expression</option>
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

                              {!object && (
                                <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-start deledit mb-3">
                                  {i === value.productComponents.length - 1 && (
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
                    <Button
                      onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.purgeFields([
                          "quantity",
                          "componentId",
                          "pricingExpression",
                        ]);
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                      }}
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: theme.palette.grey[300],
                        color: theme.palette.text.secondary,
                        marginRight: 2,
                        '&:hover': {
                          borderColor: theme.palette.grey[400],
                          backgroundColor: alpha(theme.palette.grey[100], 0.5),
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loader}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        '&:disabled': {
                          background: theme.palette.grey[300],
                          color: theme.palette.grey[500],
                        }
                      }}
                    >
                      Submit
                    </Button>
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
    </>
  );
};

export default AddSinglecomponent;
