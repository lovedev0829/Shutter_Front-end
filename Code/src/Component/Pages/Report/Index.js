import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import Header from "../../../Layout/header";
import { ReportOrderReport, ReportReciptSvg, ReportTaxReport } from "../../../SvgFile/Index";
import FinanceReport from "./FinanceReport";
import OrderReport from "./OrderReport";
import TaxReport from "./TaxReport";

export default function Index() {
  const [tabdata, setTabdata] = useState("#FinanceReports");
  
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

  const handleTabChange = (event, newValue) => {
    const selectedTab = Tablist[newValue];
    setTabdata(selectedTab.id);
  };

  const getCurrentTabIndex = () => {
    return Tablist.findIndex(tab => tab.id === tabdata);
  };

  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0].id;

  return (
    <>
      <div className="intersight_content">
        <Header title="Reports" />
        <div className="body_content">
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    minHeight: 60,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    '&.Mui-selected': {
                      fontWeight: 600,
                    },
                  },
                }}
              >
                {Tablist.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.svg}
                    label={tab.title}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {tabdata === "#FinanceReports" && <FinanceReport />}
              {(tabdata === "#OrderReports" || initialActiveTab === "#OrderReports") && 
               tabdata === "#OrderReports" && <OrderReport />}
              {(tabdata === "#TaxReports" || initialActiveTab === "#TaxReports") && 
               tabdata === "#TaxReports" && <TaxReport />}
            </Box>
          </Paper>
        </div>
      </div>
    </>
  );
}
