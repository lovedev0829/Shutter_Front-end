import { Link, NavLink } from "react-router-dom";
import SideBarLink from "./SideBarLink";
import { Dashboardsvg } from "../SvgFile/Index";
import { useEffect, useRef, useState } from "react";
import Logout from "../Component/Pages/Auth/Logout";
import { useSelector } from "react-redux";
import { HasPermission } from "../helpers/common";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState("");
  const admin_links = JSON.parse(localStorage.getItem("userData"))?.menu;

  const handleClose = () => {
    setOpen(false);
  };

  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleClosemenu = () => {
    setShow("");
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(""); // Hide the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const parentCategories = {
    Contact: "Order management",
    Job: "Order management",
    Order: "Order management",
    ArchiveCustomer: "Order management",
    Reports: "Order management",
    EstimationBreakdown: "Order management",
    Partners: "User management",
    ManageProduct: "User management",
    Users: "User management",
    Vendors: "User management",
    Material: "Master",
    Component: "Master",
    Products: "Master",
    Options: "Master",
    Expression: "Master",
    OptionExpression: "Master",
    ProductType: "Settings",
    JobType: "Settings",
    JobTitle: "Settings",
    Tax: "Settings",
    Discount: "Settings",
    Setting: "Settings",
  };
  const excludedRoles = [
    "Roles",
    "Address",
    "Estimate",
    "Window",
    "Invoice",
    "JobSchedule",
    "VendorOrder",
    "Stripe",
    "GHL",
    "PartnerContact",
    "EmailConfiguration",
    "ProductMarkup",
    "JobContact",
  ];

  const groupLinksByCategory = (links) => {
    const grouped = {};

    // Group links by category, excluding some roles
    links?.forEach((item) => {
      if (excludedRoles.includes(item.roleName)) return;
      const category = parentCategories[item.roleName] || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });

    // Add virtual Configuration link if permission exists
    if (
      HasPermission("GHLView") ||
      HasPermission("StripeView") ||
      HasPermission("EmailConfigurationView")
    ) {
      if (!grouped["Settings"]) grouped["Settings"] = [];
      grouped["Settings"].push({
        roleDisplayName: "Configuration",
        url: "/configuration",
        icon: `<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.445 1.78772C4.30061 1.02129 5.30557 0.440215 6.39667 0.0810547C6.70857 0.47206 7.1046 0.787723 7.55532 1.00457C8.00603 1.22141 8.49983 1.33386 9 1.33355C9.5001 1.33396 9.99386 1.22164 10.4446 1.00494C10.8953 0.788245 11.2914 0.472741 11.6033 0.081888C12.6944 0.441048 13.6994 1.02212 14.555 1.78855C14.3729 2.25393 14.298 2.75434 14.3358 3.25263C14.3736 3.75092 14.5231 4.2343 14.7733 4.66689C15.023 5.1003 15.3672 5.47185 15.7802 5.75391C16.1933 6.03596 16.6646 6.22127 17.1592 6.29606C17.3931 7.42013 17.3931 8.58032 17.1592 9.70439C16.1925 9.85272 15.3008 10.4211 14.7733 11.3336C14.523 11.7662 14.3734 12.2498 14.3356 12.7482C14.2978 13.2467 14.3728 13.7472 14.555 14.2127C13.6993 14.9789 12.6944 15.5597 11.6033 15.9186C11.2914 15.5277 10.8953 15.2122 10.4446 14.9955C9.99386 14.7788 9.5001 14.6665 9 14.6669C8.49983 14.6666 8.00603 14.779 7.55532 14.9959C7.1046 15.2127 6.70857 15.5284 6.39667 15.9194C5.30555 15.5603 4.30058 14.9792 3.445 14.2127C3.62727 13.7472 3.70229 13.2467 3.66449 12.7482C3.62669 12.2498 3.47704 11.7662 3.22667 11.3336C2.97691 10.9003 2.63271 10.5289 2.21965 10.247C1.8066 9.96509 1.33531 9.77991 0.840834 9.70522C0.606929 8.58087 0.606929 7.42041 0.840834 6.29606C1.33539 6.22127 1.80672 6.03596 2.21978 5.75391C2.63284 5.47185 2.977 5.1003 3.22667 4.66689C3.47686 4.2343 3.6264 3.75092 3.6642 3.25263C3.702 2.75434 3.62708 2.2531 3.445 1.78772ZM10.25 10.1644C10.5366 10.0014 10.7882 9.78339 10.9902 9.52282C11.1922 9.26225 11.3406 8.9643 11.427 8.64612C11.5134 8.32794 11.536 7.99581 11.4935 7.66886C11.451 7.34191 11.3443 7.0266 11.1794 6.74107C11.0146 6.45554 10.7949 6.20544 10.5329 6.00517C10.271 5.8049 9.97211 5.65841 9.65337 5.57414C9.33462 5.48987 9.00235 5.46948 8.67569 5.51414C8.34903 5.55881 8.03443 5.66764 7.75 5.83439C7.18048 6.16827 6.76615 6.71385 6.59741 7.35209C6.42867 7.99033 6.51922 8.66941 6.84931 9.24113C7.17941 9.81284 7.72223 10.2308 8.35934 10.4038C8.99645 10.5767 9.67611 10.4907 10.25 10.1644Z" fill="white"></path></svg>`,
        isVirtual: true,
      });
    }

    // Convert object to array with Order management first
    const ordered = [];

    if (grouped["Order management"]) {
      ordered.push({
        category: "Order management",
        items: grouped["Order management"],
      });
      delete grouped["Order management"];
    }

    // Push remaining categories in any order
    Object.entries(grouped).forEach(([category, items]) => {
      ordered.push({ category, items });
    });

    return ordered;
  };

  // Usage:
  const groupedLinks = groupLinksByCategory(admin_links);

  return (
    <>
      <div className="intersight_menu" ref={menuRef}>
        <div className="top_menu">
          {/*Start Logo Dropdown*/}
          <div className="brand">
            <button
              className="navbar-toggler navbar-toggle"
              type="button"
              onClick={() => setShow((prev) => (prev === "show" ? "" : "show"))}
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div className="dropdown">
              <button
                className="border-0 w-100 d-flex align-items-center"
                type="button"
              >
                <span
                  className="d-flex align-items-center justify-content-center"
                  style={{ overflow: "hidden" }}
                >
                  <img
                    src={users?.logo ? users?.logo : user?.logo}
                    alt=""
                    loading="lazy"
                    style={{ maxHeight: "30px", maxWidth: "100%" }}
                  />
                </span>{" "}
                {users?.companyName ? users?.companyName : user?.companyName}{" "}
              </button>
            </div>
          </div>

          {/*End Logo Dropdown*/}
          {/*Start Menu*/}
          <div className={`intersight_home ${show}`}>
            <div className="menu_div">
              <ul>
                <li onClick={() => setShow("")}>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span>
                      <Dashboardsvg />
                    </span>
                    Dashboard
                  </NavLink>
                </li>
                <li className="without_label">Workspace</li>
              </ul>

              <div
                className="accordion sidebar-accordian"
                id="accordionExample"
              >
                {groupedLinks.map(({ category, items }, index) => {
                  const isFirst = index === 0; // check if first item

                  return (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button ${
                            isFirst ? "" : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded={isFirst ? "true" : "false"}
                          aria-controls={`collapse${index}`}
                        >
                          {category}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          isFirst ? "show" : ""
                        }`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <ul className="menu_scrollbar">
                            {items.map((item, i) => (
                              <SideBarLink
                                key={i}
                                href={item?.url}
                                name={item.roleDisplayName}
                                icon={item.icon}
                                handleClosemenu={handleClosemenu}
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <ul className="menu_scrollbar">
                {admin_links?.map(
                  (item, i) =>
                    item.roleName !== "Roles" &&
                    item.roleName !== "Address" &&
                    item.roleName !== "Estimate" &&
                    item.roleName !== "Window" &&
                    item.roleName !== "Invoice" &&
                    item.roleName !== "JobSchedule" &&
                    item.roleName !== "VendorOrder" &&
                    item.roleName !== "Stripe" &&
                    item.roleName !== "GHL" &&
                    item.roleName !== "PartnerContact" &&
                    item.roleName !== "EmailConfiguration" &&
                    item.roleName !== "ProductMarkup" &&
                    item.roleName !== "JobContact" && (
                      <SideBarLink
                        key={i}
                        href={item?.url}
                        name={item.roleName}
                        icon={item.icon}
                        handleClosemenu={handleClosemenu}
                      />
                    )
                )}
                {(HasPermission("GHLView") ||
                  HasPermission("StripeView") ||
                  HasPermission("EmailConfigurationView")) && (
                  <li
                    onClick={() => {
                      setShow("");
                      localStorage.setItem("activeTab2", "#ghl");
                    }}
                  >
                    <NavLink
                      to="/configuration"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span>
                        <svg
                          width="18"
                          height="16"
                          viewBox="0 0 18 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.445 1.78772C4.30061 1.02129 5.30557 0.440215 6.39667 0.0810547C6.70857 0.47206 7.1046 0.787723 7.55532 1.00457C8.00603 1.22141 8.49983 1.33386 9 1.33355C9.5001 1.33396 9.99386 1.22164 10.4446 1.00494C10.8953 0.788245 11.2914 0.472741 11.6033 0.081888C12.6944 0.441048 13.6994 1.02212 14.555 1.78855C14.3729 2.25393 14.298 2.75434 14.3358 3.25263C14.3736 3.75092 14.5231 4.2343 14.7733 4.66689C15.023 5.1003 15.3672 5.47185 15.7802 5.75391C16.1933 6.03596 16.6646 6.22127 17.1592 6.29606C17.3931 7.42013 17.3931 8.58032 17.1592 9.70439C16.1925 9.85272 15.3008 10.4211 14.7733 11.3336C14.523 11.7662 14.3734 12.2498 14.3356 12.7482C14.2978 13.2467 14.3728 13.7472 14.555 14.2127C13.6993 14.9789 12.6944 15.5597 11.6033 15.9186C11.2914 15.5277 10.8953 15.2122 10.4446 14.9955C9.99386 14.7788 9.5001 14.6665 9 14.6669C8.49983 14.6666 8.00603 14.779 7.55532 14.9959C7.1046 15.2127 6.70857 15.5284 6.39667 15.9194C5.30555 15.5603 4.30058 14.9792 3.445 14.2127C3.62727 13.7472 3.70229 13.2467 3.66449 12.7482C3.62669 12.2498 3.47704 11.7662 3.22667 11.3336C2.97691 10.9003 2.63271 10.5289 2.21965 10.247C1.8066 9.96509 1.33531 9.77991 0.840834 9.70522C0.606929 8.58087 0.606929 7.42041 0.840834 6.29606C1.33539 6.22127 1.80672 6.03596 2.21978 5.75391C2.63284 5.47185 2.977 5.1003 3.22667 4.66689C3.47686 4.2343 3.6264 3.75092 3.6642 3.25263C3.702 2.75434 3.62708 2.2531 3.445 1.78772ZM10.25 10.1644C10.5366 10.0014 10.7882 9.78339 10.9902 9.52282C11.1922 9.26225 11.3406 8.9643 11.427 8.64612C11.5134 8.32794 11.536 7.99581 11.4935 7.66886C11.451 7.34191 11.3443 7.0266 11.1794 6.74107C11.0146 6.45554 10.7949 6.20544 10.5329 6.00517C10.271 5.8049 9.97211 5.65841 9.65337 5.57414C9.33462 5.48987 9.00235 5.46948 8.67569 5.51414C8.34903 5.55881 8.03443 5.66764 7.75 5.83439C7.18048 6.16827 6.76615 6.71385 6.59741 7.35209C6.42867 7.99033 6.51922 8.66941 6.84931 9.24113C7.17941 9.81284 7.72223 10.2308 8.35934 10.4038C8.99645 10.5767 9.67611 10.4907 10.25 10.1644Z"
                            fill="white"
                          ></path>
                        </svg>
                      </span>
                      Configuration
                    </NavLink>
                  </li>
                )}
              </ul> */}
              <div className="bottom_menu">
                <p className="text-white">
                  {/* Looking for something?{" "}
                  <Link to="#" className="d-block text-decoration-underline">
                    Help &amp; Support
                  </Link> */}
                </p>
                <div className="user_person">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle border-0 w-100 d-flex align-items-center p-0"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="d-flex align-items-center justify-content-center person_icon">
                        <img src="/image/person.svg" alt="" loading="lazy" />
                      </span>
                      <label className="person_name">
                        {users?.firstName ? users?.firstName : user?.firstName}{" "}
                        {users?.lastName ? users?.lastName : user?.lastName}{" "}
                        {users?.suffix ? users?.suffix : user?.suffix}
                        <span className="d-block">
                          {users?.email ? users?.email : user?.email}
                        </span>
                      </label>
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li onClick={() => setShow("")}>
                        <Link className="dropdown-item" to="/update-profile">
                          Profile Info
                        </Link>
                      </li>
                      <li onClick={() => setShow("")}>
                        <Link className="dropdown-item" to="/chnage-password">
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => setOpen(true)}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End Start Menu*/}
        </div>
      </div>
      <Logout open={open} handleClose={handleClose} />
    </>
  );
}
