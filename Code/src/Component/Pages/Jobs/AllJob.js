import React, { useEffect, useState } from "react";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  FormatPhoneNumber,
  HasPermission,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import { 
  TablePagination,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Container,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  TableContainer,
  Stack,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import PartnerDropdown from "../../../helpers/PartnerDropdown";
import ExportFile from "../../../helpers/ExportFile";
import AddEditButton from "../../Form/AddEditButton";
import AddEditJob from "./AddEditJob";
import GetAllContact from "../../../helpers/GetAllContact";
import Search from "../../Form/Search";
import { useDebounce } from "use-debounce";
import { useNavigate, useParams } from "react-router-dom";

// Enhanced Status Tab Component
function StatusTab({ status, isActive, onClick, count = 0 }) {
  const theme = useTheme();
  
  const getJobStatusSVG = (statusName) => {
    switch (statusName) {
      case "Won":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.24633 17.904C4.82201 17.4796 5.0432 17.5993 4.01977 17.3253C3.55541 17.2008 3.14721 16.9616 2.77807 16.675L0.562734 22.1066C0.348378 22.6325 0.748769 23.2038 1.31615 23.1823L3.88891 23.0841L5.65844 24.9533C6.04906 25.3654 6.73461 25.237 6.94896 24.7111L9.49047 18.4796C8.96117 18.7746 8.37377 18.9474 7.76635 18.9474C6.8142 18.9474 5.91967 18.5768 5.24633 17.904ZM19.1955 22.1066L16.9802 16.675C16.6111 16.9621 16.2029 17.2008 15.7385 17.3253C14.7097 17.6007 14.9353 17.4806 14.512 17.904C13.8386 18.5768 12.9436 18.9474 11.9914 18.9474C11.384 18.9474 10.7966 18.7741 10.2673 18.4796L12.8088 24.7111C13.0232 25.237 13.7092 25.3654 14.0994 24.9533L15.8694 23.0841L18.4421 23.1823C19.0095 23.2038 19.4099 22.632 19.1955 22.1066ZM13.3459 16.799C14.092 16.0397 14.1775 16.1051 15.24 15.8156C15.9182 15.6305 16.4485 15.091 16.6301 14.4005C16.9954 13.0138 16.9006 13.1813 17.8972 12.1667C18.3938 11.6613 18.5876 10.9245 18.406 10.234C18.0413 8.84829 18.0408 9.04165 18.406 7.65445C18.5876 6.96402 18.3938 6.2272 17.8972 5.72183C16.9006 4.70718 16.9954 4.87417 16.6301 3.48794C16.4485 2.79751 15.9182 2.25796 15.24 2.0729C13.8787 1.70132 14.0427 1.79849 13.0452 0.783353C12.5486 0.277982 11.8245 0.0802277 11.1462 0.265286C9.78539 0.63638 9.97533 0.636868 8.61205 0.265286C7.93383 0.0802277 7.20971 0.277493 6.71312 0.783353C5.71654 1.798 5.8806 1.70132 4.51879 2.0729C3.84057 2.25796 3.31029 2.79751 3.12865 3.48794C2.76391 4.87417 2.85814 4.70718 1.86156 5.72183C1.36498 6.2272 1.17064 6.96402 1.35277 7.65445C1.71752 9.03921 1.71801 8.84585 1.35277 10.2335C1.17113 10.924 1.36498 11.6608 1.86156 12.1667C2.85814 13.1813 2.76342 13.0138 3.12865 14.4005C3.31029 15.091 3.84057 15.6305 4.51879 15.8156C5.61156 16.1134 5.6931 16.0666 6.41234 16.799C7.05834 17.4567 8.06469 17.5744 8.84105 17.0832C9.15151 16.8861 9.51165 16.7814 9.87938 16.7814C10.2471 16.7814 10.6073 16.8861 10.9177 17.0832C11.6936 17.5744 12.6999 17.4567 13.3459 16.799ZM5.27269 8.78921C5.27269 6.19986 7.33519 4.10074 9.87914 4.10074C12.4231 4.10074 14.4856 6.19986 14.4856 8.78921C14.4856 11.3786 12.4231 13.4777 9.87914 13.4777C7.33519 13.4777 5.27269 11.3786 5.27269 8.78921Z"
              fill={isActive ? theme.palette.primary.contrastText : "#9C9BA3"}
            />
          </svg>
        );
      case "New":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8791 0.588013C6.18968 0.588013 0.76976 6.00793 0.76976 12.6974C0.76976 19.3868 6.18968 24.8068 12.8791 24.8068C19.5686 24.8068 24.9885 19.3868 24.9885 12.6974C24.9885 6.00793 19.5686 0.588013 12.8791 0.588013ZM15.6672 17.6827L11.3606 14.5529C11.2092 14.4406 11.1213 14.2648 11.1213 14.0792V5.86145C11.1213 5.53918 11.385 5.27551 11.7073 5.27551H14.051C14.3733 5.27551 14.6369 5.53918 14.6369 5.86145V12.5851L17.7375 14.8409C18.0012 15.0314 18.0549 15.3976 17.8645 15.6613L16.4875 17.5558C16.2971 17.8146 15.9309 17.8732 15.6672 17.6827Z"
              fill={isActive ? theme.palette.primary.contrastText : "#9C9BA3"}
            />
          </svg>
        );
      case "Completed":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5312 21.875H2.34375C1.04932 21.875 0 20.8257 0 19.5312V2.34375C0 1.04932 1.04932 0 2.34375 0H19.5312C20.8257 0 21.875 1.04932 21.875 2.34375V19.5312C21.875 20.8257 20.8257 21.875 19.5312 21.875ZM9.53682 17.087L18.5212 8.10259C18.8263 7.79751 18.8263 7.30283 18.5212 6.99775L17.4164 5.89292C17.1113 5.58784 16.6166 5.58779 16.3115 5.89292L8.98438 13.22L5.56353 9.79912C5.25845 9.49404 4.76377 9.49404 4.45864 9.79912L3.35381 10.904C3.04873 11.209 3.04873 11.7037 3.35381 12.0088L8.43193 17.0869C8.73706 17.3921 9.23169 17.3921 9.53682 17.087Z"
              fill={isActive ? theme.palette.primary.contrastText : "#9C9BA3"}
            />
          </svg>
        );
      case "Lost":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 25 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.0043 7.45655L19.684 8.01514C19.5668 8.22217 19.3168 8.30811 19.0941 8.22608C18.6332 8.0542 18.2113 7.80811 17.8402 7.49952C17.6605 7.35108 17.6136 7.08936 17.7308 6.88623L18.0511 6.32764C17.7816 6.01514 17.5707 5.65186 17.4301 5.25733H16.7855C16.5511 5.25733 16.348 5.08936 16.309 4.85499C16.2308 4.38624 16.2269 3.89405 16.309 3.40577C16.348 3.17139 16.5511 2.99952 16.7855 2.99952H17.4301C17.5707 2.60499 17.7816 2.2417 18.0511 1.9292L17.7308 1.37061C17.6136 1.16749 17.6566 0.905766 17.8402 0.757329C18.2113 0.448735 18.6371 0.202641 19.0941 0.0307663C19.3168 -0.0512649 19.5668 0.0346725 19.684 0.241704L20.0043 0.800298C20.4144 0.726079 20.8324 0.726079 21.2426 0.800298L21.5629 0.241704C21.6801 0.0346725 21.9301 -0.0512649 22.1527 0.0307663C22.6136 0.202641 23.0355 0.448735 23.4066 0.757329C23.5863 0.905766 23.6332 1.16749 23.516 1.37061L23.1957 1.9292C23.4652 2.2417 23.6761 2.60499 23.8168 2.99952H24.4613C24.6957 2.99952 24.8988 3.16748 24.9379 3.40186C25.016 3.87061 25.0199 4.3628 24.9379 4.85108C24.8988 5.08545 24.6957 5.25733 24.4613 5.25733H23.8168C23.6761 5.65186 23.4652 6.01514 23.1957 6.32764L23.516 6.88623C23.6332 7.08936 23.5902 7.35108 23.4066 7.49952C23.0355 7.80811 22.6097 8.0542 22.1527 8.22608C21.9301 8.30811 21.6801 8.22217 21.5629 8.01514L21.2426 7.45655C20.8363 7.53077 20.4144 7.53077 20.0043 7.45655ZM19.5941 5.15967C21.098 6.31592 22.8129 4.60108 21.6566 3.09717C20.1527 1.93702 18.4379 3.65577 19.5941 5.15967ZM15.0902 11.1714L16.4066 11.8276C16.8011 12.0542 16.973 12.5347 16.8168 12.9644C16.4691 13.9097 15.7855 14.7769 15.1527 15.5347C14.8636 15.8823 14.3636 15.9683 13.9691 15.7417L12.8324 15.0855C12.2074 15.6206 11.4808 16.0464 10.6879 16.3237V17.6362C10.6879 18.0894 10.3636 18.48 9.91834 18.5581C8.9574 18.7222 7.94959 18.73 6.95349 18.5581C6.50427 18.48 6.17224 18.0933 6.17224 17.6362V16.3237C5.37927 16.0425 4.65271 15.6206 4.02771 15.0855L2.89099 15.7378C2.50037 15.9644 1.99646 15.8784 1.7074 15.5308C1.07459 14.773 0.406617 13.9058 0.0589605 12.9644C-0.0972895 12.5386 0.0745855 12.0581 0.469117 11.8276L1.7699 11.1714C1.61755 10.355 1.61755 9.51514 1.7699 8.69483L0.469117 8.03467C0.0745855 7.80811 -0.101196 7.32764 0.0589605 6.90186C0.406617 5.95655 1.07459 5.08936 1.7074 4.33155C1.99646 3.98389 2.49646 3.89795 2.89099 4.12452L4.02771 4.78077C4.65271 4.24561 5.37927 3.81983 6.17224 3.54249V2.22608C6.17224 1.77686 6.49255 1.38624 6.93787 1.30811C7.8988 1.14405 8.91052 1.13624 9.90662 1.3042C10.3558 1.38233 10.6879 1.76905 10.6879 2.22608V3.53858C11.4808 3.81983 12.2074 4.2417 12.8324 4.77686L13.9691 4.12061C14.3597 3.89405 14.8636 3.97999 15.1527 4.32764C15.7855 5.08545 16.4496 5.95264 16.7972 6.89795C16.9535 7.32373 16.8011 7.8042 16.4066 8.03467L15.0902 8.69092C15.2426 9.51124 15.2426 10.3511 15.0902 11.1714ZM10.4965 11.9956C12.809 8.9878 9.37537 5.5542 6.36755 7.8667C4.05505 10.8745 7.48865 14.3081 10.4965 11.9956ZM20.0043 19.1323L19.684 19.6909C19.5668 19.898 19.3168 19.9839 19.0941 19.9019C18.6332 19.73 18.2113 19.4839 17.8402 19.1753C17.6605 19.0269 17.6136 18.7651 17.7308 18.562L18.0511 18.0034C17.7816 17.6909 17.5707 17.3276 17.4301 16.9331H16.7855C16.5511 16.9331 16.348 16.7651 16.309 16.5308C16.2308 16.062 16.2269 15.5698 16.309 15.0815C16.348 14.8472 16.5511 14.6753 16.7855 14.6753H17.4301C17.5707 14.2808 17.7816 13.9175 18.0511 13.605L17.7308 13.0464C17.6136 12.8433 17.6566 12.5815 17.8402 12.4331C18.2113 12.1245 18.6371 11.8784 19.0941 11.7065C19.3168 11.6245 19.5668 11.7105 19.684 11.9175L20.0043 12.4761C20.4144 12.4019 20.8324 12.4019 21.2426 12.4761L21.5629 11.9175C21.6801 11.7105 21.9301 11.6245 22.1527 11.7065C22.6136 11.8784 23.0355 12.1245 23.4066 12.4331C23.5863 12.5815 23.6332 12.8433 23.516 13.0464L23.1957 13.605C23.4652 13.9175 23.6761 14.2808 23.8168 14.6753H24.4613C24.6957 14.6753 24.8988 14.8433 24.9379 15.0776C25.016 15.5464 25.0199 16.0386 24.9379 16.5269C24.8988 16.7612 24.6957 16.9331 24.4613 16.9331H23.8168C23.6761 17.3276 23.4652 17.6909 23.1957 18.0034L23.516 18.562C23.6332 18.7651 23.5902 19.0269 23.4066 19.1753C23.0355 19.4839 22.6097 19.73 22.1527 19.9019C21.9301 19.9839 21.6801 19.898 21.5629 19.6909L21.2426 19.1323C20.8363 19.2065 20.4144 19.2065 20.0043 19.1323ZM19.5941 16.8315C21.098 17.9878 22.8129 16.273 21.6566 14.769C20.1527 13.6128 18.4379 15.3276 19.5941 16.8315Z"
              fill={isActive ? theme.palette.primary.contrastText : "#9C9BA3"}
            />
          </svg>
        );
      default:
        return (
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 4.5H14V3.5C14 2.70435 13.6839 1.94129 13.1213 1.37868C12.5587 0.816071 11.7956 0.5 11 0.5H9C8.20435 0.5 7.44129 0.816071 6.87868 1.37868C6.31607 1.94129 6 2.70435 6 3.5V4.5H3C2.20435 4.5 1.44129 4.81607 0.87868 5.37868C0.316071 5.94129 0 6.70435 0 7.5V16.5C0 17.2956 0.316071 18.0587 0.87868 18.6213C1.44129 19.1839 2.20435 19.5 3 19.5H17C17.7956 19.5 18.5587 19.1839 19.1213 18.6213C19.6839 18.0587 20 17.2956 20 16.5V7.5C20 6.70435 19.6839 5.94129 19.1213 5.37868C18.5587 4.81607 17.7956 4.5 17 4.5ZM8 3.5C8 3.23478 8.10536 2.98043 8.29289 2.79289C8.48043 2.60536 8.73478 2.5 9 2.5H11C11.2652 2.5 11.5196 2.60536 11.7071 2.79289C11.8946 2.98043 12 3.23478 12 3.5V4.5H8V3.5ZM18 16.5C18 16.7652 17.8946 17.0196 17.7071 17.2071C17.5196 17.3946 17.2652 17.5 17 17.5H3C2.73478 17.5 2.48043 17.3946 2.29289 17.2071C2.10536 17.0196 2 16.7652 2 16.5V11C2.97544 11.3869 3.97818 11.7011 5 11.94V12.53C5 12.7952 5.10536 13.0496 5.29289 13.2371C5.48043 13.4246 5.73478 13.53 6 13.53C6.26522 13.53 6.51957 13.4246 6.70711 13.2371C6.89464 13.0496 7 12.7952 7 12.53V12.32C7.99435 12.4554 8.99649 12.5255 10 12.53C11.0035 12.5255 12.0057 12.4554 13 12.32V12.53C13 12.7952 13.1054 13.0496 13.2929 13.2371C13.4804 13.4246 13.7348 13.53 14 13.53C14.2652 13.53 14.5196 13.4246 14.7071 13.2371C14.8946 13.0496 15 12.7952 15 12.53V11.94C16.0218 11.7011 17.0246 11.3869 18 11V16.5ZM18 8.81C17.0274 9.22049 16.0244 9.55483 15 9.81V9.5C15 9.23478 14.8946 8.98043 14.7071 8.79289C14.5196 8.60536 14.2652 8.5 14 8.5C13.7348 8.5 13.4804 8.60536 13.2929 8.79289C13.1054 8.98043 13 9.23478 13 9.5V10.24C11.0113 10.54 8.98875 10.54 7 10.24V9.5C7 9.23478 6.89464 8.98043 6.70711 8.79289C6.51957 8.60536 6.26522 8.5 6 8.5C5.73478 8.5 5.48043 8.60536 5.29289 8.79289C5.10536 8.98043 5 9.23478 5 9.5V9.83C3.97562 9.57483 2.9726 9.24049 2 8.83V7.5C2 7.23478 2.10536 6.98043 2.29289 6.79289C2.48043 6.60536 2.73478 6.5 3 6.5H17C17.2652 6.5 17.5196 6.60536 17.7071 6.79289C17.8946 6.98043 18 7.23478 18 7.5V8.81Z"
              fill={isActive ? theme.palette.primary.contrastText : "#9C9BA3"}
            />
          </svg>
        );
    }
  };

  return (
    <Button
      onClick={onClick}
      variant={isActive ? "contained" : "outlined"}
      startIcon={getJobStatusSVG(status?.jobStatusName || "All")}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 0.75, sm: 1 },
        minWidth: { xs: 'auto', sm: 120 },
        width: { xs: '100%', sm: 'auto' },
        fontSize: { xs: '0.8rem', sm: '0.875rem' },
        border: '1px solid',
        borderColor: isActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5),
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'primary.contrastText' : 'text.primary',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: isActive ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
        },
        transition: 'all 0.2s ease',
      }}
    >
      {status?.jobStatusName || "All"}
      {count > 0 && (
        <Chip
          label={count}
          size="small"
          sx={{
            ml: { xs: 0.5, sm: 1 },
            height: { xs: 18, sm: 20 },
            backgroundColor: isActive ? alpha(theme.palette.primary.contrastText, 0.2) : alpha(theme.palette.primary.main, 0.1),
            color: isActive ? 'primary.contrastText' : 'primary.main',
            fontWeight: 600,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        />
      )}
    </Button>
  );
}

// Enhanced Table Header Cell Component
function EnhancedTableCell({ column, filter, onSort, onFilter }) {
  const theme = useTheme();
  
  return (
    <TableCell
      sx={{
        fontWeight: 700,
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        color: 'text.primary',
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderBottom: '2px solid',
        borderBottomColor: 'primary.main',
        whiteSpace: 'nowrap',
        position: 'relative',
        py: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Header with sort */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {column.label}
          </Typography>
          
          {column.sort && (
            <IconButton
              size="small"
              onClick={() => onSort(column.key)}
              sx={{
                p: 0.5,
                color: filter.sortColumn === column.key ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              {filter.sortColumn === column.key && filter.sortDirection === 'desc' ? (
                <ArrowDownIcon fontSize="small" />
              ) : (
                <ArrowUpIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
        
        {/* Search input */}
        {column.sort && (
          <TextField
            size="small"
            placeholder="Search..."
            value={filter.columnFilters.find((f) => f.field === column.key)?.value || ""}
            onChange={(e) => onFilter(column.key, e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: 80, sm: 120 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                borderRadius: 1.5,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.5),
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputBase-input': {
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.75, sm: 1 },
              },
            }}
          />
        )}
      </Box>
    </TableCell>
  );
}

export default function AllJob() {
  const theme = useTheme();
  const [JobsList, setJobsList] = useState([]);
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [JobStatus, setJobStatus] = useState([]);
  const [filter, setFilter] = useState({
    jobStatus: "",
    tenantId: "",
    contactId: "",
    sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],
  });
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [search, setsearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const param = useParams();

  const StatusList = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      if (apiResponse?.data?.isSuccess) {
        if (param.id) {
          const foundItem = apiResponse?.data?.data?.find(
            (item) => item.jobStatusId === param.id
          );
          if (foundItem) {
            JobslistAPI(
              1,
              rowsPerPage,
              filter.tenantId,
              foundItem,
              filter.contactId,
              search,
              filter.sortColumn,
              filter.sortDirection,
              filter.columnFilters
            );
            setFilter((val) => {
              return { ...val, jobStatus: foundItem };
            });
          }
        }

        setJobStatus(apiResponse?.data?.data);
      } else {
        setJobStatus([]);
      }
    } catch (error) {
      setJobStatus([]);
    }
  };

  const JobslistAPI = async (
    page,
    perpage,
    tenantId,
    jobStatus,
    customerId,
    searchValue,
    sortColumn,
    sortDirection,
    columnFilters
  ) => {
    setLoader(true);
    try {
      const body = {
        searchValue: searchValue ? searchValue : "",
        pageNo: page ? page : 1,
        recordPerPage: perpage ? perpage : 10,
        tenantId: tenantId ? tenantId : "",
        status: 2,
        jobStatus: jobStatus ? jobStatus?.jobStatusId : "",
        customerId: customerId ? customerId : "",
        sortColumn: sortColumn ? sortColumn : "",
        sortDirection: sortDirection ? sortDirection : "asc",
        columnFilters: columnFilters || []
      };
      
      const apiResponse = await callAPI(apiUrls.GetAllJobs, {}, "POST", body);
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        setJobsList(apiResponse?.data?.data);
        setPaginatedItems(apiResponse?.data?.totalRecords);
      } else {
        setJobsList([]);
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    StatusList();
    // eslint-disable-next-line
  }, []);

  const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);

  useEffect(() => {
    JobslistAPI(
      1,
      rowsPerPage,
      filter.tenantId,
      filter.jobStatus,
      filter.contactId,
      debouncedSearch,
      filter.sortColumn,
      filter.sortDirection,
      debouncedSearchcolumn
    );
    
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedSearchcolumn]);

  const columns = [
    { key: "jobCode", label: "Job Code", sort: true },
    { key: "contactFirstName", label: "Contact Name", sort: true },
    { key: "contactEmail", label: "Contact Email", sort: true },
    { key: "contactPhone", label: "Contact Phone", sort: true },
    { key: "companyName", label: "Partner/Tenant", sort: true },
    { key: "createdbyUsername", label: "CreatedBy", sort: true },
    { key: "jobName", label: "Job Name", sort: true },
    { key: "streetAddress", label: "Address", sort: true },
    { key: "city", label: "City", sort: true },
    { key: "state", label: "State", sort: true },
    { key: "zipCode", label: "Zip Code", sort: true },
    { key: "jobStatusName", label: "Status" },
  ];

  const handleChangePage = (event, newPage) => {
    JobslistAPI(
      newPage + 1,
      rowsPerPage,
      filter.tenantId,
      filter.jobStatus,
      filter.contactId,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    JobslistAPI(
      pageNo,
      parseInt(event.target.value, 10),
      filter.tenantId,
      filter.jobStatus,
      filter.contactId,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const handleChange = (name, value) => {
    let pageNo = 1;
    JobslistAPI(
      pageNo,
      rowsPerPage,
      name === "tenantId" ? value : filter.tenantId,
      name === "jobStatus" ? value : filter.jobStatus,
      name === "contactId" ? value : filter.contactId,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [name]: value };
    });
  };

  const handleChanges = (e) => {
    let pageNo = 1;
    JobslistAPI(
      pageNo,
      rowsPerPage,
      e.target.name === "tenantId" ? e.target.value : filter.tenantId,
      e.target.name === "jobStatus" ? e.target.value : filter.jobStatus,
      e.target.name === "contactId" ? e.target.value : filter.contactId,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
    setPage(1);
    setFilter((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleclose = () => {
    setOpen(false);
  };

  const handleapi = () => {
    JobslistAPI(
      page,
      rowsPerPage,
      filter.tenantId,
      filter.jobStatus,
      filter.contactId,
      search,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
    );
  };

  let navigate = useNavigate();

  const handleview = (item) => {
    localStorage.setItem("activeTab", "#window-measurement");
    localStorage.setItem("activeTab2", "#pills-overview");
    const url = `/contacts/job/${item?.jobId}`;
    navigate(url)
  };

  const handleSearch = (value) => {
    setsearch(value);
  };

  const user = JSON.parse(localStorage.getItem("userData"));

  const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });
   
    JobslistAPI(
      1,
      rowsPerPage,
      filter.tenantId,
      filter.jobStatus,
      filter.contactId,
      search,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };
  
  const handlesearchChange = (columnKey, value = null) => {
    let updatedFilters = [...filter.columnFilters];
    if (value !== null) {
      if (columnKey === 'contactPhone') {
        value = value.replace(/[()\-\s]/g, ''); // remove (, ), -, and spaces
      }
      const index = updatedFilters.findIndex((f) => f.field === columnKey);
      if (index > -1) {
        updatedFilters[index].value = value;
      } else {
        updatedFilters.push({ field: columnKey, value });
      }
    }

    setFilter((val) => {
      return {
        ...val,
        columnFilters: updatedFilters
      };
    });
  };

  return (
    <div className="intersight_content">
      <ApiLoder open={loder} />
      <Header title="All Jobs" />
      
      <div className="body_content">
        <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2, md: 3 }, px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Enhanced Header Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: { xs: 2, md: 4 }, 
              background: alpha(theme.palette.primary.main, 0.05),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: theme.palette.primary.main,
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 2 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48, md: 56 },
                    height: { xs: 40, sm: 48, md: 56 },
                    backgroundColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  <WorkIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      color: 'primary.main',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                      lineHeight: { xs: 1.3, md: 1.2 },
                    }}
                  >
                    {filter.jobStatus ? filter.jobStatus.jobStatusName : "All"} Jobs
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    Manage and track all jobs across your organization
                  </Typography>
                </Box>
              </Box>
              
              {HasPermission("JobAdd") && (
                <Button
                  variant="contained"
                  size={window.innerWidth < 600 ? "medium" : "large"}
                  startIcon={<WorkIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  onClick={() => {
                    setAction("add");
                    setOpen(true);
                  }}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 1, sm: 1.2, md: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                    backgroundColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    minWidth: { xs: 'auto', sm: 'auto' },
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add Job
                </Button>
              )}
            </Box>
          </Paper>

          {/* Enhanced Status Tabs */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Filter by Status
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Select a job status to filter the results
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 2 }} 
              flexWrap="wrap" 
              useFlexGap
            >
              <StatusTab
                status={null}
                isActive={!filter?.jobStatus?.jobStatusName}
                onClick={() => handleChange("jobStatus", "")}
              />
              {JobStatus?.map((val, i) => (
                <StatusTab
                  key={i}
                  status={val}
                  isActive={filter?.jobStatus?.jobStatusName === val?.jobStatusName}
                  onClick={() => handleChange("jobStatus", val)}
                />
              ))}
            </Stack>
          </Paper>

          {/* Enhanced Filters Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Search & Filters
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Use the controls below to search and filter jobs
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1.5, sm: 2 }} 
              flexWrap="wrap" 
              useFlexGap
            >
              <Box sx={{ minWidth: { xs: 'auto', sm: 200, md: 250 }, width: { xs: '100%', sm: 'auto' } }}>
                <Search handleSearch={handleSearch} />
              </Box>
              
              {HasPermission("SubTenantView") && (
                <Box sx={{ minWidth: { xs: 'auto', sm: 180, md: 200 }, width: { xs: '100%', sm: 'auto' } }}>
                  <PartnerDropdown
                    value={filter.tenantId}
                    fn={handleChanges}
                  />
                </Box>
              )}
              
              <Box sx={{ minWidth: { xs: 'auto', sm: 180, md: 200 }, width: { xs: '100%', sm: 'auto' } }}>
                <GetAllContact
                  value={filter.contactId}
                  fn={handleChanges}
                  load={true}
                  className="selectboxdropdown"
                />
              </Box>
              
              <ExportFile
                type="jobs"
                serach={""}
                page={page}
                perpage={rowsPerPage}
                tenantId={filter.tenantId}
                status={"2"}
                Url={apiUrls.ExportContacts}
                jobStatus={filter?.jobStatus?.jobStatusId}
              />
            </Stack>
          </Paper>

          {/* Enhanced Data Table */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Table stickyHeader sx={{ minWidth: { xs: 800, md: 1200 } }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column, i) => (
                        <EnhancedTableCell
                          key={i}
                          column={column}
                          filter={filter}
                          onSort={handleFilterSortChange}
                          onFilter={handlesearchChange}
                        />
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {JobsList?.map((job, i) => (
                      <TableRow 
                        key={i}
                        hover
                        sx={{
                          cursor: job?.tenantId === user?.tenantId ? 'pointer' : 'default',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: alpha(theme.palette.grey[50], 0.5),
                          }
                        }}
                      >
                        <TableCell 
                          onClick={job?.tenantId === user?.tenantId ? () => handleview(job) : undefined}
                          sx={{ 
                            fontWeight: 600,
                            color: job?.tenantId === user?.tenantId ? 'primary.main' : 'text.primary',
                            py: { xs: 1, sm: 2 },
                            px: { xs: 1, sm: 2 },
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            {job?.jobCode}
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {job?.contactFirstName + " " + job?.contactLastName + " " + (job?.suffix ?? "")}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <EmailIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.contactEmail}</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <PhoneIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{FormatPhoneNumber(job?.contactPhone)}</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <BusinessIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.companyName}</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.createdbyUsername}</Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.jobName}</Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <LocationIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.streetAddress}</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.city}</Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.state}</Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job?.zipCode}</Typography>
                        </TableCell>
                        
                        <TableCell sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                          <Chip
                            label={job?.jobStatusName}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 24, sm: 32 },
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              color: 'primary.main',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Enhanced Pagination */}
              {JobsList && JobsList?.length > 0 && (
                <Box sx={{ 
                  p: { xs: 1, sm: 2 }, 
                  borderTop: '1px solid', 
                  borderTopColor: 'divider',
                  backgroundColor: alpha(theme.palette.grey[50], 0.5)
                }}>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={paginatedItems}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      },
                      '& .MuiTablePagination-select': {
                        borderRadius: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      },
                      '& .MuiTablePagination-actions button': {
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        }
                      }
                    }}
                  />
                </Box>
              )}

              {/* No Data State */}
              {JobsList && JobsList?.length === 0 && !loder && (
                <Box sx={{ p: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: { xs: 80, sm: 100, md: 120 },
                      height: { xs: 80, sm: 100, md: 120 },
                      backgroundColor: alpha(theme.palette.grey[400], 0.1),
                      mx: 'auto',
                      mb: { xs: 2, md: 3 },
                    }}
                  >
                    <WorkIcon sx={{ fontSize: { xs: 40, sm: 52, md: 64 }, color: 'text.disabled' }} />
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 1, 
                      fontWeight: 600,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    No Jobs Found
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.disabled', 
                      mb: { xs: 2, md: 3 }, 
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: { xs: 2, sm: 0 }
                    }}
                  >
                    No jobs match your current filters. Try adjusting your search criteria or create a new job.
                  </Typography>
                  {HasPermission("JobAdd") && (
                    <Button
                      variant="contained"
                      startIcon={<WorkIcon />}
                      onClick={() => {
                        setAction("add");
                        setOpen(true);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.2 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      Create Your First Job
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Job Dialog */}
          {open && (
            <AddEditJob
              open={open}
              handleclose={handleclose}
              action={action}
              LanguageListAPI={handleapi}
              object={""}
            />
          )}
        </Container>
      </div>
    </div>
  );
}
