import React, { useEffect } from "react";
import Header from "../../../Layout/header";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { useDebounce } from "use-debounce";

export default function Index() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  const [search, setsearch] = useState("");
  const [loder, setLoader] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (value) => {
    setsearch(value);
  };

  const handleChangePage = (event, newPage) => {
    TenantlistAPI(newPage + 1, rowsPerPage, search);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(pageNo, parseInt(event.target.value, 10), search);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, serach) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      status: "2",
     
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.SubtenantProductMarkup,
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
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI(1, rowsPerPage, debouncedSearch);
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const languageAdd = async (value, data, index) => {
    try {
      setLoader(true);
  
      // Ensure `value` is a valid number
      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        ErrorMessage("Please enter a valid number for markup.");
        setLoader(false);
        return;
      }
  
      const apiData = {
        productId: data.productId,
        markup: numericValue,
        id: data.id || null,
      };
  
      const apiResponse = await callAPI(
        !data.id
          ? apiUrls.SubtenantProductMarkupCreate
          : apiUrls.SubtenantProductMarkupUpdate,
        {},
        "POST",
        apiData
      );
  
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        SuccessMessage(apiResponse?.data?.message);
        TenantlistAPI(page, rowsPerPage, search);
       
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
      ErrorMessage("An error occurred while processing your request.");
    }
  };
  
  const DebouncedInput = ({ row, index }) => {
    const [markupValue, setMarkupValue] = useState(row?.markup);
    const [debouncedValue, setDebouncedValue] = useState(row?.markup);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(markupValue);
      }, 1000); // Adjust the delay (500ms) as needed
  
      return () => {
        clearTimeout(handler); // Clear timeout if the user is typing again
      };
    }, [markupValue]);
  
    useEffect(() => {
      if (debouncedValue !== row?.markup) {
        languageAdd(debouncedValue, row, index);
      }
    }, [debouncedValue, row, index]);
    return (
      <input
        type="text"
        style={{width:"84px"}}
        value={markupValue}
        className="form-control"
        onChange={(e) => setMarkupValue(e.target.value)}
      />
    );
  };
  // selectboxdropdown
  return (
    <>
      <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Product Markup" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Product Markup" />
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
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Markup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantList && tenantList.length > 0 ? (
                      tenantList.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{row?.productName}</td>
                          <td>
                          <DebouncedInput row={row} index={rowIndex} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center border-0 no-records"
                          colSpan={2 + 1}
                        >
                          <img
                            src="/image/no-records.svg"
                            alt=" "
                            loading="lazy"
                            className="img-fluid"
                          />
                          <p className="font-14">No Records Found.</p>
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
          </div>
        </div>
      </div>
    </>
  );
}
