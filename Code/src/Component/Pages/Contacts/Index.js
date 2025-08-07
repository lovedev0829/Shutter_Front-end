import React, { useEffect, useMemo } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import DynamicTable from "../../Form/DynamicTable";
import Search from "../../Form/Search";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { 
  TablePagination, 
  Box, 
  Paper, 
  Stack, 
  useTheme, 
  useMediaQuery,
  Grid
} from "@mui/material";
import AddEditContact from "./AddEditContact";
import { ResponsiveContainer } from "../../Layout/ResponsiveLayout";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router";
import PartnerDropdown from "../../../helpers/PartnerDropdown";
import StatusDropdown from "../../../helpers/StatusDropdown";
import ImportFile from "../../../helpers/ImortFile";
import ExportFile from "../../../helpers/ExportFile";
import SampleDownload from "../../../helpers/SampleDownload";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [ContactsList, setContactsList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const [filter, setFilter] = useState({
    status: "2",
    tenantId: "",
    sortColumn: "",
    sortDirection: "asc",
     columnFilters: [],
  });

    const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  const defaultState = useMemo(
    () => ({
      name: "",
      contactType: "",
      phoneNumber: "",
      email: "",
      referral: "",
      website: "",
      notes: "",
      refral: "",
      isBillingAddressSameAsAddress: false,
      billingAddressVm: {
        fullName: "",
        phoneNumber: "",
        email: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
      isTaxExemption: true,
      taxExemptionVm: {
        exemptionCertificate: "",
        effectiveDate: null,
        expiryDate: null,
      },
    }),
    []
  );

  const columns = [
    { key: "firstName", label: "Name", link: true, sort: true },
    { key: "contactUniqueId", label: "Code", sort: true },
    { key: "contactType", label: "Type", sort: true },
    { key: "phoneNumber", label: "Phone No.", phoneformate: true, sort: true },
    { key: "email", label: "Email Address", sort: true },
    { key: "referral", label: "Referral Source", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    ContactlistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    ContactlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const ContactlistAPI = async (page, perpage, serach, tenantId, status,sortColumn,sortDirection,columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId,
      status: status,
      sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Contact, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setContactsList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setContactsList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    ContactlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn]);

  // Cleanup loader state on component unmount
  useEffect(() => {
    return () => {
      setLoader(false);
    };
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject(defaultState);
  };

  const refreshContactlistAPI = () => {
    let pageNo = 1;
    ContactlistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.tenantId,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(pageNo);
    setObject(defaultState);
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
        apiUrls.ContactDelete,
        { ContactId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        ContactlistAPI(
          pageNo,
          rowsPerPage,
          search,
          filter.tenantId,
          filter.status,
          filter.sortColumn,
          filter.sortDirection,
          filter.columnFilters
        );
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

  const handlestatus = async (item) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.ContactActiveInActive,
        { ContactId: item.contactId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        ContactlistAPI(
          page,
          rowsPerPage,
          search,
          filter.tenantId,
          filter.status,
          filter.sortColumn,
          filter.sortDirection,
          filter.columnFilters
        );
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  let navigate = useNavigate();

  const handleview = (item) => {
    navigate(`/contacts/detail/${item.contactId}`);
  };

  const handleChange = (e) => {
    let pageNo = 1;
    ContactlistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.name === "tenantId" ? e.target.value : filter.tenantId,
      e.target.name === "status" ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    let pageNo = 1;
    ContactlistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.tenantId,
      filter.status,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };
  
const handlesearchChange = (columnKey, value = null) => {
  let updatedFilters = [...filter.columnFilters];
  if (value !== null) {

     if (columnKey === 'phoneNumber') {
      value = value.replace(/[()\-\s]/g, ''); // remove (, ), -, and spaces
    }
      
    
    const index = updatedFilters.findIndex((f) => f.field === columnKey);
    if (index > -1) {
      updatedFilters[index].value = value;
    } else {
      updatedFilters.push({ field: columnKey, value });
    }
  }
       

  setFilter((val) => {
      return {
        ...val,
        columnFilters: updatedFilters
      };
    });
  
};

  

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <ApiLoder open={loder} />
      <Box className="intersight_content">
        <Header title="Contacts" />
        <Box className="body_content">
          <ResponsiveContainer 
            maxWidth="xl"
            disableGutters={false}
            sx={{ 
              py: { xs: 1, sm: 2, md: 3 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: 'background.paper',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            {/* Header Section */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <TableTitle title="Manage Contacts" />
              
              {!filter.tenantId && HasPermission("ContactAdd") && (
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <AddEditButton
                    handleClick={() => {
                      setAction("add");
                      setOpen(true);
                    }}
                    title="Add New Contact"
                  />
                </Box>
              )}
            </Stack>

            {/* Filters Section */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              {/* First Row - Search and Filters */}
              <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 1.5, sm: 2 } }}>
                {/* Search */}
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <Box sx={{ width: '100%' }}>
                    <Search handleSearch={handleSearch} />
                  </Box>
                </Grid>
                
                {/* Status Dropdown */}
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <Box sx={{ width: '100%' }}>
                    <StatusDropdown value={filter.status} fn={handleChange} />
                  </Box>
                </Grid>
                
                {/* Partner Dropdown */}
                {HasPermission("SubTenantView") && (
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Box sx={{ width: '100%' }}>
                      <PartnerDropdown value={filter.tenantId} fn={handleChange} />
                    </Box>
                  </Grid>
                )}
                
                {/* Spacer for alignment */}
                <Grid item xs={12} sm={6} md={3} lg={3} />
              </Grid>

              {/* Second Row - Action Buttons */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.5, sm: 2 },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                {HasPermission("ContactAdd") && (
                  <ImportFile LanguageListAPI={refreshContactlistAPI} type="contact" />
                )}
                <ExportFile
                  type="contact"
                  serach={search}
                  page={page}
                  perpage={rowsPerPage}
                  tenantId={filter.tenantId}
                  status={filter.status}
                  Url={apiUrls.ExportContacts}
                  jobStatus={""}
                />
                <SampleDownload type="contact" />
              </Box>
            </Box>

            {/* Table Section */}
            <Box
              sx={{
                width: '100%',
                overflowX: { xs: 'auto', md: 'visible' },
                '& .table-responsive': {
                  overflowX: { xs: 'auto', md: 'visible' }
                },
                '& .MuiTable-root': {
                  minWidth: { xs: 700, md: 'auto' },
                  width: '100%'
                }
              }}
            >
              <DynamicTable
                data={ContactsList}
                columns={columns}
                title="Contact"
                rowActions={filter.tenantId ? [] : ["edit", "delete", "view"]}
                edituser={handleedit}
                handledelete={handledelete}
                handlestatus={handlestatus}
                deletepermission="ContactDelete"
                editpermission="ContactEdit"
                viewUser={handleview}
                handleFilterSortChange={handleFilterSortChange}
                sortColumn={filter.sortColumn}
                sortDirection={filter.sortDirection}
                columnFilters={filter.columnFilters}
                handlesearchChange={handlesearchChange}
              />
              
              {/* Pagination */}
              {ContactsList && ContactsList?.length > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    mt: { xs: 1.5, sm: 2 },
                    '& .MuiTablePagination-root': {
                      overflow: 'visible'
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    },
                    '& .MuiTablePagination-actions button': {
                      padding: { xs: '4px', sm: '8px' }
                    }
                  }}
                >
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-toolbar': {
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: { xs: 1, sm: 0 }
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
          </ResponsiveContainer>
        </Box>
      </Box>
      
      {/* Modals */}
      {open && (
        <AddEditContact
          open={open}
          handleclose={handleclose}
          action={action}
          LanguageListAPI={refreshContactlistAPI}
          object={object}
        />
      )}
      
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={
            object?.firstName +
            " " +
            object?.lastName +
            " " +
            (object?.suffix ?? "")
          }
          id={object?.contactId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </Box>
  );
}
