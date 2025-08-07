import React, { useEffect, useState } from 'react'
import Header from '../../../Layout/header'
import TableTitle from '../../Form/TableTitle'
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common'
import AddEditButton from '../../Form/AddEditButton';
import StatusDropdown from '../../../helpers/StatusDropdown';
import DynamicTable from '../../Form/DynamicTable';
import AddEditDiscount from './AddEditDiscount';
import { apiUrls } from '../../../utils/apiUrls';
import { callAPI } from '../../../utils/apiUtils';
import { useDebounce } from 'use-debounce';
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
} from '@mui/material';
import Search from '../../Form/Search';

function Index() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("")
    const [object, setObject] = useState("")
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paginatedItems, setPaginatedItems] = useState(0);
    const [tenantList, setTenantList] = useState([]);
    const [search, setsearch] = useState('');
    const [loder, setLoader] = useState(false);
    const [delOpen, setDelOpen] = useState(false)
    const [debouncedSearch] = useDebounce(search, 500);
    const [filter, setFilter] = useState({ status: "2", region: "",sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],  });
    const columns = [
        { key: 'applyforName', label: 'Apply To', sort: true  },
        { key: 'firstName', label: 'Customer', sort: true  },
        { key: 'discountTypeName', label: 'Discount Type', sort: true  },
        { key: 'percentageDiscount', label: '% Discount', sort: true  },
        { key: 'fixedAmount', label: 'Fixed Amount', sort: true  },
        { key: 'couponCode', label: 'Discount Code', sort: true  },
        { key: 'startDate', label: 'Start Date' },
        { key: 'expiryDate', label: 'End Date' },
        { key: 'isActive', label: 'Status' },
    ];
    const handleclose = () => {
        setOpen(false)

    }
    const handleSearch = (value) => {
        setsearch(value)
    }
    const handleChangePage = (event, newPage) => {
        TenantlistAPI(newPage + 1, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        let pageNo = 1;
        TenantlistAPI(pageNo, parseInt(event.target.value, 10), search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(pageNo);
    };
    const TenantlistAPI = async (page, perpage, serach, status,sortColumn,sortDirection,columnFilters) => {
        let query = { searchValue: serach ? serach : "", pageNo: page ? page : 1, recordPerPage: perpage ? perpage : 10, status: status, region:"",
            sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
         }
        setLoader(true)
        try {
            const apiResponse = await callAPI(apiUrls.Discount, {}, "POST", query);
            setLoader(false)
            if (apiResponse?.data?.isSuccess) {
                setTenantList(apiResponse?.data?.data)
                setPaginatedItems(apiResponse?.data?.totalRecords)
            } else {
                setTenantList([])
                ErrorMessage(apiResponse?.data?.message)
            }
        } catch (error) {
            setLoader(false)

        }
    }
    const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
    useEffect(() => {
        TenantlistAPI(1, rowsPerPage, debouncedSearch, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn)
        setPage(1);
        // eslint-disable-next-line
    }, [debouncedSearch,debouncedSearchcolumn])



    const handleapi = () => {
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setPage(pageNo);
        setObject("")

    }

    const handleedit = (item) => {
        setAction("edit")
        setObject(item)
        setOpen(true);

    }

    const handledelclose = () => {
        setDelOpen(false)
        setObject("")

    }
    const handleDelete = async (id) => {

        setLoader(true)
        try {
            const response = await callAPI(apiUrls.DiscountDelete, { discountId: id }, 'POST', {})
            setLoader(false)
            if (response.data.isSuccess) {
                handledelclose();
                SuccessMessage(response.data.message)
                let pageNo = 1;
                TenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
                setPage(pageNo);
            } else {
                ErrorMessage(response.data.message)
            }
        } catch (error) {
            setLoader(false)
        }
    }
    const handledelete = (item) => {
        setDelOpen(true)
        setObject(item)
    }
    const handlestatus = async (item) => {
        setLoader(true)
        try {
            const response = await callAPI(apiUrls.DiscountActiveInActive, { discountId: item.discountId }, 'POST', {})
            setLoader(false)
            if (response.data.isSuccess) {
                SuccessMessage(response.data.message)
                TenantlistAPI(page, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
            } else {
                ErrorMessage(response.data.message)
            }
        } catch (error) {
            setLoader(false)
        }
    }

    const handleChange = (e) => {
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, search, e.target.name === "status" ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
        );
        setPage(1)
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

    TenantlistAPI(
   1, rowsPerPage, search, filter.status,
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
                <Header title="Discount" />
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
                                            <TableTitle title="Manage Discount" />
                                            {HasPermission("DiscountAdd") && (
                                                <AddEditButton 
                                                    handleClick={() => {
                                                        setAction("add");
                                                        setOpen(true);
                                                    }}
                                                    title={isMobile ? "Add Discount" : "Add Discount"}
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
                                            <Box sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                                                <StatusDropdown value={filter.status} fn={handleChange} />
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
                                                    data={tenantList} 
                                                    columns={columns} 
                                                    title="Discount" 
                                                    rowActions={['edit', 'delete']} 
                                                    edituser={handleedit} 
                                                    handledelete={handledelete}
                                                    deletepermission="DiscountDelete" 
                                                    editpermission="DiscountEdit" 
                                                    handlestatus={handlestatus} 
                                                    handleFilterSortChange={handleFilterSortChange}
                                                    sortColumn={filter.sortColumn}
                                                    sortDirection={filter.sortDirection}
                                                    columnFilters={filter.columnFilters}
                                                    handlesearchChange={handlesearchChange}
                                                />
                                                
                                                {/* Pagination */}
                                                {tenantList && tenantList?.length > 0 && (
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
                <AddEditDiscount 
                    open={open} 
                    handleclose={handleclose} 
                    action={action} 
                    LanguageListAPI={handleapi} 
                    object={object} 
                />
            )}
            {delOpen && (
                <Delete 
                    open={delOpen} 
                    handleClose={handledelclose}
                    title={(object.customerName === null || object.customerName === '') ? object.applyforName + `(${object.couponCode})` : object.customerName + `(${object.couponCode})`}
                    id={object?.discountId} 
                    handleDelete={handleDelete} 
                    loder={loder} 
                />
            )}
        </>
    )
}

export default Index