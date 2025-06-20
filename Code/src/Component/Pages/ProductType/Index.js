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
import AddEditProductType from "./AddEditProductType";
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
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [filter, setFilter] = useState({ status: "2", tenantId: "" });

  const columns = [
    { key: "productName", label: "Name" },
    { key: "isActive", label: "Status" },
    { key: "isDefault", label: "Default Selected" },
  ];

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search, filter.status);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
      filter.status
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, serach, status) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: status,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.ProductType, {}, "POST", query);
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
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch, filter.status);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handleclose = () => {
    setOpen(false);
  };

  const handleapi = () => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, search, filter.status);
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
        apiUrls.ProductTypeDelete,
        { ProductTypeId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        TenantlistAPI(pageNo, rowsPerPage, search, filter.status);
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
        apiUrls.ProductTypeActiveInActive,
        { ProductTypeId: item.productId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        SuccessMessage(response.data.message);
        TenantlistAPI(page, rowsPerPage, search, filter.status);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, rowsPerPage, search, e.target.value);
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Product Type" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <div className="contact-profile">
                <div className="d-flex align-items-center justify-content-between mb-30">
                  <TableTitle title="Manage Product Type" />
                  <div className="heading_width_search d-flex align-items-center gap-3">
                    {HasPermission("ProductTypeAdd") && (
                      <AddEditButton
                        handleClick={() => {
                          setAction("add");
                          setOpen(true);
                        }}
                        title="Add Product Type"
                      />
                    )}
                  </div>
                </div>

                <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                  <div className="filter-dropdown dropdown">
                    <Search handleSearch={handleSearch} />
                  </div>
                  <div className="filter-dropdown dropdown">
                    <StatusDropdown value={filter.status} fn={handleChange} />
                  </div>
                </div>

                <div className="task_table mb-30">
                  <div className="table-responsive">
                    <DynamicTable
                      data={tenantList}
                      columns={columns}
                      title="Product Type"
                      rowActions={["edit","delete"]}
                      edituser={handleedit}
                      handledelete={handledelete}
                      handlestatus={handlestatus}
                      deletepermission="ProductTypeDelete"
                      editpermission="ProductTypeEdit"
                    />
                    {tenantList && tenantList?.length > 0 && (
                      <div className="d-flex align-items-center justify-content-end bottom_nav">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 15, 25, 100]}
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
                <AddEditProductType
                  open={open}
                  handleclose={handleclose}
                  action={action}
                  LanguageListAPI={handleapi}
                  object={object}
                />
                <Delete
                  open={delOpen}
                  handleClose={handledelclose}
                  title={object.productName}
                  id={object?.productId}
                  handleDelete={handleDelete}
                  loder={loder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
