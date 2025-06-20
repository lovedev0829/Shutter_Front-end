import React, { useEffect, useState } from "react";
import {  Link, useParams } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, BackButton, Delete, ErrorMessage, HasPermission, SuccessMessage } from "../../../helpers/common";
import AddSinglecomponent from "./AddSinglecomponent";
import AddEditButton from "../../Form/AddEditButton";

export default function Details() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [object, setObject] = useState("");
  
  const param = useParams();

  const TenantlistAPI = async () => {
    let query = {
      searchValue: param.productId,
      pageNo: 1,
      recordPerPage: 10,
      tenantId: ""
      ,status:"2"
    };
    setLoader(true);
   try {
    const apiResponse = await callAPI(apiUrls.Product, {}, "POST", query);
    setLoader(false);
    if (apiResponse?.data?.isSuccess) {
        setObject("");
      setTenantList(apiResponse?.data?.data);
    } else {
      setTenantList([]);
      ErrorMessage(apiResponse?.data?.message)
    }
   } catch (error) {
    setLoader(false)
   }
  };
  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, [param.productId]);

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
        apiUrls.DeleteProductComponent,
        { id: id },
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
        <Header title="Products" />

        <div className="body_content">
          <div className="contact-profile">
          <BackButton link="/products"/>
         
            <div className="d-flex align-items-center justify-content-between mb-30">
                
              <TableTitle title="Products Details" />
            </div>
            <div className="new-job_list mb-30">
              <div className="row">
                <div className="col-lg-2 col-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Product Name</h6>
                    <span>{tenantList[0]?.productName}</span>
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
                    <span>{tenantList[0]?.markup}%</span>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Status</h6>
                    <span style={{color:tenantList[0]?.isActive?"green":"red"}}>{tenantList[0]?.isActive?"Active":"Inactive"}</span>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="additional_direction mb-2">
                    <h6 className="mb-1">Notes</h6>
                    <span>{tenantList[0]?.notes}</span>
                  </div>
                </div>
              </div>
            </div>
            {tenantList[0]?.isComponentAvailable &&
            <>
            <div className="d-flex align-items-center justify-content-between mb-30">
              <h2 className="body_heading width-left-border mb-0">
                Component Details
              </h2>
              <div className="heading_width_search d-flex align-items-center gap-3">
                {HasPermission("ProductsAdd") && (
                  <AddEditButton
                    handleClick={() => {
                      setOpen(true);
                    }}
                    title="Add Component"
                  />
                )}
              </div>
            </div>
            <div className="estimate-table task_table mb-30">
              <div className="table-responsive">
                <table className="table jobscheduletable">
                  <thead>
                    <tr>
                      <th scope="col">Component Name</th>
                      {/* <th scope="col">Qty</th> */}
                      <th scope="col">Expression Name</th>
                      <th scope="col"> Pricing Expression</th>
                        {(HasPermission("ProductsEdit") ||
                                              HasPermission("ProductsDelete")) && (
                      <th scope="col" className="text-end actionheading">
                        Action
                      </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tenantList[0]?.productComponents.map((val,i) => (
                      <tr key={i}>
                        <td><Link className="color-blue" to={`/component/detail/${val.componentId}`} >{val?.componentName}</Link></td>
                        {/* <td>{val?.quantity}</td> */}
                          <td>{val?.pricingExpressionName || "---"}</td>
                        <td>{val?.pricingExpressionFormula?.join("") || "--"}</td>
                        {(HasPermission("ProductsEdit") ||
                                              HasPermission("ProductsDelete")) && (
                        <td className="text-end actiondescription">
                          <span className="d-flex align-items-center justify-content-end gap-3">
                            {HasPermission("ProductsEdit") &&<img src="/image/editblue.svg" alt="" loading="lazy" style={{cursor:"pointer"}}   onClick={() => handleedit(val)}/>}
                           {HasPermission("ProductsDelete") && <img src="/image/deleteblue.svg" alt="" loading="lazy" onClick={() => handledelete(val)} style={{cursor:"pointer"}} />}
                          </span>
                        </td>
                         )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </>
}
            
          </div>
        </div>
      </div>

     {open && <AddSinglecomponent
        open={open}
        handleclose={handleclose}
        LanguageListAPI={TenantlistAPI}
        ProductId={param.productId}
        object={object}
        produttype={tenantList[0]?.productType}
        Listmaterial={tenantList[0]?.productComponents}
      />
     }
       <Delete open={delOpen} handleClose={handledelclose} title={object.componentName} id={object?.productComponentId} handleDelete={handleDelete} loder={loder}/>
    </>
  );
}
