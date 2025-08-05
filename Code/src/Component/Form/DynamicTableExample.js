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
  InputAdornment
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

export default function DynamicTableExample({ 
  data = [], 
  columns = [], 
  handleSort, 
  handleSearch,
  sortConfig,
  loading = false 
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValues, setSearchValues] = useState({});

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleSearchChange = (column, value) => {
    const newSearchValues = { ...searchValues, [column]: value };
    setSearchValues(newSearchValues);
    if (handleSearch) {
      handleSearch(newSearchValues);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
        return { backgroundColor: '#22c55e', color: '#fff' };
      case 'inactive':
      case 'pending':
      case 'draft':
        return { backgroundColor: '#f59e0b', color: '#fff' };
      case 'cancelled':
      case 'rejected':
      case 'deleted':
        return { backgroundColor: '#ef4444', color: '#fff' };
      default:
        return { backgroundColor: '#6b7280', color: '#fff' };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: '#f8fafc'
            }}
          >
            <TableRow>
              {columns.map((column, index) => (
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Column Header with Sort */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {column.sortable ? (
                        <TableSortLabel
                          active={sortConfig?.field === column.key}
                          direction={sortConfig?.field === column.key ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort && handleSort(column.key)}
                          sx={{
                            '& .MuiTableSortLabel-icon': {
                              opacity: 1,
                            }
                          }}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        <Typography variant="subtitle2">
                          {column.label}
                        </Typography>
                      )}
                    </Box>

                    {/* Search Field */}
                    {column.searchable && (
                      <TextField
                        size="small"
                        placeholder={`Search ${column.label.toLowerCase()}...`}
                        value={searchValues[column.key] || ''}
                        onChange={(e) => handleSearchChange(column.key, e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
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
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'text.primary',
                  borderBottom: '2px solid #e5e7eb',
                  padding: 2,
                  backgroundColor: '#f8fafc',
                  width: 80,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1}
                  sx={{ 
                    textAlign: 'center', 
                    padding: 6,
                    color: 'text.secondary'
                  }}
                >
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1}
                  sx={{ 
                    textAlign: 'center', 
                    padding: 6,
                    color: 'text.secondary'
                  }}
                >
                  <Typography>No records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
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
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        fontSize: '14px',
                        color: 'text.primary',
                        borderBottom: '1px solid #e5e7eb',
                        padding: 2,
                      }}
                    >
                      {/* Render different cell types */}
                      {column.type === 'status' ? (
                        <Chip
                          label={row[column.key]}
                          size="small"
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            height: '24px',
                            cursor: 'pointer',
                            ...getStatusColor(row[column.key]),
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                        />
                      ) : column.type === 'link' ? (
                        <Typography
                          component={Link}
                          to={column.linkTo ? column.linkTo(row) : '#'}
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
                          {row[column.key]}
                        </Typography>
                      ) : column.type === 'avatar' ? (
                        <Avatar
                          src={row[column.key]}
                          alt={row.name || 'User'}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : column.type === 'date' ? (
                        moment(row[column.key]).format('MMM DD, YYYY')
                      ) : column.type === 'phone' ? (
                        FormatPhoneNumber(row[column.key])
                      ) : column.type === 'color' ? (
                        <Box
                          sx={{
                            width: 31,
                            height: 18,
                            backgroundColor: row[column.key] || "#0e0d32",
                            borderRadius: 1,
                            border: '1px solid #e5e7eb',
                          }}
                        />
                      ) : (
                        row[column.key] || '-'
                      )}
                    </TableCell>
                  ))}

                  {/* Actions Column */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb',
                      padding: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, row)}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 1,
          }
        }}
      >
        {HasPermission("View") && (
          <MenuItem 
            onClick={handleMenuClose}
            sx={{
              fontSize: '14px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
            View
          </MenuItem>
        )}
        
        {HasPermission("Edit") && (
          <MenuItem 
            onClick={handleMenuClose}
            sx={{
              fontSize: '14px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit
          </MenuItem>
        )}

        {HasPermission("Delete") && (
          <MenuItem 
            onClick={handleMenuClose}
            sx={{
              fontSize: '14px',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
              },
            }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
} 