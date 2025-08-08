import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  Paper,
  Divider,
  CardActions,
  Badge,
  Fab,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ResponsivePageTemplate,
  ResponsiveCardGrid,
  ResponsivePageTitle,
  ResponsiveCardTitle,
  ResponsiveBodyText,
  ResponsiveCaptionText,
  responsiveFontSizes
} from '../../Layout';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  StickyNote2 as NotesIcon,
  AttachFile as AttachmentIcon,
  Assessment as EstimateIcon,
  Window as WindowIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddEditJob from "./AddEditJob";
import FilterJob from "./FilterJob";


// Modern Pagination Component
function ModernPagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange, 
  onItemsPerPageChange 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        mt: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        {/* Results Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing <strong>{startItem}-{endItem}</strong> of <strong>{totalItems}</strong> jobs
          </Typography>
        </Box>

        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Items per page selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Show:
            </Typography>
            <Select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(e.target.value)}
              size="small"
              sx={{
                minWidth: 70,
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontSize: '14px'
                }
              }}
            >
              {[5, 10, 15, 25, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Modern Pagination */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPagination-ul': {
                gap: 0.5,
              },
              '& .MuiPaginationItem-root': {
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderColor: 'primary.main',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

// Job Status Progress Component
function JobProgress({ steps, stagesList }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        {steps.map((step, index) => (
          <Tooltip key={index} title={step.tooltip}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 
                  step.status === 'active' ? 'success.main' :
                  step.status === 'Abandon' ? 'primary.main' : 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {step.status === 'active' || step.status === 'Abandon' ? '✓' : index + 1}
            </Box>
          </Tooltip>
        ))}
      </Box>
      <LinearProgress
        variant="determinate"
        value={(steps.filter(s => s.status === 'active' || s.status === 'Abandon').length / steps.length) * 100}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary.main',
          }
        }}
      />
    </Box>
  );
}

// Job Card Component
function JobCard({ job, onEdit, onDelete, onView, stagesList, jobStatus, navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getDynamicSteps = (currentStageId) => {
    return stagesList.map((stage, index) => ({
      status:
        stage.ghlStageId === currentStageId
          ? "active"
          : index < stagesList.findIndex(s => s.ghlStageId === currentStageId)
            ? "Abandon"
            : "disabled",
      tooltip: stage.ghlStageName,
    }));
  };

  const getDynamicStepsstaus = (currentjobStatusId) => {
    return jobStatus.map((stage, index) => ({
      status:
        stage.jobStatusId === currentjobStatusId
          ? "active"
          : index < jobStatus.findIndex(s => s.jobStatusId === currentjobStatusId)
            ? "Abandon"
            : "disabled",
      tooltip: stage.jobStatusName,
    }));
  };

  const steps = stagesList?.length > 0 ? getDynamicSteps(job?.ghL_StageId) : getDynamicStepsstaus(job?.jobStatus);

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Progress Indicator */}
        <JobProgress steps={steps} stagesList={stagesList} />
        
        {/* Job Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <ResponsiveCardTitle sx={{ mb: 0.5 }}>
              {job?.jobName}
            </ResponsiveCardTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary', mr: 0.5 }} />
              <ResponsiveCaptionText>
                {job?.streetAddress}, {job?.city}, {job?.state}-{job?.zipCode}
              </ResponsiveCaptionText>
            </Box>
            <Chip 
              icon={<BusinessIcon />}
              label={job?.label} 
              size="small" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
          
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
            }}
          >
            <MenuItem onClick={() => { onView(job); handleMenuClose(); }}>
              <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
              View Job
            </MenuItem>
            {HasPermission("JobEdit") && (
              <MenuItem onClick={() => { onEdit(job); handleMenuClose(); }}>
                <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                Edit
              </MenuItem>
            )}
            {HasPermission("JobDelete") && (
              <MenuItem onClick={() => { onDelete(job); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                Delete
              </MenuItem>
            )}
          </Menu>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Job Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Job Type
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {job?.jobTypeName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Assigned Personnel
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {job?.assignedPersonnelName}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Notes */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <NotesIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
              Relevant Notes
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {job?.notes || "No notes available"}
          </Typography>
        </Box>

        {/* Attachments */}
        {job?.attachmentsAny && job?.attachmentsAny?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachmentIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Attachments
              </Typography>
              <Chip label={job.attachmentsAny.length} size="small" sx={{ ml: 1, height: 20 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.attachmentsAny.map((attachment, i) => {
                const fileExtension = attachment.split(".").pop().toLowerCase();
                const isImage = ["jpeg", "jpg", "png"].includes(fileExtension);
                return (
                  <Paper
                    key={i}
                    component={Link}
                    to={attachment.trim()}
                    target="_blank"
                    sx={{
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      textDecoration: 'none',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    {isImage ? (
                      <img
                        src={attachment}
                        alt={`Preview ${attachment}`}
                        style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 2 }}
                      />
                    ) : (
                      <AttachmentIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    )}
                  </Paper>
                );
              })}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1}>
          {HasPermission("EstimateView") && (
            <Grid item xs={6}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EstimateIcon />}
                fullWidth
                onClick={() => {
                  navigate(`/contacts/job/${job?.jobId}`);
                  localStorage.setItem("activeTab", "#estimate");
                }}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Estimates
              </Button>
            </Grid>
          )}
          {HasPermission("EstimateAdd") && (
            <Grid item xs={6}>
              <Button
                variant="contained"
                size="small"
                startIcon={<WindowIcon />}
                fullWidth
                onClick={() => {
                  navigate(`/contacts/job/${job?.jobId}`);
                  localStorage.setItem("activeTab", "#window-measurement");
                }}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Windows
              </Button>
            </Grid>
          )}
        </Grid>
      </CardActions>
    </Card>
  );
}

export default function Joblist({ initialActiveTab }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [StagesList, setStagesList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [addresList, setaddressList] = useState([]);
  const [value, setValue] = useState({ address: "", jobStatus: "" });
  const [JobStatus, setJobStatus] = useState([]);
  const navigate = useNavigate();
  const param = useParams();

  const AddresslistAPI = async () => {
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllAddress,
        { ContactId: param.contactId },
        "GET"
      );

      if (apiResponse?.data?.isSuccess) {
        setaddressList(apiResponse?.data?.data);
      } else {
        setaddressList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    AddresslistAPI();
    // eslint-disable-next-line
  }, [initialActiveTab]);

  const TenantlistAPI = async (page, perpage, jobStatus, address) => {
    setLoader(true);
    let query = {
      tenantId: "",
      searchValue: param.contactId,
      pageNo: page,
      recordPerPage: perpage,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: jobStatus,
      address: address,
    };

    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, value.jobStatus, value.address); // Start from page 1
    // eslint-disable-next-line
  }, []);

  const CountryList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllStages, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setStagesList(apiResponse?.data?.data);
      } else {
        setStagesList([]);
      }
    } catch (error) {
      setStagesList([]);
    }
  };

  useEffect(() => {
    CountryList();
    // eslint-disable-next-line
  }, []);

  // Cleanup loader state on component unmount
  useEffect(() => {
    return () => {
      setLoader(false);
    };
  }, []);

  const handleChangePage = (newPage) => {
    TenantlistAPI(newPage, rowsPerPage, value.jobStatus, value.address);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    const pageNo = 1; // Reset to first page
    TenantlistAPI(pageNo, newRowsPerPage, value.jobStatus, value.address);
    setRowsPerPage(newRowsPerPage);
    setPage(pageNo);
  };

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    const pageNo = 1; // Reset to first page
    TenantlistAPI(pageNo, rowsPerPage, value.jobStatus, value.address);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    setAction("edit");
    setObject(item);
    setOpen(true);
  };

  const handleView = (item) => {
    navigate(`/contacts/job/${item?.jobId}`);
    localStorage.setItem("activeTab", "#window-measurement");
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.JobDelete, { Id: id }, "POST", {});
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        const pageNo = 1; // Reset to first page after delete
        TenantlistAPI(pageNo, rowsPerPage, value.jobStatus, value.address);
        setPage(pageNo);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handledelete = (item) => {
    setDelOpen(true);
    setObject(item);
  };

  const handleAddresschnage = (addressValue) => {
    setValue((val) => {
      return { ...val, address: addressValue };
    });
    const pageNo = 1; // Reset to first page when filtering
    TenantlistAPI(pageNo, rowsPerPage, value.jobStatus, addressValue);
    setPage(pageNo);
  };
  
  const handleStatuschange = (statusValue) => {
    setValue((val) => {
      return { ...val, jobStatus: statusValue };
    });
    const pageNo = 1; // Reset to first page when filtering
    TenantlistAPI(pageNo, rowsPerPage, statusValue, value.address);
    setPage(pageNo);
  };

  const GetSatus = (data) => {
    setJobStatus(data);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <ApiLoder open={loder} />
      
      <FilterJob
        addresList={addresList}
        handleAddresschnage={handleAddresschnage}
        handleStatuschange={handleStatuschange}
        value={value}
        GetSatus={GetSatus}
      />

      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WorkIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
            <ResponsivePageTitle sx={{ mb: 0 }}>
              Jobs
            </ResponsivePageTitle>
          </Box>
          
          {HasPermission("JobAdd") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setAction("add");
                setOpen(true);
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                fontSize: responsiveFontSizes.buttonText,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Create New Job
            </Button>
          )}
        </Stack>
      </Paper>

        {/* Jobs Grid */}
        <ResponsiveCardGrid 
          spacing={{ xs: 2, sm: 3 }}
          breakpoints={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        >
          {/* Create New Job Card */}
          {HasPermission("JobAdd") && (
            <Card 
              elevation={0}
              sx={{ 
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                height: { xs: 200, sm: 250, md: 300 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.50',
                  borderColor: 'primary.dark',
                }
              }}
              onClick={() => {
                setAction("add");
                setOpen(true);
              }}
            >
              <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                <Avatar 
                  sx={{ 
                    width: { xs: 48, sm: 56, md: 64 }, 
                    height: { xs: 48, sm: 56, md: 64 }, 
                    backgroundColor: 'primary.main',
                    mb: 2,
                    mx: 'auto'
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                </Avatar>
                <ResponsiveCardTitle sx={{ color: 'primary.main', mb: 1 }}>
                  Create New Job
                </ResponsiveCardTitle>
                <ResponsiveBodyText sx={{ color: 'text.secondary' }}>
                  Start a new job for this contact
                </ResponsiveBodyText>
              </Box>
            </Card>
          )}

          {/* Job Cards */}
          {tenantList?.map((job, i) => (
            <JobCard
              key={i}
              job={job}
              onEdit={handleedit}
              onDelete={handledelete}
              onView={handleView}
              stagesList={StagesList}
              jobStatus={JobStatus}
              navigate={navigate}
            />
          ))}

        </ResponsiveCardGrid>

        {/* No Records */}
        {(!tenantList || tenantList?.length === 0) && (
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, sm: 6 }, 
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mt: 3
            }}
          >
            <WorkIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.disabled', mb: 2 }} />
            <ResponsiveCardTitle sx={{ color: 'text.secondary', mb: 1 }}>
              No Jobs Found
            </ResponsiveCardTitle>
            <ResponsiveBodyText sx={{ color: 'text.disabled' }}>
              There are no jobs associated with this contact yet.
            </ResponsiveBodyText>
          </Paper>
        )}

        {/* Modern Pagination */}
        {tenantList && tenantList?.length > 0 && (
          <ModernPagination
            totalItems={paginatedItems}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
            onItemsPerPageChange={handleChangeRowsPerPage}
          />
        )}

      {/* Modals */}
      {open && (
        <AddEditJob
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={handleapi}
          object={object}
        />
      )}
      
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.jobName}
        id={object?.jobId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}
