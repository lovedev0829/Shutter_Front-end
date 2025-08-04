import { Link } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import StatusDropdown from "../../../helpers/StatusDropdown";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import moment from "moment";
import ArchivePopup from "./ArchivePopup";

export default function Index() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    status: "2",
    tenantId: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });
  const [object, setObject] = useState("");
  const [approved, setApproved] = useState(false);

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
  const TenantlistAPI = async (
    page,
    perpage,
    serach,
    tenantId,
    status,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: tenantId ? tenantId : "",
      status: status ? status : 2,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetAllArchiveContacts,
        {},
        "POST",
        query
      );
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
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

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
  }, [debouncedSearch, debouncedSearchcolumn]);
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

  const handledelclosee = () => {
    setApproved(false);
    setObject("");
  };

  const handlestatus = async (archiveType) => {
    setLoader(true);
    try {
      const response = await callAPI(apiUrls.ArchiveContacts, {}, "POST", {
        contactId: object.contactId ? object.contactId : null,
        status: true,
        archiveType: archiveType,
      });
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        setApproved(false);
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
        setObject("");
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

    TenantlistAPI(
      1,
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

  const columns = [
    { key: "contactUniqueId", label: "Customer ID", sort: true },
    { key: "firstName", label: "Name", sort: true },
    { key: "contactType", label: "Type", sort: true },
    { key: "streetAddress", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State"},
    { key: "zipCode", label: "Zip Code" },
    { key: "createdAt", label: "Created Date" },
    { key: "isActive", label: "Status" },
    { key: "isActive", label: "Action" },
  ];

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Archive Customer" />
        <div className="body_content">
          <div className="awarded-jobs task_table">
            <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Archive Customer Tool" />
              <div className="heading_width_search d-flex align-items-center gap-3">
                <div className="red_btn">
                  Note: Only inactive customers will be archived
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mb-30">
              <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                <div className="filter-dropdown dropdown">
                  <Search handleSearch={handleSearch} />
                </div>
                <div className="filter-dropdown dropdown">
                  <StatusDropdown value={filter.status} fn={handleChange} />
                </div>
              </div>
              <Link
                to="#"
                className="btn blue-btn small_btn"
                onClick={() => {
                  setApproved(true);
                  setObject("");
                }}
              >
                Archive All Inactive
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((val, i) => (
                      <th
                        scope="col"
                        key={i}
                        style={{ verticalAlign: "top", whiteSpace: "nowrap" }}
                      >
                        {val.label}
                        {val.sort && filter.sortColumn === val.key && (
                          <span
                            className="ascen-descending"
                            onClick={() =>
                              val.sort ? handleFilterSortChange(val.key) : null
                            }
                          >
                            {filter.sortDirection === "asc" ? (
                              <img src="/image/ascending.png" alt=""></img>
                            ) : (
                              <img src="/image/descending.png" alt=""></img>
                            )}
                          </span>
                        )}

                        {val.sort && filter.sortColumn !== val.key && (
                          <span
                            className="ascen-descending"
                            onClick={() =>
                              val.sort ? handleFilterSortChange(val.key) : null
                            }
                          >
                            <img src="/image/ascending.png" alt=""></img>
                          </span>
                        )}

                        {val.sort && (
                          <input
                            type="text"
                            className="form-control new-search-input"
                            name="suffix"
                            placeholder="Search here"
                            value={
                              filter.columnFilters.find(
                                (f) => f.field === val.key
                              )?.value || ""
                            }
                            onChange={(e) =>
                              handlesearchChange(val.key, e.target.value)
                            }
                          ></input>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenantList?.map((val, i) => (
                    <tr key={i}>
                      {val.isArchive ? (
                        <td>{val?.contactUniqueId}</td>
                      ) : (
                        <td>
                          <Link
                            onClick={() => {
                              localStorage.setItem(
                                "activeTab2",
                                "#pills-overview"
                              );
                            }}
                            className="color-blue"
                            to={`/contacts/detail/${val.contactId}`}
                           
                          >
                            {val?.contactUniqueId}
                          </Link>{" "}
                        </td>
                      )}

                      <td style={{ color: val.isArchive ? "red" : "" }}>
                        {val?.firstName +
                          " " +
                          val?.lastName +
                          " " +
                          (val?.suffix ?? "")}
                      </td>

                      <td>{val?.contactType}</td>

                      <td>{val?.billingAddressVm?.streetAddress}</td>
                      <td>{val?.billingAddressVm?.city}</td>
                      <td>{val?.billingAddressVm?.state}</td>
                      <td>{val?.billingAddressVm?.zipCode}</td>
                      <td>
                        {moment(val?.createdAt).format("MM-DD-YYYY") || ""}
                      </td>
                      <td>
                        <span
                          className={`tags ${
                            val?.isActive ? "active" : "inactive"
                          }-tag`}
                        >
                          {val?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {!val.isArchive && !val?.isActive && (
                          <Link
                            to="#"
                            className="btn blue-btn small_btn"
                            onClick={() => {
                              setApproved(true);
                              setObject(val);
                            }}
                          >
                            Archive
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!tenantList || tenantList?.length === 0) && (
                    <tr>
                      <td
                        className="text-center border-0 no-records"
                        colSpan={12}
                      >
                        <img
                          src="/image/no-records.svg"
                          alt=" "
                          loading="lazy"
                          className="img-fluid"
                        />
                        <p className="font-14">No Archive Customer Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
      <ArchivePopup
        open={approved}
        handleClose={handledelclosee}
        handlestatus={handlestatus}
        loder={loder}
        object={object}
        title={`You want to Archive (${
          object.firstName
            ? object?.firstName +
              " " +
              object?.lastName +
              " " +
              (object?.suffix ?? "")
            : "All Inactive"
        }) Customer?`}
        subtitle={"Please click the Confirm button to Archive the Customer."}
      />
    </>
  );
}
