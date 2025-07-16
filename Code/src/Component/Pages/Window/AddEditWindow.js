import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  PreviewFiles,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import GetAllProduct from "../../../helpers/GetAllProduct";
import { PostImage } from "../../../utils/apiCall";
import GetAllOptions from "../../../helpers/GetAllOptions";
import GetAllForedit from "./GetAllForedit";
import AddEditProduct from "../Products/AddEditProduct";
import AddEditProductType from "../ProductType/AddEditProductType";
import AddEditOption from "../Option/AddEditOption";

function AddEditWindow({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
  listdata,
  resetObject,
}) {
  const defaultState = {
    contactId: listdata?.contactId,
    addressId: listdata?.addressId,
    jobId: listdata?.jobId,
    quantity: "",
    label: "",
    width: "",
    height: "",
    archHeight: null,
    notes: "",
    photo: [],
    windowProducts: [
      {
        productId: "",
        productTypeId: "",
        optionTypeId: [],
        buildWidth: "",
        buildHeight: "",
      },
    ],
  };

  // Main state
  const [value, setValue] = useState(object || defaultState);
  
  // Option-related state
  const [optionName, setOptionName] = useState([]);
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [optionMapping, setOptionMapping] = useState([]);
  
  // UI state
  const [show, setShow] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [popupMode, setPopupMode] = useState("");
  const [activeOptionsTab, setActiveOptionsTab] = useState("options");
  
  // Modal states
  const [vendor, setvendor] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [option, setoption] = useState(false);
  
  // Data states
  const [vendorlist, setvendorlist] = useState(false);
  const [optionlist, setoptionlist] = useState(false);
  const [countryList, setCountryList] = useState([]);
  
  // Validator
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    setValue((val) => {
      if (index !== null && name === "productId") {
        const updatedProducts = [...val.windowProducts];
        updatedProducts[index][name] = value;
        return { ...val, windowProducts: updatedProducts };
      }
      return { ...val, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
      return;
    }

    try {
      setLoader(true);
      const submissionData = { ...value, additionalCosts };
      const apiResponse = await callAPI(
        action === "add" ? apiUrls.WindowCreate : apiUrls.WindowUpdate,
        {},
        "POST",
        submissionData
      );
      
      if (apiResponse?.data?.isSuccess) {
        SuccessMessage(apiResponse?.data?.message);
        await LanguageListAPI();
        handleClearState();
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage("An error occurred while saving the window.");
    } finally {
      setLoader(false);
    }
  };
  const fetchProductTypes = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllProductType, {}, "GET");
      
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setCountryList([]);
    } finally {
      setShow(false);
    }
  };
  const addProduct = () => {
    const newProduct = {
      productId: "",
      productTypeId: "",
      optionTypeId: [],
      buildWidth: "",
      buildHeight: "",
      additionalCost: 0,
    };
    
    setValue((prev) => ({
      ...prev,
      windowProducts: [...prev.windowProducts, newProduct]
    }));
  };

  const handleproduct = (e, i) => {
    const { name, value, checked, type } = e.target;
    setValue((prev) => {
      const updatedProducts = [...prev.windowProducts];
      if (name === "optionTypeId" && type === "radio") {
        const selectedOptions = updatedProducts[i][name] || [];
        if (checked) {
          updatedProducts[i][name] = [...selectedOptions, value];
        } else {
          updatedProducts[i][name] = selectedOptions.filter(
            (id) => id !== value
          );
        }
      } else {
        updatedProducts[i][name] = value;
      }
      return { ...prev, windowProducts: updatedProducts };
    });
  };

  const deleteProduct = (index) => {
    // Remove product from window products
    setValue((prev) => ({
      ...prev,
      windowProducts: prev.windowProducts.filter((_, i) => i !== index)
    }));

    // Helper function to update indexed arrays
    const updateIndexedArray = (array) => 
      array
        .filter((entry) => entry.indexId !== index)
        .map((entry) => ({
          ...entry,
          indexId: entry.indexId > index ? entry.indexId - 1 : entry.indexId,
        }));

    // Update all option-related state arrays
    setOptionName(updateIndexedArray);
    setAdditionalCosts(updateIndexedArray);
    setOptionMapping(updateIndexedArray);

    // Clear validator fields if no products remain
    if (value.windowProducts.length <= 1) {
      simpleValidator.current.purgeFields([
        "productTypeId",
        "productId", 
        "buildWidth",
        "buildHeight",
      ]);
    }
  };

  const removeOption = (productIndex, optionLabel) => {
    // Find the optionTypeId that corresponds to this option using optionMapping
    let optionTypeIdToRemove = null;
    const mappingEntry = optionMapping.find(entry => entry.indexId === productIndex);
    if (mappingEntry && mappingEntry.data[optionLabel]) {
      optionTypeIdToRemove = mappingEntry.data[optionLabel];
    }
    
    // Remove from optionName state
    setOptionName((prevOptionName) => {
      return prevOptionName.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          delete updatedData[optionLabel];
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove from additionalCosts state
    setAdditionalCosts((prevAdditionalCosts) => {
      return prevAdditionalCosts.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          // Remove all additional costs that match the option label pattern
          Object.keys(updatedData).forEach((key) => {
            if (key.includes(optionLabel.replace(`-${productIndex}`, ""))) {
              delete updatedData[key];
            }
          });
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove from optionMapping state
    setOptionMapping((prevMapping) => {
      return prevMapping.map((entry) => {
        if (entry.indexId === productIndex) {
          const updatedData = { ...entry.data };
          delete updatedData[optionLabel];
          return { ...entry, data: updatedData };
        }
        return entry;
      });
    });

    // Remove the optionTypeId from windowProducts
    if (optionTypeIdToRemove) {
      setValue((prevValue) => {
        const updatedProducts = [...prevValue.windowProducts];
        if (updatedProducts[productIndex] && updatedProducts[productIndex].optionTypeId) {
          updatedProducts[productIndex].optionTypeId = updatedProducts[productIndex].optionTypeId.filter(
            (id) => id !== optionTypeIdToRemove
          );
        }
        return { ...prevValue, windowProducts: updatedProducts };
      });
    }
  };

  useEffect(() => {
    setValue(action === "edit" ? object : defaultState);
    fetchProductTypes();
    setvendorlist(false);
    setoptionlist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const UploadImage = async (e) => {
    setImageLoader(true);
    let file = [...e.target.files];
    const path = await PostImage(file);
    setImageLoader(false);
    if (path) {
      setValue((val) => {
        return {
          ...val,
          photo: [...(val.photo || []), ...path],
        };
      });
    }
    e.target.value = null;
  };

  const handleClearState = () => {
    setValue(defaultState);
    setShowOptionsPopup(false);
    setOptionName([]);
    setAdditionalCosts([]);
    setOptionMapping([]);
    simpleValidator.current.hideMessages();
    forceUpdate();
    resetObject?.();
    handleclose();
  };

  const handleImageDelete = (index) => {
    setValue((prev) => ({
      ...prev,
      photo: prev.photo?.filter((_, i) => i !== index) || []
    }));
  };

  const refreshVendorList = () => setvendorlist((prev) => !prev);
  const refreshProductTypes = () => fetchProductTypes();
  const refreshOptionList = () => setoptionlist((prev) => !prev);
  return (
    <>
      <Dialog
        open={open}
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
          <div className="modal-dialog modal-dialog-centered filter_modal highwidthmodal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  {action === "add" ? "Add New Window" : "Update Window"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={handleClearState}
                ></i>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body modale-scroll">
                  <div className="form-design window-form-design">
                    <div className="middle-heading">
                      <h4 className="mt-0">Window information</h4>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <InputField
                            labelName={"Qty"}
                            placeholderName={"Enter window qty"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"quantity"}
                            name={"quantity"}
                            value={value.quantity}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "quantity",
                              value?.quantity,
                              `required|numeric`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <InputField
                            labelName={"Window label"}
                            placeholderName={"e.g., Living Room Window 1"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"label"}
                            name={"label"}
                            value={value.label}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "label",
                              value?.label,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                        <label className="font-14">Dimensions </label>
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <InputField
                              labelName={"Width"}
                              placeholderName={"Width (entered in Inches)"}
                              type={"text"}
                              handleChange={handleChange}
                              id={"width"}
                              name={"width"}
                              value={value.width}
                              required={true}
                              displayLabel={""}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                "width",
                                value?.width,
                                `required|numeric`
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <InputField
                              labelName={"Height"}
                              placeholderName={"Height (entered in Inches)"}
                              type={"text"}
                              handleChange={handleChange}
                              id={"height"}
                              name={"height"}
                              value={value.height}
                              required={true}
                              displayLabel={""}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                "height",
                                value?.height,
                                `required|numeric`
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <div className="form-group">
                            <InputField
                              labelName={"Arch Height"}
                              placeholderName={"Arch (entered in Inches)"}
                              type={"text"}
                              handleChange={handleChange}
                              id={"archHeight"}
                              name={"archHeight"}
                              value={value.archHeight}
                              displayLabel={""}
                            />
                            <div className="error">
                              {simpleValidator.current.message(
                                "archHeight",
                                value?.archHeight,
                                `numeric`
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="middle-heading">
                        <h4>Product Types</h4>
                      </div>
                      <div className="row gx-2">
                        {value.windowProducts !== undefined &&
                          value.windowProducts.length > 0 &&
                          value?.windowProducts?.map((val, i) => {
                            return (
                              <React.Fragment key={i}>
                                <div className="col-lg-2 col-md-2">
                                  <div className="form-group">
                                    {i === 0 && (
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
                                    )}

                                    <div className="position-relative">
                                      {show && <SelectBoxLoader />}
                                      <select
                                        className="form-select "
                                        aria-label="Default select example"
                                        name="productTypeId"
                                        value={val?.productTypeId}
                                        onChange={(e) => {
                                          handleproduct(e, i);
                                        }}
                                      >
                                        <option value="">Choose Type</option>

                                        {countryList?.map((vals, idx) => {
                                          return (
                                            <option
                                              value={vals.productId}
                                              key={idx}
                                              selected={
                                                vals.productId ===
                                                val?.productId
                                                  ? true
                                                  : false
                                              }
                                            >
                                              {vals.productName}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "Product type",
                                        val?.productTypeId,
                                        "required"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                  <div className="form-group">
                                    {i === 0 && (
                                      <label className="font-14 d-flex align-items-center justify-content-between">
                                        <span>
                                          {" "}
                                          Select Product <sup>*</sup>{" "}
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
                                    )}
                                    <GetAllProduct
                                      fn={(e) => handleproduct(e, i)}
                                      value={val.productId}
                                      name="productId"
                                      load={vendorlist}
                                      producttypeId={val.productTypeId}
                                    />
                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "product",
                                        val?.productId,
                                        "required"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-5 col-md-4">
                                  <div className="form-group">
                                    {i === 0 && (
                                      <label className="font-14">
                                        Select Options{" "}
                                      </label>
                                    )}
                                    {action === "edit" && (
                                      <>
                                        <div className="new-option-wrapper">
                                          {optionName
                                            .filter(
                                              (entry) => entry.indexId === i
                                            )
                                            .map((entry) => (
                                              <div
                                                key={entry.indexId}
                                                className="mb-3"
                                              >
                                                <ul className="list-unstyled new-option-main">
                                                  {Object.entries(
                                                    entry.data
                                                  ).map(
                                                    ([label, value], idx) => (
                                                      <li
                                                        key={idx}
                                                        className="new-option-li d-flex justify-content-between align-items-center"
                                                      >
                                                        <span style={{marginRight: "20px"}}>
                                                          {label.replace(
                                                            new RegExp(`-${i}$`),
                                                            ""
                                                          )}
                                                          - {value}
                                                        </span>
                                                        <button
                                                          type="button"
                                                          className="btn btn-sm btn-outline-danger"
                                                          onClick={() => removeOption(i, label)}
                                                          title="Remove Option"
                                                        >
                                                          ×
                                                        </button>
                                                      </li>
                                                    )
                                                  )}
                                                 {Object.keys(entry.data).length > 0 && ( <img
                                                    src="/image/editblue.svg"
                                                    alt=""
                                                    className="option-edit-new"
                                                    onClick={() => {
                                                      setActiveProductIndex(i);
                                                      setShowOptionsPopup(true);
                                                      setPopupMode(action);
                                                    }}
                                                  ></img>
                                                     )}
                                                </ul>
                                              </div>
                                            ))}
                                        </div>

                                        <GetAllForedit
                                          fn={(e) => handleproduct(e, i)}
                                          values={val.optionTypeId}
                                          optiondata={val.optionTypeId}
                                          name="optionTypeId"
                                          load={optionlist}
                                          producttypeId={val.productId}
                                          indexId={i}
                                          optionName={optionName}
                                          setOptionName={setOptionName}
                                          additionalCosts={additionalCosts}
                                          setAdditionalCosts={setAdditionalCosts}
                                          isRender={false}
                                          buildRequirement={false}
                                          showOptionsPopup={false}
                                          optionMapping={optionMapping}
                                          setOptionMapping={setOptionMapping}
                                        />
                                      </>
                                    )}
                                    {action === "add" && (
                                      <>
                                        {optionName
                                          .filter(
                                            (entry) => entry.indexId === i
                                          )
                                          .map((entry) => (
                                            <div
                                              key={entry.indexId}
                                              className="mb-3"
                                            >
                                              <ul className="list-unstyled new-option-main">
                                                {Object.entries(entry.data).map(
                                                  ([label, value], idx) => (
                                                    <li
                                                      key={idx}
                                                      className="new-option-li d-flex justify-content-between align-items-center"
                                                    >
                                                      <span style={{marginRight: "20px"}}>
                                                        {label.replace(
                                                          new RegExp(`-${i}$`),
                                                          ""
                                                        )}
                                                        - {value}
                                                      </span>
                                                      <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeOption(i, label)}
                                                        title="Remove Option"
                                                      >
                                                        ×
                                                      </button>
                                                    </li>
                                                  )
                                                )}
                                                {Object.keys(entry.data).length > 0 && ( <img
                                                  src="/image/editblue.svg"
                                                  alt=""
                                                  className="option-edit-new"
                                                  onClick={() => {
                                                    setActiveProductIndex(i);
                                                    setShowOptionsPopup(true);
                                                    setPopupMode(action);
                                                  }}
                                                ></img>
                                                 )}
                                              </ul>
                                            </div>
                                          ))}
                                        <GetAllOptions
                                          fn={(e) => handleproduct(e, i)}
                                          value={val.optionTypeId}
                                          name="optionTypeId"
                                          load={optionlist}
                                          producttypeId={val.productId}
                                          indexId={i}
                                          optionName={optionName}
                                          setOptionName={setOptionName}
                                          additionalCosts={additionalCosts}
                                          setAdditionalCosts={setAdditionalCosts}
                                          isRender={false}
                                          buildRequirement={false}
                                          showOptionsPopup={false}
                                          optionMapping={optionMapping}
                                          setOptionMapping={setOptionMapping}
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="col-lg-3 col-md-3 d-flex align-items-start gap-3">
                                  <div className="form-group build-new">
                                    {i === 0 && (
                                      <label
                                        className="font-14"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        Build Width (in)<sup>*</sup>
                                      </label>
                                    )}
                                    <div className="">
                                      <InputField
                                        labelName={"Build Width"}
                                        placeholderName={""}
                                        type={"text"}
                                        handleChange={(e) =>
                                          handleproduct(e, i)
                                        }
                                        id={"buildWidth"}
                                        name={"buildWidth"}
                                        value={val.buildWidth}
                                        required={true}
                                        displayLabel={"none"}
                                      />
                                      <div className="error">
                                        {simpleValidator.current.message(
                                          "Width",
                                          val?.buildWidth,
                                          `required|numeric`
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-group build-new">
                                    {i === 0 && (
                                      <label
                                        className="font-14"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        Build Height (in)<sup>*</sup>
                                      </label>
                                    )}
                                    <div className="">
                                      <InputField
                                        labelName={"Build Height"}
                                        placeholderName={""}
                                        type={"text"}
                                        handleChange={(e) =>
                                          handleproduct(e, i)
                                        }
                                        id={"buildHeight"}
                                        name={"buildHeight"}
                                        value={val.buildHeight}
                                        required={true}
                                        displayLabel={"none"}
                                      />
                                    </div>

                                    <div className="error">
                                      {simpleValidator.current.message(
                                        "Height",
                                        val?.buildHeight,
                                        `required|numeric`
                                      )}
                                    </div>
                                  </div>

                                  <div className="add-delete" style={{marginTop:i === 0?"32px":"6px"}}>
                                    {i === value.windowProducts.length - 1 && (
                                      <div onClick={addProduct}>
                                        <img
                                          src="/image/plusblue.svg"
                                          alt=""
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                    {value.windowProducts.length > 1 && (
                                      <div
                                        className="mt-1"
                                        onClick={() => {
                                          deleteProduct(i);
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
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      {showOptionsPopup && (
                        <div className="modal-backdrop windowsdata">
                          <div className="custom-modal custom-modald">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                              <h5 className="modal-title">Add Option</h5>
                              {HasPermission("OptionsAdd") && (
                                <img
                                  src="/image/plusblue.svg"
                                  alt=""
                                  loading="lazy"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "20px",
                                  }}
                                  onClick={() => setoption(true)}
                                />
                              )}
                              <button
                                type="button"
                                className="btn-close btn-closee"
                                onClick={() => {
                                  setShowOptionsPopup(false);
                                  setoptionlist((prev) => !prev); // Force refresh of inline components
                                }}
                              ></button>
                            </div>
                            <div className="modal-body">
                              {/* Tab Navigation */}
                              <div className="nav nav-tabs mb-3" role="tablist">
                                <button
                                  className={`nav-link ${activeOptionsTab === 'options' ? 'active' : ''}`}
                                  onClick={() => setActiveOptionsTab('options')}
                                  type="button"
                                >
                                  Options
                                </button>
                                <button
                                  className={`nav-link ${activeOptionsTab === 'buildRequirements' ? 'active' : ''}`}
                                  onClick={() => setActiveOptionsTab('buildRequirements')}
                                  type="button"
                                >
                                  Build Requirements
                                </button>
                              </div>

                              {/* Tab Content */}
                              <div className="tab-content">
                                {popupMode === "add" ? (
                                  <GetAllOptions
                                    fn={(e) =>
                                      handleproduct(e, activeProductIndex)
                                    }
                                    value={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId || []
                                    }
                                    name="optionTypeId"
                                    load={optionlist}
                                    producttypeId={
                                      value.windowProducts[activeProductIndex]
                                        ?.productId
                                    }
                                    indexId={activeProductIndex}
                                    optionName={optionName}
                                    setOptionName={setOptionName}
                                    additionalCosts={additionalCosts}
                                    setAdditionalCosts={setAdditionalCosts}
                                    buildRequirement={activeOptionsTab === 'buildRequirements'}
                                    showOptionsPopup={showOptionsPopup}
                                  />
                                ) : (
                                  <GetAllForedit
                                    fn={(e) =>
                                      handleproduct(e, activeProductIndex)
                                    }
                                    values={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId
                                    }
                                    optiondata={
                                      value.windowProducts[activeProductIndex]
                                        ?.optionTypeId
                                    }
                                    name="optionTypeId"
                                    load={optionlist}
                                    producttypeId={
                                      value.windowProducts[activeProductIndex]
                                        ?.productId
                                    }
                                    indexId={activeProductIndex}
                                    optionName={optionName}
                                    setOptionName={setOptionName}
                                    additionalCosts={additionalCosts}
                                    setAdditionalCosts={setAdditionalCosts}
                                    buildRequirement={activeOptionsTab === 'buildRequirements'}
                                    showOptionsPopup={showOptionsPopup}

                                  />
                                )}
                              </div>
                            </div>
                                                          <div className="modal-footer">
                                <div className="form-style form-group d-flex align-items-center justify-content-end w-100 gap-4">
                                  <button
                                    type="button"
                                    className="btn blue-btn"
                                    onClick={() => {
                                      setShowOptionsPopup(false);
                                      setoptionlist((prev) => !prev); // Force refresh of inline components
                                    }}
                                  >
                                    Submit
                                  </button>
                                  <Link
                                    className="cancel"
                                    onClick={() => {
                                      setShowOptionsPopup(false);
                                      setoptionlist((prev) => !prev); // Force refresh of inline components
                                    }}
                                  >
                                    Cancel
                                  </Link>
                                </div>
                              </div>
                          </div>
                        </div>
                      )}

                      <div className="middle-heading">
                        <h4>Notes</h4>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Add Notes"}
                            placeholderName={"Add notes"}
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
                          <label className="font-14">Upload Photo</label>
                          <div className="position-relative upload-photo">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/png,image/jpg,image/jpeg"
                              name="exemptionCertificate"
                              onChange={(e) => {
                                UploadImage(e);
                              }}
                              multiple
                            />
                            <span>
                              <img
                                src="/image/upload.svg"
                                className="me-2"
                                alt=" "
                                loading="lazy"
                              />{" "}
                              Choose File
                            </span>
                            {imageLoader && <SelectBoxLoader />}
                          </div>

                          <PreviewFiles
                            file={value?.photo}
                            isdelete={true}
                            handleImageDelelet={handleImageDelete}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-start w-100 gap-4">
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn"
                      name={action === "add" ? "Submit" : "Update"}
                      disabled={loader}
                    />
                    <Link className="cancel" onClick={handleClearState}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {vendor && (
        <AddEditProduct
          open={vendor}
          handleclose={() => setvendor(false)}
          action="add"
          LanguageListAPI={refreshVendorList}
          object=""
        />
      )}
      
      {option && (
        <AddEditOption
          open={option}
          handleclose={() => setoption(false)}
          action="add"
          LanguageListAPI={refreshOptionList}
          object=""
        />
      )}

      {producttype && (
        <AddEditProductType
          open={producttype}
          handleclose={() => setproducttype(false)}
          action="add"
          LanguageListAPI={refreshProductTypes}
          object=""
        />
      )}
    </>
  );
}

export default AddEditWindow;
