import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import Header from '../../../Layout/header';

export default function TestDatatable() {
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


  // 👇 Define the filter component INSIDE useMemo
  const defaultColumn = useMemo(() => ({
    Filter: ({ column }) => (
      <input
        value={column.filterValue || ''}
        onChange={e => column.setFilter(e.target.value)}
        placeholder={`Search ${column.id}`}
        style={{ width: '100%' }}
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
        <div style={{ background: '#eee', width: '100%' }}>
          <div style={{
            width: `${value}%`,
            background: 'green',
            color: 'white',
            textAlign: 'center',
          }}>
            {value}%
          </div>
        </div>
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
    <div className="intersight_content">
      <Header title="Contacts" />
       <div className="body_content">
        <div className="awarded-jobs task_table">
             <div className="table-responsive">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, j) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={j}
                  style={{ border: '1px solid black' }}
                >
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, j) => (
                  <td
                    {...cell.getCellProps()}
                    key={j}
                    style={{ border: '1px solid gray', padding: '5px' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
    </div>
    </div>
  );
}
