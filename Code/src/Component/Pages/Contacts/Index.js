import React, { useEffect, useMemo } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import DynamicTable from "../../Form/DynamicTable";
import Search from "../../Form/Search";
import AddEditButton from "../../Form/AddEditButton";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import AddEditContact from "./AddEditContact";
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
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
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
    TenantlistAPI(
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
    TenantlistAPI(
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
  const TenantlistAPI = async (page, perpage, serach, tenantId, status,sortColumn,sortDirection,columnFilters) => {
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
        setTenantList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI(
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

  const handleclose = () => {
    setOpen(false);
    setObject(defaultState);
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(
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
        TenantlistAPI(
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
        TenantlistAPI(
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
    TenantlistAPI(
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
    TenantlistAPI(
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
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Contacts" />
        <div className="body_content">
          <div className="awarded-jobs task_table">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Contacts" />

              <div className="heading_width_search d-flex align-items-center gap-3">
                {!filter.tenantId && (
                  <>
                    {HasPermission("ContactAdd") && (
                      <AddEditButton
                        handleClick={() => {
                          setAction("add");
                          setOpen(true);
                        }}
                        title="Add New Contact"
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="d-block d-lg-flex align-items-center gap-2 mb-30">
              <div className="filter-dropdown dropdown">
                <Search handleSearch={handleSearch} />
              </div>
              <div className="filter-dropdown dropdown">
                <StatusDropdown value={filter.status} fn={handleChange} />
              </div>
              <div className="filter-dropdown dropdown">
                {HasPermission("SubTenantView") && (
                  <PartnerDropdown value={filter.tenantId} fn={handleChange} />
                )}
              </div>
              <div className="d-flex justify-content-between gap-2 ">
                {HasPermission("ContactAdd") && (
                  <ImportFile LanguageListAPI={handleapi} type="contact" />
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
              </div>
            </div>

            <div className="table-responsive">
              <DynamicTable
                data={tenantList}
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
              {tenantList && tenantList?.length > 0 && (
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
      {open &&<AddEditContact
        open={open}
        handleclose={handleclose}
        action={action}
        LanguageListAPI={handleapi}
        object={object}
      />}
      {delOpen &&<Delete
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
}
    </>
  );
}
