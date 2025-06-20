import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  BackButton,
  Delete,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";
import AddSinglematerial from "./AddSinglematerial";
import AddEditButton from "../../Form/AddEditButton";

export default function Details() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [object, setObject] = useState("");
  const param = useParams();

  const TenantlistAPI = async () => {
    try {
      let query = {
        searchValue: param.componentId,
        pageNo: 1,
        recordPerPage: 10,
        tenantId: "",
        status: "2",
      };
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.Component, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setObject("");
        setTenantList(apiResponse?.data?.data);
      } else {
        setTenantList([]);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, [param.componentId]);

  const handleclose = () => {
    setOpen(false);
    setObject("");
  };

  const handledelclose = () => {
    setDelOpen(false);
    setObject("");
  };

  const handleDelete = async (id) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.DeleteComponentMaterial,
        { Id: id },
        "POST",
        {}
      );
      setLoader(false);
      if (response.data.isSuccess) {
        handledelclose();
        SuccessMessage(response.data.message);
        TenantlistAPI();
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

  const handleedit = (item) => {
    setObject(item);
    setOpen(true);
  };

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Component" />

        <div className="body_content">
          <div className="contact-profile">
            <BackButton link="/component" />

            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Component Details" />
            </div>
            <div className="new-job_list mb-30">
              <div className="row">
                <div className="col-lg-2 col-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Component Name</h6>
                    <span>{tenantList[0]?.componentName}</span>
                  </div>
                </div>
                <div className="col-lg-2 col-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Product Type</h6>
                    <span>{tenantList[0]?.productTypeName}</span>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Markup %</h6>
                    <span>{tenantList[0]?.markupPercentage}%</span>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Status</h6>
                    <span
                      style={{
                        color: tenantList[0]?.isActive ? "green" : "red",
                      }}
                    >
                      {tenantList[0]?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                {/* <div className="col-lg-4 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Pricing Expression</h6>
                    <span>{tenantList[0]?.expressionName}</span><br></br>
                    <span>{tenantList[0]?.expressionFormulae}</span>
                  </div>
                </div> */}
                <div className="col-lg-2 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Notes</h6>
                    <span>{tenantList[0]?.notes}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-30">
              <h2 className="body_heading width-left-border mb-0">
                Material Details
              </h2>
              <div className="heading_width_search d-flex align-items-center gap-3">
                {HasPermission("ComponentAdd") && (
                  <AddEditButton
                    handleClick={() => {
                      setOpen(true);
                    }}
                    title="Add Material"
                  />
                )}
              </div>
            </div>
            <div className="estimate-table task_table mb-30">
              <div className="table-responsive">
                <table className="table jobscheduletable">
                  <thead>
                    <tr>
                      <th scope="col">Raw Material</th>
                       <th scope="col">Expression Name</th>
                      <th scope="col"> Pricing Expression</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Waste %</th>
                      {(HasPermission("ComponentEdit") ||
                        HasPermission("ComponentDelete")) && (
                        <th scope="col" className="text-end actionheading">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tenantList[0]?.componentMaterials.map((val, i) => (
                      <tr key={i}>
                        <td>
                          <Link
                            className="color-blue"
                            to={`/material`}
                            
                          >
                            {val?.materialName}
                          </Link>{" "}
                        </td>
                         <td>{val?.expressionName}</td>
                        <td>{val?.displayArray?.join("")}</td>
                        <td>{val?.quantity?val?.quantity:"-"}</td>
                        <td>{val?.wasteFactor?`${val?.wasteFactor}%`:"-"}</td>
                        {(HasPermission("ComponentEdit") ||
                          HasPermission("ComponentDelete")) && (
                          <td className="text-end actiondescription">
                            <span className="d-flex align-items-center justify-content-end gap-3">
                            {HasPermission("ComponentEdit") && <img
                                src="/image/editblue.svg"
                                alt=""
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleedit(val)}
                              />
                            }
                              {HasPermission("ComponentDelete") &&
                              <img
                                src="/image/deleteblue.svg"
                                alt=""
                                loading="lazy"
                                onClick={() => handledelete(val)}
                                style={{ cursor: "pointer" }}
                              />
}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

     {open &&<AddSinglematerial
        open={open}
        handleclose={handleclose}
        LanguageListAPI={TenantlistAPI}
        componentId={param.componentId}
        object={object}
        Listmaterial={tenantList[0]?.componentMaterials}
        produttype={tenantList[0]?.productType}
      />
     }
      {delOpen &&<Delete
        open={delOpen}
        handleClose={handledelclose}
        title={object.materialName}
        id={object?.componentMaterialId}
        handleDelete={handleDelete}
        loder={loder}
      />
}
    </>
  );
}
