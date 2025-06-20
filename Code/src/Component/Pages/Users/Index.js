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
import AddEditUser from './AddEditUser'
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common'
import { useDebounce } from "use-debounce";
import Tab from '../../Form/Tab'
import RoleList from '../Role/RoleList'
import { Manageapplication, Manageroletab } from '../../../SvgFile/Index'
import PartnerDropdown from '../../../helpers/PartnerDropdown'
import StatusDropdown from '../../../helpers/StatusDropdown'


export default function Index() {
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
  const [filter, setFilter] = useState({status:"2",tenantId:"",sortColumn: "",
    sortDirection: "asc",
     columnFilters: [],});
  const [tabdata, setTabdata] = useState("#manageapplication");

  const columns = [
    { key: 'firstName', label: 'Name', sort: true },
      { key: 'email', label: 'Email', sort: true },
      {key:'phone', label: 'Phone Number',phoneformate:true, sort: true},
      {key:'ghlUserName', label: 'GHL User Name', sort: true},
      {key:'roleName', label: 'Role Name', sort: true},
    { key: 'isActive', label: 'Status' }
  ];



  const handleSearch = (value)=>{
        setsearch(value)
  }

 

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search,filter.tenantId,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), search,filter.tenantId,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page,perpage,serach,tenantId,status,sortColumn,sortDirection,columnFilters) => {
    let query={searchValue:serach?serach:"",pageNo:page?page:1,recordPerPage:perpage?perpage:10,tenantId:tenantId,status:status,sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []}
     try {
      setLoader(true)
      const apiResponse = await callAPI(apiUrls.User,{}, "POST",query);
      setLoader(false)
      if (apiResponse?.data?.isSuccess) {
           setTenantList(apiResponse?.data?.data)
          setPaginatedItems(apiResponse?.data?.totalRecords)
      } else {
        setTenantList([])
       
      }
     } catch (error) {
      setLoader(false)
     }
  }
   const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch,filter.tenantId,filter.status, filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn)
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn])

  const handleclose = () => {
    setOpen(false)

  }

  const handleapi = () => {
         let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage,search,filter.tenantId,filter.status,
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
    try{
     const response = await callAPI(apiUrls.UserDelete,{UserId:id},'POST',{})
     setLoader(false)
     if(response.data.isSuccess){
      handledelclose();
      SuccessMessage(response.data.message)
      let pageNo = 1;
      TenantlistAPI(pageNo, rowsPerPage,search,filter.tenantId,filter.status,
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
     const response = await callAPI(apiUrls.UserActiveInActive,{UserId:item.userId},'POST',{})
     setLoader(false)
     if(response.data.isSuccess){
      SuccessMessage(response.data.message)
      TenantlistAPI(page, rowsPerPage,search,filter.tenantId,filter.status,
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


  const Tablist = [
    { status: true, id: "#manageapplication", svg: <Manageapplication />, title: "Manage Application Users" },
    (HasPermission("RolesView") && !filter.tenantId) && { status: false, id: "#manageroletab", svg: <Manageroletab />, title: "Manage Roles" }
  ].filter(Boolean);
  

  const handleApihit =  () => {
    TenantlistAPI(page, rowsPerPage,search,filter.tenantId,filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
  }

  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage,search,e.target.name === 'tenantId' ? e.target.value : filter.tenantId,e.target.name === 'status' ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1)
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  
  const handleTabchnage =  (value) => {
    setTabdata(value || Tablist[0].id)
  }
  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0].id;

    const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
    let pageNo = 1;
    TenantlistAPI(
      pageNo, rowsPerPage,search,filter.tenantId,filter.status,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };
  
const handlesearchChange = (columnKey, value = null) => {
  let updatedFilters = [...filter.columnFilters];
  if (value !== null) {
    if (columnKey === 'phone') {
  // Remove all formatting characters first
  value = value.replace(/[()+\-\s]/g, '');

  // Remove leading '1' if it follows a '+'
  if (value.startsWith('1')) {
    value = value.substring(1);
  }
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
    <>
    {loder && <ApiLoder/>}
      <div className="intersight_content">
        <Header title="Users Admin" />
        <div className="body_content">
        <div className="contact-profile">
  <div className="engage-tabs">
    <ul className="nav nav-pills" id="pills-tab" role="tablist">
     <Tab Tablist={Tablist} handleTabchnage={handleTabchnage}/>
    </ul>
    <div className="tab-content" id="pills-tabContent">
      {/* manage application tab */}
      <div
         className={`tab-pane fade ${initialActiveTab === "#manageapplication" ? "show active" : ""
         }`}
        id="manageapplication"
        role="tabpanel"
        aria-labelledby="pills-overview-tab"
        tabIndex={0}
      >
        {tabdata === "#manageapplication" && 
        <>
        <div className="d-flex align-items-center justify-content-between mb-30">
        <TableTitle title="Manage Application Users"/>
          <div className="heading_width_search d-flex align-items-center gap-3">
          {!filter.tenantId &&
                <>
          {HasPermission("UsersAdd") && 
          <AddEditButton handleClick={(() => {
              setAction("add")
              setOpen(true)
            })
            }   title="Add New User"/>
          }
            </>
}
          </div>
        </div>

        <div className="d-block d-md-flex align-items-center gap-2 mb-30">
              
              <div className="filter-dropdown dropdown">
              <Search handleSearch={handleSearch}/>
              </div>
              <div className="filter-dropdown dropdown">
              <StatusDropdown  value={filter.status}
                            fn={handleChange} /> 
              </div>
              <div className="filter-dropdown dropdown">
              {HasPermission("SubTenantView") && 
          <PartnerDropdown  value={filter.tenantId}
                            fn={handleChange} /> }
              </div>
            </div>

        <div className="task_table mb-30">
          <div className="table-responsive">
          <DynamicTable data={tenantList} columns={columns}  title="User" rowActions={filter.tenantId?[]:['edit', 'delete']} edituser={handleedit} handledelete={handledelete} handlestatus={handlestatus}
          deletepermission="UsersDelete" editpermission="UsersEdit"
           handleFilterSortChange={handleFilterSortChange}
                sortColumn={filter.sortColumn}
                sortDirection={filter.sortDirection}
                columnFilters={filter.columnFilters}
                handlesearchChange={handlesearchChange}/>
          {tenantList && tenantList?.length > 0 &&
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
        </>
}
      </div>
      
      {/* manage role tab */}
      <div
         className={`tab-pane fade ${initialActiveTab === "#manageroletab" ? "show active" : ""
         }`}
        id="manageroletab"
        role="tabpanel"
        aria-labelledby="pills-payment-tab"
        tabIndex={0}
      >
         {HasPermission("RolesView") && tabdata === "#manageroletab" && 
        <RoleList handleApihit={handleApihit}/>
         }
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
      {open &&<AddEditUser open={open} handleclose={handleclose} action={action} LanguageListAPI={handleapi} object={object}/>}
      {delOpen && <Delete open={delOpen} handleClose={handledelclose} title={object.firstName + ' ' + object.lastName} id={object?.userId} handleDelete={handleDelete} loder={loder}/>}
    </>
  )
}
