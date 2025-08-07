import React, { useEffect } from "react";
import { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  TablePagination,
  Backdrop,
  CircularProgress
} from "@mui/material";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import DynamicTable from "../../Form/DynamicTable";
import Search from "../../Form/Search";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import AddEditProduct from "./AddEditProduct";
import {
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import StatusDropdown from "../../../helpers/StatusDropdown";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [ProductsList, setProductsList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ status: "2", productType: "",sortColumn: "",
    sortDirection: "asc",
    columnFilters: [], });

  const columns = [
    { key: "productName", label: "Name" , link:true, sort: true  },
    { key: "productTypeName", label: "Product Type", sort: true  },
    { key: "markup", label: "Markup %", sort: true  },
    // { key: 'notes', label: 'Notes' },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    ProductslistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.productType,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    ProductslistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.productType,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const ProductslistAPI = async (page, perpage, serach, productType, status,sortColumn,sortDirection,columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      productType: productType,
      status: status,
      sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Product, {}, "POST", query);
    setLoader(false);
    if (apiResponse?.data?.isSuccess) {
      setProductsList(apiResponse?.data?.data);
      setPaginatedItems(apiResponse?.data?.totalRecords);
    } else {
      setProductsList([]);
      ErrorMessage(apiResponse?.data?.message)
    }
    } catch (error) {
     setLoader(false) 
    }
  };
   const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    ProductslistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.productType,
      filter.status,
       filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn]);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handleapi = () => {
    let pageNo = 1;
    ProductslistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.productType,
      filter.status,
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
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.ProductDelete,
        { ProductId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        ProductslistAPI(
          pageNo,
          rowsPerPage,
          search,
          filter.productType,
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
        apiUrls.ProductActiveInActive,
        { ProductId: item.productId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        ProductslistAPI(
          page,
          rowsPerPage,
          search,
          filter.productType,
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
    navigate(`/products/detail/${item.productId}`);
  };

  const handleChange = (e) => {
    let pageNo = 1;
    ProductslistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.name === "productType" ? e.target.value : filter.productType,
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

    ProductslistAPI(
         1,
          rowsPerPage,
          search,
          filter.productType,
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
    <div className="intersight_content">

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Header title="Products" />
        
        <Container maxWidth="xl" sx={{ py: 3 }} >
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Header Section */}
              <Box sx={{ mb: 4 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                >
                  <TableTitle title="Manage Products" />
                  <Box>
                    {HasPermission("ProductsAdd") && (
                      <AddEditButton
                        handleClick={() => {
                          setAction("add");
                          setOpen(true);
                        }}
                        title="Add Product"
                      />
                    )}
                  </Box>
                </Stack>
              </Box>

              {/* Filters Section */}
              <Box sx={{ mb: 4 }}>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2}
                  alignItems={{ xs: 'stretch', md: 'flex-start' }}
                >
                  <Search handleSearch={handleSearch} />
                  <StatusDropdown value={filter.status} fn={handleChange} />
                  <ProductTypeDropdown
                    value={filter.productType}
                    fn={handleChange}
                    load={true}
                  />
                </Stack>
              </Box>

              {/* Table Section */}
                <DynamicTable
                  data={ProductsList}
                  columns={columns}
                  title="Products"
                  rowActions={["edit", "delete", "view"]}
                  edituser={handleedit}
                  handledelete={handledelete}
                  handlestatus={handlestatus}
                  deletepermission="ProductsDelete"
                  editpermission="ProductsEdit"
                  viewUser={handleview}
                  handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  handlesearchChange={handlesearchChange}
                />
                
                {/* Pagination */}
                {ProductsList && ProductsList?.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    marginTop: 2,
                    
                  }}>
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
                          paddingLeft: 0,
                          paddingRight: 0,
                          alignItems: 'baseline',
                        }
                      }}
                    />
                  </Box>
                )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      
      {open && (
        <AddEditProduct
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
          title={object.productName}
          id={object?.productId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </div>
  );
}
