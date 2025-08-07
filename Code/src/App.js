import { useSelector } from "react-redux";
import "./App.css";
import { RenderRout } from "./router";
import { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

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

  const lightenColor = (color, percentage) => {
    color = color.replace("#", "");
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    r = Math.min(255, Math.floor(r + (255 - r) * (percentage / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percentage / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percentage / 100)));
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const darkerColor = darkenColor(primaryColor, 50); // Darken by 50%

  // Create Material UI Theme based on user's primary color
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: primaryColor,
        dark: darkenColor(primaryColor, 20),
        light: lightenColor(primaryColor, 20),
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#f50057',
        dark: '#c51162',
        light: '#ff5983',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1px',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0,0,0,0.1)',
      '0px 4px 8px rgba(0,0,0,0.1)',
      '0px 8px 16px rgba(0,0,0,0.1)',
      '0px 12px 24px rgba(0,0,0,0.1)',
      '0px 16px 32px rgba(0,0,0,0.1)',
      '0px 20px 40px rgba(0,0,0,0.1)',
      '0px 24px 48px rgba(0,0,0,0.1)',
      '0px 28px 56px rgba(0,0,0,0.1)',
      '0px 32px 64px rgba(0,0,0,0.1)',
      '0px 36px 72px rgba(0,0,0,0.1)',
      '0px 40px 80px rgba(0,0,0,0.1)',
      '0px 44px 88px rgba(0,0,0,0.1)',
      '0px 48px 96px rgba(0,0,0,0.1)',
      '0px 52px 104px rgba(0,0,0,0.1)',
      '0px 56px 112px rgba(0,0,0,0.1)',
      '0px 60px 120px rgba(0,0,0,0.1)',
      '0px 64px 128px rgba(0,0,0,0.1)',
      '0px 68px 136px rgba(0,0,0,0.1)',
      '0px 72px 144px rgba(0,0,0,0.1)',
      '0px 76px 152px rgba(0,0,0,0.1)',
      '0px 80px 160px rgba(0,0,0,0.1)',
      '0px 84px 168px rgba(0,0,0,0.1)',
      '0px 88px 176px rgba(0,0,0,0.1)',
      '0px 92px 184px rgba(0,0,0,0.1)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  }), [primaryColor]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
