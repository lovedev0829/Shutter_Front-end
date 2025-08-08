import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TableTitle from "../../Form/TableTitle";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Link as MuiLink,
  useTheme,
  alpha,
  Fade,
  Skeleton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import LaunchIcon from '@mui/icons-material/Launch';
import UpdateIcon from '@mui/icons-material/Update';
import { styled } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  '& .MuiTable-root': {
    minWidth: 650,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  '&:last-child': {
    paddingRight: theme.spacing(3),
  },
  '&:first-of-type': {
    paddingLeft: theme.spacing(3),
  },
}));

const StyledTableHead = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: theme.spacing(2, 3),
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusSelect = styled(Select)(({ theme }) => ({
  minWidth: 140,
  fontSize: '0.875rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.divider, 0.5),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
}));

const CalendarCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  '& .rbc-calendar': {
    backgroundColor: 'transparent',
    fontFamily: theme.typography.fontFamily,
  },
  '& .rbc-header': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  },
  '& .rbc-month-view': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .rbc-date-cell': {
    padding: theme.spacing(1),
    fontWeight: 500,
  },
  '& .rbc-today': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '& .rbc-event': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 6,
    border: 'none',
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  '& .rbc-toolbar': {
    padding: theme.spacing(2, 3),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    '& button': {
      backgroundColor: 'transparent',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      color: theme.palette.primary.main,
      borderRadius: 6,
      padding: theme.spacing(0.5, 1.5),
      fontWeight: 500,
      fontSize: '0.875rem',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
      '&.rbc-active': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  },
}));

const NoDataBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 2),
  '& img': {
    maxWidth: 200,
    opacity: 0.6,
    marginBottom: theme.spacing(2),
  },
  '& p': {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    fontWeight: 500,
  },
}));

const JobIdChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

export default function Calendardashboard({ Apiload }) {
  const theme = useTheme();
  const [jobData, setJobData] = useState([]);
  const [loder, setLoader] = useState(false);
  const [JobStatus, setJobStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  const StatusList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setJobStatus(apiResponse?.data?.data);
      } else {
        setJobStatus([]);
      }
    } catch (error) {
      setJobStatus([]);
    }
  };

  const DashBoard = async () => {
    try {
      setLoader(true);
      const response = await callAPI(apiUrls.GetAllJobDetails, {}, "GET", {});
      setLoader(false);
      if (response?.data?.isSuccess) {
        setJobData(response?.data?.data);
      } else {
        ErrorMessage(response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    StatusList();
    DashBoard();
  }, []);

  // Convert jobData to events for the calendar
  const events = jobData.map((job) => ({
    title: `${job?.contactFirstName} ${job?.contactLastName} ${(job?.suffix ?? "")}`,
    start: new Date(job.scheduledDate),
    description: job.jobName,
    id: job.jobId,
    jobStatusName: job.jobStatusName,
  }));

  // Customize the event display
  const eventPropGetter = (event) => {
    let backgroundColor = theme.palette.primary.main;
    let color = "#ffffff";
    
    switch (event.jobStatusName) {
      default:
        backgroundColor = theme.palette.primary.main;
        color = "#ffffff";
    }

    return {
      style: {
        backgroundColor,
        color,
        border: 'none',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: '0.75rem',
        fontWeight: 500,
      },
    };
  };

  // Render the event details in a tooltip
  const EventDetails = ({ event }) => (
    <Tooltip title={event.description || "No description"} arrow>
      <Box sx={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '100%'
      }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {event.title}
        </Typography>
      </Box>
    </Tooltip>
  );

  const handleChnage = async (value, jobid, jobstatus) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to change the job status?"
    );
    if (isConfirmed) {
      setLoader(true);
      setSelectedStatus((prev) => ({ ...prev, [jobid]: value }));
      try {
        const response = await callAPI(apiUrls.UpdateJobStatus, {}, "POST", {
          jobId: jobid,
          jobStatus: value,
        });
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data.message);
          DashBoard();
          Apiload();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      value = selectedStatus[jobid] || jobstatus;
    }
  };

  const navigate = useNavigate();

  const handleEventClick = (event) => {
    localStorage.setItem("activeTab", "#window-measurement");
    const jobId = event.id;
    const url = `/contacts/job/${jobId}`;
    navigate(url);
  };

  const TableSkeleton = () => (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['Job ID', 'Contact Name', 'Job Name', 'Start Date', 'Status Change Date', 'Status'].map((header) => (
              <StyledTableHead key={header}>
                <Skeleton variant="text" width="100%" />
              </StyledTableHead>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(6)].map((_, cellIndex) => (
                <StyledTableCell key={cellIndex}>
                  <Skeleton variant="text" width="100%" />
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );

  return (
    <Box>
      <ApiLoder open={loder} />
      
      <Fade in timeout={600}>
        <Box>
          {/* Jobs Table */}
          {loder ? (
            <TableSkeleton />
          ) : (
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHead>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ fontSize: 18 }} />
                        Job ID
                      </Box>
                    </StyledTableHead>
                    <StyledTableHead>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                        Contact Name
                      </Box>
                    </StyledTableHead>
                    <StyledTableHead>Job Name</StyledTableHead>
                    <StyledTableHead>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 18 }} />
                        Start Date
                      </Box>
                    </StyledTableHead>
                    <StyledTableHead>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UpdateIcon sx={{ fontSize: 18 }} />
                        Status Change Date
                      </Box>
                    </StyledTableHead>
                    <StyledTableHead>Status</StyledTableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData?.map((val, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>
                        <JobIdChip
                          label={val?.jobUniqueCode}
                          component={Link}
                          to={`/contacts/job/${val.jobId}`}
                          onClick={() => {
                            localStorage.setItem("activeTab", "#window-measurement");
                          }}
                          clickable
                          icon={<LaunchIcon sx={{ fontSize: 14 }} />}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <MuiLink
                          component={Link}
                          to={`/contacts/detail/${val.contactId}`}
                          onClick={() => {
                            localStorage.setItem("activeTab2", "#pills-overview");
                          }}
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {val?.contactFirstName} {val?.contactLastName} {(val?.suffix ?? "")}
                        </MuiLink>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {val?.jobName}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2">
                          {val?.scheduledDate
                            ? `${moment(val?.scheduledDate).format("MM-DD-YYYY")} | ${moment(val?.scheduledDate).format("hh:mm A")}`
                            : "---"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2">
                          {moment(val?.updatedAt).format("MM-DD-YYYY") || ""}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <FormControl size="small">
                          <StatusSelect
                            value={selectedStatus[val.jobId] || val.jobStatus}
                            onChange={(e) =>
                              handleChnage(e.target.value, val.jobId, val.jobStatus)
                            }
                            variant="outlined"
                          >
                            {JobStatus?.map((vals, i) => (
                              <MenuItem key={i} value={vals.jobStatusId}>
                                {vals?.jobStatusName}
                              </MenuItem>
                            ))}
                          </StatusSelect>
                        </FormControl>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {(!jobData || jobData?.length === 0) && !loder && (
                    <TableRow>
                      <StyledTableCell colSpan={6}>
                        <NoDataBox>
                          <img
                            src="/image/no-records.svg"
                            alt="No Records"
                            loading="lazy"
                          />
                          <Typography variant="body1" color="textSecondary">
                            No Records Found
                          </Typography>
                        </NoDataBox>
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}

          {/* Calendar Section */}
          <CalendarCard>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Jobs Schedule
                  </Typography>
                </Box>
              }
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="start"
                style={{ height: 500, fontFamily: theme.typography.fontFamily }}
                eventPropGetter={eventPropGetter}
                components={{
                  event: EventDetails,
                }}
                onSelectEvent={handleEventClick}
                popup
                showMultiDayTimes
                step={60}
                views={['month', 'week', 'day']}
                defaultView="month"
                messages={{
                  next: "Next",
                  previous: "Previous",
                  today: "Today",
                  month: "Month",
                  week: "Week",
                  day: "Day"
                }}
              />
            </CardContent>
          </CalendarCard>
        </Box>
      </Fade>
    </Box>
  );
}
