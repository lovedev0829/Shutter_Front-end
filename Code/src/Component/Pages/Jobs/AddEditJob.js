import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Close as CloseIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Notes as NotesIcon,
  Attachment as AttachmentIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
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
import { Link, useParams } from "react-router-dom";
import JobTypeDropdown from "../../../helpers/JobTypeDropdown";
import AssignedPersonnelDropdown from "../../../helpers/AssignedPersonnelDropdown";
import JobstatusDropdown from "../../../helpers/JobstatusDropdown";
import { PostImage } from "../../../utils/apiCall";
import moment from "moment";
import GetAllContact from "../../../helpers/GetAllContact";
import AddEditUser from "../Users/AddEditUser";
import AddEditAddress from "../Address/AddEditAddress";
import AddEditContact from "../Contacts/AddEditContact";
import AddEditJobType from "../JobType/AddEditJobType";
import GetAllStages from "../../../helpers/GetAllStages";

const AddEditJob = ({ 
  open,
  handleclose,
  LanguageListAPI,
  action,
  object,
}) => {
  const theme = useTheme();
  let param = useParams();

  const defaultState = {
    contactId: param.contactId ? param.contactId : "",
    addressId: "",
    jobName: "",
    jobType: "",
    assignedPersonnel: "",
    scheduledDate: null,
    jobStatus: "",
    notes: "",
    attachmentsAny: [],
    ghL_StageId: null
  };

  const [vendor, setvendor] = useState(false);
  const [vendorlist, setvendorlist] = useState(false);
  const [contact, setcontact] = useState(false);
  const [contactlist, setcontactlist] = useState(false);
  const [address, setaddress] = useState(false);
  const [value, setValue] = useState(object ? object : defaultState);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [show, setShow] = useState(false);
  const [addresList, setaddressList] = useState([]);
  const [shows, setShows] = useState(false);
  const [producttype, setproducttype] = useState(false);
  const [producttypelist, setproducttypelist] = useState(false);

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const JobAddUpdate = async (e) => {
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
          ghL_StageId: !value.ghL_StageId ? null : value.ghL_StageId,
        };
        const apiResponse = await callAPI(
          action === "add" ? apiUrls.JobCreate : apiUrls.JobUpdate,
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
      setaddressList([]);
      setValue(defaultState);
    }
    setvendorlist(false);
    setcontactlist(false);
    setproducttypelist(false);
    // eslint-disable-next-line
  }, [open, action]);

  const UploadImage = async (e) => {
    setShows(true);
    let file = [...e.target.files];
    const path = await PostImage(file);
    setShows(false);
    if (path) {
      setValue((val) => {
        return {
          ...val,
          attachmentsAny: [...(val.attachmentsAny || []), ...path],
        };
      });
    }
    e.target.value = null;
  };

  const handleImageDelelet = (data) => {
    const arr = value?.attachmentsAny?.filter((val, i) => i !== data);
    setValue((val) => {
      return { ...val, attachmentsAny: arr };
    });
  };

  const AddresslistAPI = async () => {
    setShow(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllAddress,
        { ContactId: param.contactId ? param.contactId : value.contactId },
        "GET"
      );

      if (apiResponse?.data?.isSuccess) {
        setaddressList(apiResponse?.data?.data);
      } else {
        setaddressList([]);
      }
      setShow(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (value.contactId) {
      AddresslistAPI();
    }
    // eslint-disable-next-line
  }, [value.contactId, open]);

  const handleapi = () => {
    setvendorlist((prev) => !prev);
  };
  const handleapiv = () => {
    setcontactlist((prev) => !prev);
  };
  const handleapiproduct = () => {
    setproducttypelist((prev) => !prev);
  };

  const handleClose = () => {
    setValue(defaultState);
    handleclose();
    simpleValidator.current.hideMessages();
    forceUpdate();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: '0 16px 64px rgba(0,0,0,0.15)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            margin: { xs: 0, sm: 4 },
            maxHeight: { xs: '100vh', sm: '90vh' },
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            p: 0,
            background: alpha(theme.palette.primary.main, 0.05),
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backgroundColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  <WorkIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.main',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      lineHeight: { xs: 1.3, sm: 1.2 },
                    }}
                  >
                    {action === "add" ? "Create New Job" : "Update Job"}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mt: 0.5,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {action === "add" ? "Fill in the details below to create a new job" : "Update the job information"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'text.secondary',
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                  position: { xs: 'absolute', sm: 'relative' },
                  top: { xs: 16, sm: 'auto' },
                  right: { xs: 16, sm: 'auto' },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <form onSubmit={JobAddUpdate}>
          <DialogContent sx={{ p: 0, overflowX: 'hidden' }}>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Job Information Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  mb: { xs: 2, sm: 3 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
                  <Avatar sx={{ 
                    backgroundColor: 'primary.main', 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 } 
                  }}>
                    <PersonIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Job Information
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {!param.contactId && (
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'text.primary',
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          >
                            Contact Name *
                          </Typography>
                          {HasPermission("ContactAdd") && (
                            <IconButton
                              size="small"
                              onClick={() => setcontact(true)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                        <GetAllContact
                          value={value.contactId}
                          fn={handleChange}
                          load={contactlist}
                        />
                        {simpleValidator.current.message(
                          "contact Name",
                          value?.contactId,
                          `required`
                        ) && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'error.main', 
                              mt: 0.5, 
                              display: 'block',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            {simpleValidator.current.message("contact Name", value?.contactId, `required`)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6} mt={1}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Select Address *
                        </Typography>
                        {param.contactId && HasPermission("AddressAdd") && (
                          <IconButton
                            size="small"
                            onClick={() => setaddress(true)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <FormControl fullWidth size="small">
                        <Select
                          name="addressId"
                          value={value?.addressId || ""}
                          onChange={handleChange}
                          displayEmpty
                          disabled={show}
                          sx={{
                            backgroundColor: 'background.paper',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'divider',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <MenuItem value="">
                            <Typography sx={{ color: 'text.disabled' }}>Select an address</Typography>
                          </MenuItem>
                          {addresList?.map((val, i) => (
                            <MenuItem key={i} value={val?.addressId}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {val?.streetAddress}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {val?.stateName}, {val?.city} - {val?.zipCode} ({val?.label})
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {show && <SelectBoxLoader />}
                      </FormControl>
                      {simpleValidator.current.message(
                        "Address",
                        value?.addressId,
                        `required`
                      ) && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'error.main', 
                            mt: 0.5, 
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {simpleValidator.current.message("Address", value?.addressId, `required`)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} mt={1}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary', 
                          mb: 1,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Job Name *
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Job Name"
                        name="jobName"
                        value={value.jobName}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                          },
                        }}
                      />
                      {simpleValidator.current.message(
                        "Job Name",
                        value?.jobName,
                        `required`
                      ) && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'error.main', 
                            mt: 0.5, 
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {simpleValidator.current.message("Job Name", value?.jobName, `required`)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Select Job Type *
                        </Typography>
                        {HasPermission("JobTypeAdd") && (
                          <IconButton
                            size="small"
                            onClick={() => setproducttype(true)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <JobTypeDropdown
                        value={value.jobType}
                        fn={handleChange}
                        load={producttypelist}
                      />
                      {simpleValidator.current.message(
                        "Job Type",
                        value?.jobType,
                        `required`
                      ) && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'error.main', 
                            mt: 0.5, 
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {simpleValidator.current.message("Job Type", value?.jobType, `required`)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} mt={1}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary', 
                          mb: 1,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Select GHL Stage
                      </Typography>
                      <GetAllStages
                        value={value.ghL_StageId}
                        fn={handleChange}
                        load={action}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Select Assigned Personnel *
                        </Typography>
                        {HasPermission("UsersAdd") && (
                          <IconButton
                            size="small"
                            onClick={() => setvendor(true)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <AssignedPersonnelDropdown
                        value={value.assignedPersonnel}
                        fn={handleChange}
                        load={vendorlist}
                      />
                      {simpleValidator.current.message(
                        "Assigned Personnel",
                        value?.assignedPersonnel,
                        `required`
                      ) && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'error.main', 
                            mt: 0.5, 
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {simpleValidator.current.message("Assigned Personnel", value?.assignedPersonnel, `required`)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {action === "edit" && (
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Select Job Status
                        </Typography>
                        <JobstatusDropdown
                          value={value.jobStatus}
                          fn={handleChange}
                          load={action}
                        />
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary', 
                          mb: 1,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Schedule Date and Time
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="datetime-local"
                        name="scheduledDate"
                        value={value.scheduledDate || ""}
                        onChange={handleChange}
                        InputProps={{
                          sx: {
                            backgroundColor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Notes and Attachments Section */}
              <Accordion 
                defaultExpanded
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                }}
              >
                                 <AccordionSummary 
                   expandIcon={<ExpandMoreIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                   sx={{ 
                     backgroundColor: alpha(theme.palette.primary.main, 0.02),
                     borderRadius: '8px 8px 0 0',
                     py: { xs: 1, sm: 2 },
                   }}
                 >
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                     <Avatar sx={{ 
                       backgroundColor: 'primary.main', 
                       width: { xs: 28, sm: 32 }, 
                       height: { xs: 28, sm: 32 } 
                     }}>
                       <NotesIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                     </Avatar>
                     <Typography 
                       variant="h6" 
                       sx={{ 
                         fontWeight: 600,
                         fontSize: { xs: '1rem', sm: '1.25rem' }
                       }}
                     >
                       Notes & Attachments
                     </Typography>
                   </Box>
                 </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Job Notes
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          size="small"
                          placeholder="Enter any relevant notes..."
                          name="notes"
                          value={value.notes}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'background.paper',
                              '& fieldset': { borderColor: 'divider' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Attachments
                        </Typography>
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: { xs: 2, sm: 3 },
                            textAlign: 'center',
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            position: 'relative',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            }
                          }}
                        >
                          {shows && <SelectBoxLoader />}
                          <input
                            type="file"
                            multiple
                            accept="image/png,image/jpg,image/jpeg,.doc,.docx,.pdf"
                            onChange={UploadImage}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              cursor: 'pointer'
                            }}
                          />
                          <AttachmentIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'text.disabled', mb: 1 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary', 
                              mb: 1,
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          >
                            Drop files here or click to browse
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.disabled',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            Supports: Images, PDF, DOC, DOCX
                          </Typography>
                        </Box>
                        
                        {value?.attachmentsAny && value.attachmentsAny.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <PreviewFiles
                              file={value?.attachmentsAny}
                              isdelete={true}
                              handleImageDelelet={handleImageDelelet}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.info.main, 0.2)
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'info.main', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Examples:
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            • Customer prefers afternoon visits.
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            • Be aware of the dog in the backyard.
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            • Parking available on the street; permit required.
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 }, 
            gap: { xs: 1.5, sm: 2 },
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            '& > *': {
              width: { xs: '100%', sm: 'auto' }
            }
          }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: { xs: 1.2, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.secondary',
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
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
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: { xs: 2, sm: 4 },
                py: { xs: 1.2, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                backgroundColor: 'primary.main',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {action === "add" ? "Create Job" : "Update Job"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Sub-dialogs */}
      {vendor && (
        <AddEditUser
          open={vendor}
          handleclose={() => setvendor(false)}
          action={"add"}
          LanguageListAPI={handleapi}
          object={""}
        />
      )}
      {address && (
        <AddEditAddress
          open={address}
          handleclose={() => setaddress(false)}
          action={"add"}
          LanguageListAPI={AddresslistAPI}
          object={""}
        />
      )}
      {contact && (
        <AddEditContact
          open={contact}
          handleclose={() => setcontact(false)}
          action={"add"}
          LanguageListAPI={handleapiv}
          object={""}
        />
      )}
      {producttype && (
        <AddEditJobType
          open={producttype}
          handleclose={() => setproducttype(false)}
          action={"add"}
          LanguageListAPI={handleapiproduct}
          object={""}
        />
      )}
    </>
  );
};

export default AddEditJob;
