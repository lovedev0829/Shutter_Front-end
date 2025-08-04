import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PostImage } from "../utils/apiCall";
import { t } from "i18next";
import { 
  Dialog,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  useTheme,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Backdrop
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DeleteOutline as DeleteIcon,
  AccessTime as ScheduleIcon,
  EditOutlined as EditIcon,
  AddCircleOutline as AddIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachmentIcon,
  Palette as PaletteIcon,
  EventAvailable as AppointmentIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Appointment from "./Appointment";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";

const ApiLoder = () => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

const SuccessMessage = (message) => {
  setTimeout(
    () =>
      toast.success(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }),
    10
  );
};

const ErrorMessage = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const CommonUploadImage = async (e, handleonchange, allowedFileTypes) => {
  let file = e?.target?.files[0];
  let name = e?.target?.name;
  if (
    allowedFileTypes.includes(file?.type) ||
    allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
  ) {
    const path = await PostImage(file);
    if (path?.length > 0) {
      handleonchange((extra) => ({ ...extra, [name]: path[0] }));
    } else {
      handleonchange((extra) => ({ ...extra, [name]: "" }));
    }
    e.target.value = null;
  } else {
    ErrorMessage("Invalid file Formate");
    handleonchange((extra) => ({ ...extra, [name]: "" }));
    e.target.value = null;
    return false;
  }
};

const AcceptFileType =
  "image/png,image/PNG,image/jpg,image/JPG,image/jpeg,image/JPEG,.doc, .docx,.xls,.xlsx,.pdf,.csv,";
const FileType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "pdf",
  "csv",
  "jpg",
  "png",
  "jpeg",
  "JPG",
  "PNG",
  "JPEG",
];

const CustomMessages = {
  required: t("required_field"),
  email: t("email_field"),
  min: t("min_field"),
  max: t("max_field"),
  numeric: t("numeric_field"),
  alpha_num: t("alpha_num_field"),
  alpha_num_space: t("alpha_num_space_field"),
};

function SubmitButton({ onClick, disabled, text }) {
  const theme = useTheme();
  
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        fontWeight: 600,
        fontSize: '0.875rem',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        px: 4,
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        letterSpacing: '0.02em',
        boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          backgroundColor: theme.palette.grey[400],
          color: theme.palette.grey[600],
        },
        transition: 'all 0.2s ease-in-out'
      }}
      startIcon={disabled ? <CircularProgress size={16} color="inherit" /> : null}
    >
      {text}
    </Button>
  );
}

const Delete = ({ open, handleClose, handleDelete, title, id, loder }) => {
  const theme = useTheme();
  
  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            mx: 'auto',
            mb: 3,
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <DeleteIcon sx={{ fontSize: 32, color: '#dc2626' }} />
        </Box>
        
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 2, 
            color: theme.palette.text.primary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '-0.01em'
          }}
        >
          Delete Confirmation
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: theme.palette.text.secondary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: 1.6
          }}
        >
          Are you sure you want to delete{" "}
          <Typography 
            component="span" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            {title}
          </Typography>
          ? This action cannot be undone.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.secondary,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '&:hover': {
                borderColor: theme.palette.grey[400],
                backgroundColor: theme.palette.grey[50],
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loder}
            onClick={() => handleDelete(id)}
            sx={{
              backgroundColor: '#dc2626',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[400],
              }
            }}
            startIcon={loder ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export const getHomeUrl = () => {
  return window.location.origin;
};

const HasPermission = (permission) => {
  const permissions = JSON.parse(localStorage.getItem("userData"));
  return permissions?.roles.includes(permission);
};

function SelectBoxLoader({ size = 20, color }) {
  const theme = useTheme();
  
  return (
    <CircularProgress 
      size={size} 
      thickness={4}
      sx={{ 
        color: color || theme.palette.primary.main,
        filter: `drop-shadow(0 1px 3px ${theme.palette.primary.main}30)`
      }} 
    />
  );
}

const ColorList = [
  { value: "#e94235", label: "Red" },
  { value: "#4285f4", label: "Blue" },
  { value: "#34a853", label: "Green" },
  { value: "#1d7e8b", label: "Teal" },
  { value: "#c950b4", label: "Pink" },
  { value: "#ab743f", label: "Brown" },
  { value: "#c1a536", label: "Yellow" },
  { value: "#e25530", label: "Orange" },
];

function BackButton({ link }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        component={Link}
        to={link}
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          borderColor: theme.palette.grey[300],
          color: theme.palette.text.secondary,
          px: 3,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '0.01em',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}08`,
            color: theme.palette.primary.main,
            transform: 'translateX(-2px)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Back
      </Button>
    </Box>
  );
}

function JobUi({ tenantList, onJobUpdate }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [childData, setChildData] = useState("");
  const [powderCoatColors, setPowderCoatColors] = useState([]);
  const [selectedPowderCoatColor, setSelectedPowderCoatColor] = useState(
    tenantList?.powderCoatColorId || ""
  );
  const [loadingColors, setLoadingColors] = useState(false);
  const [updatingColor, setUpdatingColor] = useState(false);

  const handleChildData = (data) => {
    setChildData(data);
  };

  // Load powder coat colors
  const loadPowderCoatColors = async () => {
    try {
      setLoadingColors(true);
      const response = await callAPI(
        apiUrls.GetPowderCoatColorsForDropdown,
        {},
        "GET"
      );
      if (response?.data?.isSuccess) {
        setPowderCoatColors(response.data.data);
      } else {
        setPowderCoatColors([]);
        ErrorMessage(
          response?.data?.message || "Failed to load powder coat colors"
        );
      }
    } catch (error) {
      console.error("Error loading powder coat colors:", error);
      ErrorMessage("Error loading powder coat colors");
      setPowderCoatColors([]);
    } finally {
      setLoadingColors(false);
    }
  };

  // Update job powder coat color
  const updateJobPowderCoatColor = async (colorId) => {
    try {
      setUpdatingColor(true);

      const response = await callAPI(
        apiUrls.UpdateJobPowderCoatColor,
        {
          jobId: tenantList?.jobId,
          powderCoatColorId: colorId || null,
        },
        "POST"
      );

      if (response?.data?.isSuccess) {
        setSelectedPowderCoatColor(colorId);
        if (onJobUpdate) {
          onJobUpdate({ ...tenantList, powderCoatColorId: colorId });
        }
        SuccessMessage("Powder coat color updated successfully");
      } else {
        ErrorMessage(
          response?.data?.message || "Failed to update powder coat color"
        );
      }
    } catch (error) {
      console.error("Error updating powder coat color:", error);
      ErrorMessage("Error updating powder coat color");
    } finally {
      setUpdatingColor(false);
    }
  };

  const handlePowderCoatColorChange = (e) => {
    const colorId = e.target.value;
    if (colorId != "") {
      updateJobPowderCoatColor(colorId);
    }
  };

  useEffect(() => {
    loadPowderCoatColors();
  }, []);

  useEffect(() => {
    setSelectedPowderCoatColor(tenantList?.powderCoatColorId || "");
  }, [tenantList?.powderCoatColorId]);

  // Ensure the selected color is set after colors are loaded
  useEffect(() => {
    if (powderCoatColors.length > 0 && tenantList?.powderCoatColorId) {
      setSelectedPowderCoatColor(tenantList.powderCoatColorId);
    }
  }, [powderCoatColors, tenantList?.powderCoatColorId]);

  return (
    <div className="row">
      <div className="col-lg-3 col-6">
        <div className="additional_direction mt-0">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Address
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              lineHeight: 1.5,
              fontWeight: 400
            }}
          >
            {tenantList?.streetAddress}, {tenantList?.city}, {tenantList?.state}
            - {tenantList?.zipCode} ({tenantList?.label})
          </Typography>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="additional_direction mt-0">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Job Name
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }}
          >
            {tenantList?.jobName}
          </Typography>
        </div>
      </div>
      <div className="col-lg-2 col-6">
        <div className="additional_direction mt-0">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WorkIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Job Type
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }}
          >
            {tenantList?.jobTypeName}
          </Typography>
        </div>
      </div>
      <div className="col-lg-2">
        <div className="additional_direction mt-0">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Assigned Personnel
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }}
          >
            {tenantList?.assignedPersonnelName}
          </Typography>
        </div>
      </div>
      <div className="col-lg-2">
        <div className="additional_direction mt-0">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssignmentIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Job Status
            </Typography>
          </Box>
          <Chip
            label={tenantList?.jobStatusName}
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '0.02em'
            }}
          />
        </div>
      </div>

      <div className="col-lg-3">
        <div className="additional_direction">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Schedule Date & Time
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }}
          >
            {tenantList?.scheduledDate
              ? `${moment(tenantList.scheduledDate).format(
                  "MM-DD-YYYY"
                )} | ${moment(tenantList.scheduledDate).format("hh:mm A")}`
              : "N/A"}
          </Typography>
        </div>
      </div>
      <div className="col-lg-3">
        <div className="additional_direction">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssignmentIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Job Notes
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 400,
              fontStyle: tenantList?.notes ? 'normal' : 'italic'
            }}
          >
            {tenantList?.notes ? tenantList?.notes : "---"}
          </Typography>
        </div>
      </div>

      <div className="col-lg-3">
        <div className="additional_direction">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PaletteIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Powder Coating Color
            </Typography>
          </Box>
          <div className="position-relative">
            {loadingColors && <SelectBoxLoader />}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedPowderCoatColor}
                onChange={handlePowderCoatColorChange}
                disabled={updatingColor || !HasPermission("JobEdit")}
                displayEmpty
                sx={{ 
                  borderRadius: 1,
                  backgroundColor: 'white',
                  fontWeight: 500,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <MenuItem value="">Select Color</MenuItem>
                {powderCoatColors.map((color) => (
                  <MenuItem 
                    key={color.id} 
                    value={color.id}
                    sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}
                  >
                    {color.colorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {HasPermission("JobEdit") && (
        <div className="col-lg-3">
          <div className="additional_direction">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AppointmentIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.secondary,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Appointment Date & Time
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={childData?.scheduleDateTime ? <EditIcon /> : <AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                textTransform: 'none',
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 500,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                mt: 0.5,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}08`,
                }
              }}
            >
              {childData?.scheduleDateTime
                ? `${moment(childData.scheduleDateTime).format(
                    "MM-DD-YYYY"
                  )} | ${moment(childData.scheduleDateTime).format("hh:mm A")}`
                : "Add Appointment"}
            </Button>
          </div>
        </div>
      )}
      <div className="col-lg-3">
        <div className="additional_direction">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachmentIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mr: 0.5 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Attachments
            </Typography>
          </Box>
          <PreviewFiles file={tenantList?.attachmentsAny} />
        </div>
      </div>
      {open && (
        <Appointment
          open={open}
          handleclose={() => setOpen(false)}
          action={open}
          jobId={tenantList?.jobId}
          sendToParent={handleChildData}
        />
      )}
    </div>
  );
}

const PreviewFiles = ({ file, isdelete = false, handleImageDelelet }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {file &&
        file.length > 0 &&
        file.map((val, i) => {
          const fileExtension = val.split(".").pop().toLowerCase();
          const isImage = ["jpeg", "jpg", "png"].includes(fileExtension);
          return (
            <Box key={i} sx={{ position: 'relative' }}>
              <Paper
                component={Link}
                to={val.trim()}
                target="_blank"
                elevation={0}
                sx={{
                  p: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.grey[50],
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 8px ${theme.palette.primary.main}20`,
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {isImage ? (
                  <Box
                    component="img"
                    src={val}
                    alt={`Preview ${val}`}
                    sx={{
                      width: 30,
                      height: 30,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src="/image/file.svg"
                    alt="File preview"
                    sx={{ width: 24, height: 24 }}
                  />
                )}
              </Paper>
              {isdelete && (
                <IconButton
                  size="small"
                  onClick={() => handleImageDelelet(i)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      backgroundColor: '#fecaca',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 12 }} />
                </IconButton>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

function FormatPhoneNumber(input) {
  // Remove everything except numbers
  let cleaned = input?.replace(/\D/g, "");

  // Remove leading 1 if user manually typed it
  if (cleaned?.startsWith("1")) {
    cleaned = cleaned?.slice(1);
  }

  // Format based on how many digits the user typed
  if (cleaned?.length <= 3) {
    return `+1(${cleaned}`;
  } else if (cleaned?.length <= 6) {
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(3)}`;
  } else if (cleaned?.length <= 10) {
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(
      3,
      6
    )}-${cleaned?.slice(6)}`;
  } else {
    // Limit to 10 digits after +1
    cleaned = cleaned?.slice(0, 10);
    return `+1(${cleaned?.slice(0, 3)}) ${cleaned?.slice(
      3,
      6
    )}-${cleaned?.slice(6)}`;
  }
}

// Compact inline loading component for buttons and small areas
const InlineLoader = ({ size = 16, color = "inherit" }) => (
  <CircularProgress 
    size={size} 
    thickness={4}
    sx={{ 
      color: color,
      animation: 'none' // Remove default animation for smoother experience
    }} 
  />
);

// Enhanced loading overlay for conditional loading
const LoadingOverlay = ({ show }) => {
  if (!show) return null;
  
  return <ApiLoder />;
};

// Skeleton loader for table rows and content placeholders
const SkeletonLoader = ({ 
  lines = 3, 
  height = 40, 
  showAvatar = false 
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Box 
          key={index}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: index < lines - 1 ? 2 : 0 
          }}
        >
          {showAvatar && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.grey[200]
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                height: height / 2,
                backgroundColor: theme.palette.grey[200],
                borderRadius: 1,
                mb: 1,
                width: `${90 - index * 10}%`
              }}
            />
            <Box
              sx={{
                height: height / 3,
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
                width: `${70 - index * 5}%`
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export {
  ApiLoder,
  InlineLoader,
  LoadingOverlay,
  SkeletonLoader,
  ErrorMessage,
  SuccessMessage,
  CommonUploadImage,
  CustomMessages,
  FileType,
  AcceptFileType,
  SubmitButton,
  Delete,
  HasPermission,
  SelectBoxLoader,
  ColorList,
  BackButton,
  JobUi,
  PreviewFiles,
  FormatPhoneNumber,
};
