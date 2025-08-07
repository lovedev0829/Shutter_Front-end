import React, { useEffect } from "react";
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
  Container,
  Card,
  CardContent,
  Paper,
  Stack,
  Backdrop,
  CircularProgress,
  useTheme,
  useMediaQuery
} from "@mui/material";
import AddEditPowderCoatColor from "./AddEditPowderCoatColor";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [powderCoatColorList, setPowderCoatColorList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });

  const columns = [
    { key: "colorName", label: "Color Name", sort: true },
    { key: "cost", label: "Cost", sign: true, sort: true },
    { key: "description", label: "Description", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    getPowderCoatColorsAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    getPowderCoatColorsAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const getPowderCoatColorsAPI = async (page, perpage, serach, sortColumn, sortDirection, columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.GetAllPowderCoatColor, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setPowderCoatColorList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setPowderCoatColorList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  useEffect(() => {
    getPowderCoatColorsAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedSearchcolumn]);

  const handleclose = () => {
    setOpen(false);
  };

  const refreshPowderCoatColorList = () => {
    let pageNo = 1;
    getPowderCoatColorsAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
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
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.PowderCoatColorDelete,
        { powderCoatColorId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        getPowderCoatColorsAPI(
          pageNo,
          rowsPerPage,
          search,
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
        apiUrls.PowderCoatColorActiveInActive,
        { powderCoatColorId: item.id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        let pageNo = 1;
        getPowderCoatColorsAPI(
          pageNo,
          rowsPerPage,
          search,
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

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });

    getPowderCoatColorsAPI(
      1,
      rowsPerPage,
      search,
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

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <div className="intersight_content">
        <Header title="Powder Coat Colors" />
        <div className="body_content">
          <div className="contact-profile">
            <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0 }}>
              <Container 
                maxWidth="xl" 
                sx={{ 
                  py: isMobile ? 1 : 3,
                  px: isMobile ? 1 : 3
                }}
              >
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
                    {/* Header Section */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={2}
                      sx={{ mb: isMobile ? 2 : 3 }}
                    >
                      <TableTitle title="Manage Powder Coat Colors" />
                      {HasPermission("PowderCoatColorAdd") && (
                        <AddEditButton
                          handleClick={() => {
                            setAction("add");
                            setOpen(true);
                          }}
                          title={isMobile ? "Add Color" : "Add Color"}
                        />
                      )}
                    </Stack>
                    {/* Filters Section */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{ mb: isMobile ? 2 : 3 }}
                    >
                      <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                        <Search handleSearch={handleSearch} />
                      </Box>
                    </Stack>

                    {/* Table Section */}
                    <Box sx={{ mb: isMobile ? 2 : 3 }}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          borderRadius: 2, 
                          overflow: 'hidden',
                          '& .table-responsive': {
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': {
                              height: 8,
                            },
                            '&::-webkit-scrollbar-track': {
                              backgroundColor: '#f1f1f1',
                              borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: '#c1c1c1',
                              borderRadius: 4,
                              '&:hover': {
                                backgroundColor: '#a8a8a8',
                              },
                            },
                          }
                        }}
                      >
                        <DynamicTable
                          data={powderCoatColorList}
                          columns={columns}
                          title="Powder Coat Color"
                          rowActions={["edit", "delete"]}
                          edituser={handleedit}
                          handledelete={handledelete}
                          handlestatus={handlestatus}
                          deletepermission="PowderCoatColorDelete"
                          editpermission="PowderCoatColorEdit"
                          handleFilterSortChange={handleFilterSortChange}
                          sortColumn={filter.sortColumn}
                          sortDirection={filter.sortDirection}
                          columnFilters={filter.columnFilters}
                          handlesearchChange={handlesearchChange}
                        />
                        
                        {/* Pagination */}
                        {powderCoatColorList && powderCoatColorList?.length > 0 && (
                          <Box sx={{
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            p: isMobile ? 1 : 2,
                            borderTop: 1,
                            borderColor: 'divider',
                          }}>
                            <TablePagination
                              rowsPerPageOptions={isMobile ? [10, 25, 50] : [10, 25, 50, 100]}
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
                                  fontSize: isMobile ? '12px' : '14px',
                                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                                },
                                '& .MuiTablePagination-selectLabel': {
                                  fontSize: isMobile ? '12px' : '14px',
                                  marginBottom: isMobile ? '4px' : 0,
                                },
                                '& .MuiTablePagination-displayedRows': {
                                  fontSize: isMobile ? '12px' : '14px',
                                  marginBottom: isMobile ? '4px' : 0,
                                },
                                '& .MuiTablePagination-select': {
                                  fontSize: isMobile ? '12px' : '14px',
                                },
                                '& .MuiTablePagination-actions': {
                                  marginLeft: isMobile ? '8px' : '20px',
                                },
                                '& .MuiIconButton-root': {
                                  padding: isMobile ? '4px' : '12px',
                                }
                              }}
                            />
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Container>
            </Box>
          </div>
        </div>
      </div>
      {open && (
        <AddEditPowderCoatColor
          open={open}
          handleClose={handleclose}
          action={action}
          PowderCoatColorListAPI={refreshPowderCoatColorList}
          selectedData={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.colorName}
          id={object?.id}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
