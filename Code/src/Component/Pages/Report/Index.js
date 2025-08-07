import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, useTheme, useMediaQuery } from "@mui/material";
import Header from "../../../Layout/header";
import { ReportOrderReport, ReportReciptSvg, ReportTaxReport } from "../../../SvgFile/Index";
import FinanceReport from "./FinanceReport";
import OrderReport from "./OrderReport";
import TaxReport from "./TaxReport";

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
          <Paper 
            sx={{ 
              width: '100%', 
              mb: { xs: 1, md: 3 },
              mx: { xs: 1, md: 0 },
              maxWidth: { xs: 'calc(100vw - 16px)', md: '100%' }
            }}
          >
            <Tabs
              value={getCurrentTabIndex()}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 44, md: 48 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem' },
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  minWidth: { xs: 'auto', md: 160 },
                  px: { xs: 1, md: 2 },
                  '&.Mui-selected': {
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-flexContainer': {
                  flexWrap: { xs: 'nowrap', md: 'wrap' },
                },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              {Tablist.map((tab, index) => (
                <Tab
                  key={index}
                  icon={isMobile ? null : tab.svg}
                  label={isMobile ? tab.title.replace(" Reports", "") : tab.title}
                  iconPosition="start"
                  sx={{ 
                    gap: { xs: 0, md: 1 },
                    '& .MuiTab-iconWrapper': {
                      display: { xs: 'none', md: 'block' }
                    }
                  }}
                />
              ))}
            </Tabs>

            <Box sx={{ 
              p: { xs: 1, sm: 2, md: 3 },
              overflow: 'hidden'
            }}>
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
