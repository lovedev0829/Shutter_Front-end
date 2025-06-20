import React from "react";
import { NavLink } from "react-router-dom";

export default function SideBarLink({ href, name, icon,handleClosemenu }) {
  return (
    <>
      <li>
        <NavLink
          to={href}
          className={({ isActive, isPending }) =>
            isPending ? "" : isActive ? "active" : ""
          }
          onClick={() => {
            let activeTab;
            switch (href) {
              case "/contacts":
                activeTab = "#pills-overview";
                break;
              case "/users":
                activeTab = "#manageapplication";
                break;
              case "/reports":
                activeTab = "#FinanceReports";
                break;
                 case "/configuration":
                activeTab = "#ghl";
                break;
              default:
                activeTab = "#vendorlisttabd";
            }
            handleClosemenu();
            localStorage.setItem("activeTab2", activeTab);
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: icon }}></span>
          {name}
        </NavLink>
      </li>
    </>
  );
}
