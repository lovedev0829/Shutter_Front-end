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
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import GetAllVendorDropdown from "../../../helpers/GetAllVendorDropdown";
import UnitofMesaurmentDropdown from "../../../helpers/UnitofMesaurmentDropdown";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import AddEditVender from "../Vender/AddEditVender";
import AddEditProductType from "../ProductType/AddEditProductType";

const AddEditMaterial = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = {
    materialName: "",
    unitCost: "",
    unitOfMeasurement: "",
    stockQuantity: null,
    reorderLevel: null,
    vendorId: "",
    notes: "",
    sku: null,
    isCutSheet: false,
    productType: "",
    // nonRatedUnitCost: "",
    lenght: null,
    width: null,
  };

  const theme = useTheme();
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const MaterialAddUpdate = async (e) => {
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
          stockQuantity: !value.stockQuantity ? null : value.stockQuantity,
          reorderLevel: !value.reorderLevel ? null : value.reorderLevel,
          sku: !value.sku ? null : value.sku,
          lenght: !value.lenght ? null : value.lenght,
          width: !value.width ? null : value.width,
         
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.MaterialCreate : apiUrls.MaterialUpdate,
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
    setvendorlist(false);
    setproducttypelist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const handleRadioChange = (e) => {
    setValue({
      ...value,
      isCutSheet: e.target.value === "true",
    });
  };

  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };

  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
  };
  const Getproduct = (id) => {
    if (action !== "edit") {
      setValue((val) => {
        return { ...val, productType: id };
      });
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
          <div className="modal-dialog modal-dialog-centered filter_modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  {action === "add" ? "Add Material" : "Update Material"}
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
              <form onSubmit={MaterialAddUpdate}>
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
                            value={value.productType}
                            fn={handleChange}
                            load={producttypelist}
                            Getproduct={Getproduct}
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
                            labelName={"Material Name"}
                            placeholderName={"Enter Material Name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"materialName"}
                            name={"materialName"}
                            value={value.materialName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "materialName",
                              value?.materialName,
                              `required|min:3`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Unit Cost"}
                            placeholderName={"Enter Unit Cost"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"unitCost"}
                            name={"unitCost"}
                            value={value.unitCost}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Unit Cost",
                              value?.unitCost,
                              `required|numeric`
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Non Rated Unit Cost"}
                            placeholderName={"Enter Non Rated Unit Cost"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"nonRatedUnitCost"}
                            name={"nonRatedUnitCost"}
                            value={value.nonRatedUnitCost}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Non Rated Unit Cost",
                              value?.nonRatedUnitCost,
                              `required|numeric`
                            )}
                          </div>
                        </div>
                      </div> */}

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14">
                            Unit Of Measure <sup>*</sup>
                          </label>
                          <UnitofMesaurmentDropdown
                            value={value.unitOfMeasurement}
                            fn={handleChange}
                            load={action}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "Unit Of Measure",
                              value?.unitOfMeasurement,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>
                      {["Linear Feet", "Linear Inches","Sq Inches", "Sq Feet"].some((keyword) =>
                        value?.unitOfMeasurement?.includes(keyword)
                      ) && (
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Length"}
                            placeholderName={"Enter Length"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"lenght"}
                            name={"lenght"}
                            value={value.lenght}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Length",
                              value?.lenght,
                              `numeric`
                            )}
                          </div>
                        </div>
                      </div>
                       )}
                        {["Sq Inches", "Sq Feet"].some((keyword) =>
                        value?.unitOfMeasurement?.includes(keyword)
                      ) && (
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Width"}
                            placeholderName={"Enter Width"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"width"}
                            name={"width"}
                            value={value.width}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Width",
                              value?.width,
                              `numeric`
                            )}
                          </div>
                        </div>
                      </div>
                      )}
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Inventory (Qty)"}
                            placeholderName={"Enter Inventory (Qty)"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"stockQuantity"}
                            name={"stockQuantity"}
                            value={value.stockQuantity}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Inventory (Qty)",
                              value?.stockQuantity,
                              `numeric`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"Reorder Level"}
                            placeholderName={"Enter Reorder Level"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"reorderLevel"}
                            name={"reorderLevel"}
                            value={value.reorderLevel}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Reorder Level",
                              value?.reorderLevel,
                              `numeric`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <label className="font-14 d-flex align-items-center justify-content-between">
                            <span>
                              {" "}
                              Select vendor <sup>*</sup>{" "}
                            </span>
                            {HasPermission("VendorsAdd") && (
                              <img
                                src="/image/plusblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => setvendor(true)}
                              />
                            )}
                          </label>
                          <GetAllVendorDropdown
                            value={value.vendorId}
                            fn={handleChange}
                            load={vendorlist}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "Vendor",
                              value?.vendorId,
                              `required`
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="form-group">
                          <InputField
                            labelName={"SKU"}
                            placeholderName={"Enter SKU Number"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"sku"}
                            name={"sku"}
                            value={value.sku}
                          />
                        
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
                          <label className="font-14">Cut Sheet</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                value="true"
                                checked={value.isCutSheet === true}
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
                                checked={value.isCutSheet === false}
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
                    </div>
                  </div>
                </div>

                  <div className="modal-footer">
                   <div className="form-style form-group d-flex align-items-center justify-content-end">
                     <Button
                       onClick={() => {
                         setValue(defaultState);
                         handleclose();
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
                       {action === "add" ? "Submit" : "Update"}
                     </Button>
                   </div>
                 </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {vendor &&<AddEditVender
        open={vendor}
        handleclose={() => setvendor(false)}
        action={"add"}
        LanguageListAPI={handleapi}
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
    </>
  );
};

export default AddEditMaterial;
