import React from "react";
import { NavLink } from "react-router-dom";
import { HasPermission } from "../helpers/common";

export default function SideBarLink({ href, name, icon, handleClosemenu }) {
  const loginuser = JSON.parse(localStorage.getItem("userData"));

  const Tablist = [
    HasPermission("GHLView") &&
      !loginuser.isGHLConfigSameAsTenant && {
        id: "#ghl",
      },
    HasPermission("StripeView") && {
      id: "#Stripe",
    },
    HasPermission("EmailConfigurationView") && {
      id: "#Email",
    },
  ].filter(Boolean);

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
                const preference = ["#ghl", "#Stripe", "#Email"];
                activeTab =
                  preference.find((id) => Tablist.some((t) => t.id === id)) ||
                  "#ghl";
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
