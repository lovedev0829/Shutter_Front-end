import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ApiLoder,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import AddEditButton from "../../Form/AddEditButton";
import { TablePagination } from "@mui/material";
import AddEditdocument from "./AddEditdocument";
import moment from "moment";

function AllDocumentlist({listdata}) {
  const param = useParams();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [documentslistAPI, setdocumentslistAPI] = useState([]);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    DocumentslistAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    DocumentslistAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const DocumentslistAPI = async (page, perpage) => {
    let query = {
      searchValue: "",
      pageNo: page ? page : 1,
      recordPerPage: perpage ? perpage : 10,
      tenantId: "",
      productType: "",
      status: "2",
      jobId: param?.JobId,
    };
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.UploadDocumentGetAll,
        {},
        "POST",
        query
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setdocumentslistAPI(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setdocumentslistAPI([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    DocumentslistAPI(1, rowsPerPage);
    setPage(1);
    // eslint-disable-next-line
  }, []);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const refreshDocumentslistAPI = () => {
    let pageNo = 1;
    DocumentslistAPI(page, rowsPerPage);
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
        apiUrls.UploadDocumentDelete,
        { documentId: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        let pageNo = 1;
        DocumentslistAPI(page, rowsPerPage);
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

 const getFileExtension = (url) => {
  return url.split(".").pop().split(/[#?]/)[0];
};


  const handleDownload = async (documentId,blobUrl, documentTitle) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.UploadDocumentDownloadBlobAsBase64,
        { documentId: documentId },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        const decodedString = atob(response?.data?.data);
        const byteArray = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
          byteArray[i] = decodedString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], {
          type: "application/pdf",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${documentTitle?.replace(/\s+/g, '')}.${getFileExtension(blobUrl)}`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

   const Loginuser = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
                  <ApiLoder open={loder} />{" "}
      <div className="d-block d-md-flex align-items-center justify-content-between mb-30">
        <div className="d-flex gap-3 invoice-new">
          <h2 className="body_heading width-left-border mb-0">Documents</h2>
        </div>
        {HasPermission("JobContactAdd") &&  listdata?.tenantId === Loginuser?.tenantId &&(
          <AddEditButton
            handleClick={() => {
              setAction("add");
              setOpen(true);
            }}
            title="Add Document"
          />
        )}
      </div>
      <div className="estimate-table task_table mb-30">
        <div className="table-responsive">
          <table className="table jobscheduletable">
            <thead>
              <tr>
                <th scope="col">SN</th>
                <th scope="col">Title</th>
                <th scope="col">Uploaded By</th>
                <th scope="col">Date</th>
                <th scope="col">Document</th>

                {(HasPermission("JobContactEdit") ||
                  HasPermission("JobContactDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                  <th scope="col" className="text-end actionheading">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {documentslistAPI?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{(page - 1) * rowsPerPage + index + 1}</td>
                      <td>{item?.documentTitle}</td>
                      <td>{item?.createdBy}</td>
                      <td>
                        {" "}
                        {moment(item?.createdAt).format(
                          "MM-DD-YYYY"
                        )}{" "}
                      </td>
                      <td>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleDownload(item?.documentId,item?.blobUrl, item?.documentTitle)
                          }
                        >
                          <img
                            src="/image/export.svg"
                            className=""
                            alt=" "
                            loading="lazy"
                          />{" "}
                        </button>
                      </td>

                      {(HasPermission("JobContactEdit") ||
                        HasPermission("JobContactDelete")) && listdata?.tenantId === Loginuser?.tenantId && (
                        <td className="text-end actiondescription">
                          <span className="d-flex align-items-center justify-content-end gap-3">
                            {HasPermission("JobContactEdit") && (
                              <img
                                src="/image/editblue.svg"
                                role="button"
                                alt=""
                                loading="lazy"
                                onClick={() => handleedit(item)}
                              />
                            )}
                            {HasPermission("JobContactDelete") && (
                              <img
                                src="/image/deleteblue.svg"
                                alt=""
                                loading="lazy"
                                role="button"
                                onClick={() => handledelete(item)}
                              />
                            )}
                          </span>
                        </td>
                      )}
                    </tr>
                  </>
                );
              })}
              {(!documentslistAPI || documentslistAPI?.length === 0) && (
                <tr>
                  <td className="text-center border-0 no-records" colSpan={7}>
                    <img
                      src="/image/no-records.svg"
                      alt=" "
                      loading="lazy"
                      className="img-fluid"
                    />
                    <p className="font-14">No Document Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {documentslistAPI && documentslistAPI?.length > 0 && (
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
      {open && (
        <AddEditdocument
          open={open}
          handleclose={handleclose}
          action={action}
          DocumentslistAPI={refreshDocumentslistAPI}
          selecteddata={object}
          jobid={param?.JobId}
         handleDownload={handleDownload}
        />
      )}
      <Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object?.documentTitle}
        id={object?.documentId}
        handleDelete={handleDelete}
        loder={loder}
      />
    </>
  );
}

export default AllDocumentlist;
