import { useEffect, useMemo, useRef, useCallback, useState } from "react"
import { useImmer } from "use-immer"
import { downloadFile, getCssVarAsHex, showGenericErrorAsToast, suggestChartType, TOAST_OPTIONS } from "@/utils"
import { AxisSelector, ChartOptions, ErrorBoundary, Spinner1 } from "."
import Plot from "react-plotly.js"
import Plotly from "plotly.js-dist"
import toast from "react-hot-toast"
import { saveAnalysis } from "@/api"
import { ChevronDown, Download, Save, BarChart3, AlertTriangle } from "lucide-react"

// Chart type options
const CHART_OPTIONS = [
  { label: "Scatter Plot", value: "scatter" },
  { label: "Bar Chart", value: "bar" },
  { label: "Line Chart", value: "line" },
  { label: "Pie Chart", value: "pie" },
  { label: "3D Scatter", value: "scatter3d" },
  { label: "3D Surface", value: "surface" },
  { label: "3D Mesh", value: "mesh3d" },
  { label: "3D Line", value: "line3d" },
]

// Download format options
const DOWNLOAD_OPTIONS = [
  { label: "SVG - Vector Graphics (Best for print)", value: "svg" },
  { label: "PNG - Image Format (Good for web)", value: "png" },
  { label: "JPEG - Compressed Image", value: "jpeg" },
  { label: "WebP - Modern Image Format", value: "webp" },
  { label: "PDF - Document Format", value: "pdf" },
  { label: "GLB - 3D Model Format", value: "glb" },
]

// Tooltip descriptions for download formats
const getFormatTooltip = (format) => {
  const tooltips = {
    svg: "Vector format, best for print & scaling",
    png: "Lossless raster format, good for web",
    jpeg: "Compressed format, smaller file size",
    webp: "Modern compressed format, good for web",
    pdf: "Document format, good for reports & print",
    glb: "3D model format, for interactive 3D viewers & AR/VR",
  }
  return tooltips[format] || ""
}

// Get color based on selected scheme and theme
const getColorForScheme = (scheme, isDarkMode) => {
  const colors = {
    viridis: "#440154",
    plasma: "#9c179e",
    warm: "#d13b40",
    cool: "#3b518a",
    default: isDarkMode ? "#63B3ED" : "#3182CE",
  }
  return colors[scheme] || colors.default
}

function ChartBuilder({
  sheetNames,
  headers,
  columnTypes,
  initialData,
  handleSheetChange = () => {},
  selectedSheetIndex = 0,
  originalFileName = "",
  dataSetId = "",
  isDarkMode = false,
}) {
  const [chartState, setChartState] = useImmer({
    selectedSheet: sheetNames[0] || "",
    chartType: "scatter",
    xAxis: headers[0] || "",
    yAxis: headers.length > 1 ? headers[1] : headers[0] || "",
    zAxis: null,
    chartOptions: {
      colorScheme: "default",
      markerSize: initialData.length > 1000 ? 3 : 8,
      showLegend: true,
    },
    downloadFormat: "svg",
    isDownloadMenuOpen: false,
  })
  const { selectedSheet, chartType, xAxis, yAxis, zAxis, chartOptions, downloadFormat, isDownloadMenuOpen } = chartState
  const plotRef = useRef(null)
  const downloadMenuRef = useRef(null)

  // Close download menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setChartState((draft) => {
          draft.isDownloadMenuOpen = false
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setChartState])

  // Chart type suggestion based on data
  useEffect(() => {
    if (headers.length > 1 && columnTypes.length > 0) {
      const suggestion = suggestChartType(columnTypes, headers)
      setChartState((draft) => {
        draft.chartType = suggestion.chartType
        draft.xAxis = suggestion.xAxis
        draft.yAxis = suggestion.yAxis
      })
    }
  }, [headers, columnTypes, setChartState])

  // Adjust download format based on chart type
  useEffect(() => {
    setChartState((draft) => {
      if (chartType.includes("3d")) {
        draft.downloadFormat = "glb"
      } else if (chartType === "scatter" || chartType === "line") {
        draft.downloadFormat = "svg"
      } else if (chartType === "pie") {
        draft.downloadFormat = "png"
      }
    })
  }, [chartType, setChartState])

  // To check if a chart type is 3D
  const is3DChart = (chartType) => {
    return chartType.includes("3d") || chartType === "surface" || chartType === "mesh3d"
  }

  // To check if a column is numeric
  const isNumeric = useCallback(
    (header) => {
      return columnTypes.find((c) => c.name === header)?.type === "numeric"
    },
    [columnTypes],
  )

  // To change chart option
  const handleOptionsChange = useCallback(
    (newOptions) => {
      setChartState((draft) => {
        draft.chartOptions = {
          ...draft.chartOptions,
          ...newOptions,
        }
      })
    },
    [setChartState],
  )

  const handleSheetSelection = useCallback(
    (e) => {
      const value = e.target.value
      setChartState((draft) => {
        draft.selectedSheet = value
      })
      handleSheetChange(value)
    },
    [handleSheetChange, setChartState],
  )

  const handleFormatSelect = useCallback(
    (format) => {
      setChartState((draft) => {
        draft.downloadFormat = format
        draft.isDownloadMenuOpen = false
      })
    },
    [setChartState],
  )

  // Process data (keeping the original logic but simplified for brevity)
  const processedData = useMemo(() => {
    return initialData.map((row) => {
      const processedRow = {}
      columnTypes.forEach(({ name, type }, index) => {
        const rawValue = row[index]

        if (rawValue === undefined || rawValue === null) {
          processedRow[name] = null
          return
        }

        switch (type) {
          case "numeric":
            processedRow[name] =
              rawValue === ""
                ? null
                : !Number.isNaN(Number.parseFloat(rawValue))
                  ? Number.parseFloat(rawValue)
                  : rawValue
            break
          case "boolean":
            if (typeof rawValue === "boolean") {
              processedRow[name] = rawValue
            } else if (typeof rawValue === "string") {
              const lowerValue = rawValue.toLowerCase()
              processedRow[name] = ["true", "yes", "1", "y"].includes(lowerValue)
                ? true
                : ["false", "no", "0", "n"].includes(lowerValue)
                  ? false
                  : null
            } else if (typeof rawValue === "number") {
              processedRow[name] = rawValue !== 0
            } else {
              processedRow[name] = null
            }
            break
          case "date":
            try {
              if (rawValue instanceof Date) {
                processedRow[name] = rawValue
              } else if (typeof rawValue === "string" && rawValue.trim() !== "") {
                const parsedDate = new Date(rawValue)
                processedRow[name] = !Number.isNaN(parsedDate.getTime()) ? parsedDate : rawValue
              } else {
                processedRow[name] = rawValue
              }
            } catch (e) {
              processedRow[name] = rawValue
            }
            break
          case "string":
          default:
            processedRow[name] =
              typeof rawValue === "string"
                ? rawValue
                : rawValue !== null && rawValue !== undefined
                  ? String(rawValue)
                  : rawValue
            break
        }
      })
      return processedRow
    })
  }, [initialData, columnTypes])

  // Simplified chart trace and layout (keeping core logic)
  const chartTrace = useMemo(() => {
    if (!processedData.length || !xAxis || !yAxis) {
      return {}
    }

    const markerSize = chartOptions.markerSize || (initialData.length > 1000 ? 3 : 8)
    const color = getColorForScheme(chartOptions.colorScheme, isDarkMode)

    if (chartType === "pie") {
      return {
        labels: processedData.map((row) => row[xAxis]),
        values: processedData.map((row) => row[yAxis]),
        type: "pie",
        marker: { colors: [color] },
      }
    }

    return {
      x: processedData.map((row) => row[xAxis]),
      y: processedData.map((row) => row[yAxis]),
      type: chartType,
      mode: chartType === "line" ? "lines+markers" : "markers",
      marker: { size: markerSize, color },
    }
  }, [xAxis, yAxis, chartType, processedData, chartOptions, isDarkMode, initialData.length])

  const layout = useMemo(() => {
    return {
      title: {
        text: `${xAxis} vs ${yAxis}${zAxis ? ` vs ${zAxis}` : ""}`,
        font: { size: 18, color: getCssVarAsHex("--chart-title-color") },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: getCssVarAsHex("--chart-title-color") },
      xaxis: {
        title: { text: xAxis, font: { size: 14, color: getCssVarAsHex("--chart-title-color") } },
        gridcolor: getCssVarAsHex("--chart-grid-color"),
      },
      yaxis: {
        title: { text: yAxis, font: { size: 14, color: getCssVarAsHex("--chart-title-color") } },
        gridcolor: getCssVarAsHex("--chart-grid-color"),
      },
      margin: { l: 60, r: 40, b: 60, t: 60 },
      showlegend: chartOptions.showLegend,
      autosize: true,
    }
  }, [xAxis, yAxis, zAxis, chartOptions.showLegend])

  // Warning for non-numeric columns
  const showNumericWarning = chartType !== "pie" && !isNumeric(yAxis)

  // Simplified download function (keeping core logic but removing complex 3D export for brevity)
  const handleDownload = useCallback(() => {
    if (!plotRef.current?.el) {
      toast.error("Chart not available for download.", TOAST_OPTIONS)
      return
    }

    const plotElement = plotRef.current.el
    const fileName = `chart-${chartType}-${xAxis}-${yAxis}`

    Plotly.toImage(plotElement, {
      format: downloadFormat === "glb" ? "png" : downloadFormat,
      width: 1200,
      height: 800,
      scale: 2,
    })
      .then((dataUrl) => {
        downloadFile(dataUrl, `${fileName}.${downloadFormat === "glb" ? "png" : downloadFormat}`)
        setChartState((draft) => {
          draft.isDownloadMenuOpen = false
        })
      })
      .catch((err) => {
        console.error("Download failed:", err)
        toast.error("Failed to download chart.", TOAST_OPTIONS)
      })
  }, [chartType, xAxis, yAxis, downloadFormat, setChartState])

  const getAvailableDownloadFormats = useCallback(() => {
    if (is3DChart(chartType)) {
      return DOWNLOAD_OPTIONS.filter((option) => ["glb", "png", "jpeg", "webp"].includes(option.value))
    }
    return DOWNLOAD_OPTIONS.filter((option) => option.value !== "glb")
  }, [chartType])

  // Save analysis functionality
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analysisName, setAnalysisName] = useState("")

  const handleSaveClick = () => {
    setAnalysisName(`Analysis - ${layout.title.text}`)
    setShowModal(true)
  }

  const handleSaveAnalysis = async () => {
    if (!analysisName.trim()) {
      toast.error("Please add name for analysis.", TOAST_OPTIONS)
      return
    }
    if (!xAxis || !yAxis) {
      toast.error("Please select axes before saving analysis", TOAST_OPTIONS)
      return
    }

    setIsSaving(true)
    try {
      const dataSample = {
        headers,
        rows: initialData.slice(0, 3),
        totalRows: initialData.length,
      }

      const chartConfig = {
        chartType,
        xAxis,
        yAxis,
        zAxis: zAxis || "",
        title: layout.title.text,
        additionalOptions: chartOptions,
      }

      const analysisData = {
        name: analysisName,
        fileName: originalFileName,
        sheetName: selectedSheet,
        sheetIndex: selectedSheetIndex,
        chartConfig,
        dataSample,
        dataSetId,
      }

      const { success, data, genericErrors } = await saveAnalysis(analysisData)
      if (success) {
        toast.success(data.message, TOAST_OPTIONS)
        setShowModal(false)
        return
      }
      showGenericErrorAsToast(genericErrors)
    } catch (error) {
      console.error("Error saving analysis:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Data Visualization</h2>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2 text-foreground">Sheet</label>
          <select
            className="w-full p-2 sm:p-3 rounded border bg-background border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onChange={handleSheetSelection}
            value={selectedSheet}
          >
            {sheetNames.map((sheet, index) => (
              <option key={sheet} value={index} className="bg-background text-foreground">
                {sheet}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2 text-foreground">Chart Type</label>
          <select
            className="w-full p-2 sm:p-3 rounded border bg-background border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onChange={(e) =>
              setChartState((draft) => {
                draft.chartType = e.target.value
              })
            }
            value={chartType}
          >
            {CHART_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value} className="bg-background text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Axis Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <AxisSelector label="X Axis" options={headers} value={xAxis} onSelect={setChartState} />
        <AxisSelector label="Y Axis" options={headers} value={yAxis} onSelect={setChartState} />
        {(chartType.includes("3d") || chartType === "surface") && (
          <AxisSelector label="Z Axis" options={headers} value={zAxis} onSelect={setChartState} />
        )}
      </div>

      {/* Warnings */}
      {showNumericWarning && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Warning: Selected columns should be numeric for this chart type.
          </p>
        </div>
      )}

      {is3DChart(chartType) && !zAxis && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            A Z-axis selection is required for 3D visualizations.
          </p>
        </div>
      )}

      {/* Chart Options */}
      <ChartOptions chartType={chartType} onOptionsChange={handleOptionsChange} />

      {/* Plot Container */}
      <div className="border rounded-lg p-2 sm:p-4 bg-card">
        <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
          <ErrorBoundary>
            <Plot
              ref={plotRef}
              data={[chartTrace]}
              layout={{
                ...layout,
                margin: {
                  l: window.innerWidth < 640 ? 40 : 60,
                  r: window.innerWidth < 640 ? 20 : 40,
                  t: window.innerWidth < 640 ? 40 : 60,
                  b: window.innerWidth < 640 ? 40 : 60,
                },
                font: {
                  ...layout.font,
                  size: window.innerWidth < 640 ? 10 : 12,
                },
                title: {
                  ...layout.title,
                  font: {
                    ...layout.title.font,
                    size: window.innerWidth < 640 ? 14 : 18,
                  },
                },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: window.innerWidth < 640 ? ["lasso2d", "select2d"] : [],
              }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
        {/* Download Options */}
        <div className="relative" ref={downloadMenuRef}>
          <div className="flex">
            <button
              onClick={() =>
                setChartState((draft) => {
                  draft.isDownloadMenuOpen = !isDownloadMenuOpen
                })
              }
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted text-muted-foreground border border-r-0 border-border text-sm rounded-l-md hover:bg-muted/80 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Format: {downloadFormat.toUpperCase()}</span>
              <span className="sm:hidden">{downloadFormat.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onClick={handleDownload}
              className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-sm rounded-r-md hover:bg-primary/90 transition-colors"
            >
              <span className="hidden sm:inline">Download Chart</span>
              <span className="sm:hidden">Download</span>
            </button>
          </div>

          {isDownloadMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-card border border-border shadow-lg rounded-md z-10">
              <div className="py-2 px-3 bg-muted text-sm font-medium text-muted-foreground rounded-t-md">
                Select Format
              </div>
              <ul className="py-1 max-h-48 overflow-y-auto">
                {getAvailableDownloadFormats().map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleFormatSelect(option.value)}
                    className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex justify-between items-center text-sm"
                  >
                    <span>{option.label}</span>
                    {downloadFormat === option.value && <span className="text-primary">✓</span>}
                  </li>
                ))}
              </ul>
              <div className="p-2 text-xs text-muted-foreground bg-muted/30 rounded-b-md">
                <p>
                  <strong>{downloadFormat.toUpperCase()}</strong>: {getFormatTooltip(downloadFormat)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Analysis */}
        <button
          onClick={handleSaveClick}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!xAxis || !yAxis}
        >
          <Save className="w-4 h-4" />
          <span>Save Analysis</span>
        </button>
      </div>

      {/* Save Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-4 sm:p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Analysis</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Analysis Name</label>
              <input
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                placeholder="Enter a name for this analysis"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground border border-border text-sm rounded-md hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAnalysis}
                disabled={isSaving || !analysisName.trim()}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px]"
              >
                {isSaving ? <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartBuilder
