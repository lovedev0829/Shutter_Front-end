import React, { useEffect } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import DynamicTable from "../../Form/DynamicTable";
import Search from "../../Form/Search";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import AddEditSubTenent from "./AddEditSubTenent";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import StatusDropdown from "../../../helpers/StatusDropdown";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [subtenantList, setsubtenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ status: "2", tenantId: "", sortColumn: "",
    sortDirection: "asc",
     columnFilters: []});

  const columns = [
    { key: "logo", label: "Logo" },
     { key: "primaryColor", label: "Site Color" },
    { key: "companyName", label: "Company Name", sort: true  },
    { key: "firstName", label: "Name", sort: true  },
    { key: "email", label: "Email", sort: true  },
    { key: "code", label: "Code", sort: true  },
    { key: "markup", label: "Markup", sort: true  },
    { key: "isActive", label: "Status" },
  ];

   const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    SubTenantlistAPI(newPage + 1, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    SubTenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const SubTenantlistAPI = async (page, perpage, serach, status,sortColumn,sortDirection,columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: status,
      sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.SubTenant, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setsubtenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setsubtenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    SubTenantlistAPI(1, rowsPerPage, debouncedSearch, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch,debouncedSearchcolumn]);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const refreshSubTenantlistAPI = () => {
    let pageNo = 1;
    SubTenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
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
        apiUrls.SubTenantDelete,
        { TenantId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        SubTenantlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
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
        apiUrls.SubTenantActiveInActive,
        { TenantId: item.tenantId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        SubTenantlistAPI(page, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleChange = (e) => {
    let pageNo = 1;
    SubTenantlistAPI(pageNo, rowsPerPage, search, e.target.value,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
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

    SubTenantlistAPI(
      1,
      rowsPerPage,
      search,
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
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Partners" />
        <div className="body_content">
          <div className="awarded-jobs task_table">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Partners" />

              <div className="heading_width_search d-flex align-items-center gap-3">
                {HasPermission("SubTenantAdd") && (
                  <AddEditButton
                    handleClick={() => {
                      setAction("add");
                      setOpen(true);
                    }}
                    title="Add New Partners"
                  />
                )}
              </div>
            </div>

            <div className="d-block align-items-center gap-2 mb-30 d-md-flex">
              <div className="filter-dropdown dropdown">
                <Search handleSearch={handleSearch} />
              </div>
              <div className="filter-dropdown dropdown">
                <StatusDropdown value={filter.status} fn={handleChange} />
              </div>
            </div>

            <div className="table-responsive">
              <DynamicTable
                data={subtenantList}
                columns={columns}
                title="Partners"
                rowActions={["edit", "delete", "product","ghl"]}
                edituser={handleedit}
                handledelete={handledelete}
                handlestatus={handlestatus}
                deletepermission="SubTenantDelete"
                editpermission="SubTenantEdit"
                handleFilterSortChange={handleFilterSortChange}
                sortColumn={filter.sortColumn}
                sortDirection={filter.sortDirection}
                columnFilters={filter.columnFilters}
                handlesearchChange={handlesearchChange}
              />
              {subtenantList && subtenantList?.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    {open &&  <AddEditSubTenent
        open={open}
        handleclose={handleclose}
        action={action}
        SubTenantlistAPI={refreshSubTenantlistAPI}
        object={object}
      />
    }
     {delOpen && <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.firstName + " " + object.lastName}
        id={object?.tenantId}
        handleDelete={handleDelete}
        loder={loder}
      />
     }
    </>
  );
}
