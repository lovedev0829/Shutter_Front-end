import React, { useEffect, useState } from "react";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import DynamicTable from "../../Form/DynamicTable";
import {
  TablePagination,
  Box,
  Paper,
  Container,
  Stack,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VersionHistory from "./VersionHistory";
import Search from "../../Form/Search";
import { useDebounce } from "use-debounce";
import GetAllContact from "../../../helpers/GetAllContact";
import GetAllEstimateContact from "../../../helpers/GetAllEstimateContact";
import SendApproved from "../Estimate/SendApproved";

export default function AllOrderList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tenantList, setTenantList] = useState([]);
  const [approved, setApproved] = useState(false);
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const [search, setsearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    contactId: "",
    estimateId: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });

  const TenantlistAPI = async (
    page,
    perpage,
    search,
    customerId,
    estimateId,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    setLoader(true);
    try {
      const body = {
        searchValue: search ? search : "",
        pageNo: page ? page : 1,
        recordPerPage: perpage ? perpage : 10,
        customerId: customerId ? customerId : "",
        status: 2,
        estimationId: estimateId ? estimateId : "",
        sortColumn: sortColumn ? sortColumn : "",
        sortDirection: sortDirection ? sortDirection : "asc",
        columnFilters: columnFilters || [],
      };
      const apiResponse = await callAPI(apiUrls.Order, {}, "POST", body);
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

  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  useEffect(() => {
    TenantlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.contactId,
      filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedSearchcolumn]);

  const columns = [
    { key: "orderNumber", label: "Order Number", link: true, sort: true },
    { key: "firstContactName", label: "Contact Name", link: true, sort: true },
    { key: "estimateName", label: "Estimate Title", sort: true },
    { key: "grandTotal", label: "Total Amount", sign: true, sort: true },
    { key: "createdDate", label: "Create Date" },
  ];

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.contactId,
      filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.contactId,
      filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  let navigate = useNavigate();

  const handleview = (item) => {
    navigate(`/contacts/order/preview/${item.orderId}`);
  };
  const edituser = (item) => {
    navigate(`/contacts/invoice/${item?.jobId}/${item?.orderId}`);
  };

  const handleVersion = (item) => {
    setObject(item);
    setHistory(true);
  };

   const handleApproved = (item) => {
    setObject(item);
    setApproved(true);
  };

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChanges = (e) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.name === "contactId" ? e.target.value : filter.contactId,
      e.target.name === "estimateId" ? e.target.value : filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handlecontact = (item) => {
    localStorage.setItem("activeTab", "#window-measurement");
    localStorage.setItem("activeTab2", "#pills-overview");
    const url = `/contacts/detail/${item?.contactId}`;
    navigate(url);
  };

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });

    TenantlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.contactId,
      filter.estimateId,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };

  const handlesearchChange = (columnKey, value = null) => {
    let updatedFilters = [...filter.columnFilters];
    if (value !== null) {
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
        columnFilters: updatedFilters,
      };
    });
  };

  const handlestatus = async () => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.SendInvoice, {}, "POST", {
        documentType: 2,
        templateId: null,
        contactId: object.contactId,
        estimationId: object.estimateId,
        orderId: object.orderId,
      });
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
        TenantlistAPI(
          page,
          rowsPerPage,
          search,
          filter.contactId,
          filter.estimateId,
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

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Box className="intersight_content">
        <Header title="All Orders" />
        <Box className="body_content">
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 1, sm: 2, md: 3 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                backgroundColor: 'background.paper',
                overflow: 'hidden',
              }}
            >
              {/* Page Header */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: { xs: 2, sm: 3 } }}
              >
                <TableTitle title="Orders" />
              </Stack>

              {/* Filters Section */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Search handleSearch={handleSearch} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <GetAllContact
                      value={filter.contactId}
                      fn={handleChanges}
                      load={true}
                      className="selectboxdropdown"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <GetAllEstimateContact
                      value={filter.estimateId}
                      fn={handleChanges}
                      ContactId={filter.contactId}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Data Table */}
              <Box sx={{ width: '100%' }}>
                <DynamicTable
                  data={tenantList}
                  columns={columns}
                  title="Orders"
                  viewUser={handleview}
                  rowActions={["version", "orderview", "editorder"]}
                  editpermission="JobView"
                  handleVersion={handleVersion}
                  handlecontact={handlecontact}
                  handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  edituser={edituser}
                  handlesearchChange={handlesearchChange}
                  handleApproved={handleApproved}
                />
                
                {/* Pagination */}
                {tenantList && tenantList?.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 2,
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
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          alignItems: "baseline",
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
      
      {/* Version History Modal */}
      {history && (
        <VersionHistory
          open={history}
          handleClose={() => setHistory(false)}
          EstimationId={object.estimateId}
        />
      )}

      {/* Send Approved Modal */}
      <SendApproved
        open={approved}
        handleClose={() => setApproved(false)}
        handlestatus={handlestatus}
        estimateId={object.orderId}
        isApproved={false}
        loder={loder}
        title={"Share Link Via Copy or Email Prospective Customer"}
        subtitle={
          "You can send this link via email and copy to send the customer"
        }
        url="/contacts/order/preview/"
      />
    </Box>
  );
}
