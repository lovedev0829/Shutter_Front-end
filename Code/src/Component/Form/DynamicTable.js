import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormatPhoneNumber, HasPermission } from "../../helpers/common";
import moment from "moment";
import { defaultConfig } from "../../config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Chip,
  Tooltip,
  TableSortLabel,
  Box,
  Typography,
  Avatar,
  Stack,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ResponsiveTableContainer } from '../Layout/ResponsiveLayout';
// All styled components removed - using sx prop instead

const DynamicTable = ({
  data,
  columns,
  title,
  rowActions,
  edituser,
  handledelete,
  handlestatus,
  deletepermission,
  editpermission,
  viewUser,
  handleVersion,
  handlecontact,
  handleFilterSortChange,
  sortColumn,
  sortDirection,
  columnFilters,
  handlesearchChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const getSortIcon = (columnKey) => {
    if (sortColumn === columnKey) {
      return sortDirection === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    }
    return <ArrowUpwardIcon fontSize="small" style={{ opacity: 0.3 }} />;
  };

  const renderCellContent = (row, col, rowIndex, colIndex) => {
    if (col.key === "firstName") {
      return (
        <Typography
          variant="body2"
          onClick={() => col.link ? viewUser(row) : null}
          sx={{ 
            cursor: col.link ? 'pointer' : 'default',
            color: col.link ? 'primary.main' : 'text.primary',
            fontWeight: col.link ? 500 : 400,
            textDecoration: col.link ? 'underline' : 'none',
            '&:hover': col.link ? {
              color: 'primary.dark',
            } : {},
          }}
        >
          {row.firstName + " " + row.lastName + " " + (row?.suffix ?? "")}
        </Typography>
      );
    }
    
    if (col.key === "contactFirstName") {
  return (
        <Typography
          variant="body2"
          onClick={() => col.link ? handlecontact(row) : null}
          sx={{ 
            cursor: col.link ? 'pointer' : 'default',
            color: col.link ? 'primary.main' : 'text.primary',
            fontWeight: col.link ? 500 : 400,
            textDecoration: col.link ? 'underline' : 'none',
            '&:hover': col.link ? {
              color: 'primary.dark',
            } : {},
          }}
        >
          {row.contactFirstName + " " + row.contactLastName + " " + (row?.suffix ?? "")}
        </Typography>
      );
    }
    
    if (col.key === "firstContactName") {
      return (
        <Typography
          variant="body2"
          onClick={() => col.link ? handlecontact(row) : null}
          sx={{ 
            cursor: col.link ? 'pointer' : 'default',
            color: col.link ? 'primary.main' : 'text.primary',
            fontWeight: col.link ? 500 : 400,
            textDecoration: col.link ? 'underline' : 'none',
            '&:hover': col.link ? {
              color: 'primary.dark',
            } : {},
          }}
        >
          {row.firstContactName + " " + row.lastContactName + " " + (row?.suffix ?? "")}
        </Typography>
      );
    }
    
    if (col.key === "expressionFormulae") {
      return row?.displayArray?.join("");
    }
    
    if (col.key === "isActive") {
      return (
        <Chip
          label={row[col.key] ? "Active" : "Inactive"}
          onClick={() => handlestatus(row)}
          size="small"
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            height: '24px',
            cursor: 'pointer',
            backgroundColor: row[col.key] ? '#22c55e' : '#ef4444',
            color: '#fff',
            '&:hover': {
              backgroundColor: row[col.key] ? '#16a34a' : '#dc2626',
            },
          }}
        />
      );
    }
    
    if (col.key === "vendorOrderStatus") {
      return (
        <Chip
          label={row[col.key]}
          color={row[col.key] === "Approved" ? "success" : "default"}
          size="small"
          variant="filled"
        />
      );
    }
    
    if (col.key === "primaryColor") {
      return (
        <Box
          sx={{
            width: 31,
            height: 18,
            backgroundColor: row.primaryColor || "#0e0d32",
            borderRadius: 1,
            border: '1px solid #e5e7eb',
          }}
        />
      );
    }
    
    if (col.key === "isCutSheet" || col.key === "isDefault") {
      return <Typography variant="body2">{row[col.key] ? "Yes" : "No"}</Typography>;
    }
    
    if (col.key === "jobStatusName") {
      return (
        <Chip
          label={row?.jobStatusName}
          size="small"
          variant="outlined"
          color="primary"
        />
      );
    }
    
    if (col.key === "options") {
      return (
        <Box>
          {row?.options?.map((opt, optIndex) => (
            <Chip
              key={optIndex}
              label={`${opt.optionType} ($${opt.additionalCost})`}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      );
    }
    
    if (col.key === "logo") {
      return (
        <Tooltip title="Click to view logo">
          <Avatar
            src={row.logo || "/image/no-image.jpg"}
            alt="Logo"
            onClick={() => window.open(row.logo || "/image/no-image.jpg", "_blank")}
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
        </Tooltip>
      );
    }
    
    if (["effectiveDate", "startDate", "orderDate", "expectedDeliveryDate", 
         "actualDeliveryDate", "createdDate", "expiryDate"].includes(col.key)) {
      return (
        <Typography variant="body2">
          {moment(row[col.key]).format("MM-DD-YYYY") || ""}
        </Typography>
      );
    }
    
    if (col.phoneformate) {
      return (
        <Typography variant="body2">
          {FormatPhoneNumber(row[col.key] || "")}
        </Typography>
      );
    }
    
    if (col.link) {
      return (
        <Typography 
          variant="body2" 
          onClick={() => viewUser(row)}
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 500,
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          {row[col.key]}
        </Typography>
      );
    }
    
    if (col.sign) {
      return (
        <Typography variant="body2">
          {defaultConfig.currencySign + " " + row[col.key]}
        </Typography>
      );
    }
    
    return (
      <Typography variant="body2">
        {row[col.key] || row[col.key] === 0 ? row[col.key] : "-"}
      </Typography>
    );
  };

  // Mobile Card View Component
  const MobileCardView = () => (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {data && data.length > 0 ? (
        <Stack spacing={2}>
          {data.map((row, rowIndex) => (
            <Card
              key={rowIndex}
              sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {columns.map((col, colIndex) => {
                  const cellContent = renderCellContent(row, col, rowIndex, colIndex);
                  // Skip empty cells
                  if (!cellContent || cellContent === '' || cellContent === '-') return null;
                  
                  return (
                    <Box key={colIndex} sx={{ mb: colIndex === columns.length - 1 ? 0 : 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          fontSize: '0.75rem'
                        }}
                      >
                        {col.label || col.key}
                      </Typography>
                      <Box
                        sx={{
                          mt: 0.5,
                          fontSize: '0.875rem',
                          lineHeight: 1.4,
                          '& .MuiTypography-root': {
                            fontSize: 'inherit',
                            lineHeight: 'inherit'
                          }
                        }}
                      >
                        {cellContent}
                      </Box>
                    </Box>
                  );
                })}
                
                {/* Mobile Actions */}
                {(HasPermission(editpermission) || HasPermission(deletepermission)) && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {rowActions.includes("view") && (
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => viewUser(row)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          View
                        </Button>
                      )}
                      {rowActions.includes("edit") && HasPermission(editpermission) && (
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => edituser(row)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Edit
                        </Button>
                      )}
                      {rowActions.includes("version") && (
                        <Button
                          size="small"
                          startIcon={<HistoryIcon />}
                          onClick={() => handleVersion(row)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          History
                        </Button>
                      )}
                      {rowActions.includes("delete") && HasPermission(deletepermission) && (
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handledelete(row)}
                          color="error"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <img
            src="/image/no-records.svg"
            alt="No records"
            loading="lazy"
            style={{ maxWidth: '150px', opacity: 0.6 }}
          />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            No Records Found. Please Add New {title}
          </Typography>
        </Card>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile Card View */}
      <MobileCardView />
      
      {/* Desktop Table View */}
      <ResponsiveTableContainer>
        <TableContainer 
          component={Paper}
          sx={{
            display: { xs: 'none', md: 'block' },
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}
        >
        <Table>
          <TableHead
            sx={{
              backgroundColor: '#f8fafc'
            }}
          >
            <TableRow>
              {columns.map((col, index) => (
                <TableCell 
                  key={index}
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.primary',
                    borderBottom: '2px solid #e5e7eb',
                    padding: 2,
                    backgroundColor: '#f8fafc',
                    verticalAlign: 'top',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {col.label || col.key}
                      </Typography>
                      {col.sort && (
                        <Tooltip title={`Sort by ${col.label || col.key}`}>
                          <IconButton
                            size="small"
                            onClick={() => handleFilterSortChange(col.key)}
                            sx={{ padding: 0.5 }}
                          >
                            {getSortIcon(col.key)}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    
                    {col.sort && (
                      <TextField
                        size="small"
                        placeholder="Search here"
                        variant="outlined"
                        fullWidth
                        value={columnFilters.find((f) => f.field === col.key)?.value || ""}
                        onChange={(e) => handlesearchChange(col.key, e.target.value)}
                        sx={{
                          mt: 1,
                          '& .MuiInputBase-root': {
                            fontSize: '12px',
                            height: '32px',
                            backgroundColor: '#fff',
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '8px 12px',
                          },
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
              
              {(HasPermission(editpermission) || HasPermission(deletepermission)) && (
                <TableCell 
                  align="right"
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.primary',
                    borderBottom: '2px solid #e5e7eb',
                    padding: 2,
                    backgroundColor: '#f8fafc',
                    verticalAlign: 'top',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    Action
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                    '&:last-child td': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell 
                      key={colIndex}
                      sx={{
                        fontSize: '14px',
                        color: 'text.primary',
                        borderBottom: '1px solid #e5e7eb',
                        padding: 2,
                      }}
                    >
                      {renderCellContent(row, col, rowIndex, colIndex)}
                    </TableCell>
                  ))}
                  
                  {(HasPermission(editpermission) || HasPermission(deletepermission)) && (
                    <TableCell 
                      align="right"
                      sx={{
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb',
                        padding: 1,
                      }}
                    >
                      <Tooltip title="More actions">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, row)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  sx={{ 
                    border: 'none',
                    textAlign: 'center', 
                    padding: 6,
                    color: 'text.secondary'
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      padding: 6,
                      color: 'text.secondary',
                    }}
                  >
                    <img
                      src="/image/no-records.svg"
                      alt="No records"
                      loading="lazy"
                      style={{ maxWidth: '200px', opacity: 0.6 }}
                    />
                    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                      No Records Found. Please Add New {title}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </ResponsiveTableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        {rowActions.includes("view") && (
          <MenuItem
            onClick={() => {
              viewUser(selectedRow);
              handleMenuClose();
            }}
          >
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View
          </MenuItem>
        )}

        {rowActions.includes("edit") && HasPermission(editpermission) && (
          <MenuItem
            onClick={() => {
              edituser(selectedRow);
              handleMenuClose();
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}

        {rowActions.includes("version") && (
          <MenuItem
            onClick={() => {
              handleVersion(selectedRow);
              handleMenuClose();
            }}
          >
            <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
            View History
          </MenuItem>
        )}

        {rowActions.includes("delete") && HasPermission(deletepermission) && (
          <MenuItem
            onClick={() => {
              handledelete(selectedRow);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}

        {rowActions.includes("switch") && (
          <MenuItem
            onClick={() => {
              localStorage.setItem("ghluser", selectedRow?.companyName);
              handleMenuClose();
            }}
          >
            <SyncIcon fontSize="small" sx={{ mr: 1 }} />
            Sync GHL
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default DynamicTable;
