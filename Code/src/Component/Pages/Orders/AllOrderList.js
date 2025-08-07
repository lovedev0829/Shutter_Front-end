import React, { useEffect, useState } from "react";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import DynamicTable from "../../Form/DynamicTable";
import { TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VersionHistory from "./VersionHistory";
import Search from "../../Form/Search";
import { useDebounce } from "use-debounce";
import GetAllContact from "../../../helpers/GetAllContact";
import GetAllEstimateContact from "../../../helpers/GetAllEstimateContact";

export default function AllOrderList() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [history, setHistory] = useState(false);
  const [object, setObject] = useState("");
  const [search, setsearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({contactId:"",estimateId:"",sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],  });

  const TenantlistAPI = async (page, perpage, search,customerId,estimateId,sortColumn,sortDirection,columnFilters) => {
    setLoader(true);
    try {
      const body = {
        searchValue: search ? search : "",
        pageNo: page ? page : 1,
        recordPerPage: perpage ? perpage : 10,
        customerId:customerId?customerId:"",
        status: 2,
        estimationId:estimateId?estimateId:"",
        sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
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
    TenantlistAPI(1, rowsPerPage, debouncedSearch,filter.contactId,filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
     debouncedSearchcolumn);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn]);

  const columns = [
    { key: "orderNumber", label: "Order Number", link: true, sort: true },
    { key: "firstContactName", label: "Contact Name", link: true, sort: true },
    { key: "estimateName", label: "Estimate Title", sort: true },
    { key: "grandTotal", label: "Total Amount", sign: true, sort: true },
     { key: "createdDate", label: "Create Date"},
  ];

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search,filter.contactId,filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), search,filter.contactId,filter.estimateId,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  let navigate = useNavigate();

  const handleview = (item) => {
    navigate(`/contacts/order/preview/${item.orderId}`);
  };

  const handleVersion = (item) => {
    setObject(item);
    setHistory(true);
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
      const url =`/contacts/detail/${item?.contactId}`;
      navigate(url)
    
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
     1, rowsPerPage, debouncedSearch,filter.contactId,filter.estimateId,
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
      <ApiLoder open={loder} />
      <Header title="All Orders" />
      <div className="body_content">
        <div className="contact-profile">
          <div className="engage-tabs">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title={`Orders`} />
            </div>
            <div className="d-block d-md-flex align-items-center gap-2 mb-30">
              <div className="filter-dropdown dropdown">
                <Search handleSearch={handleSearch} />
              </div>
              <div className="filter-dropdown dropdown">
                <GetAllContact
                  value={filter.contactId}
                  fn={handleChanges}
                  load={true}
                  className="selectboxdropdown"
                />
              </div>
              <div className="filter-dropdown dropdown">
                <GetAllEstimateContact
                  value={filter.estimateId}
                  fn={handleChanges}
                  ContactId={filter.contactId}
                  
                />
              </div>
            </div>
            <div className="task_table mb-30">
              <div className="table-responsive">
                <DynamicTable
                  data={tenantList}
                  columns={columns}
                  title="Orders"
                  viewUser={handleview}
                  rowActions={["version"]}
                  editpermission="JobView"
                  handleVersion={handleVersion}
                  handlecontact={handlecontact}
                   handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  handlesearchChange={handlesearchChange}
                />
                {tenantList && tenantList?.length > 0 && (
                  <div className="d-flex align-items-center justify-content-end bottom_nav">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <TablePagination
                          rowsPerPageOptions={[10, 25, 50, 100]}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {history &&<VersionHistory
        open={history}
        handleClose={() => setHistory(false)}
        EstimationId={object.estimateId}
      />
}
    </div>
  );
}
