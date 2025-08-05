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
  const [tenantList, setTenantList] = useState([]);
  const userName = user?.username;
  const currentTenantId = user?.tenantId;

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

  const getTenantsListByUsername = async () => {
    const apiResponse = await callAPI(apiUrls.GetTenantsListByUsername, {UserName: userName}, "GET");
    if (apiResponse?.data?.isSuccess) {
      setTenantList(apiResponse?.data?.data);
    }
  }

  useEffect(() => {
    NotificationlistAPI();
    getTenantsListByUsername();
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
        case "Order":
        localStorage.setItem("activeTab", "#orders");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/order/preview/${notification?.typeId}`);
        break;
         case "Payment":
        localStorage.setItem("activeTab", "#invoice");
        localStorage.setItem("activeTab2", "#pills-content");
        navigate(`/contacts/payment/${notification?.typeId}`);
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

  const handleTenantChange = async (e) => {
    const tenantId = e.target.value;
    try {
        const apiResponse = await callAPI(apiUrls.GetUserDataForTenantSwitch, {
            UserName: userName,
            TenantId: tenantId
        }, "GET");
      
        if (apiResponse?.data?.isSuccess) {

            const completeUserData = apiResponse.data.data;

            localStorage.setItem("userData", JSON.stringify(completeUserData));
            localStorage.setItem("accessToken", completeUserData.token);
            
            window.location.reload();
        } 
    } catch (error) {
        console.error("Error switching tenant:", error);
    }
  }

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
        <div 
        className="top_header d-flex align-items-center justify-content-between" 
        style={{ 
          padding: '10px 15px',
          gap: '10px',
          flexWrap: 'nowrap',
          minHeight: '60px'
        }}
      >
          <div 
            className="tenant-selector d-flex align-items-center" 
            style={{ 
              gap: '8px', 
              minWidth: '150px', 
              maxWidth: '280px',
              flexShrink: 0
            }}
          >
            <label 
              htmlFor="tenant-select" 
              className="form-label mb-0 text-nowrap d-none d-md-block" 
              style={{ 
                fontSize: '13px', 
                fontWeight: '500',
                color: '#6c757d'
              }}
            >
              Tenant:
            </label>
            <select 
              id="tenant-select"
              className="form-select form-select-sm" 
              value={currentTenantId} 
              onChange={(e) => handleTenantChange(e)} 
              style={{ 
                flex: '1',
                minWidth: '100px',
                fontSize: '13px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                padding: '4px 8px'
              }}
              title="Select Tenant"
            >
              {tenantList?.map((tenant) => (
                <option key={tenant?.tenantId} value={tenant?.tenantId}>
                  {tenant?.code}
                </option>
              ))}
            </select>
          </div>
        <h1 
          className="header-title text-center flex-grow-1 mx-3"
          style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', 
            fontWeight: '600',
            margin: '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <span className="d-none d-lg-inline">
            {users?.companyName ? users?.companyName : user?.companyName} -{" "}
          </span>
          {props.title}
        </h1>

        <div
          className="header_notification position-relative"
          style={{ 
            cursor: "pointer",
            flexShrink: 0,
            minWidth: '50px'
          }}
          onClick={() => setOpen(!open)}
        >
          <div 
            className="header_icon position-relative notification d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
          >
            <img 
              src="/image/notification.svg" 
              alt="Notifications" 
              loading="lazy"
              style={{ width: '20px', height: '20px' }}
            />
            {notifications?.filter((notif) => !notif?.isReaded)?.length > 0 && (
              <span 
                className="notification_alert position-absolute"
                style={{
                  top: '-2px',
                  right: '-2px',
                  minWidth: '18px',
                  height: '18px',
                  fontSize: '11px',
                  borderRadius: '50%',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {notifications?.filter((notif) => !notif?.isReaded)?.length}
              </span>
            )}
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
