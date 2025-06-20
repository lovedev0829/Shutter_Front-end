import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
// import AllProduct from "../../../helpers/AllProduct";
import ValidatePopup from "./Validate";
import { defaultConfig } from "../../../config";

function AddEditExpression({
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) {
  const defaultState = {
    expressionName: "",
    expressionFormulae: "",
    productTypeId: "",
    productId: "",
    productName: "",
    formulaeArray: [],
    displayArray: [],
    isOptionExpression: true,
  };
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [countryList, setCountryList] = useState([]);

  const chip = [
    {
      name: "BuildWidth",
      componentName: "Product Width",
      type: "Others",
    },
    {
      name: "BuildHeight",
      componentName: "Product Height",
      type: "Others",
    },
    { name: "Quantity", componentName: "Quantity", type: "Others" },
    { name: "Optionprice", componentName: "Option Price", type: "Others" },
    { name: "Unit", componentName: "Option Unit", type: "Others" },
  ];
  const [show, setShow] = useState(false);
  const [clickedChips, setClickedChips] = useState([]);
  const [orignalData, setorignalData] = useState([]);
  const [insertIndex, setInsertIndex] = useState(orignalData?.length);
  const [number, setNumber] = useState("");
  const [validate, setValidate] = useState(true);
  const [shows, setShows] = useState(false);
  const [result, setResult] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const languageAdd = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.ExpressionCreate
            : apiUrls.ExpressionUpdate,
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
          setClickedChips([]);
          setorignalData([]);
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };
  const handleChange = (e) => {
    if (e.target.name === "productTypeId") {
      setClickedChips([]);
      setorignalData([]);

      setValue((val) => {
        return { ...val, productId: "", productName: "" };
      });
    }
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const CountryList = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllProductType, {}, "GET");
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
        if (action !== "edit") {
          const foundItem = apiResponse.data.data.find(
            (item) => item.isDefault === true
          );
          if (foundItem) {
            setValue((val) => {
              return { ...val, productTypeId: foundItem.productId };
            });
           
          }
        }
      }
    } catch (error) {
      setShow(false);
      setCountryList([]);
    }
  };

  useEffect(() => {
    setResult("");
    if (action === "edit") {
      setValidate(false);
      setClickedChips(object?.formulaeArray);
      setorignalData(object?.displayArray);
      setInsertIndex(object?.displayArray?.length);
      setValue(object);
    } else {
      setClickedChips([]);
      setorignalData([]);
      setInsertIndex(0);
      setValue(defaultState);
      setValidate(true);
    }
    CountryList();
    // eslint-disable-next-line
  }, [open, action]);

  const expression = [
    { name: "+" },
    { name: "-" },
    { name: "*" },
    { name: "%" },
    { name: "/" },
    { name: "(" },
    { name: ")" },
    { name: ">" },
    { name: "<" },
    { name: "if" },
    { name: "," },
    { name: "==" },
    { name: "<=" },
    { name: ">=" },
  ];

  const expression2 = [
    { name: "Inch" },
    { name: "CM" },
    { name: "Sqft" },
    { name: "lbs" },
    { name: "Per Unit" },
    { name: "Each Job" },
  ];

  const handleChipClicks2 = (chip) => {
    setValidate(true);
    setResult("");
    const formula = `'${chip.name}'`;
    const formula2 = chip.name;
    // setClickedChips((prev) => [...prev, formula]);
    // setorignalData((prev) => [...prev, formula2]);

    const updatedChips = [...clickedChips];
    const updatedDisplay = [...orignalData];
    updatedChips.splice(insertIndex, 0, formula);
    updatedDisplay.splice(insertIndex, 0, formula2);
    setClickedChips(updatedChips);
    setorignalData(updatedDisplay);
    setInsertIndex(insertIndex + 1);
  };

  const handleChipClick = (chip) => {
    setValidate(true);
    setResult("");
    const formula = `{{${chip.name}}}`;
    const formula2 = chip.componentName;

    const updatedChips = [...clickedChips];
    const updatedDisplay = [...orignalData];
    updatedChips.splice(insertIndex, 0, formula);
    updatedDisplay.splice(insertIndex, 0, formula2);
    setClickedChips(updatedChips);
    setorignalData(updatedDisplay);

    // setClickedChips((prev) => [...prev, formula]);
    // setorignalData((prev) => [...prev, formula2]);

    setInsertIndex(insertIndex + 1);
  };

  useEffect(() => {
    setValue((val) => ({
      ...val,
      expressionFormulae: clickedChips?.join(""),
      formulaeArray: clickedChips,
      displayArray: orignalData,
    }));
  }, [clickedChips, orignalData]);

  const handleChipClicks = (chip) => {
    setValidate(true);
    setResult("");
    const formula = `${chip.name}`;

    const updatedChips = [...clickedChips];
    const updatedDisplay = [...orignalData];
    updatedChips.splice(insertIndex, 0, formula);
    updatedDisplay.splice(insertIndex, 0, formula);
    setClickedChips(updatedChips);
    setorignalData(updatedDisplay);

    // setClickedChips((prev) => [...prev, formula]);
    // setorignalData((prev) => [...prev, formula]);
    setInsertIndex(insertIndex + 1);
  };

  const handleImageDelelet = (data) => {
    setValidate(true);
    setResult("");
    const arr = clickedChips?.filter((val, i) => i !== data);
    const arr2 = orignalData?.filter((val, i) => i !== data);
    setClickedChips(arr);
    setorignalData(arr2);
    if (insertIndex > data) setInsertIndex(insertIndex - 1);
  };
  const handleAdd = () => {
    if (number) {
      setValidate(true);
      setResult("");

      const updatedChips = [...clickedChips];
      const updatedDisplay = [...orignalData];
      updatedChips.splice(insertIndex, 0, number);
      updatedDisplay.splice(insertIndex, 0, number);
      setClickedChips(updatedChips);
      setorignalData(updatedDisplay);
      setInsertIndex(insertIndex + 1);

      // setClickedChips((prev) => [...prev, number]);
      // setorignalData((prev) => [...prev, number]);
      setNumber("");
    }
  };
  const groupedByType = chip?.reduce((acc, val) => {
    if (!acc[val.type]) {
      acc[val.type] = [];
    }
    acc[val.type].push(val);
    return acc;
  }, {});

  const Validate = async (data) => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          apiUrls.ExpressionValidate,
          {},
          "POST",
          {
            expression: value.expressionFormulae,
            buildWidth: data.BuildWidth,
            buildHeight: data.BuildHeight,
            quantity: data.Quantity,
            optionprice: data.optionprice,
            unit: data.unit,
          }
        );
        setLoader(false);
        setShows(false);
        if (apiResponse?.data?.isSuccess) {
          setValidate(false);
          setResult(apiResponse?.data?.data);
          SuccessMessage(apiResponse?.data?.message);
        } else {
          setResult("Failed");
          ErrorMessage(apiResponse?.data?.message);
        }
      } catch (error) {
        setResult("Failed");
        setLoader(false);
        setShows(false);
      }
    }
  };

  const handlevalidate = () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setShows(true);
    }
  };

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
          <div className="modal-dialog modal-dialog-centered filter_modal experssion_modal">
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  languageAdd();
                }}
              >
                <div className="modal-body pt-0 pb-0">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="modal-header ps-0 pe-0">
                        <h1
                          className="modal-title d-flex align-items-center justify-content-between w-100"
                          id="exampleModalLabel"
                        >
                          {action === "add"
                            ? "Add Option Expression"
                            : "Update Option Expression"}
                          <i
                            className="icofont-close btn-close mobile_close"
                            onClick={() => {
                              setValue(defaultState);
                              handleclose();
                              simpleValidator.current.hideMessages();
                              forceUpdate();
                              setClickedChips([]);
                              setorignalData([]);
                            }}
                          ></i>
                        </h1>
                      </div>
                      <div className="form-design pt-3">
                        <div className="row gx-2">
                          <div className="col-lg-6 col-6">
                            <div className="form-group">
                              <label className="font-14">
                                Product Type <sup>*</sup>
                              </label>

                              <div className="position-relative">
                                {show && <SelectBoxLoader />}
                                <select
                                  className="form-select "
                                  aria-label="Default select example"
                                  name="productTypeId"
                                  value={value?.productTypeId}
                                  onChange={handleChange}
                                >
                                  <option value="">Choose Type</option>

                                  {countryList?.map((vals, idx) => {
                                    return (
                                      <option
                                        value={vals.productId}
                                        key={idx}
                                        selected={
                                          vals.productId ===
                                          value?.productTypeId
                                            ? true
                                            : false
                                        }
                                      >
                                        {vals.productName}
                                      </option>
                                    );
                                  })}
                                </select>
                                <div className="error">
                                  {simpleValidator.current.message(
                                    "Product Type",
                                    value?.productTypeId,
                                    `required`
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 col-6">
                            <div className="form-group">
                              <InputField
                                labelName={"Expression Name"}
                                placeholderName={"Enter Expression Name"}
                                type={"text"}
                                handleChange={handleChange}
                                id={"expressionName"}
                                name={"expressionName"}
                                value={value.expressionName}
                                required={true}
                              />
                              <div className="error">
                                {simpleValidator.current.message(
                                  "expressionName",
                                  value?.expressionName,
                                  `required`
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="option-scroll col-lg-12">
                            <div className="filter_jobs">
                              <div className="filter_option">
                                <h6>Expression</h6>
                                
                                {value?.expressionFormulae &&
                                  orignalData?.map((val, i) => (
                                    <React.Fragment key={i}>
                                      {insertIndex === i && (
                                        <span
                                          style={{
                                            width: "1px",
                                            background: "black",
                                            display: "inline-block",
                                            height: "23px",
                                            margin: "-7px 4px",
                                          }}
                                        />
                                      )}
                                      <Link
                                        to="#"
                                        style={{marginRight:"6px"}}
                                        className={"active position-relative"}
                                        onClick={() => setInsertIndex(i + 1)}
                                      >
                                        {val}
                                        <span className="expdelete">
                                           <i
                                        className="fa fa-times "
                                        onClick={() => handleImageDelelet(i)}
                                      ></i>
                                        </span>
                                         
                                      </Link>

                                    
                                    </React.Fragment>
                                  ))}
                                {insertIndex === orignalData?.length && (
                                  <span
                                    style={{
                                      width: "1px",
                                      background: "black",
                                      display: "inline-block",
                                      height: "23px",
                                      margin: "-7px 4px",
                                    }}
                                  />
                                )}
                              </div>
                              {result && (
                                <div className="filter_option mt-30">
                                  <h6>
                                    Calculated Result :{" "}
                                    <strong
                                      style={{
                                        color:
                                          result === "Failed" ? "red" : "black",
                                      }}
                                    >
                                      {result !== "Failed"
                                        ? defaultConfig.currencySign +
                                          " " +
                                          result
                                        : result}
                                    </strong>
                                  </h6>
                                </div>
                              )}
                            </div>
                            <div className="error">
                              {simpleValidator.current.message(
                                "expressionFormulae",
                                value?.expressionFormulae,
                                `required`
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 bg-light">
                      <div className="right_experssion position-relative p-1">
                        <i
                          className="icofont-close btn-close desktop_close"
                          onClick={() => {
                            setValue(defaultState);
                            handleclose();
                            simpleValidator.current.hideMessages();
                            forceUpdate();
                            setClickedChips([]);
                            setorignalData([]);
                          }}
                        ></i>

                        {chip.length > 0 && (
                          <div className="filter_jobs pt-5">
                            <div
                              className="filter_option  one-chip bg-white"
                              style={{ marginBottom: "10px" }}
                            >
                              <div className="row gx-0 align-items-center">
                                <div className="col-md-7">
                                  {expression?.map((val, i) => (
                                    <Link
                                      to="#"
                                      onClick={() => handleChipClicks(val)}
                                      key={i}
                                      className="operatorfield"
                                      style={{ marginBottom: "6px" }}
                                    >
                                      {val.name}
                                    </Link>
                                  ))}
                                  {expression2?.map((val, i) => (
                                    <Link
                                      to="#"
                                      onClick={() => handleChipClicks2(val)}
                                      key={i}
                                      className="operatorfield"
                                      style={{ marginBottom: "6px" }}
                                    >
                                      {val.name}
                                    </Link>
                                  ))}
                                </div>
                                <div className="col-md-5 d-flex align-items-center gap-3">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Number"
                                    value={number ? number : ""}
                                    onChange={(e) => setNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAdd();
                                      }
                                    }}
                                  />{" "}
                                  <button
                                    type="button"
                                    className="btn blue-btn btn-sm"
                                    onClick={handleAdd}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="option-scroll">
                              {Object?.entries(groupedByType)?.map(
                                ([type, items], index) => (
                                  <div
                                    className="filter_option  one-chip bg-white mobile_filter_scroll"
                                    key={index}
                                    style={{
                                      marginBottom: "10px",
                                      overflowY:
                                        type !== "Others" ? "auto" : "",
                                      height:
                                        type !== "Others"
                                          ? "calc(100vh - 340px)"
                                          : "",
                                    }}
                                  >
                                    <div className="chip-heading">
                                      <h5>{type}</h5>
                                    </div>
                                    {items?.map((val, i) => (
                                      <Link
                                        to="#"
                                        onClick={() => handleChipClick(val)}
                                        key={i}
                                        style={{ color: "#070619" }}
                                      >
                                        {val?.componentName}
                                      </Link>
                                    ))}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end exp-form-style">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setValue(defaultState);
                        handleclose();
                        simpleValidator.current.hideMessages();
                        forceUpdate();
                        setClickedChips([]);
                        setorignalData([]);
                      }}
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      className="btn blue-btn me-3"
                      onClick={handlevalidate}
                    >
                      Validate
                    </button>

                    {validate ? (
                      ""
                    ) : (
                      <SubmitButton
                        type="submit"
                        className="btn blue-btn"
                        name={action === "add" ? "Submit" : "Update"}
                        disabled={loader}
                      />
                    )}
                    {validate && (
                      <button
                        type="submit"
                        className="btn blue-btn"
                        disabled={true}
                      >
                        {action === "add" ? "Submit" : "Update"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {shows &&<ValidatePopup
        open={shows}
        handleClose={() => setShows(false)}
        handleValidate={Validate}
        loder={loader}
      />
}
    </>
  );
}

export default AddEditExpression;
