import React, { useEffect } from "react";
import { useState } from "react";
import TableTitle from "../../Form/TableTitle";
import Search from "../../Form/Search";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { TablePagination } from "@mui/material";
import { ApiLoder } from "../../../helpers/common";
import { useDebounce } from "use-debounce";
import { defaultConfig } from "../../../config";
import ExportFile from "../../../helpers/ExportFile";

export default function TaxReport() {
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
    TenantlistAPI(
      newPage + 1,
      rowsPerPage,
      search,
    );
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    TenantlistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      search,
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };
  const TenantlistAPI = async (page, perpage, serach) => {
    let query = {
      searchValue: serach ? serach : "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      status: 2,
      
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetTaxReport,
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
  useEffect(() => {
    TenantlistAPI(
      1,
      rowsPerPage,
      debouncedSearch,
    );
    setPage(1);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  
  return (
    <>
      {loder && <ApiLoder />}

      <div className="contact-profile">
        <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
          <TableTitle title={`${"All Tax Report"}`} />
          <div className="heading_width_search d-flex align-items-center gap-3">
            <div className="greencolor">
              Total Number Of All Tax Report :{paginatedItems}
            </div>
          </div>
        </div>
        <div className="d-block d-md-flex align-items-center gap-2  justify-content-between">
          <div className="d-block d-md-flex gap-2 mb-30 ">
            <div className="filter-dropdown dropdown ">
              <Search handleSearch={handleSearch} />
            </div>
          </div>
          <div className="d-flex gap-2 mb-30 justify-content-between">
            {/* <div className="btn blue-btn small_btn">
              <PrintSvg />
              <Link to="#">Print</Link>
            </div> */}
            <div className="btn blue-btn small_btn">
              <ExportFile
                type="tax"
                serach={search}
                page={page}
                perpage={rowsPerPage}
                status={"2"}
                Url={apiUrls.ExportContacts}
               
              />
            </div>
          </div>
        </div>
        <div className="estimate-table task_table mb-30">
          <div className="table-responsive">
            <table className="table jobscheduletable">
              <thead>
                <tr>
                  <th scope="col">Estimation Code</th>
                  <th scope="col">Job Code</th>
                  <th scope="col">Contact Name</th>

                  <th scope="col" className="text-end actionheading">
                    Tax Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenantList?.map((val, i) => (
                  <tr key={i}>
                    <td>{val?.estimateCode}</td>
                    <td>{val?.jobDetails?.jobUniqueId}</td>
                    <td>{val?.jobDetails?.firstName +" " + val?.jobDetails?.lastName + " " + (val?.jobDetails?.suffix ?? "")}</td>

                    <td>
                      {" "}
                      <span className="d-flex align-items-center justify-content-end gap-3">
                        {defaultConfig.currencySign} {val?.tax}
                      </span>
                    </td>
                  </tr>
                ))}

                {(!tenantList || tenantList?.length === 0) && (
                  <tr>
                    <td className="text-center border-0 no-records" colSpan={7}>
                      <img
                        src="/image/no-records.svg"
                        alt=" "
                        loading="lazy"
                        className="img-fluid"
                      />
                      <p className="font-14">No Finance Report</p>
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
    </>
  );
}
