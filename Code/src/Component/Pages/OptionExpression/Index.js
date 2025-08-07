import React, { useEffect } from 'react'
import Header from '../../../Layout/header'
import { useState } from 'react'
import TableTitle from '../../Form/TableTitle'
import DynamicTable from '../../Form/DynamicTable'
import Search from '../../Form/Search'
import AddEditButton from '../../Form/AddEditButton'
import { apiUrls } from '../../../utils/apiUrls'
import { callAPI } from '../../../utils/apiUtils'
import { TablePagination } from "@mui/material";
import { ApiLoder, Delete, ErrorMessage, HasPermission, SuccessMessage } from '../../../helpers/common'
import { useDebounce } from "use-debounce";
import StatusDropdown from '../../../helpers/StatusDropdown'
import AddEditExpression from './AddEditExpression'
function Index() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("")
    const [object, setObject] = useState("")
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paginatedItems, setPaginatedItems] = useState(0);
    const [OptionexpressionList, setOptionexpressionList] = useState([]);
    const [search, setsearch] = useState('');
    const [loder, setLoader] = useState(false);
    const [delOpen, setDelOpen] = useState(false)
    const [debouncedSearch] = useDebounce(search, 500);
    const [filter, setFilter] = useState({ status: "2", region: "",sortColumn: "",
    sortDirection: "asc",
    columnFilters: [],   });
    const columns = [
        { key: 'expressionName', label: 'Expression Name', sort: true },
        { key: 'productTypeName', label: 'Product Type', sort: true },
        { key: 'expressionFormulae', label: 'Expression Formulae', sort: true },
        { key: 'isActive', label: 'Status' },
    ];

    const handleSearch = (value) => {
        setsearch(value)
    }
    const handleChangePage = (event, newPage) => {
        OptionexpressionlistAPI(newPage + 1, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        let pageNo = 1;
        OptionexpressionlistAPI(pageNo, parseInt(event.target.value, 10), search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(pageNo);
    };
    const OptionexpressionlistAPI = async (page, perpage, serach, status,sortColumn,sortDirection,columnFilters) => {
        let query = { searchValue: serach ? serach : "", pageNo: page ? page : 1, recordPerPage: perpage ? perpage : 10, status: status, region:"",
            sortColumn:sortColumn?sortColumn:"",
      sortDirection:sortDirection?sortDirection:"asc",
      columnFilters:columnFilters || [],
      isOptionExpression: true,
         }
        setLoader(true)
        try {
            const apiResponse = await callAPI(apiUrls.Expression, {}, "POST", query);
        setLoader(false)
        if (apiResponse?.data?.isSuccess) {
            setOptionexpressionList(apiResponse?.data?.data)
            setPaginatedItems(apiResponse?.data?.totalRecords)
        } else {
            setOptionexpressionList([])
            ErrorMessage(apiResponse?.data?.message)
        }
        } catch (error) {
            setLoader(false)
            
        }
    }
    const [debouncedSearchcolumn] = useDebounce(filter.columnFilters, 500);
    useEffect(() => {
        OptionexpressionlistAPI(1, rowsPerPage, debouncedSearch, filter.status,
      filter.sortColumn,
      filter.sortDirection,
     debouncedSearchcolumn)
        setPage(1);
        // eslint-disable-next-line
    }, [debouncedSearch,debouncedSearchcolumn])

    const handleclose = () => {
        setOpen(false)

    }

    const handleapi = () => {
        let pageNo = 1;
        OptionexpressionlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
        setPage(pageNo);
        setObject("")

    }

    const handleedit = (item) => {
        setAction("edit")
        setObject(item)
        setOpen(true);

    }

    const handledelclose = () => {
        setDelOpen(false)
        setObject("")

    }
    const handleDelete = async (id) => {
        setLoader(true)
        try {
            const response = await callAPI(apiUrls.ExpressionDelete, { ExpressionId: id }, 'POST', {})
            setLoader(false)
            if (response.data.isSuccess) {
                handledelclose();
                SuccessMessage(response.data.message)
                let pageNo = 1;
                OptionexpressionlistAPI(pageNo, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
                setPage(pageNo);
            } else {
                ErrorMessage(response.data.message)
            }
        } catch (error) {
            setLoader(false)
        }
    }
    const handledelete = (item) => {
        setDelOpen(true)
        setObject(item)
    }
    const handlestatus = async (item) => {
        setLoader(true)
        try {
            const response = await callAPI(apiUrls.ExpressionActiveInActive, { ExpressionId: item.expressionId }, 'POST', {})
            setLoader(false)
            if (response.data.isSuccess) {
                SuccessMessage(response.data.message)
                OptionexpressionlistAPI(page, rowsPerPage, search, filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters);
            } else {
                ErrorMessage(response.data.message)
            }
            
        } catch (error) {
            setLoader(false)
        }
    }

    const handleChange = (e) => {
        let pageNo = 1;
        OptionexpressionlistAPI(pageNo, rowsPerPage, search, e.target.name === "status" ? e.target.value : filter.status,
      filter.sortColumn,
      filter.sortDirection,
      filter.columnFilters
        );
        setPage(1)
        setFilter((val) => {
            return { ...val, [e.target.name]: e.target.value };
        });
    };

     const handleFilterSortChange = (columnKey) => {
    setFilter((val) => {
      return {
        ...val,
        sortColumn: columnKey,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      };
    });

    OptionexpressionlistAPI(
    1, rowsPerPage, search, filter.status,
      columnKey,
      filter.sortDirection === "asc" ? "desc" : "asc",
      filter.columnFilters
    );
    setPage(1);
  };

  const handlesearchChange = (columnKey, value = null) => {
    let updatedFilters = [...filter.columnFilters];
    if (value !== null) {
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
        columnFilters: updatedFilters,
      };
    });
  };


    return (
        <>
            <ApiLoder open={loder} />
            <div className="intersight_content">
                <Header title="Options Expression" />
                <div className="body_content">
                    <div className="contact-profile">
                        <div className="d-flex align-items-center justify-content-between mb-30">
                            <TableTitle title="Manage Options Expression" />
                            <div className="heading_width_search d-flex align-items-center gap-3">

                                {HasPermission("OptionExpressionAdd") &&
                                    <AddEditButton handleClick={(() => {
                                        setAction("add")
                                        setOpen(true)
                                    })
                                    } title="Add Option Expression" />
                                }
                            </div>  
                        </div>
                        <div className="d-block d-md-flex align-items-center gap-2 mb-30">
                            <div className="filter-dropdown dropdown">
                                <Search handleSearch={handleSearch} />
                            </div>
                            <div className="filter-dropdown dropdown">
                                <StatusDropdown value={filter.status} fn={handleChange} />
                            </div>
                           
                        </div>
                        <div className="task_table mb-30">
                            <div className="table-responsive">
                                <DynamicTable data={OptionexpressionList} columns={columns} title="Expression" rowActions={['edit', 'delete']} edituser={handleedit} handledelete={handledelete}
                                    deletepermission="OptionExpressionDelete" editpermission="OptionExpressionEdit" handlestatus={handlestatus}  handleFilterSortChange={handleFilterSortChange}
                  sortColumn={filter.sortColumn}
                  sortDirection={filter.sortDirection}
                  columnFilters={filter.columnFilters}
                  handlesearchChange={handlesearchChange}/>
                                {OptionexpressionList && OptionexpressionList?.length > 0 &&
                                    <div className="d-flex align-items-center justify-content-end bottom_nav">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <TablePagination
                                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                                    component="div"
                                                    count={paginatedItems}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page - 1}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            </ul>
                                        </nav>
                                    </div>
                                }
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            {open &&<AddEditExpression open={open} handleclose={handleclose} action={action} LanguageListAPI={handleapi} object={object} />}
            <Delete open={delOpen} handleClose={handledelclose} title={object.expressionName} id={object?.expressionId} handleDelete={handleDelete} loder={loder} />
        </>

    )
}

export default Index