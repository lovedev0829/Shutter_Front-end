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
import AddEditVender from "./AddEditVender";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import StatusDropdown from "../../../helpers/StatusDropdown";
import VendorOrderList from "../Vendor-Order/VendorOrderList";
import Tab from "../../Form/Tab";
import { Manageapplication, Vendororder } from "../../../SvgFile/Index";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [VendorList, setVendorList] = useState([]);
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
  const [tabdata, setTabdata] = useState("#pills-overview-tab");
  const columns = [
    { key: "companyName", label: "Company Name", sort: true },
    { key: "firstName", label: "Name", sort: true },
    { key: "vendorCode", label: "Code", sort: true },
    { key: "email", label: "Email", sort: true },
    { key: "phoneNumber", label: "Phone", phoneformate: true, sort: true },
    { key: "streetAddress", label: "Address", sort: true },
    { key: "stateName", label: "State", sort: true },
    { key: "city", label: "City", sort: true },
    { key: "zipCode", label: "Zip Code", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    VendorlistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    VendorlistAPI(
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
  const VendorlistAPI = async (
    page,
    perpage,
    serach,
    status,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: status,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Vendor, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setVendorList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setVendorList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  
  useEffect(() => {
    VendorlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.status,
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

  const refreshVendorlistAPI = () => {
    let pageNo = 1;
    VendorlistAPI(
      pageNo,
      rowsPerPage,
      search,
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
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.VendorDelete,
        { VendorId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        VendorlistAPI(
          pageNo,
          rowsPerPage,
          search,
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
        apiUrls.VendorActiveInActive,
        { VendorId: item.vendorId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        VendorlistAPI(
          page,
          rowsPerPage,
          search,
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

  const handleChange = (e) => {
    let pageNo = 1;
    VendorlistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.value,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const Tablist = [
    {
      status: true,
      id: "#vendorlisttabd",
      svg: <Manageapplication />,
      title: "Manage Vendor",
    },
    HasPermission("VendorOrderView") && {
      status: false,
      id: "#addvendortab",
      svg: <Vendororder />,
      title: "Vendor Order",
    },
  ];

  const handleTabchnage = (value) => {
    setTabdata(value || Tablist[0].id);
  };
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
    VendorlistAPI(
      pageNo,
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
      if (columnKey === "phoneNumber") {
        // Remove all formatting characters first
        value = value.replace(/[()+\-\s]/g, "");

        // Remove leading '1' if it follows a '+'
        if (value.startsWith("1")) {
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
        columnFilters: updatedFilters,
      };
    });
  };

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Vendor" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <Tab Tablist={Tablist} handleTabchnage={handleTabchnage} />
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className={`tab-pane fade ${
                    initialActiveTab === "#vendorlisttabd" ? "show active" : ""
                  }`}
                  id="vendorlisttabd"
                  role="tabpanel"
                  aria-labelledby="pills-overview-tab"
                  tabIndex={0}
                >
                  <div className="contact-profile">
                    <div className="d-flex align-items-center justify-content-between mb-30">
                      <TableTitle title="Manage Vendor" />
                      <div className="heading_width_search d-flex align-items-center gap-3">
                        {HasPermission("VendorsAdd") && (
                          <AddEditButton
                            handleClick={() => {
                              setAction("add");
                              setOpen(true);
                            }}
                            title="Add Vendor"
                          />
                        )}
                      </div>
                    </div>

                    <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                      <div className="filter-dropdown dropdown">
                        <Search handleSearch={handleSearch} />
                      </div>
                      <div className="filter-dropdown dropdown">
                        <StatusDropdown
                          value={filter.status}
                          fn={handleChange}
                        />
                      </div>
                    </div>

                    <div className="task_table mb-30">
                      <div className="table-responsive">
                        <DynamicTable
                          data={VendorList}
                          columns={columns}
                          title="Vendor"
                          rowActions={["edit", "delete"]}
                          edituser={handleedit}
                          handledelete={handledelete}
                          handlestatus={handlestatus}
                          deletepermission="VendorsDelete"
                          editpermission="VendorsEdit"
                          handleFilterSortChange={handleFilterSortChange}
                          sortColumn={filter.sortColumn}
                          sortDirection={filter.sortDirection}
                          columnFilters={filter.columnFilters}
                          handlesearchChange={handlesearchChange}
                        />
                        {VendorList && VendorList?.length > 0 && (
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
                    {open && (
                      <AddEditVender
                        open={open}
                        handleclose={handleclose}
                        action={action}
                        LanguageListAPI={refreshVendorlistAPI}
                        object={object}
                      />
                    )}
                    {delOpen && (
                      <Delete
                        open={delOpen}
                        handleClose={handledelclose}
                        title={object.companyName}
                        id={object?.vendorId}
                        handleDelete={handleDelete}
                        loder={loder}
                      />
                    )}
                  </div>
                </div>
                {/* vendorlisttab */}

                {HasPermission("VendorOrderView") && (
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#addvendortab" ? "show active" : ""
                    }`}
                    id="addvendortab"
                    role="tabpanel"
                    aria-labelledby="pills-payment-tab"
                    tabIndex={0}
                  >
                    {tabdata === "#addvendortab" && <VendorOrderList />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
