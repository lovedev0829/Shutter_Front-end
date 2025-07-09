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
import AddEditMaterial from "./AddEditMaterial";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import ProductTypeDropdown from "../../../helpers/ProductTypeDropdown";
import GetAllVendorDropdown from "../../../helpers/GetAllVendorDropdown";
import ImortFile from "../../../helpers/ImortFile";
import ExportFile from "../../../helpers/ExportFile";
import SampleDownload from "../../../helpers/SampleDownload";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [MaterialList, setMaterialList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({
    vendor: "",
    productType: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });

  const columns = [
    { key: "materialName", label: "Name", sort: true },
    { key: "unitCost", label: "Unit Cost", sign: true, sort: true },
    //  { key: "nonRatedUnitCost", label: "Non Rated Cost",sign:true  },
    { key: "unitOfMeasurement", label: "Unit Of Measure", sort: true },
    { key: "stockQuantity", label: "Inventory", sort: true },
    { key: "reorderLevel", label: "Reorder level", sort: true },
    { key: "companyName", label: "Vendor", sort: true },
    { key: "sku", label: "SKU", sort: true },
    { key: "isCutSheet", label: "Cut Sheet" },
    // { key: 'notes', label: 'Notes' },
    { key: "isActive", label: "Status" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    MateriallistAPI(
      newPage + 1,
      rowsPerPage,
      search,
      filter.productType,
      filter.vendor,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    MateriallistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.productType,
      filter.vendor,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const MateriallistAPI = async (
    page,
    perpage,
    serach,
    productType,
    vendor,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
      productType: productType,
      vendor: vendor,
      sortColumn: sortColumn ? sortColumn : "",
      sortDirection: sortDirection ? sortDirection : "asc",
      columnFilters: columnFilters || [],
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.Material, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setMaterialList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setMaterialList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
  useEffect(() => {
    MateriallistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
      filter.productType,
      filter.vendor,
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

  const handleapi = () => {
    let pageNo = 1;
    MateriallistAPI(
      pageNo,
      rowsPerPage,
      search,
      filter.productType,
      filter.vendor,
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
        apiUrls.MaterialDelete,
        { Id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        MateriallistAPI(
          pageNo,
          rowsPerPage,
          search,
          filter.productType,
          filter.vendor,
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
        apiUrls.MaterialActiveInActive,
        { Id: item.materialId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        MateriallistAPI(
          page,
          rowsPerPage,
          search,
          filter.productType,
          filter.vendor,
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
    MateriallistAPI(
      pageNo,
      rowsPerPage,
      search,
      e.target.name === "productType" ? e.target.value : filter.productType,
      e.target.name === "vendor" ? e.target.value : filter.vendor,
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

    MateriallistAPI(
      1,
      rowsPerPage,
      search,
      filter.productType,
      filter.vendor,
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

  // selectboxdropdown
  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Material" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Raw Material" />
              <div className="heading_width_search d-flex align-items-center gap-3">
                {HasPermission("MaterialAdd") && (
                  <AddEditButton
                    handleClick={() => {
                      setAction("add");
                      setOpen(true);
                    }}
                    title="Add Material"
                  />
                )}
              </div>
            </div>
            <div className="d-block d-lg-flex gap-2">
              <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                <div className="filter-dropdown dropdown">
                  <Search handleSearch={handleSearch} />
                </div>
                <div className="filter-dropdown dropdown">
                  <ProductTypeDropdown
                    value={filter.productType}
                    fn={handleChange}
                    load={true}
                    className="selectboxdropdown"
                  />
                </div>
                <div className="filter-dropdown dropdown">
                  {HasPermission("SubTenantView") && (
                    <GetAllVendorDropdown
                      value={filter.vendor}
                      fn={handleChange}
                      load={true}
                      className="selectboxdropdown"
                      name="vendor"
                    />
                  )}
                </div>
              </div>
              <div className="d-flex invoice-new gap-2">
                {HasPermission("MaterialAdd") && (
                  <ImortFile LanguageListAPI={handleapi} type="material" />
                )}
                <ExportFile
                  type="material"
                  serach={search}
                  page={page}
                  perpage={rowsPerPage}
                  tenantId={""}
                  status={"2"}
                  Url={apiUrls.ExportContacts}
                  jobStatus={""}
                  vendor={filter.vendor}
                  productType={filter.productType}
                />
                <SampleDownload type="material" />
              </div>
            </div>

            <div className="task_table mb-30">
              <div className="table-responsive">
                <DynamicTable
                  data={MaterialList}
                  columns={columns}
                  title="Material"
                  rowActions={["edit", "delete"]}
                  edituser={handleedit}
                  handledelete={handledelete}
                  handlestatus={handlestatus}
                  deletepermission="MaterialDelete"
                  editpermission="MaterialEdit"
                  handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  handlesearchChange={handlesearchChange}
                />
                {MaterialList && MaterialList?.length > 0 && (
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
        <AddEditMaterial
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
          title={object.materialName}
          id={object?.materialId}
          handleDelete={handleDelete}
          loder={loder}
        />
      )}
    </>
  );
}
