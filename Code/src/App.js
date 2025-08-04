import { useSelector } from "react-redux";
import "./App.css";
import { RenderRout } from "./router";
import { useEffect } from "react";


function App() {
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
  const primaryColor = users?.primaryColor || user?.primaryColor || "#0e0d32";

  const darkenColor = (color, percentage) => {
    color = color.replace("#", "");
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percentage / 100))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percentage / 100))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percentage / 100))));
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const darkerColor = darkenColor(primaryColor, 50); // Darken by 20%

  function changeFavicon() {
    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = users?.logo || user?.logo ||"/image/logo.svg";
    document.title =
      users?.companyName || user?.companyName
        ? `${users?.companyName || user?.companyName} ${
            ""
          }`.trim()
        : document.title;
  }

  useEffect(() => {
    changeFavicon();
    // eslint-disable-next-line
  }, [user]);

  return (
    <>
      <style>
        {`
          .intersight_menu, .blue-btn, .gradient_bg ,  .bs-wizard > .bs-wizard-step > .bs-wizard-dot, .filter_option a.active {
            background-color: ${primaryColor};
          }
          
             .engage-tabs .nav .nav-item .nav-link.active {
    border-bottom: 3px solid ${primaryColor};
    color: ${primaryColor};
}
    
   
     .border-btn, .imagesMultiple {
    border: 1px solid ${primaryColor};
    color: ${primaryColor};
    
}


 .sidebar-accordian .accordion-body , .sidebar-accordian .accordion-button ,.sidebar-accordian .accordion-button:not(.collapsed) ,.sidebar-accordian .accordion-header {
     background-color: ${primaryColor};
    
}


    .engage-tabs .nav .nav-item .nav-link.active svg path {
    fill: ${primaryColor};
}
      
.menu_scrollbar::-webkit-scrollbar-thumb, .brand button , .person_icon {
  background: ${user?.code !== "admin" && darkerColor};
}
  .menu_div li a.active{
  background:${user?.code !== "admin" && darkenColor(primaryColor, -30)};
  color:${user?.code !== "admin" && "white"}
  }
  .menu_div li a:hover {
  background:${user?.code !== "admin" && darkenColor(primaryColor, -30)};
  }

  .menu_div li a.active svg path, .menu_div li a:hover svg path {
    fill: ${user?.code !== "admin" && darkenColor(primaryColor, 50)};
}
    .blue-btn:hover, .border-btn:hover {
    background-color: ${
      user?.code !== "admin" && darkenColor(primaryColor, 50)
    };
   
}
    .form-check-input:checked {
        background-color: ${
          user?.code !== "admin" && darkenColor(primaryColor, 50)
        };
    border-color: ${user?.code !== "admin" && darkenColor(primaryColor, 50)};
    }
    .bs-wizard > .bs-wizard-step > .progress > .progress-bar {
     background:${primaryColor}
    }
     .Toastify__toast-theme--colored.Toastify__toast--success{
     background:${primaryColor}
     }
     .dasboard_title{
     color: ${primaryColor};
     }
     .product_question{
     background:${primaryColor}
     }
     .color-blue, .stongtag{
     color: ${primaryColor};
     }
.engage-tabs .window-measurement-tabs .nav .nav-item .nav-link.active {
    border-bottom: 3px solid ${primaryColor};
    background-color: ${primaryColor};
   
}
    .blue-outline-btn {
    border: 1px solid ${primaryColor};
    
}
    .blue-outline-btn:hover {
    background-color: ${primaryColor};
  
}
    .estimate-header  {
    background-color: ${primaryColor};
   
}
     .loaderproduct  {
     border-top: 2px solid ${primaryColor};
   
}
    .option-scroll {
  scrollbar-color: ${primaryColor} #f0f0f0;
}
  .intersight_home, .notification_alert{
   background-color: ${primaryColor};
      }
   .loading-screens{
     background: linear-gradient(135deg, ${darkenColor(primaryColor, 50)}, ${primaryColor});
   }
  
        `}
      </style>
      <RenderRout />
    </>
  );
}

export default App;
