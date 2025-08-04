import React, { useState } from "react";
import Header from "../../../Layout/header";
import Tab from "../../Form/Tab";
import { ReportOrderReport, ReportReciptSvg, ReportTaxReport } from "../../../SvgFile/Index";
import FinanceReport from "./FinanceReport";
import OrderReport from "./OrderReport";
import TaxReport from "./TaxReport";
export default function Index() {
  const [tabdata, setTabdata] = useState("#pills-overview-tab");
  const Tablist = [
    {
      status: true,
      id: "#FinanceReports",
      svg: <ReportReciptSvg />,
      title: "Finance Reports",
    },
    {
      status: false,
      id: "#OrderReports",
      svg: <ReportOrderReport />,
      title: "Order Reports",
    },
    {
      status: false,
      id: "#TaxReports",
      svg: <ReportTaxReport/>,
      title: "Tax Reports",
    },
  ];
  const handleTabchnage = (value) => {
    setTabdata(value || Tablist[0].id);
  };
  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0].id;
  return (
    <>
      <div className="intersight_content">
        <Header title="Reports" />
        <div className="body_content">
          <div className="contact-profile">
            <div className="engage-tabs">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <Tab Tablist={Tablist} handleTabchnage={handleTabchnage} />
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className={`tab-pane fade ${
                    tabdata === "#FinanceReports" ? "show active" : ""
                  }`}
                  id="FinanceReports"
                  role="tabpanel"
                  aria-labelledby="pills-overview-tab"
                  tabIndex={0}
                >
                {tabdata === "#FinanceReports" &&   <FinanceReport /> }
                </div>
                <div
                  className={`tab-pane fade ${
                    initialActiveTab === "#OrderReports" ? "show active" : ""
                  }`}
                  id="OrderReports"
                  role="tabpanel"
                  aria-labelledby="pills-payment-tab"
                  tabIndex={0}
                >
                  {tabdata === "#OrderReports" && <OrderReport />}
                </div>
                <div
                  className={`tab-pane fade ${
                    initialActiveTab === "#TaxReports" ? "show active" : ""
                  }`}
                  id="TaxReports"
                  role="tabpanel"
                  aria-labelledby="pills-payment-tab"
                  tabIndex={0}
                >
                  {tabdata === "#TaxReports" && <TaxReport/>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
