import React, { useEffect } from 'react'
import Header from '../../../Layout/header'
import { useState } from 'react'
import TableTitle from '../../Form/TableTitle'
import DynamicTable from '../../Form/DynamicTable'
import Search from '../../Form/Search'
import AddEditButton from '../../Form/AddEditButton'
import { apiUrls } from '../../../utils/apiUrls'
import { callAPI } from '../../../utils/apiUtils'
import { 
  Container,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  TablePagination,
  useTheme,
  useMediaQuery
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddEditOption from './AddEditOption'
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common'
import { useDebounce } from "use-debounce";
import ProductTypeDropdown from '../../../helpers/ProductTypeDropdown'
import StatusDropdown from '../../../helpers/StatusDropdown'


export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("")
  const [object, setObject] = useState("")
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [OptionsList, setOptionsList] = useState([]);
  const [search, setsearch] = useState('');
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false)
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({status:"2",productType:"",sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],});

  const columns = [
      { key: 'productTypeName', label: 'Product Type', sort: true },
         { key: 'productName', label: 'Product', sort: true },
      {key:'optionName', label: 'Options Name', sort: true},
    { key: 'options', label: 'Option Type' },
    { key: 'isActive', label: 'Status' }
  ];



  const handleSearch = (value)=>{
        setsearch(value)
  }

 

  const handleChangePage = (event, newPage) => {
    OptionslistAPI(newPage + 1, rowsPerPage, search,filter.productType,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    OptionslistAPI(pageNo, parseInt(event.target.value, 10), search,filter.productType,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const OptionslistAPI = async (page,perpage,serach,productType,status,sortColumn,sortDirection,columnFilters) => {
    let query={searchValue:serach?serach:"",pageNo:page?page:1,recordPerPage:perpage?perpage:10,tenantId:"",productType:productType,status:status,
       sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      isManageProductOption:false,
      columnFilters:columnFilters || []
    }
      setLoader(true)
      try {
        const apiResponse = await callAPI(apiUrls.Option,{}, "POST",query);
       setLoader(false)
      if (apiResponse?.data?.isSuccess) {
           setOptionsList(apiResponse?.data?.data)
          setPaginatedItems(apiResponse?.data?.totalRecords)
      } else {
        setOptionsList([])
        ErrorMessage(apiResponse?.data?.message)
      }
      } catch (error) {
       setLoader(false) 
      }
  }
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    OptionslistAPI(1, rowsPerPage, debouncedSearch,filter.productType,filter.status, filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn)
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn])

  const handleclose = () => {
    setOpen(false)
    setObject("")
    OptionslistAPI(page, rowsPerPage,search,filter.productType,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
  }

  const handleapi = () => {
         let pageNo = 1;
        OptionslistAPI(pageNo, rowsPerPage,search,filter.productType,filter.status,
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

  }


  const handleDelete = async (id) => {
    setLoader(true)
    try{
     const response = await callAPI(apiUrls.OptionDelete,{Id:id},'POST',{})
     setLoader(false)
     if(response.data.isSuccess){
      handledelclose();
      SuccessMessage(response.data.message)
      let pageNo = 1;
      OptionslistAPI(pageNo, rowsPerPage,search,filter.productType,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
      setPage(pageNo);
     }else{
      ErrorMessage(response.data.message)
     }
    }catch(error){
      setLoader(false)
    }
  }

  const handledelete = (item) => {
    setDelOpen(true)
    setObject(item)
  }

  const handlestatus = async (item) => {
    setLoader(true)
    try{
     const response = await callAPI(apiUrls.OptionActiveInActive,{Id:item.optionId},'POST',{})
     setLoader(false)
     if(response.data.isSuccess){
      SuccessMessage(response.data.message)
      OptionslistAPI(page, rowsPerPage,search,filter.productType,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
     }else{
      ErrorMessage(response.data.message)
     }
    }catch(error){
      setLoader(false)
    }
  }

  const handleChange = (e) => {
    let pageNo = 1;
    OptionslistAPI(pageNo, rowsPerPage,search,e.target.name === 'productType' ? e.target.value : filter.productType,e.target.name === 'status' ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
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

    OptionslistAPI(
     1, rowsPerPage,search,filter.productType,filter.status,
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
      <ApiLoder open={loder} />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }} className="intersight_content">
        <Header title="Options" />
        
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Paper 
            elevation={1}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            {/* Header Section */}
            <Box 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 2, sm: 1 }
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { 
                    xs: '1.25rem', 
                    sm: '1.5rem', 
                    md: '1.75rem' 
                  }
                }}
              >
                Manage Options
              </Typography>
              
              {HasPermission("OptionsAdd") && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setAction("add")
                    setOpen(true)
                  }}
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1 },
                    px: { xs: 2, sm: 2 },
                    minWidth: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Add Option
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {/* Filters Section */}
            <Card 
              variant="outlined" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                backgroundColor: 'background.default'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Search & Filters
                </Typography>
                
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Search handleSearch={handleSearch} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatusDropdown value={filter.status} fn={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <ProductTypeDropdown
                      value={filter.productType}
                      fn={handleChange}
                      load={true}
                      className="selectboxdropdown"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Table Section */}
            <Card variant="outlined">
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <DynamicTable 
                    data={OptionsList} 
                    columns={columns}  
                    title="Options" 
                    rowActions={['edit', 'delete']} 
                    edituser={handleedit} 
                    handledelete={handledelete} 
                    handlestatus={handlestatus}
                    deletepermission="OptionsDelete" 
                    editpermission="OptionsEdit"  
                    handleFilterSortChange={handleFilterSortChange}
                    sortColumn={filter.sortColumn}
                    sortDirection={filter.sortDirection}
                    columnFilters={filter.columnFilters}
                    handlesearchChange={handlesearchChange} 
                  />
                </Box>
                
                {/* Pagination */}
                {OptionsList && OptionsList?.length > 0 && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-end' },
                      alignItems: 'center',
                      p: { xs: 1, sm: 2 },
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.default'
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
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        },
                        '& .MuiTablePagination-select': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        },
                        '& .MuiIconButton-root': {
                          padding: { xs: '4px', sm: '8px' }
                        }
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Container>
      </Box>

      {/* Modals */}
      {open && (
        <AddEditOption 
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
          title={object.optionName} 
          id={object?.optionId} 
          handleDelete={handleDelete} 
          loder={loder}
        />
      )}
    </>
  )
}
