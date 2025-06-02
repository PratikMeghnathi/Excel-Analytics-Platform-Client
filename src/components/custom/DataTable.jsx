"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Database, ChevronDown, ChevronUp } from "lucide-react"

function DataTable({ data, headers, totalRows, columnTypes }) {
  const [page, setPage] = useState(0)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const rowsPerPage = 5

  useEffect(() => {
    setPage(0)
    setExpandedRows(new Set()) // Reset expanded rows when data changes
  }, [data])

  const startRow = page * rowsPerPage
  const endRow = Math.min(startRow + rowsPerPage, data.length)
  const displayData = data.slice(startRow, endRow)
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const toggleRowExpansion = (rowIndex) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex)
    } else {
      newExpandedRows.add(rowIndex)
    }
    setExpandedRows(newExpandedRows)
  }

  const isRowExpanded = (rowIndex) => expandedRows.has(rowIndex)

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-muted border-b">
        <Database className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm sm:text-base font-medium text-foreground">
          Data Preview - {totalRows.toLocaleString()} Rows Total
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  <div className="truncate max-w-[150px]" title={header}>
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {displayData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                {headers.map((header, index) => {
                  const columnType = columnTypes.find((c) => c.name === header)?.type
                  let cellValue = row[index]

                  if (columnType === "date" && typeof cellValue === "string") {
                    const date = new Date(cellValue)
                    if (!Number.isNaN(date.getTime())) {
                      cellValue = date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    }
                  }

                  return (
                    <td key={`${rowIndex}-${header}`} className="px-4 py-3 text-sm text-foreground">
                      <div className="truncate max-w-[200px]" title={cellValue?.toString() || ""}>
                        {cellValue?.toString() || "—"}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}

            {/* Empty state */}
            {displayData.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {displayData.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No data available</div>
        ) : (
          <div className="divide-y divide-border">
            {displayData.map((row, rowIndex) => {
              const actualRowIndex = startRow + rowIndex
              const expanded = isRowExpanded(actualRowIndex)
              const visibleHeaders = expanded ? headers : headers.slice(0, 4)
              const hiddenColumnsCount = headers.length - 4

              return (
                <div key={rowIndex} className="p-4 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Row {actualRowIndex + 1}</div>

                  {/* Display visible columns */}
                  {visibleHeaders.map((header, index) => {
                    const columnType = columnTypes.find((c) => c.name === header)?.type
                    let cellValue = row[index]

                    if (columnType === "date" && typeof cellValue === "string") {
                      const date = new Date(cellValue)
                      if (!Number.isNaN(date.getTime())) {
                        cellValue = date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      }
                    }

                    return (
                      <div key={`${rowIndex}-${header}`} className="flex justify-between items-start gap-2">
                        <span className="text-xs font-medium text-muted-foreground truncate flex-shrink-0 min-w-0 max-w-[40%]">
                          {header}:
                        </span>
                        <span className="text-sm text-foreground text-right truncate min-w-0 max-w-[60%]">
                          {cellValue?.toString() || "—"}
                        </span>
                      </div>
                    )
                  })}

                  {/* Expand/Collapse button for additional columns */}
                  {headers.length > 4 && (
                    <button
                      onClick={() => toggleRowExpansion(actualRowIndex)}
                      className="flex items-center justify-center gap-1 w-full text-xs text-primary hover:text-primary/80 transition-colors pt-2 border-t border-border/50 mt-3"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          <span>+{hiddenColumnsCount} more columns</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-muted/30 px-3 sm:px-4 py-3 flex items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`
                flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border text-xs sm:text-sm font-medium rounded-md transition-colors
                ${
                  page === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-background text-foreground hover:bg-muted cursor-pointer"
                }
              `}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-xs sm:text-sm text-muted-foreground px-2">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              className={`
                flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border text-xs sm:text-sm font-medium rounded-md transition-colors
                ${
                  page >= totalPages - 1
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-background text-foreground hover:bg-muted cursor-pointer"
                }
              `}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Row info - hidden on very small screens */}
          <div className="hidden sm:block text-xs text-muted-foreground">
            Showing {startRow + 1}-{endRow} of {data.length} rows
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
