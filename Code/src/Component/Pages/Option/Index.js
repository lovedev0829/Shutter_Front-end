import React, { useEffect } from 'react'
import Header from '../../../Layout/header'
import { useState } from 'react'
import TableTitle from '../../Form/TableTitle'
import DynamicTable from '../../Form/DynamicTable'
import Search from '../../Form/Search'
import AddEditButton from '../../Form/AddEditButton'
import { apiUrls } from '../../../utils/apiUrls'
import { callAPI } from '../../../utils/apiUtils'
import { TablePagination } from "@mui/material";
import AddEditOption from './AddEditOption'
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common'
import { useDebounce } from "use-debounce";
import ProductTypeDropdown from '../../../helpers/ProductTypeDropdown'
import StatusDropdown from '../../../helpers/StatusDropdown'


export default function Index() {
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
    {loder && <ApiLoder/>}
      <div className="intersight_content">
        <Header title="Options" />
        <div className="body_content">
        <div className="contact-profile">
        <div className="d-flex align-items-center justify-content-between mb-30">
        <TableTitle title="Manage Options"/>
          <div className="heading_width_search d-flex align-items-center gap-3">
          
        
          {HasPermission("OptionsAdd") && 
          <AddEditButton handleClick={(() => {
              setAction("add")
              setOpen(true)
            })
            }   title="Add Option"/>
          }
          </div>
        </div>

        <div className="d-block d-md-flex align-items-center gap-2 mb-30">
              <div className="filter-dropdown dropdown">
                <Search handleSearch={handleSearch} />
              </div>
              <div className="filter-dropdown dropdown">
                <StatusDropdown value={filter.status} fn={handleChange} />
              </div>
              <div className="filter-dropdown dropdown">
                <ProductTypeDropdown
                  value={filter.productType}
                  fn={handleChange}
                  load={true}
                  className="selectboxdropdown"
                />
              </div>
            </div>
        
        <div className="task_table mb-30">
          <div className="table-responsive">
          <DynamicTable data={OptionsList} columns={columns}  title="Options" rowActions={['edit', 'delete']} edituser={handleedit} handledelete={handledelete} handlestatus={handlestatus}
          deletepermission="OptionsDelete" editpermission="OptionsEdit"  handleFilterSortChange={handleFilterSortChange}
                sortColumn={filter.sortColumn}
                sortDirection={filter.sortDirection}
                columnFilters={filter.columnFilters}
                handlesearchChange={handlesearchChange} />
          {OptionsList && OptionsList?.length > 0 &&
            <div className="d-flex align-items-center justify-content-end bottom_nav">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <TablePagination
              rowsPerPageOptions={[10,25,50,100]}
              component="div"
              count={paginatedItems}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ul>
        </nav>
      </div>
}
          </div>
        </div>
     
    
</div>
        </div>
      </div>
     {open && <AddEditOption open={open} handleclose={handleclose} action={action} LanguageListAPI={handleapi} object={object}/>}
      {delOpen &&<Delete open={delOpen} handleClose={handledelclose} title={object.optionName} id={object?.optionId} handleDelete={handleDelete} loder={loder}/>}
    </>
  )
}
