import { useNavigate, useParams } from "react-router-dom";
import {
  ApiLoder,
  BackButton,
  ErrorMessage,
  HasPermission,
  JobUi,
} from "../../../helpers/common";
import Header from "../../../Layout/header";
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import WindowTable from "../Window/WindowTable";
import EstimateList from "../Estimate/EstimateList";
import Tablist2 from "../../Form/Tablist2";
import OrderList from "../Orders/OrderList";
import JobTab from "../../Form/JobTab";
import InvoiceList from "../Invoice/InvoiceList";
import Jobschedulelist from "../Jobschedule/Jobschedulelist";
import JobContactList from "../JobContact/JobContactList";
import AllDocumentlist from "../Documentupload/AllDocumentlist";

export default function JobDetiels() {
  const [tenantList, setTenantList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [tabdata, setTabdata] = useState("#window-measurement");

  const navigate = useNavigate();
  const param = useParams();

  const TenantlistAPI = async () => {
    setLoader(true);
    let query = {
      tenantId: "",
      searchValue: param.JobId,
      pageNo: 1,
      recordPerPage: 10,
      status: 2,
      vendor: "",
      productType: "",
      jobStatus: "",
      address: "",
    };
    try {
      const apiResponse = await callAPI(apiUrls.Job, {}, "POST", query);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        if (apiResponse?.data?.data?.length>0) {
          setTenantList(apiResponse?.data?.data);
        } else {
          navigate("/contacts");
        }
      } else {
        navigate("/contacts");
        setTenantList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      navigate("/contacts");
      setLoader(false);
    }
  };

  useEffect(() => {
    TenantlistAPI();
    // eslint-disable-next-line
  }, []);

  const Tablist = [
    HasPermission("WindowView") && {
      status: true,
      id: "#window-measurement",
      title: "Window Measurements",
    },
    HasPermission("EstimateView") && {
      status: false,
      id: "#estimate",
      title: "Estimate",
    },
    HasPermission("OrderView") && {
      status: false,
      id: "#orders",
      title: "Orders",
    },
    HasPermission("InvoiceView") && {
      status: false,
      id: "#invoice",
      title: "Invoice",
    },
    HasPermission("JobScheduleView") && {
      status: false,
      id: "#jobscheduletab",
      title: "Job Schedule",
    },
    HasPermission("JobContactView") && {
      status: false,
      id: "#contacttab",
      title: "Contacts",
    },
    HasPermission("JobContactView") && {
      status: false,
      id: "#documenttab",
      title: "Documents",
    },
  ].filter(Boolean);

  const initialActiveTab = localStorage.getItem("activeTab") || Tablist[0].id;

  const handleGettab = (value) => {
    setTabdata(value || Tablist[0].id);
  };

  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header
          title={`Contacts / ${
            tenantList[0]?.contactFirstName +
            " " +
            tenantList[0]?.contactLasttName +
            " " +
            (tenantList[0]?.suffix ?? "")
          }`}
        />

        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <JobTab contactId={tenantList[0]?.contactId} />
              </ul>

              <div className="row">
                <BackButton
                  link={`/contacts/detail/${tenantList[0]?.contactId}`}
                />
                <div className="col-lg-12">
                  <div className="new-job_list">
                    <JobUi tenantList={tenantList[0]} />
                  </div>
                </div>
              </div>
              {/* 2nd tab */}
              <div className="window-measurement-tabs mt-4">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  <Tablist2 Tablist={Tablist} handleGettab={handleGettab} />
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  {/* Window Measurements tab content */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#window-measurement"
                        ? "show active"
                        : ""
                    }`}
                    id="window-measurement"
                    role="tabpanel"
                    aria-labelledby="pills-overview-tab"
                    tabIndex={0}
                  >
                    {HasPermission("WindowView") &&
                      tabdata === "#window-measurement" && (
                        <WindowTable listdata={tenantList[0]} />
                      )}
                  </div>
                  {/* estimate tab */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#estimate" ? "show active" : ""
                    }`}
                    id="estimate"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("EstimateView") &&
                      tabdata === "#estimate" && (
                        <EstimateList listdata={tenantList[0]} />
                      )}
                  </div>
                  {/* order tab */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#orders" || tabdata === "#orders"
                        ? "show active"
                        : ""
                    }`}
                    id="orders"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("OrderView") && tabdata === "#orders" && (
                      <OrderList JobId={param.JobId} listdata={tenantList[0]}/>
                    )}
                  </div>
                  {/* invoice tab */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#invoice" ? "show active" : ""
                    }`}
                    id="invoice"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("InvoiceView") && tabdata === "#invoice" && (
                      <InvoiceList
                        JobId={param.JobId}
                        contactId={tenantList[0]?.contactId}
                        listdata={tenantList[0]}
                      />
                    )}
                  </div>
                  {/* job schedule tab */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#jobscheduletab"
                        ? "show active"
                        : ""
                    }`}
                    id="jobscheduletab"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("JobScheduleView") &&
                      tabdata === "#jobscheduletab" && <Jobschedulelist listdata={tenantList[0]}/>}
                  </div>
                  {/*  contact tab */}
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#contacttab" ? "show active" : ""
                    }`}
                    id="contacttab"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("JobContactView") &&
                      tabdata === "#contacttab" && <JobContactList listdata={tenantList[0]}/>}
                  </div>
                  <div
                    className={`tab-pane fade ${
                      initialActiveTab === "#documenttab" ? "show active" : ""
                    }`}
                    id="documenttab"
                    role="tabpanel"
                    aria-labelledby="pills-playbook-tab"
                    tabIndex={0}
                  >
                    {HasPermission("JobContactView") &&
                      tabdata === "#documenttab" && <AllDocumentlist listdata={tenantList[0]}/>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
