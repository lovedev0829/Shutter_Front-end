import React, { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ErrorMessage,
  FormatPhoneNumber,
  PreviewFiles,
  SelectBoxLoader,
  SuccessMessage,
} from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";
import Selectbox from "../../Form/Selectbox";
import moment from "moment/moment";
import { PostImage } from "../../../utils/apiCall";
import Allstate from "../../../helpers/Allstate";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Button,
  Stack,
  Paper,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  TextField,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TaxIcon from '@mui/icons-material/AttachMoney';
import UploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    maxWidth: '900px',
    width: '100%',
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5),
      maxHeight: '95vh',
      borderRadius: theme.spacing(1),
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  color: '#fff',
  padding: theme.spacing(2.5, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2.5),
    fontSize: '1.125rem',
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  border: '1px solid #e0e0e0',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: '#f8fafc',
  borderRadius: theme.spacing(1),
}));

const SectionIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1),
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  border: '2px dashed #e0e0e0',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: '#f8fafc',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 120,
}));

const AddEditContact = ({
  open,
  handleclose,
LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
}) => {
  const defaultState = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      suffix: "",
      contactType: "",
      phoneNumber: "+1",
      email: "",
      referral: "",
      website: "",
      notes: "",
      refral: "",
      isbillingSameAddress: false,
      billingAddressVm: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        streetAddress: "",
        city: "",
        stateId: "",
        zipCode: "",
      },
      isTaxExemption: true,
      taxExemptionVm: {
        exemptionCertificate: [],
        effectiveDate: null,
        expiryDate: null,
      },
    }),
    []
  );
  const [value, setValue] = useState(object ? object : defaultState);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [shows, setShows] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const ContactAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.ContactCreate : apiUrls.ContactUpdate,
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
          setShow(false);
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
      setShow(object.isTaxExemption ? false : true);
    } else {
      setValue(defaultState);
    }
    // eslint-disable-next-line
  }, [open, action]);

  const handleRadioChange = (e) => {
    setValue({
      ...value,
      isTaxExemption: e.target.value === "true",
    });
    setShow(e.target.value === "true" ? false : true);
    setValue((prev) => ({
      ...prev,
      taxExemptionVm: {
        ...prev.taxExemptionVm,
        exemptionCertificate: [],
        effectiveDate: null,
        expiryDate: null,
      },
    }));
  };

  const UploadImage = async (e) => {
    setShows(true);
    const files = [...e.target.files];
    const paths = await PostImage(files);
    setShows(false);

    if (paths) {
      setValue((prev) => ({
        ...prev,
        taxExemptionVm: {
          ...prev.taxExemptionVm,
          exemptionCertificate: [
            ...prev.taxExemptionVm.exemptionCertificate,
            ...(Array.isArray(paths) ? paths : [paths]),
          ],
        },
      }));
    }
    e.target.value = null;
  };

  const handleImageDelelet = (data) => {
    const arr = value?.taxExemptionVm?.exemptionCertificate?.filter(
      (val, i) => i !== data
    );
    setValue((prev) => ({
      ...prev,
      taxExemptionVm: {
        ...prev.taxExemptionVm,
        exemptionCertificate: arr,
      },
    }));
  };

  const handleChangenumber = (e) => {
    const { name, value } = e.target;
  
    let cleanedValue = value.replace(/\D/g, "").replace(/^1/, "");
  
    // ⛔ Prevent extra digits being stored
    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.slice(0, 10);
    }
  
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: cleanedValue,
        },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    }
  };
  
  const handleSameAsBillingChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prev) => ({
      ...prev,
      isbillingSameAddress: isChecked,
      billingAddressVm: isChecked
        ? {
            ...prev.billingAddressVm,
            firstName: prev.firstName,
            lastName: prev.lastName,
            phoneNumber: prev.phoneNumber,
            email: prev.email,
          }
        : {
            ...prev.billingAddressVm,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          },
    }));

  }

  const handleCloseModal = () => {
    handleclose();
    setValue(defaultState);
    simpleValidator.current.hideMessages();
    forceUpdate();
    setShow(false);
  };

  return (
    <StyledDialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={handleCloseModal}
    >
      <StyledDialogTitle>
        <Typography variant="h5" fontWeight={700}>
          {action === "add" ? "Add Contact" : "Update Contact"}
        </Typography>
        <IconButton onClick={handleCloseModal} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <form onSubmit={ContactAddUpdate}>
        <DialogContent sx={{ p: 3 }}>
          {/* Personal Information Section */}
          <SectionCard>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader>
                <SectionIcon>
                  <PersonIcon />
                </SectionIcon>
                <Typography variant="h6" fontWeight={600}>
                  Personal Information
                </Typography>
              </SectionHeader>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"First Name"}
                    placeholderName={"Enter First Name"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"firstName"}
                    name={"firstName"}
                    value={value.firstName}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "First Name",
                      value?.firstName,
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Last Name"}
                    placeholderName={"Enter Last Name"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"lastName"}
                    name={"lastName"}
                    value={value.lastName}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "Last Name",
                      value?.lastName,
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Suffix"}
                    placeholderName={"Enter Suffix"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"suffix"}
                    name={"suffix"}
                    value={value.suffix}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Selectbox
                    labelName={"Contact Type"}
                    options={[
                      { value: "person", label: "Person" },
                      { value: "organization", label: "Organization" },
                      { value: "lead", label: "Lead" },
                      { value: "customer", label: "Customer" },
                    ]}
                    handleChange={handleChange}
                    id={"contactType"}
                    name={"contactType"}
                    value={value.contactType}
                    required={true}
                    sx={{
                      mt: 1.25,
                    }}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "Contact Type",
                      value?.contactType,
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Phone No."}
                    placeholderName={"Enter phone number"}
                    type={"text"}
                    handleChange={handleChangenumber}
                    id={"phoneNumber"}
                    name={"phoneNumber"}
                    value={FormatPhoneNumber(value.phoneNumber || "")}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "Phone Number",
                      value?.phoneNumber,
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Email Address."}
                    placeholderName={"Enter email address"}
                    type={"text"}
                    handleChange={handleChange}
                    idv={"email"}
                    name={"email"}
                    value={value.email}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "email",
                      value?.email,
                      "required|email"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Referral Source"}
                    placeholderName={"Enter Referral Source"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"referral"}
                    name={"referral"}
                    value={value.referral}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Website Url"}
                    placeholderName={"Enter website url"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"website"}
                    name={"website"}
                    value={value.website}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    labelName={"Notes"}
                    placeholderName={"Enter notes"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"notes"}
                    name={"notes"}
                    value={value.notes}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Billing Address Section */}
          <SectionCard>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader>
                <SectionIcon>
                  <LocationOnIcon />
                </SectionIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Primary/Billing Address
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.isbillingSameAddress}
                        onChange={handleSameAsBillingChange}
                        color="primary"
                      />
                    }
                    label="Same as contact information"
                  />
                </Box>
              </SectionHeader>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"First Name"}
                    placeholderName={"Enter First name"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"firstName"}
                    name={"billingAddressVm.firstName"}
                    value={value.billingAddressVm?.firstName || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "First name",
                      value.billingAddressVm?.firstName || "",
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"Last Name"}
                    placeholderName={"Enter Last name"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"lastName"}
                    name={"billingAddressVm.lastName"}
                    value={value.billingAddressVm?.lastName || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "Last name",
                      value.billingAddressVm?.lastName || "",
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"Phone No."}
                    placeholderName={"Enter phone number"}
                    type={"text"}
                    handleChange={handleChangenumber}
                    id={"phoneNumber"}
                    name={"billingAddressVm.phoneNumber"}
                    value={FormatPhoneNumber(
                      value.billingAddressVm?.phoneNumber || ""
                    )}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "phoneNumber",
                      value.billingAddressVm?.phoneNumber || "",
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"Email Address."}
                    placeholderName={"Enter email address"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"email"}
                    name={"billingAddressVm.email"}
                    value={value.billingAddressVm?.email || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "email",
                      value.billingAddressVm?.email || "",
                      "required|email"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"Street Adress"}
                    placeholderName={"Enter street address"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"streetAddress"}
                    name={"billingAddressVm.streetAddress"}
                    value={value.billingAddressVm?.streetAddress || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "streetAddress",
                      value.billingAddressVm?.streetAddress || "",
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" gutterBottom>
                      State<Typography component="sup" sx={{ color: 'error.main' }}>*</Typography>
                    </Typography>
                    <Allstate
                      name="billingAddressVm.stateId"
                      value={value.billingAddressVm?.stateId || ""}
                      fn={handleChange}
                      load={action}
                    />
                    <Typography color="error" variant="caption">
                      {simpleValidator.current.message(
                        "State",
                        value.billingAddressVm?.stateId || "",
                        "required"
                      )}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"City"}
                    placeholderName={"Enter city"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"city"}
                    name={"billingAddressVm.city"}
                    value={value.billingAddressVm?.city || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "city",
                      value.billingAddressVm?.city || "",
                      "required"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    labelName={"Zip Code "}
                    placeholderName={"Enter zip code"}
                    type={"text"}
                    handleChange={handleChange}
                    id={"zipCode"}
                    name={"billingAddressVm.zipCode"}
                    value={value.billingAddressVm?.zipCode || ""}
                    required={true}
                  />
                  <Typography color="error" variant="caption">
                    {simpleValidator.current.message(
                      "ZipCode",
                      value.billingAddressVm?.zipCode || "",
                      "required|min:5|max:6"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Tax Management Section */}
          <SectionCard>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader>
                <SectionIcon>
                  <TaxIcon />
                </SectionIcon>
                <Typography variant="h6" fontWeight={600}>
                  Tax Management
                </Typography>
              </SectionHeader>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Apply Tax
                </FormLabel>
                <RadioGroup
                  row
                  value={value.isTaxExemption.toString()}
                  onChange={handleRadioChange}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio color="primary" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio color="primary" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>

              {show && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
                        Upload File
                      </Typography>
                      <UploadBox component="label">
                        {shows && <SelectBoxLoader />}
                        <input
                          type="file"
                          hidden
                          accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                          name="exemptionCertificate"
                          onChange={UploadImage}
                          multiple
                        />
                        <UploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Choose Files
                        </Typography>
                      </UploadBox>
                      <Box sx={{ mt: 2 }}>
                        <PreviewFiles
                          file={value?.taxExemptionVm?.exemptionCertificate}
                          isdelete={true}
                          handleImageDelelet={handleImageDelelet}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
                      Effective Date
                    </Typography>
                    <TextField
                      type="date"
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="taxExemptionVm.effectiveDate"
                      value={
                        action === "add"
                          ? moment(value.taxExemptionVm?.effectiveDate).format("YYYY-MM-DD") || ""
                          : ""
                      }
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
                      Expiry Date
                    </Typography>
                    <TextField
                      type="date"
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="taxExemptionVm.expiryDate"
                      value={
                        moment(value.taxExemptionVm?.expiryDate).format("YYYY-MM-DD") || ""
                      }
                      onChange={handleChange}
                      inputProps={{
                        min: action === "add"
                          ? moment(value.taxExemptionVm?.effectiveDate).format("YYYY-MM-DD") || ""
                          : undefined
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </SectionCard>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <ActionButton
              variant="outlined"
              onClick={handleCloseModal}
              startIcon={<CancelIcon />}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loader}
              startIcon={<SaveIcon />}
            >
              {action === "add" ? "Submit" : "Update"}
            </ActionButton>
          </Stack>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};
export default AddEditContact;
