import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { Manageapplication, Manageroletab } from "../../../SvgFile/Index";
import Tab from "../../Form/Tab";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ApiLoder, BackButton, ErrorMessage, FormatPhoneNumber, HasPermission, PreviewFiles } from "../../../helpers/common";
import AddEditContact from "./AddEditContact";
import AddEditButton from "../../Form/AddEditButton";
import Addresslist from "../Address/Addresslist";
import moment from "moment";
import Joblist from "../Jobs/Joblist";

export default function Detail() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
   const [tabdata, setTabdata] = useState("#pills-overview");
  const param = useParams();

 
  const Tablist = [
    {
      status: true,
      id: "#pills-overview",
      svg: <Manageapplication />,
      title: "Profile",
    },
    HasPermission("AddressView") && {
      status: false,
      id: "#pills-playbook",
      svg: <Manageroletab />,
      title: "Address",
    },
    HasPermission("JobView") && {
      status: false,
      id: "#pills-content",
      svg: <Manageroletab />,
      title: "Jobs",
    },
  ].filter(Boolean);
  
 const navigate = useNavigate();

  const TenantlistAPI = async () => {
    let query = {
      searchValue: param.contactId,
      pageNo: 1,
      recordPerPage: 10,
      tenantId: "",
      status:"2"
    };
    setLoader(true);
   try {
    const apiResponse = await callAPI(apiUrls.Contact, {}, "POST", query);
    setLoader(false);
    if (apiResponse?.data?.isSuccess) {
      const tenants = apiResponse?.data?.data;
      if (tenants?.length > 0) {
        if (tenants[0]?.isActive) {
          setTenantList(tenants);
        } else {
          navigate("/contacts");
        }
      } else {
        navigate("/contacts");
      }
    } else {
      setTenantList([]);
      navigate("/contacts");
      ErrorMessage(apiResponse?.data?.message)
    }
   } catch (error) {
    navigate("/contacts");
    setLoader(false)
   }
  };
  useEffect(() => {
    if (tabdata === "#pills-overview") {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [param.contactId,tabdata]);

  const handleTabchnage =  (value) => {
    setTabdata(value || Tablist[0].id)
  }
  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0].id;

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title={`Contacts / ${tenantList[0]?.firstName + " " + tenantList[0]?.lastName+ " " +(tenantList[0]?.suffix ?? "")}`} />

        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <Tab Tablist={Tablist} handleTabchnage={handleTabchnage}/>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                className={`tab-pane fade ${initialActiveTab === "#pills-overview" ? "show active" : ""
                }`}
                
                  id="pills-overview"
                  role="tabpanel"
                  aria-labelledby="pills-overview-tab"
                  tabIndex={0}
                >
                  {tabdata === "#pills-overview" && 
                  <>
                  <BackButton link="/contacts"/>
                 
                  <div className="d-flex align-items-center justify-content-between mb-30">
                    <TableTitle title="Contact Profile" />

                    <div className="heading_width_search d-flex align-items-center gap-3">
                      {HasPermission("ContactEdit") && (
                        <AddEditButton
                          handleClick={() => {
                            setOpen(true);
                          }}
                          title="Edit Profile"
                        />
                      )}
                    </div>
                  </div>
                  {HasPermission("ContactView") && (
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="professional_info">
                          <h6 className="font-16">Personal Information</h6>
                          <div className="row">
                            <div className="col-lg-4 col-6">
                              <div className="my-info">
                                <span className="d-block">Full Name</span>
                                <label className="d-block">
                                  {tenantList[0]?.firstName + " " + tenantList[0]?.lastName + " " +(tenantList[0]?.suffix ?? "")} 
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4 col-6">
                              <div className="my-info">
                                <span className="d-block">Contact Type</span>
                                <label className="d-block">
                                  {tenantList[0]?.contactType}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4 col-6">
                              <div className="my-info">
                                <span className="d-block">Phone Number</span>
                                <label className="d-block">
                                  {FormatPhoneNumber(tenantList[0]?.phoneNumber||"")}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Email Address</span>
                                <label className="d-block">
                                  {tenantList[0]?.email}
                                </label>
                              </div>
                            </div>

                            <div className="col-lg-4 col-6">
                              <div className="my-info">
                                <span className="d-block">Referral Source</span>
                                <label className="d-block">
                                  {tenantList[0]?.referral}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4 col-6">
                              <div className="my-info">
                                <span className="d-block">Website</span>
                                <label className="d-block">
                                  {tenantList[0]?.website}
                                </label>
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="my-info">
                                <span className="d-block">Notes</span>
                                <label className="d-block">
                                  {tenantList[0]?.notes}
                                </label>
                              </div>
                            </div>
                            {tenantList[0]?.taxExemptionVm
                              ?.exemptionCertificate && (
                              <div className="col-lg-12">
                                <div className="my-info">
                                  <span className="d-block">Tax Document</span>
                                   <PreviewFiles file={tenantList[0]?.taxExemptionVm
                              ?.exemptionCertificate}/>
                                </div>
                              </div>
                            )}

                            {tenantList[0]?.taxExemptionVm
                              ?.effectiveDate && (
                              <div className="col-lg-6 mt-3">
                                <div className="my-info">
                                  <span className="d-block">
                                    Effective Date
                                  </span>
                                  <label className="d-block">
                                    {moment(tenantList[0]?.taxExemptionVm?.effectiveDate).format("MM-DD-YYYY") || ""}
                                  </label>
                                </div>
                              </div>
                            )}
                            {tenantList[0]?.taxExemptionVm
                              ?.expiryDate && (
                              <div className="col-lg-6 mt-3">
                                <div className="my-info">
                                  <span className="d-block">Expiry Date</span>
                                  <label className="d-block">
                                  {moment(tenantList[0]?.taxExemptionVm?.expiryDate).format("MM-DD-YYYY") || ""}
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="professional_info">
                          <h6 className="font-16">Primary/Billing Address</h6>
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Full Name</span>
                                <label className="d-block">
                                {tenantList[0]?.billingAddressVm?.firstName + " " + tenantList[0]?.billingAddressVm?.lastName}
                                  
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Phone Number</span>
                                <label className="d-block">
                                  {FormatPhoneNumber(tenantList[0]?.billingAddressVm?.phoneNumber || "")}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Email Address</span>
                                <label className="d-block">
                                  {tenantList[0]?.billingAddressVm?.email}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Street Address</span>
                                <label className="d-block">
                                  {
                                    tenantList[0]?.billingAddressVm
                                      ?.streetAddress
                                  }
                                </label>
                              </div>
                            </div>
                          
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">State</span>
                                <label className="d-block">
                                  {tenantList[0]?.billingAddressVm?.stateName}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">City</span>
                                <label className="d-block">
                                  {tenantList[0]?.billingAddressVm?.city}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="my-info">
                                <span className="d-block">Zipcode</span>
                                <label className="d-block">
                                  {tenantList[0]?.billingAddressVm?.zipCode}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
}
                </div>
                <div
                  className={`tab-pane fade ${initialActiveTab === "#pills-playbook" ? "show active" : ""
                  }`}
                  id="pills-playbook"
                  role="tabpanel"
                  aria-labelledby="pills-playbook-tab"
                  tabIndex={0}
                >
                  <BackButton link="/contacts"/>
                  {HasPermission("AddressView") && tabdata === "#pills-playbook" && <Addresslist/>}
                </div>
                {HasPermission("JobView") && tabdata === "#pills-content" && <Joblist initialActiveTab={initialActiveTab}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <AddEditContact
          open={open}
          handleclose={() => setOpen(false)}
          action={"edit"}
          LanguageListAPI={TenantlistAPI}
          object={tenantList[0]}
        />
      )}
    </>
  );
}
