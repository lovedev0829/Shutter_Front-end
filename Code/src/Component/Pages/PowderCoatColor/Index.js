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
import AddEditPowderCoatColor from "./AddEditPowderCoatColor";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [powderCoatColorList, setPowderCoatColorList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });

  const columns = [
    { key: "colorName", label: "Color Name", sort: true },
    { key: "cost", label: "Cost", sign: true, sort: true },
    { key: "description", label: "Description", sort: true },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    getPowderCoatColorsAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    getPowderCoatColorsAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const getPowderCoatColorsAPI = async (page, perpage, serach, sortColumn, sortDirection, columnFilters) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || []
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.GetAllPowderCoatColor, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setPowderCoatColorList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setPowderCoatColorList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  useEffect(() => {
    getPowderCoatColorsAPI(
      1,
      rowsPerPage,
      debouncedSearch,
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

  const refreshPowderCoatColorList = () => {
    let pageNo = 1;
    getPowderCoatColorsAPI(
      pageNo,
      rowsPerPage,
      search,
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
        apiUrls.PowderCoatColorDelete,
        { powderCoatColorId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        getPowderCoatColorsAPI(
          pageNo,
          rowsPerPage,
          search,
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
        apiUrls.PowderCoatColorActiveInActive,
        { powderCoatColorId: item.id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        let pageNo = 1;
        getPowderCoatColorsAPI(
          pageNo,
          rowsPerPage,
          search,
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

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });

    getPowderCoatColorsAPI(
      1,
      rowsPerPage,
      search,
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
        <Header title="Powder Coat Colors" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Powder Coat Colors" />
              <div className="heading_width_search d-flex align-items-center gap-3">
                {HasPermission("PowderCoatColorAdd") && (
                  <AddEditButton
                    handleClick={() => {
                      setAction("add");
                      setOpen(true);
                    }}
                    title="Add Color"
                  />
                )}
              </div>
            </div>
            <div className="d-block d-lg-flex gap-2">
              <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                <div className="filter-dropdown dropdown">
                  <Search handleSearch={handleSearch} />
                </div>
              </div>
            </div>

            <div className="task_table mb-30">
              <div className="table-responsive">
                <DynamicTable
                  data={powderCoatColorList}
                  columns={columns}
                  title="Powder Coat Color"
                  rowActions={["edit", "delete"]}
                  edituser={handleedit}
                  handledelete={handledelete}
                  handlestatus={handlestatus}
                  deletepermission="PowderCoatColorDelete"
                  editpermission="PowderCoatColorEdit"
                  handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  handlesearchChange={handlesearchChange}
                />
                {powderCoatColorList && powderCoatColorList?.length > 0 && (
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
      {open && (
        <AddEditPowderCoatColor
          open={open}
          handleClose={handleclose}
          action={action}
          PowderCoatColorListAPI={refreshPowderCoatColorList}
          selectedData={object}
        />
      )}
      {delOpen && (
        <Delete
          open={delOpen}
          handleClose={handledelclose}
          title={object.colorName}
          id={object?.id}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
