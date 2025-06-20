import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import moment from "moment";
import { useNavigate } from "react-router-dom";
export default function Header(props) {
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState(false);
  const [notifications, setnotifications] = useState([]);

  const NotificationlistAPI = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllNotification, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        setnotifications(apiResponse?.data?.data);
      } else {
        setnotifications([]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    NotificationlistAPI();
  }, []);

  const navigate = useNavigate();

  const NotificationType = (notification) => {
    switch (notification.type) {
      case "Job":
        localStorage.setItem("activeTab", "#window-measurement");
        localStorage.setItem("activeTab2", "#pills-overview");
        navigate(`/contacts/job/${notification?.typeId}`);
        break;
      case "Contact":
        localStorage.setItem("activeTab", "#window-measurement");
        localStorage.setItem("activeTab2", "#pills-overview");
        navigate(`/contacts/detail/${notification?.typeId}`);
        break;
      case "Estimate":
        localStorage.setItem("activeTab", "#estimate");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/estimate/preview/${notification?.typeId}`);
        break;
      case "Tenant":
        navigate(`/tenant`);
        break;
      case "SubTenant":
        navigate(`/subtenant`);
        break;
      case "User":
        localStorage.setItem("activeTab2", "#manageapplication");
        navigate(`/users`);
        break;
      case null:
      case "":
        console.log(`Unknown Type Notification: ${notification.body}`);
        break;
      default:
        console.log(`Other Type (${notification.type}): ${notification.body}`);
    }
  };

  const handlestatus = async (data) => {
    NotificationType(data);
    try {
      const response = await callAPI(
        apiUrls.UpdateNotification,
        { id: data.id },
        "POST",
        {}
      );

      if (response.data.isSuccess) {
        
      } else {
      }
    } catch (error) {}
  };

  const dropdownRef = useRef(null); // Ref for detecting outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div className="top_header d-flex align-items-center justify-content-between">
        <h1>
          {users?.companyName ? users?.companyName : user?.companyName} -{" "}
          {props.title}
        </h1>

        <div
          className="header_notification"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <div className="header_icon position-relative notification d-flex align-items-center justify-content-center">
            <img src="/image/notification.svg" alt="" loading="lazy"/>
            <span className="notification_alert">
              {notifications?.filter((notif) => !notif?.isReaded)?.length}
            </span>
          </div>
        </div>

        {open && (
          <div className="notification-dropdownn" ref={dropdownRef}>
            <div className="dropdown-headern">
              <span>NOTIFICATIONS</span>
             
            </div>
            <div className="notification-listn">
              {notifications?.map((notif, i) => (
                <div
                  key={i}
                  className={`notification-itemn ${
                    notif?.isReaded ? "read" : "unread"
                  }`}
                  onClick={() => handlestatus(notif)}
                >
                  <div className="notification-textn">
                    <span className="notification-subjectn">
                      {notif?.subject}
                    </span>
                    <span className="notification-messagen">{notif?.body}</span>
                    <span className="notification-timen">
                      {moment(notif?.createdDate).format(
                        "MM-DD-YYYY || hh:mm A"
                      )}{" "}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
