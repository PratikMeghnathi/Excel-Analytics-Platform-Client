import {
  BarChart2Icon,
  ScatterChartIcon as ChartScatter,
  BarChartIcon as ChartSpline,
  PieChartIcon,
  Trash,
} from "lucide-react"
import { formatDate } from "@/utils"
import { Cube } from "@phosphor-icons/react/dist/ssr"

function AnalysisCard({ analysis, onClick, onRemove, compact = false }) {
  const { name, filename, sheetName, chartConfig, createdAt, dataSample, _id } = analysis

  const handleRemove = (e) => {
    e.stopPropagation()
    if (onRemove) onRemove(e, _id)
  }

  return (
    <div
      className="border rounded-sm overflow-hidden p-2 sm:p-3 bg-card hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-1.5 h-full group min-h-[200px] sm:min-h-[250px]"
      onClick={() => onClick(analysis)}
    >
      {/* Header with title and remove button */}
      <div className="flex justify-between gap-2 sm:gap-3 items-start mb-2">
        <span className="text-sm sm:text-md font-medium text-foreground truncate leading-tight">{name}</span>
        {onRemove && (
          <div
            className="opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-accent text-accent-foreground hover:text-destructive rounded-sm p-1 flex-shrink-0"
            onClick={handleRemove}
          >
            <Trash size={14} className="sm:w-4 sm:h-4" />
          </div>
        )}
      </div>

      {/* Sheet name and chart type */}
      <div className="flex justify-between items-center mb-2 gap-2">
        <span className="text-xs sm:text-sm text-foreground truncate flex-1">{sheetName}</span>
        <div className="text-xs text-muted-foreground border border-muted-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md whitespace-nowrap">
          {chartConfig.chartType.toUpperCase()}
        </div>
      </div>

      {/* Data preview or chart preview */}
      {!compact && dataSample?.headers?.length > 0 && dataSample?.rows?.length > 0 ? (
        <div className="flex-grow my-1">
          {/* Mobile: Show simplified data preview */}
          <div className="sm:hidden">
            <div className="bg-muted/30 rounded border p-2 text-xs">
              <div className="font-medium mb-1">Data Preview:</div>
              <div className="space-y-1">
                {dataSample.headers.slice(0, 3).map((header, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground truncate">{header}:</span>
                    <span className="truncate ml-2">{dataSample.rows[0]?.[i] || "N/A"}</span>
                  </div>
                ))}
                {dataSample.headers.length > 3 && (
                  <div className="text-muted-foreground text-center">+{dataSample.headers.length - 3} more columns</div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Show full table */}
          <div className="hidden sm:block overflow-x-auto rounded border border-border mb-1.5">
            <table className="min-w-[400px] lg:min-w-[500px] w-full text-xs sm:text-sm border-collapse">
              <thead className="bg-muted">
                <tr>
                  {dataSample.headers.map((header, i) => (
                    <th key={i} className="border border-border p-1.5 sm:p-2 text-left font-medium truncate">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSample.rows.slice(0, 3).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-border p-1.5 sm:p-2 truncate max-w-[100px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : compact ? (
        <div className="h-24 sm:h-32 bg-muted/30 rounded-md flex items-center justify-center mb-2">
          <div className="text-muted-foreground text-xs sm:text-sm flex flex-col items-center gap-1">
            <span className="text-lg sm:text-xl">
              {chartConfig.chartType === "bar" ? (
                <BarChart2Icon />
              ) : chartConfig.chartType === "pie" ? (
                <PieChartIcon />
              ) : chartConfig.chartType === "scatter" ? (
                <ChartScatter />
              ) : chartConfig.chartType === "line" ? (
                <ChartSpline />
              ) : chartConfig.chartType.includes("3d") ? (
                <Cube size={20} />
              ) : (
                <BarChart2Icon />
              )}
            </span>
            <span className="text-center leading-tight">
              {chartConfig.xAxis} × {chartConfig.yAxis}
              {chartConfig.zAxis ? ` × ${chartConfig.zAxis}` : ""}
            </span>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-md h-24 sm:h-32 w-full flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
          No data preview available
        </div>
      )}

      {/* Footer with filename and date */}
      <div className="mt-auto flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
        <span className="truncate order-2 sm:order-1">{filename}</span>
        <span className="self-start sm:self-end order-1 sm:order-2 whitespace-nowrap">{formatDate(createdAt)}</span>
      </div>
    </div>
  )
}

export default AnalysisCard
