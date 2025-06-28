"use client"

import React, { useState, useEffect, Fragment } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Search,
  ChevronDown,
  Plus,
  LayoutGrid
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Debounced Input Component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, placeholder, ...props }) => {
  const [value, setValue] = useState(initialValue || "")

  useEffect(() => {
    setValue(initialValue || "")
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10"
        placeholder={placeholder}
      />
    </div>
  )
}

// Empty State Component
const EmptyTable = ({ message = "No data available" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <div className="text-6xl mb-4">📋</div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  )
}

// Skeleton Rows Component
const SkeletonTableRows = ({ columns, rowCount = 5 }) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex} className="p-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

// Table Pagination Component
const TablePagination = ({ 
  totalDocs, 
  currentPage, 
  totalPages,
  onPageChange,
  isLoading,
  hasNextPage = true,
  hasPrevPage = true
}) => {
  const showingFrom = ((currentPage - 1) * 10) + 1
  const showingTo = Math.min(currentPage * 10, totalDocs)

  const handlePreviousPage = () => {
    if (hasPrevPage && currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNextPage && currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const renderPageButtons = () => {
    const buttons = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="text-sm text-gray-500">
        {isLoading ? (
          <Skeleton className="w-32 h-4" />
        ) : (
          `Showing ${showingFrom} to ${showingTo} of ${totalDocs} entries`
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={!hasPrevPage || currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {!isLoading && renderPageButtons()}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!hasNextPage || currentPage >= totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Main Custom Data Table Component
const CustomDataTable = ({
  title,
  ButtonLabel,
  columns,
  data = {},
  currentPage = 1,
  setCurrentPage = () => {},
  rowsPerPage = 10,
  setRowsPerPage = () => {},
  search = "",
  setSearch = () => {},
  isLoading = false,
  isFetching = false,
  addButtonClick = () => {},
  showButton = true,
  searchable = true,
  sortable = true,
  showRefresh = false,
  onRefresh = () => {},
  emptyMessage = "No data available",
  Subject = null
}) => {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState(search)

  // Extract data properties
  const tableData = data?.docs || data?.data || []
  const totalDocs = data?.totalDocs || data?.total || 0
  const totalPages = data?.totalPages || Math.ceil(totalDocs / rowsPerPage) || 0
  const hasNextPage = data?.hasNextPage || currentPage < totalPages
  const hasPrevPage = data?.hasPrevPage || currentPage > 1

  // Update global filter when search prop changes
  useEffect(() => {
    setGlobalFilter(search)
  }, [search])

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: rowsPerPage,
      },
    },
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: sortable,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleSearchChange = (value) => {
    setGlobalFilter(value)
    if (setSearch) {
      setSearch(value)
    }
  }

  const handlePageSizeChange = (newSize) => {
    const size = parseInt(newSize)
    if (setRowsPerPage) {
      setRowsPerPage(size)
      setCurrentPage(1) // Reset to first page when changing page size
    }
  }

  return (
    <Card className="w-full">
      {/* Header */}
      {(title || showButton) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
            {Subject && <div>{Subject}</div>}
          </div>
          {showButton && (
            <div className="flex items-center gap-2">
              <Button onClick={addButtonClick}>
                <Plus className="w-4 h-4 mr-2" />
                {ButtonLabel || "Add"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between p-6 pt-0">
        <div className="flex items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize" className="text-sm">Show:</Label>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20" id="pageSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Button */}
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading || isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${(isLoading || isFetching) ? 'animate-spin' : ''}`} />
            </Button>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4" />
                <span className="ml-2">Columns</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        {searchable && (
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={handleSearchChange}
            placeholder={`Search ${totalDocs} records...`}
          />
        )}
      </div>

      {/* Table */}
      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className={`${
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())
                        }
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronDown 
                              className={`h-3 w-3 ${
                                header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-400'
                              }`} 
                            />
                            <ChevronDown 
                              className={`h-3 w-3 rotate-180 -mt-1 ${
                                header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-400'
                              }`} 
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <SkeletonTableRows columns={columns} rowCount={rowsPerPage} />
              ) : !tableData || tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64">
                    <EmptyTable message={emptyMessage} />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <TablePagination
            totalDocs={totalDocs}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading || isFetching}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default CustomDataTable
