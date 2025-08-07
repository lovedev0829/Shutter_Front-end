import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import Header from '../../../Layout/header';
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableSortLabel,
  TextField,
  LinearProgress,
  Typography,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ResponsiveContainer } from '../../Layout/ResponsiveLayout';

export default function TestDatatable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filters, setFilters] = useState({});

  const data = useMemo(() => [
  {
    name: 'Martin Peacock',
    designation: 'Designer',
    mail: 'martin98@jourrapide.com',
    location: 'Mexico',
    status: 'Active',
    trust: 'Sufficient',
    rating: '⭐⭐⭐',
    proficiency: 91,
  },
  {
    name: 'Sarah Johnson',
    designation: 'Developer',
    mail: 'sarah.johnson@example.com',
    location: 'USA',
    status: 'Active',
    trust: 'High',
    rating: '⭐⭐⭐⭐',
    proficiency: 87,
  },
  {
    name: 'David Lee',
    designation: 'QA Engineer',
    mail: 'david.lee@example.com',
    location: 'Canada',
    status: 'Inactive',
    trust: 'Moderate',
    rating: '⭐⭐',
    proficiency: 70,
  },
  {
    name: 'Aisha Khan',
    designation: 'Project Manager',
    mail: 'aisha.khan@example.com',
    location: 'UK',
    status: 'Active',
    trust: 'High',
    rating: '⭐⭐⭐⭐⭐',
    proficiency: 95,
  },
  {
    name: 'Carlos Ruiz',
    designation: 'DevOps Engineer',
    mail: 'carlos.ruiz@example.com',
    location: 'Spain',
    status: 'Active',
    trust: 'Sufficient',
    rating: '⭐⭐⭐',
    proficiency: 89,
  },
  {
    name: 'Emily Zhang',
    designation: 'UX Researcher',
    mail: 'emily.zhang@example.com',
    location: 'China',
    status: 'Inactive',
    trust: 'Low',
    rating: '⭐',
    proficiency: 60,
  },
  {
    name: 'Liam Smith',
    designation: 'Backend Developer',
    mail: 'liam.smith@example.com',
    location: 'Ireland',
    status: 'Active',
    trust: 'Moderate',
    rating: '⭐⭐⭐',
    proficiency: 80,
  },
  {
    name: 'Isabella Rossi',
    designation: 'Frontend Developer',
    mail: 'isabella.rossi@example.com',
    location: 'Italy',
    status: 'Active',
    trust: 'High',
    rating: '⭐⭐⭐⭐⭐',
    proficiency: 93,
  },
  {
    name: 'Mohammed Ali',
    designation: 'Data Scientist',
    mail: 'mohammed.ali@example.com',
    location: 'UAE',
    status: 'Inactive',
    trust: 'Sufficient',
    rating: '⭐⭐',
    proficiency: 75,
  },
  {
    name: 'Sofia Müller',
    designation: 'Product Owner',
    mail: 'sofia.mueller@example.com',
    location: 'Germany',
    status: 'Active',
    trust: 'High',
    rating: '⭐⭐⭐⭐',
    proficiency: 88,
  },
], []);


  // Define the filter component with Material UI
  const defaultColumn = useMemo(() => ({
    Filter: ({ column }) => (
      <TextField
        value={column.filterValue || ''}
        onChange={e => column.setFilter(e.target.value)}
        placeholder={`Search ${column.id}`}
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem'
          }
        }}
      />
    )
  }), []);

  const columns = useMemo(() => [
    {
      Header: 'Employee Name',
      accessor: 'name',
    },
    {
      Header: 'Designation',
      accessor: 'designation',
    },
    {
      Header: 'Mail',
      accessor: 'mail',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <Chip
          label={value}
          color={value === 'Active' ? 'success' : 'default'}
          variant={value === 'Active' ? 'filled' : 'outlined'}
          size="small"
        />
      ),
    },
    {
      Header: 'Trustworthiness',
      accessor: 'trust',
    },
    {
      Header: 'Rating',
      accessor: 'rating',
    },
    {
      Header: 'Software Proficiency',
      accessor: 'proficiency',
      Cell: ({ value }) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: value >= 80 ? '#4caf50' : value >= 60 ? '#ff9800' : '#f44336',
              }
            }}
          />
          <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'right' }}>
            {value}%
          </Typography>
        </Box>
      ),
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { columns, data, defaultColumn }, // 👈 Attach defaultColumn here
    useFilters,
    useSortBy
  );

  

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Box className="intersight_content">
        <Header title="Contacts" />
        <Box className="body_content">
          <ResponsiveContainer 
            maxWidth="xl"
            disableGutters={false}
            sx={{ 
              py: { xs: 1, sm: 2, md: 3 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            <Paper
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                boxShadow: 1,
                backgroundColor: 'background.paper',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <Typography 
                variant="h5" 
                component="h1" 
                gutterBottom
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Employee Data Table
              </Typography>

              <TableContainer
                sx={{
                  '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                  },
                  overflowX: 'auto',
                  maxHeight: { xs: 400, sm: 600, md: 'none' }
                }}
              >
                <Table {...getTableProps()} stickyHeader={isMobile}>
                  <TableHead>
                    {headerGroups.map((headerGroup, i) => (
                      <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, j) => (
                          <TableCell
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            key={j}
                            sx={{
                              fontWeight: 600,
                              backgroundColor: 'grey.50',
                              borderBottom: '2px solid',
                              borderBottomColor: 'divider',
                              position: 'relative',
                              minWidth: { xs: 120, sm: 150 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                              '&:hover': {
                                backgroundColor: 'grey.100'
                              }
                            }}
                          >
                            <TableSortLabel
                              active={column.isSorted}
                              direction={column.isSortedDesc ? 'desc' : 'asc'}
                              sx={{ fontSize: 'inherit' }}
                            >
                              {column.render('Header')}
                            </TableSortLabel>
                            <Box sx={{ mt: 1, minHeight: 40 }}>
                              {column.canFilter ? column.render('Filter') : null}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                      prepareRow(row);
                      return (
                        <TableRow 
                          {...row.getRowProps()} 
                          key={i}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            },
                            '&:nth-of-type(odd)': {
                              backgroundColor: 'action.selected'
                            }
                          }}
                        >
                          {row.cells.map((cell, j) => (
                            <TableCell
                              {...cell.getCellProps()}
                              key={j}
                              sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: 'divider',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                                whiteSpace: { xs: 'nowrap', md: 'normal' }
                              }}
                            >
                              {cell.render('Cell')}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
