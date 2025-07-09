import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  Button,
  Divider,
  IconButton,
  Checkbox
} from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import AddEditProductType from "../ProductType/AddEditProductType";
import AllProductDropdown from "../../../helpers/AllProductDropdown";
import AddEditProduct from "../Products/AddEditProduct";
import FormulaDropdown from "../../../helpers/FormulaDropdown";
import TaxListDropdown from "../../../helpers/TaxListDropdown";
import AddEditExpression from "../OptionExpression/AddEditExpression";
import AddEditTaxes from "../Taxes/AddEditTaxes";

const AddEditOption = ({ open, handleclose, LanguageListAPI, action, object }) => {
  const defaultState = {
    productTypeId: "",
    optionName: "",
    productId: "",
    optionExpression: "",
    markup: "",
    unit: "",
    isTaxAvailable: true,
    taxId: null,
    buildRequirement: false,
    useInCutSheet: false,
    options: [
      {
        optionType: "",
        additionalCost: "",
        isDefault: false,
        sortOrder: 0,
        requirePriceAtEstimatePreview: false,
        hidePreview: false,
      },
    ],
  };

  const [value, setValue] = useState(() => {
    if (object) {
      return {
        ...object,
        options: object.options?.map((opt) => ({
          ...opt,
          requirePriceAtEstimatePreview: opt.requirePriceAtEstimatePreview || false,
          hidePreview: opt.hidePreview || false,
        })) || [],
      };
    }
    return defaultState;
  });
  const [loader, setLoader] = useState(false);
  const [vendor, setVendor] = useState(false);
  const [tax, setTax] = useState(false);
  const [productTypeModal, setProductTypeModal] = useState(false);
  const [allTaxModal, setAllTaxModal] = useState(false);

  const [vendorListOpen, setVendorListOpen] = useState(false);
  const [taxListOpen, setTaxListOpen] = useState(false);
  const [productTypeListOpen, setProductTypeListOpen] = useState(false);
  const [allTaxListOpen, setAllTaxListOpen] = useState(false);

  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) =>
    setValue((v) => ({ ...v, [e.target.name]: e.target.value }));

  const toggleUseInCutSheet = () =>
    setValue((v) => ({ ...v, useInCutSheet: !v.useInCutSheet }));

  const toggleBuildRequirement = () =>
    setValue((v) => ({ ...v, buildRequirement: !v.buildRequirement }));

  const handleTaxChange = (e) => {
    const isAvailable = e.target.value === "true";
    setValue((v) => ({ ...v, isTaxAvailable: isAvailable, taxId: null }));
  };

  const languageAdd = async (e) => {
    e.preventDefault();
    // price check
    const priceErr = value.options.find(
      (opt) =>
        opt.requirePriceAtEstimatePreview &&
        (!opt.additionalCost || opt.additionalCost === "" || opt.additionalCost === "0")
    );
    if (priceErr) {
      return ErrorMessage(
        'Additional cost required'
      );
    }
    if (!simpleValidator.current.allValid()) {
      simpleValidator.current.showMessages();
      forceUpdate((i) => i + 1);
      return;
    }

    try {
      setLoader(true);
      const cleaned = {
        ...value,
        options: value.options.map((opt) => ({
          ...opt,
          additionalCost:
            opt.additionalCost === ""
              ? null
              : parseFloat(opt.additionalCost) || null,
        })),
      };
      const res = await callAPI(
        action === "add" ? apiUrls.OptionCreate : apiUrls.OptionUpdate,
        {},
        "POST",
        cleaned
      );
      setLoader(false);
      if (res?.data?.isSuccess) {
        SuccessMessage(res.data.message);
        await LanguageListAPI();
        handleclose();
        setValue(defaultState);
      } else {
        if (res.data.errors) {
          const msgs = res.data.errors
            .map((e) => `${e.Field}: ${e.Errors.join(", ")}`)
            .join("\n");
          ErrorMessage(`Validation failed:\n${msgs}`);
        } else {
          ErrorMessage(res.data.message || "An error occurred");
        }
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
      ErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (action === "edit" && object) {
      setValue({
        ...object,
        options:
          object.options?.map((opt) => ({
            ...opt,
            requirePriceAtEstimatePreview: opt.requirePriceAtEstimatePreview || false,
            hidePreview: opt.hidePreview || false,
          })) || [],
      });
    } else {
      setValue(defaultState);
    }
    setVendorListOpen(false);
    setTaxListOpen(false);
    setProductTypeListOpen(false);
    setAllTaxListOpen(false);
    // eslint-disable-next-line
  }, [open, action]);

  // --- option rows helpers unchanged ---
  const AddContactPerson = () => {
    const arr = [...value.options];
    const max = arr.length ? Math.max(...arr.map((o) => o.sortOrder)) : 0;
    arr.push({
      optionType: "",
      additionalCost: "",
      isDefault: false,
      sortOrder: max + 1,
      requirePriceAtEstimatePreview: false,
      hidePreview: false,
    });
    setValue((v) => ({ ...v, options: arr }));
  };
  const deleteContactPerson = (i) => {
    const arr = [...value.options];
    arr.splice(i, 1);
    const upd = arr.map((o, idx) => ({ ...o, sortOrder: idx }));
    setValue((v) => ({ ...v, options: upd }));
    if (upd.length === 0)
      simpleValidator.current.purgeFields([
        "optionType",
        "additionalCost",
        "isDefault",
      ]);
  };
  const handleContactPerson = (e, i) => {
    const { name, value: val, type, checked } = e.target;
    const arr = [...value.options];
    if (name === "isDefault") {
      arr.forEach((it, idx) => (it.isDefault = idx === i));
    } else {
      arr[i][name] = type === "checkbox" ? checked : val;
    }
    setValue((v) => ({ ...v, options: arr }));
  };
  // ----------------------------------------

  const Getproduct = (id) => {
    if (action !== "edit") setValue((v) => ({ ...v, productTypeId: id }));
  };
  const handleapiproduct = () => setProductTypeListOpen((p) => !p);
  const handleapi = () => setVendorListOpen((p) => !p);
  const handleapi2 = () => setTaxListOpen((p) => !p);
  const handleapi3 = () => setAllTaxListOpen((p) => !p);

  return (
    <>
      <Dialog open={open} onClose={handleclose} fullWidth maxWidth="lg">
        <DialogTitle>
          {action === "add" ? "Add Group" : "Update Group"}
         
        </DialogTitle>

        <form onSubmit={languageAdd} noValidate>
          <DialogContent dividers>
            {/* ROW 1 */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  error={!!simpleValidator.current.message(
                    "Product Type",
                    value.productTypeId,
                    "required"
                  )}
                >
                  <FormLabel style={{display: "flex", justifyContent:"space-between"}}>
                    Product Type *
                    {HasPermission("ProductTypeAdd") && (
                    <Button size="small" onClick={() => setProductTypeModal(true)}>
                      + NEW
                    </Button>
                  )}
                  </FormLabel>
                  <ProductTypeDropdown
                    value={value.productTypeId}
                    fn={handleChange}
                    load={productTypeListOpen}
                    name="productTypeId"
                    Getproduct={Getproduct}
                  />
                  <FormHelperText>
                    {simpleValidator.current.message(
                      "Product Type",
                      value.productTypeId,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  error={!!simpleValidator.current.message(
                    "Product",
                    value.productId,
                    "required"
                  )}
                >
                    <FormLabel style={{display: "flex", justifyContent:"space-between"}}>
                        Product *
                        {HasPermission("ProductsAdd") && (
                        <Button size="small" onClick={() => setVendor(true)}>
                        + NEW
                        </Button>
                    )}

                    </FormLabel>
                  <AllProductDropdown
                    fn={handleChange}
                    value={value.productId}
                    name="productId"
                    load={vendorListOpen}
                    producttypeId={value.productTypeId}
                  />
                  <FormHelperText>
                    {simpleValidator.current.message(
                      "Product",
                      value.productId,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormLabel >Group Name *</FormLabel>
                <TextField
                  style={{marginTop: 8}}
                  fullWidth
                  required
                  name="optionName"
                  size="small"
                  value={value.optionName}
                  onChange={handleChange}
                  error={!!simpleValidator.current.message(
                    "Group Name",
                    value.optionName,
                    "required"
                  )}
                  helperText={simpleValidator.current.message(
                    "Group Name",
                    value.optionName,
                    "required"
                  )}
                />
              </Grid>
            </Grid>

            {/* ROW 2 */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  error={!!simpleValidator.current.message(
                    "Pricing Expression",
                    value.optionExpression,
                    "required"
                  )}
                >
                  <FormLabel style={{ display: "flex",  justifyContent: "space-between"}}>
                    Pricing Expression *
                    {HasPermission("OptionExpressionAdd") && (
                    <Button size="small" onClick={() => setTax(true)}>
                      + NEW
                    </Button>
                  )}
                  </FormLabel>
                  <FormulaDropdown
                    value={value.optionExpression}
                    fn={handleChange}
                    load={taxListOpen}
                    ProductId={value.productTypeId}
                    name="optionExpression"
                    isOptionExpression
                  />
                  <FormHelperText>
                    {simpleValidator.current.message(
                      "Pricing Expression",
                      value.optionExpression,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormLabel>
                    Markup %
                </FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  required
                  style={{ marginTop: 7 }}
                  name="markup"
                  value={value.markup}
                  onChange={handleChange}
                  error={!!simpleValidator.current.message(
                    "Markup %",
                    value.markup,
                    "required|numeric"
                  )}
                  helperText={simpleValidator.current.message(
                    "Markup %",
                    value.markup,
                    "required|numeric"
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormLabel>
                    Unit *
                </FormLabel>
                <FormControl
                  fullWidth
                  error={!!simpleValidator.current.message(
                    "Unit",
                    value.unit,
                    "required"
                  )}
                >
                  <Select
                    style={{ marginTop: 7}}
                    name="unit"
                    value={value.unit}
                    size="small"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Choose Unit</MenuItem>
                    {[
                      "Per Unit",
                      "Each Job",
                      "Inch",
                      "CM",
                      "Sqft",
                      "lbs",
                    ].map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {simpleValidator.current.message(
                      "Unit",
                      value.unit,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* ROW 3 */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={2}>
                <FormControl component="fieldset">
                  <FormLabel>Apply Tax</FormLabel>
                  <RadioGroup
                    row
                    name="isTaxAvailable"
                    value={String(value.isTaxAvailable)}
                    onChange={handleTaxChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {value.isTaxAvailable && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <FormLabel style={{ display: "flex", justifyContent: "space-between"}}>
                        Select Tax
                        {HasPermission("TaxAdd") && (
                            <Button
                                size="small"
                                onClick={() => setAllTaxModal(true)}
                            >
                                + NEW
                            </Button>
                        )}
                    </FormLabel>
                    <TaxListDropdown
                      value={value.taxId}
                      fn={handleChange}
                      load={allTaxListOpen}
                      name="taxId"
                    />
                  </FormControl>
                </Grid>
                )}
                <Grid item xs={12} sm={3}  mt={3}>
                    <FormControlLabel
                    control={
                        <Switch
                        name="buildRequirement"
                        checked={value.buildRequirement}
                        onChange={toggleBuildRequirement}
                        />
                    }
                    label="Build Requirement"
                    />
                </Grid>

                <Grid item xs={12} sm={3}  mt={3}>
                    <FormControlLabel
                    control={
                        <Switch
                        name="useInCutSheet"
                        checked={value.useInCutSheet}
                        onChange={toggleUseInCutSheet}
                        />
                    }
                    label="Use in Cut Sheet"
                    />
                </Grid>
            </Grid>

            <Divider />

            {/* OPTION ROWS */}
            <Box mt={3}>
              <Grid container spacing={2} alignItems="center">
                {value.options.map((opt, i) => (
                  <React.Fragment key={i}>
                    {/* -- unchanged option fields -- */}
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Option Name"
                        name="optionType"
                        value={opt.optionType}
                        onChange={(e) => handleContactPerson(e, i)}
                        error={!!simpleValidator.current.message(
                          "Option Name",
                          opt.optionType,
                          "required"
                        )}
                        helperText={simpleValidator.current.message(
                          "Option Name",
                          opt.optionType,
                          "required"
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label={`Price${
                          opt.requirePriceAtEstimatePreview ? " *" : ""
                        }`}
                        name="additionalCost"
                        value={opt.additionalCost}
                       
                        onChange={(e) => handleContactPerson(e, i)}
                        error={
                          opt.requirePriceAtEstimatePreview &&
                          (!opt.additionalCost || opt.additionalCost === "")
                        }
                        helperText={
                          opt.requirePriceAtEstimatePreview &&
                          (!opt.additionalCost || opt.additionalCost === "")
                            ? "Required"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="requirePriceAtEstimatePreview"
                            checked={opt.requirePriceAtEstimatePreview}
                            onChange={(e) => handleContactPerson(e, i)}
                          />
                        }
                        label="Require Price"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="hidePreview"
                            checked={opt.hidePreview}
                            onChange={(e) => handleContactPerson(e, i)}
                          />
                        }
                        label="Hide on Preview"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Radio
                            onDoubleClick={ (e) => {
                              if (opt.isDefault) {
                                e.preventDefault();
                                const arr = [...value.options];
                                arr[i]['isDefault'] = false;
                                setValue((v) => ({ ...v, options: arr }));
                              }
                            }}
                            name="isDefault"
                            checked={opt.isDefault}
                            onClick={(e) => handleContactPerson(e, i)}
                          />
                        }
                        label="Default"
                      />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: "right" }}>
                      {value.options.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => deleteContactPerson(i)}
                        >
                          −
                        </Button>
                      )}
                      {i === value.options.length - 1 && (
                        <Button size="small" onClick={AddContactPerson}>
                          +
                        </Button>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleclose}>Cancel</Button>
            <SubmitButton
              type="submit"
              className="btn blue-btn"
              name={action === "add" ? "Submit" : "Update"}
              disabled={loader}
            />
          </DialogActions>
        </form>
      </Dialog>

      {/* Nested “Add New…” dialogs */}
      {productTypeModal && (
        <AddEditProductType
          open={productTypeModal}
          handleclose={() => setProductTypeModal(false)}
          action="add"
          LanguageListAPI={handleapiproduct}
          object=""
        />
      )}
      {vendor && (
        <AddEditProduct
          open={vendor}
          handleclose={() => setVendor(false)}
          action="add"
          LanguageListAPI={handleapi}
          object=""
        />
      )}
      {tax && (
        <AddEditExpression
          open={tax}
          handleclose={() => setTax(false)}
          action="add"
          LanguageListAPI={handleapi2}
          object=""
        />
      )}
      {allTaxModal && (
        <AddEditTaxes
          open={allTaxModal}
          handleclose={() => setAllTaxModal(false)}
          action="add"
          LanguageListAPI={handleapi3}
          object=""
        />
      )}
    </>
  );
};

export default AddEditOption;
