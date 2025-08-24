import React, { useEffect, useState } from 'react'
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common';
import { 
  TablePagination,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import AddEditJobShedule from './AddEditJobShedule';
import AddEditButton from '../../Form/AddEditButton';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import StatusDropdown from '../../../helpers/StatusDropdown';
import { PageHeader, EmptyState } from '../../Form/MaterialUIComponents';
export default function Jobschedulelist({listdata}) {
  const param = useParams()

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [filter, setFilter] = useState({ status: "2", tenantId: "" });

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, tenantId, status) => {
    let query = {
      searchValue: param?.JobId,
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      productType: "",
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.JobSchedule, {}, "POST", query);
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
    TenantlistAPI(1, rowsPerPage, filter.tenantId, filter.status);
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
    setPage(pageNo);
    setObject("");
  };

  const handleedit = (item) => {
    setAction("edit");
    setObject(item);
    setOpen(true);
  };

  const handledelclose = () => {
    setDelOpen(false);
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.JobScheduleDelete,
        { JobScheduleId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
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
  const handleStatus = async (item) => {
    setLoader(true)
    try {
      const response = await callAPI(apiUrls.JobScheduleActiveInActive, { JobScheduleId: item.scheduleJobId }, 'POST', {})
      setLoader(false)
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message)
        TenantlistAPI(page, rowsPerPage, filter.tenantId, filter.status);
      } else {
        ErrorMessage(response.data.message)
      }
    } catch (error) {
      setLoader(false)
    }

  }
  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, e.target.name === 'tenantId' ? e.target.value : filter.tenantId, e.target.name === 'status' ? e.target.value : filter.status);
    setPage(1)
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const Loginuser = JSON.parse(localStorage.getItem("userData"));
  
  return (
    <Box sx={{ p: 3 }}>
      <ApiLoder open={loder} />

      <PageHeader
        title="Job Schedule"
        subtitle="Manage and track job schedules and appointments"
        actions={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter.status}
                label="Status"
                name="status"
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="2">All</MenuItem>
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
            {HasPermission("JobScheduleAdd") && listdata?.tenantId === Loginuser?.tenantId && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
              setAction("add");
              setOpen(true);
            }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 3
                }}
              >
                Create Schedule
              </Button>
            )}
          </Box>
        }
      />

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>SN</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estimate Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Resource Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>GHL User Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
              {(HasPermission("JobScheduleEdit") || HasPermission("JobScheduleDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tenantList?.map((item, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { backgroundColor: 'grey.50' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item?.estimateName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item?.jobTitle}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{item?.userFullname}</TableCell>
                <TableCell>{item?.ghlUserName}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {moment(item?.startDate).format("MM-DD-YYYY")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={moment(item?.dayStartTime,"HH:mm:ss").format("hh:mm A")} 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {moment(item?.endDate).format("MM-DD-YYYY")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={moment(item?.dayEndDateTime,"HH:mm:ss").format("hh:mm A")} 
                    size="small" 
                    variant="outlined" 
                    color="secondary"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={item?.isActive === true ? "Active" : "Inactive"}
                    size="small"
                    color={item?.isActive === true ? "success" : "default"}
                    variant={item?.isActive === true ? "filled" : "outlined"}
                    clickable={listdata?.tenantId === Loginuser?.tenantId}
                    onClick={() => listdata?.tenantId === Loginuser?.tenantId ? handleStatus(item) : null}
                    sx={{
                      fontWeight: 500,
                      minWidth: 80,
                      cursor: listdata?.tenantId === Loginuser?.tenantId ? 'pointer' : 'default'
                    }}
                  />
                </TableCell>
                {(HasPermission("JobScheduleEdit") || HasPermission("JobScheduleDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {HasPermission("JobScheduleEdit") && (
                        <IconButton
                          size="small"
                          onClick={() => handleedit(item)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.light' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {HasPermission("JobScheduleDelete") && (
                        <IconButton
                          size="small"
                          onClick={() => handledelete(item)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'error.light' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {(!tenantList || tenantList?.length === 0) && (
              <TableRow>
                <TableCell 
                  colSpan={11} 
                  sx={{ border: 0, py: 6 }}
                >
                  <EmptyState
                    icon={
                      <Box
                        component="img"
                        src="/image/no-records.svg"
                        alt="No records"
                        sx={{ width: 80, height: 80, opacity: 0.5 }}
                      />
                    }
                    title="No Job Schedules Found"
                    description="There are no job schedules available yet."
                    action={
                      HasPermission("JobScheduleAdd") && listdata?.tenantId === Loginuser?.tenantId && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setAction("add");
                            setOpen(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 2,
                            px: 3
                          }}
                        >
                          Create Schedule
                        </Button>
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

          {tenantList && tenantList?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 25, 100]}
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
        )}
      </TableContainer>
      {open &&<AddEditJobShedule
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
        jobid={param?.JobId}
      />
}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.jobTitle}
        id={object?.scheduleJobId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </Box>
  )
}
