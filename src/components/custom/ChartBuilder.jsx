import { useEffect, useMemo, useRef, useCallback, useState } from "react"
import { useImmer } from "use-immer"

import {
  downloadFile, ERROR_TOAST_OPTIONS, getCssVarAsHex, showGenericErrorAsToast, SUCCESS_TOAST_OPTIONS, suggestChartType, TOAST_OPTIONS,
  BarChart3, Download, Save, AlertTriangle, ChevronDown, Info, Shield, Sparkles, Copy, Check, Brain,
} from "@/utils"
import { AxisSelector, ChartOptions, ErrorBoundary, Spinner1 } from "."
import { getAiInsights, saveAnalysis } from "@/api"

import toast from "react-hot-toast"
import Plot from "react-plotly.js"
import Plotly from "plotly.js-dist"
import jsPDF from "jspdf"

import * as THREE from "three"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js"

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
  handleSheetChange = () => { },
  selectedSheetIndex = 0,
  originalFileName = "",
  dataSetId = "",
  isDarkMode = false,
  analysisLimitReached = false,
  analysisUnlimited = false,
  onAnalysisSaveSuccess,
  userPermissions = {
    canUpload: true,
    canSave: true,
    canDelete: true,
    role: "user",
    permissions: "Full Access",
  },
  aiPromptTypes = [],
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

  // AI Insights state
  const [aiInsights, setAiInsights] = useImmer({
    isGenerating: false,
    selectedPromptType: aiPromptTypes[0]?.type || "summary",
    insights: null,
    error: null,
    isExpanded: true,
    isPromptMenuOpen: false,
  })

  // Copy state for insights
  const [isCopied, setIsCopied] = useState(false)

  const { selectedSheet, chartType, xAxis, yAxis, zAxis, chartOptions, downloadFormat, isDownloadMenuOpen } = chartState
  const plotRef = useRef(null)
  const downloadMenuRef = useRef(null)
  const promptMenuRef = useRef(null)

  // Close download menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setChartState((draft) => {
          draft.isDownloadMenuOpen = false
        })
      }
      if (promptMenuRef.current && !promptMenuRef.current.contains(event.target)) {
        setAiInsights((draft) => {
          draft.isPromptMenuOpen = false
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
  }, [headers, columnTypes])

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
  }, [chartType])

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
  const handleOptionsChange = useCallback((newOptions) => {
    setChartState((draft) => {
      draft.chartOptions = {
        ...draft.chartOptions,
        ...newOptions,
      }
    })
  }, [])

  const handleSheetSelection = useCallback(
    (e) => {
      const value = e.target.value
      setChartState((draft) => {
        draft.selectedSheet = value
      })

      const sheetIndex = sheetNames.findIndex((name) => name === value)
      handleSheetChange(sheetIndex)

      // Clear insights when sheet changes
      setAiInsights((draft) => {
        draft.insights = null
        draft.error = null
      })
    },
    [handleSheetChange, sheetNames],
  )

  const handleFormatSelect = useCallback((format) => {
    setChartState((draft) => {
      draft.downloadFormat = format
      draft.isDownloadMenuOpen = false
    })
  }, [])

  // AI Insights functions
  const handlePromptSelect = useCallback((promptType) => {
    setAiInsights((draft) => {
      draft.selectedPromptType = promptType
      draft.isPromptMenuOpen = false
    })
  }, [])

  const handleGenerateInsights = useCallback(async () => {
    if (!dataSetId) {
      toast.error("No dataset available for AI analysis.", ERROR_TOAST_OPTIONS)
      return
    }

    // Check permissions
    if (userPermissions.role !== "admin" && userPermissions.permissions === "Read Only") {
      toast.error(
        "You don't have permission to generate AI insights. Please contact your administrator.",
        ERROR_TOAST_OPTIONS,
      )
      return
    }

    setAiInsights((draft) => {
      draft.isGenerating = true
      draft.error = null
    })

    try {
      const { success, data, genericErrors, fieldErrors } = await getAiInsights(
        dataSetId,
        selectedSheetIndex,
        aiInsights.selectedPromptType,
      )

      console.log(success, data)

      if (success) {
        setAiInsights((draft) => {
          draft.insights = data.data
        })
      } else {
        // Handle field errors
        if (fieldErrors?.permission) {
          setAiInsights((draft) => {
            draft.error = fieldErrors.permission
          })
        } else if (fieldErrors?.dataQuality) {
          setAiInsights((draft) => {
            draft.error = fieldErrors.dataQuality
          })
        } else if (fieldErrors?.aiQuota) {
          setAiInsights((draft) => {
            draft.error = fieldErrors.aiQuota
          })
        } else if (fieldErrors?.aiService) {
          setAiInsights((draft) => {
            draft.error = fieldErrors.aiService
          })
        } else {
          setAiInsights((draft) => {
            draft.error = genericErrors?.[0] || "Failed to generate AI insights"
          })
        }
      }
    } catch (error) {
      console.error("Error generating AI insights:", error)
      let errorMessage = "Failed to generate AI insights. Please try again."

      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to generate AI insights."
      } else if (error.response?.status === 429) {
        errorMessage = "AI service quota exceeded. Please try again later."
      }

      setAiInsights((draft) => {
        draft.error = errorMessage
      })
    } finally {
      setAiInsights((draft) => {
        draft.isGenerating = false
      })
    }
  }, [dataSetId, selectedSheetIndex, aiInsights.selectedPromptType, userPermissions])

  const handleCopyInsights = useCallback(async () => {
    if (aiInsights.insights?.insights) {
      try {
        await navigator.clipboard.writeText(aiInsights.insights.insights)
        setIsCopied(true)
        toast.success("Insights copied to clipboard!", SUCCESS_TOAST_OPTIONS)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (error) {
        toast.error("Failed to copy insights.", ERROR_TOAST_OPTIONS)
      }
    }
  }, [aiInsights.insights])

  // Check if AI insights can be generated
  const canGenerateAiInsights = useMemo(() => {
    return (
      (dataSetId && headers.length > 0 && initialData.length > 0 && userPermissions.role === "admin") ||
      userPermissions.permissions !== "Read Only"
    )
  }, [dataSetId, headers.length, initialData.length, userPermissions])

  // Check if AI insights are available for saving
  const hasAiInsights = useMemo(() => {
    return aiInsights.insights && aiInsights.insights.insights && aiInsights.insights.insights.trim().length > 0
  }, [aiInsights.insights])

  // Process data
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
              rawValue === "" ? null : !isNaN(Number.parseFloat(rawValue)) ? Number.parseFloat(rawValue) : rawValue
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
                processedRow[name] = !isNaN(parsedDate.getTime()) ? parsedDate : rawValue
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

  const prepare3DData = useCallback(
    (chartType, processedData, xAxis, yAxis, zAxis, chartOptions) => {
      const markerSize = chartOptions.markerSize || 5
      const color = getColorForScheme(chartOptions.colorScheme, isDarkMode)

      // Base configuration for 3D traces
      const baseTrace = {
        x: processedData.map((row) => row[xAxis]),
        y: processedData.map((row) => row[yAxis]),
        z: zAxis ? processedData.map((row) => row[zAxis]) : Array(processedData.length).fill(0),
        mode: "markers",
        marker: {
          size: markerSize,
          color,
          opacity: 0.8,
          line: {
            width: 0.5,
            color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          },
        },
      }

      // Add specific configurations based on chart type
      switch (chartType) {
        case "scatter3d":
          return {
            ...baseTrace,
            type: "scatter3d",
          }

        case "surface":
          const xValues = [...new Set(processedData.map((row) => row[xAxis]))].sort((a, b) => a - b)
          const yValues = [...new Set(processedData.map((row) => row[yAxis]))].sort((a, b) => a - b)
          const zMatrix = Array(yValues.length)
            .fill()
            .map(() => Array(xValues.length).fill(null))

          processedData.forEach((row) => {
            if (row[xAxis] !== null && row[yAxis] !== null && row[zAxis] !== null) {
              const xIdx = xValues.indexOf(row[xAxis])
              const yIdx = yValues.indexOf(row[yAxis])
              if (xIdx >= 0 && yIdx >= 0) {
                zMatrix[yIdx][xIdx] = row[zAxis]
              }
            }
          })

          const hasGaps = zMatrix.some((row) => row.some((cell) => cell === null))
          if (hasGaps) {
            for (let i = 0; i < zMatrix.length; i++) {
              for (let j = 0; j < zMatrix[i].length; j++) {
                if (zMatrix[i][j] === null) {
                  zMatrix[i][j] = 0
                }
              }
            }
          }

          return {
            type: "surface",
            x: xValues,
            y: yValues,
            z: zMatrix,
            colorscale: chartOptions.colorScheme || "Viridis",
            showscale: true,
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#ffffff",
                project: { z: true },
              },
            },
          }

        case "mesh3d":
          return {
            ...baseTrace,
            type: "mesh3d",
            intensity: processedData.map((row) => row[zAxis]),
            colorscale: chartOptions.colorScheme || "Viridis",
            opacity: 0.8,
            delaunayaxis: "z",
          }

        case "line3d":
          return {
            ...baseTrace,
            type: "scatter3d",
            mode: "lines",
            line: {
              width: 6,
              color: color,
              opacity: 0.7,
            },
          }

        default:
          return baseTrace
      }
    },
    [isDarkMode],
  )

  // Create chart trace configuration
  const chartTrace = useMemo(() => {
    if (!processedData.length || !xAxis || !yAxis) {
      return {}
    }

    const markerSize = chartOptions.markerSize || (initialData.length > 1000 ? 3 : 8)
    const color = getColorForScheme(chartOptions.colorScheme, isDarkMode)

    if (is3DChart(chartType) || chartType === "line3d") {
      return prepare3DData(chartType, processedData, xAxis, yAxis, zAxis, chartOptions)
    }

    let mode = "markers"
    if (chartType === "line") {
      mode = "lines+markers"
    } else if (chartType === "bar") {
      mode = "none"
    }

    const baseTrace = {
      x: processedData.map((row) => row[xAxis]),
      y: processedData.map((row) => row[yAxis]),
      type: chartType.includes("gl") ? chartType.replace("gl", "") : chartType,
      mode,
      marker: {
        size: markerSize,
        color,
      },
    }

    if (initialData.length > 1000 && chartType === "scatter") {
      baseTrace.type = "scattergl"
    }

    if (chartType === "pie") {
      return {
        labels: processedData.map((row) => row[xAxis]),
        values: processedData.map((row) => row[yAxis]),
        type: "pie",
        marker: { colors: [color] },
      }
    }
    return baseTrace
  }, [xAxis, yAxis, zAxis, chartType, processedData, initialData.length, isDarkMode, chartOptions])

  // Create chart layout configuration
  const layout = useMemo(() => {
    const baseLayout = {
      title: {
        text: `${xAxis}  v/s  ${yAxis}${zAxis ? ` v/s ${zAxis}` : ""}`,
        font: {
          size: 22,
          color: getCssVarAsHex("--chart-title-color"),
        },
        pad: { t: 10 },
        xref: "paper",
        x: 0.5,
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: getCssVarAsHex("--chart-title-color") },
      xaxis: {
        title: {
          text: xAxis,
          font: {
            size: 16,
            color: getCssVarAsHex("--chart-title-color"),
          },
          standoff: 20,
        },
        gridcolor: getCssVarAsHex("--chart-grid-color"),
      },
      yaxis: {
        title: {
          text: yAxis,
          font: {
            size: 16,
            color: getCssVarAsHex("--chart-title-color"),
          },
          standoff: 20,
        },
        gridcolor: getCssVarAsHex("--chart-grid-color"),
      },
      margin: { l: 80, r: 80, b: 80, t: 80, pad: 4 },
      showlegend: chartOptions.showLegend,
      autosize: true,
    }

    if (is3DChart(chartType) || chartType === "line3d") {
      baseLayout.scene = {
        xaxis: {
          title: {
            text: xAxis,
            font: {
              size: 16,
              color: getCssVarAsHex("--chart-title-color"),
            },
          },
          gridcolor: getCssVarAsHex("--chart-grid-color"),
          backgroundcolor: "transparent",
          showbackground: true,
          zerolinecolor: getCssVarAsHex("--chart-title-color"),
        },
        yaxis: {
          title: {
            text: yAxis,
            font: {
              size: 16,
              color: getCssVarAsHex("--chart-title-color"),
            },
          },
          gridcolor: getCssVarAsHex("--chart-grid-color"),
          backgroundcolor: "transparent",
          showbackground: true,
          zerolinecolor: getCssVarAsHex("--chart-title-color"),
        },
        zaxis: {
          title: {
            text: zAxis || "",
            font: {
              size: 16,
              color: getCssVarAsHex("--chart-title-color"),
            },
          },
          gridcolor: getCssVarAsHex("--chart-grid-color"),
          backgroundcolor: "transparent",
          showbackground: true,
          zerolinecolor: getCssVarAsHex("--chart-title-color"),
        },
        camera: {
          eye: { x: 1.75, y: 1.75, z: 1.25 },
          center: { x: 0, y: 0, z: 0 },
          up: { x: 0, y: 0, z: 1 },
        },
        aspectmode: "cube",
        aspectratio: { x: 1, y: 1, z: 0.85 },
      }

      if (chartType === "surface") {
        baseLayout.scene.dragmode = "orbit"
        baseLayout.margin = { l: 50, r: 50, b: 50, t: 90 }
      } else if (chartType === "mesh3d") {
        baseLayout.scene.camera.eye = { x: 1.9, y: 1.9, z: 1.6 }
        baseLayout.scene.aspectratio = { x: 1, y: 1, z: 0.9 }
      } else if (chartType === "line3d") {
        baseLayout.scene.camera.eye = { x: 1.8, y: 1.8, z: 1.4 }
      }
    }

    return baseLayout
  }, [xAxis, yAxis, zAxis, chartType, isDarkMode, chartOptions.showLegend])

  // Warning for non-numeric columns
  const showNumericWarning =
    (chartType !== "pie" && !isNumeric(yAxis)) || (chartType.includes("3d") && zAxis && !isNumeric(zAxis))

  // GLB export function
  const handleDownloadGLB = (plotRef, chartType, xAxis, yAxis, zAxis, processedData, chartOptions) => {
    const gd = plotRef.current?.el

    if (!gd) {
      toast.error("Chart not ready for GLB export.", TOAST_OPTIONS)
      return
    }
    try {
      const exportScene = new THREE.Scene()

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
      exportScene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1)
      exportScene.add(directionalLight)

      const backLight = new THREE.DirectionalLight(0xffffff, 0.4)
      backLight.position.set(-1, -1, -1)
      exportScene.add(backLight)

      const xData = processedData.map((row) => row[xAxis])
      const yData = processedData.map((row) => row[yAxis])
      const zData = zAxis ? processedData.map((row) => row[zAxis]) : null

      if (!zData) {
        toast.error("Z-axis data is required for 3D export.", TOAST_OPTIONS)
        return
      }

      // Normalize data for better visualization
      const normalizeData = (data) => {
        const min = Math.min(...data.filter((val) => val !== null && !isNaN(val)))
        const max = Math.max(...data.filter((val) => val !== null && !isNaN(val)))
        const range = max - min
        return data.map((val) => {
          if (val === null || isNaN(val)) return 0
          return range !== 0 ? ((val - min) / range) * 10 - 5 : 0
        })
      }

      const normalizedX = normalizeData(xData)
      const normalizedY = normalizeData(yData)
      const normalizedZ = normalizeData(zData)

      // Get color from chart options
      const getColor = () => {
        const colorScheme = chartOptions?.colorScheme || "default"
        const colors = {
          viridis: 0x440154,
          plasma: 0x9c179e,
          warm: 0xd13b40,
          cool: 0x3b518a,
          default: 0x3182ce,
        }
        return colors[colorScheme] || colors.default
      }

      const color = getColor()
      const pointSize = chartOptions?.markerSize || 1.3

      switch (chartType) {
        case "scatter3d": {
          const group = new THREE.Group()
          for (let i = 0; i < normalizedX.length; i++) {
            if (normalizedX[i] === null || normalizedY[i] === null || normalizedZ[i] === null) continue

            const geometry = new THREE.SphereGeometry(pointSize * 0.1, 8, 8)
            const material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.3,
              metalness: 0.2,
            })

            const point = new THREE.Mesh(geometry, material)
            point.position.set(normalizedX[i], normalizedZ[i], normalizedY[i])
            group.add(point)
          }
          exportScene.add(group)
          break
        }
        case "surface": {
          const uniqueX = [...new Set(normalizedX)].sort((a, b) => a - b)
          const uniqueY = [...new Set(normalizedY)].sort((a, b) => a - b)
          const zGrid = Array(uniqueY.length)
            .fill()
            .map(() => Array(uniqueX.length).fill(null))

          for (let i = 0; i < normalizedX.length; i++) {
            const xIndex = uniqueX.indexOf(normalizedX[i])
            const yIndex = uniqueY.indexOf(normalizedY[i])

            if (xIndex >= 0 && yIndex >= 0) {
              zGrid[yIndex][xIndex] = normalizedZ[i]
            }
          }

          // Fill any gaps in the surface
          for (let y = 0; y < zGrid.length; y++) {
            for (let x = 0; x < zGrid[y].length; x++) {
              if (zGrid[y][x] === null) {
                let sum = 0
                let count = 0

                for (let dy = -1; dy <= 1; dy++) {
                  for (let dx = -1; dx <= 1; dx++) {
                    if (y + dy >= 0 && y + dy < zGrid.length && x + dx >= 0 && x + dx < zGrid[y].length) {
                      if (zGrid[y + dy][x + dx] !== null) {
                        sum += zGrid[y + dy][x + dx]
                        count++
                      }
                    }
                  }
                }

                zGrid[y][x] = count > 0 ? sum / count : 0
              }
            }
          }

          // Create surface geometry
          const geometry = new THREE.PlaneGeometry(10, 10, uniqueX.length - 1, uniqueY.length - 1)

          // Modify the vertices to create the surface
          const vertices = geometry.attributes.position.array
          for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            const x = Math.floor(j % uniqueX.length)
            const y = Math.floor(j / uniqueX.length)

            if (y < uniqueY.length && x < uniqueX.length) {
              vertices[i + 2] = zGrid[y][x]
            }
          }
          geometry.computeVertexNormals()

          // Create material with color gradient
          const material = new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            flatShading: false,
            roughness: 0.5,
            metalness: 0.1,
          })

          const surface = new THREE.Mesh(geometry, material)
          surface.rotation.x = -Math.PI / 2 // Rotate to correct orientation

          exportScene.add(surface)
          break
        }

        case "mesh3d": {
          const validPoints = []
          for (let i = 0; i < normalizedX.length; i++) {
            if (
              normalizedX[i] !== null &&
              !isNaN(normalizedX[i]) &&
              normalizedY[i] !== null &&
              !isNaN(normalizedY[i]) &&
              normalizedZ[i] !== null &&
              !isNaN(normalizedZ[i])
            ) {
              validPoints.push(new THREE.Vector3(normalizedX[i], normalizedZ[i], normalizedY[i]))
            }
          }

          if (validPoints.length < 4) {
            toast.error("Not enough valid data points for 3D mesh.", TOAST_OPTIONS)
            return
          }

          let geometry
          try {
            // Try to create faces using convex hull algorithms
            if (validPoints.length > 4) {
                try{
                  geometry = new ConvexGeometry(validPoints)
                } catch (e) {
                  console.warn("Failed to create convex hull, falling back to point cloud", e)
                  // Fallback: create a simple triangulated geometry
                  const positions = new Float32Array(validPoints.length * 3)
                  const indices = []

                  // Fill vertex positions
                  for (let i = 0; i < validPoints.length; i++) {
                    positions[i * 3] = validPoints[i].x
                    positions[i * 3 + 1] = validPoints[i].y
                    positions[i * 3 + 2] = validPoints[i].z
                  }

                  // Create simple triangulation for visualization
                  for (let i = 1; i < validPoints.length - 1; i++) {
                    indices.push(0, i, i + 1)
                  }

                  geometry = new THREE.BufferGeometry()
                  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
                  geometry.setIndex(indices)
                }
              } else {
                geometry = new THREE.BufferGeometry().setFromPoints(validPoints)
              }
            } catch (e) {
              console.error("Error creating mesh geometry:", e)
              // create a basic shape
              geometry = new THREE.SphereGeometry(3, 32, 16)
            }

            // Compute normals for proper lighting
            geometry.computeVertexNormals()

            const material = new THREE.MeshStandardMaterial({
              color: color,
              opacity: 0.8,
              transparent: true,
              side: THREE.DoubleSide,
              flatShading: true,
              wireframe: false,
            })

            const mesh = new THREE.Mesh(geometry, material)

            // Add point cloud as well for better visualization
            const pointsGeometry = new THREE.BufferGeometry().setFromPoints(validPoints)
            const pointsMaterial = new THREE.PointsMaterial({
              color: 0xffffff,
              size: pointSize * 0.15,
              sizeAttenuation: true,
            })
            const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial)

            // Group them together
            const meshGroup = new THREE.Group()
            meshGroup.add(mesh)
            meshGroup.add(pointCloud)

            // Add metadata
            meshGroup.userData = {
              chartType: "mesh3d",
              pointCount: validPoints.length,
              dataColumns: {
                x: xAxis,
                y: yAxis,
                z: zAxis,
              },
            }

            exportScene.add(meshGroup)
            break
          }

        case "line3d": {
          const material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2,
          })

          // Sort points by X value for connected line
          const indices = Array.from({ length: normalizedX.length }, (_, i) => i)
          indices.sort((a, b) => normalizedX[a] - normalizedX[b])

          const points = []
          for (const i of indices) {
            if (normalizedX[i] === null || normalizedY[i] === null || normalizedZ[i] === null) continue
            points.push(new THREE.Vector3(normalizedX[i], normalizedZ[i], normalizedY[i]))
          }

          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, material)
          exportScene.add(line)
          break
        }

        default:
          toast.error(`Chart type ${chartType} is not supported for 3D export.`, TOAST_OPTIONS)
          return
      }

      const addAxes = () => {
        const axesGroup = new THREE.Group()

        // X axis (red)
        const xAxisGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-6, 0, 0),
          new THREE.Vector3(6, 0, 0),
        ])
        const xAxis = new THREE.Line(xAxisGeom, new THREE.LineBasicMaterial({ color: 0xff0000 }))
        axesGroup.add(xAxis)

        // Y axis (green)
        const yAxisGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -6, 0),
          new THREE.Vector3(0, 6, 0),
        ])
        const yAxis = new THREE.Line(yAxisGeom, new THREE.LineBasicMaterial({ color: 0x00ff00 }))
        axesGroup.add(yAxis)

        // Z axis (blue) - Note: Z is forward in THREE.js, but corresponds to Y axis in our data
        const zAxisGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, -6),
          new THREE.Vector3(0, 0, 6),
        ])
        const zAxis = new THREE.Line(zAxisGeom, new THREE.LineBasicMaterial({ color: 0x0000ff }))
        axesGroup.add(zAxis)

        // // Create actual TEXT geometry for axis labels instead of sprites
        // const addAxisLabel = (text, position, color) => {
        //   // Create text geometry
        //   const fontLoader = new FontLoader()
        //   // Use system font fallback if loading fails
        //   try {
        //     const textGeometry = new TextGeometry(text, {
        //       font: new THREE.Font({}), // Default placeholder font
        //       size: 0.5,
        //       height: 0.1,
        //       curveSegments: 4,
        //       bevelEnabled: false,
        //     })

        //     const textMaterial = new THREE.MeshBasicMaterial({ color: color })
        //     const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        //     textMesh.position.copy(position)
        //     return textMesh
        //   } catch (e) {
        //     // Fallback to creating a more visible marker with embedded text
        //     const markerGeometry = new THREE.SphereGeometry(0.15, 8, 8)
        //     const markerMaterial = new THREE.MeshBasicMaterial({ color: color })
        //     const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        //     marker.position.copy(position)

        //     // Add data attribute to the marker that will be preserved in the GLB
        //     marker.userData = { axisLabel: text }

        //     return marker
        //   }
        // }


        // Create axis labels using simple markers 
        const addAxisLabel = (text, position, color) => {
          // Create a visible marker sphere
          const markerGeometry = new THREE.SphereGeometry(0.15, 8, 8)
          const markerMaterial = new THREE.MeshBasicMaterial({ color: color })
          const marker = new THREE.Mesh(markerGeometry, markerMaterial)
          marker.position.copy(position)

          // Store the axis label in userData so it's preserved in the GLB export
          marker.userData = { axisLabel: text }

          return marker
        }

        const xLabelPos = new THREE.Vector3(6.5, 0, 0)
        const yLabelPos = new THREE.Vector3(0, 6.5, 0)
        const zLabelPos = new THREE.Vector3(0, 0, 6.5)

        // Add both the axis name and the actual data column name in userData
        const xLabelObj = addAxisLabel("X", xLabelPos, 0xff0000)
        xLabelObj.userData = { axisName: "X", dataColumn: xAxis }
        axesGroup.add(xLabelObj)

        const yLabelObj = addAxisLabel("Y", yLabelPos, 0x00ff00)
        yLabelObj.userData = { axisName: "Y", dataColumn: zAxis } // Note Z in THREE.js = Y in our data
        axesGroup.add(yLabelObj)

        const zLabelObj = addAxisLabel("Z", zLabelPos, 0x0000ff)
        zLabelObj.userData = { axisName: "Z", dataColumn: yAxis } // Note Y in THREE.js = Z in our data
        axesGroup.add(zLabelObj)

        // Add axis min/max values metadata
        const getMinMax = (data) => {
          const filtered = data.filter((val) => val !== null && !isNaN(val))
          return {
            min: Math.min(...filtered),
            max: Math.max(...filtered),
          }
        }

        // Add metadata to the axes group that will be preserved in the GLB
        axesGroup.userData = {
          axisInfo: {
            xAxis: {
              name: xAxis,
              ...getMinMax(processedData.map((row) => row[xAxis])),
            },
            yAxis: {
              name: yAxis,
              ...getMinMax(processedData.map((row) => row[yAxis])),
            },
            zAxis: {
              name: zAxis || "",
              ...(zAxis ? getMinMax(processedData.map((row) => row[zAxis])) : {}),
            },
          },
        }

        // Add grid lines with values
        const addGridWithValues = () => {
          const gridGroup = new THREE.Group()
          const intervals = 5 // Number of grid lines per axis

          // Generate values along each axis
          const generateAxisValues = (min, max, count) => {
            const values = []
            for (let i = 0; i <= count; i++) {
              values.push(min + (max - min) * (i / count))
            }
            return values
          }

          // X-axis grid with values
          const xMinMax = getMinMax(processedData.map((row) => row[xAxis]))
          const xValues = generateAxisValues(xMinMax.min, xMinMax.max, intervals)

          // Add tick marks and values for X axis
          xValues.forEach((value, i) => {
            const normalizedPos = -5 + 10 * (i / intervals)

            // Tick mark
            const tickGeom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(normalizedPos, -0.2, 0),
              new THREE.Vector3(normalizedPos, 0.2, 0),
            ])
            const tick = new THREE.Line(tickGeom, new THREE.LineBasicMaterial({ color: 0x888888 }))
            gridGroup.add(tick)

            // Value marker (as a small sphere with metadata)
            const valueMarker = new THREE.Mesh(
              new THREE.SphereGeometry(0.05, 4, 4),
              new THREE.MeshBasicMaterial({ color: 0xcccccc }),
            )
            valueMarker.position.set(normalizedPos, -0.3, 0)
            valueMarker.userData = { axisValue: value.toFixed(2) }
            gridGroup.add(valueMarker)
          })

          // Similarly for Y and Z axes (not showing full implementation for brevity)
          return gridGroup
        }

        axesGroup.add(addGridWithValues())
        return axesGroup
      }

      exportScene.add(addAxes())

      // Add a grid for reference
      const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444)
      gridHelper.rotation.x = Math.PI / 2
      exportScene.add(gridHelper)

      const exporter = new GLTFExporter()
      const exportOptions = {
        binary: true,
        includeCustomExtensions: true,
        embedImages: true,
        onlyVisible: true,
        precision: 8,
        trs: false,
      }
      exporter.parse(
        exportScene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: "model/gltf-binary" })
            const fileName = `3d-chart-${chartType}-${xAxis}-${yAxis}${zAxis ? `-${zAxis}` : ""}`
            downloadFile(URL.createObjectURL(blob), `${fileName}.glb`)

            toast.success("3D model exported successfully!", TOAST_OPTIONS)
          } else {
            console.error("Export did not return an ArrayBuffer", result)
            toast.error("Failed to create valid GLB file.", TOAST_OPTIONS)
          }
        },
        (error) => {
          console.error("GLB export error:", error)
          toast.error("Failed to export GLB file.", TOAST_OPTIONS)
        },
        exportOptions,
      )
    } catch (error) {
      console.error("GLB export failed:", error)
      toast.error("Failed to export 3D model. Error: " + error.message, TOAST_OPTIONS)
    }
  }

  // Enhanced download function
  const handleDownload = useCallback(() => {
    if (!plotRef.current?.el) {
      toast.error("Chart not available for download.", ERROR_TOAST_OPTIONS)
      return
    }

    try {
      // For GLB format with 3D charts
      if (is3DChart(chartType) && downloadFormat === "glb") {
        handleDownloadGLB(plotRef, chartType, xAxis, yAxis, zAxis, processedData, chartOptions)
        return
      }

      const plotElement = plotRef.current.el
      const fileName = `chart-${chartType}-${xAxis}-${yAxis}`
      const { clientWidth, clientHeight } = plotElement
      const aspectRatio = clientWidth / clientHeight

      // Prepare enhanced export layout with improved styling
      const exportLayout = {
        ...layout,
        font: { ...layout.font, color: "#000000" },
        title: {
          ...layout.title,
          font: { ...layout.title.font, color: "#000000", size: 24 },
        },
        xaxis: {
          ...layout.xaxis,
          title: { ...layout.xaxis.title, font: { ...layout.xaxis.title.font, color: "#000000", size: 18 } },
          tickfont: { color: "#000000", size: 14 },
          gridcolor: "#dddddd",
          linewidth: 2,
          linecolor: "#000000",
        },
        yaxis: {
          ...layout.yaxis,
          title: { ...layout.yaxis.title, font: { ...layout.yaxis.title.font, color: "#000000", size: 18 } },
          tickfont: { color: "#000000", size: 14 },
          gridcolor: "#dddddd",
          linewidth: 2,
          linecolor: "#000000",
        },
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
      }

      // Optimize 3D scene for export if applicable
      if (exportLayout.scene) {
        exportLayout.scene = {
          ...exportLayout.scene,
          xaxis: {
            ...exportLayout.scene.xaxis,
            color: "#000000",
            title: { ...exportLayout.scene.xaxis.title, font: { color: "#000000" } },
          },
          yaxis: {
            ...exportLayout.scene.yaxis,
            color: "#000000",
            title: { ...exportLayout.scene.yaxis.title, font: { color: "#000000" } },
          },
          zaxis: {
            ...exportLayout.scene.zaxis,
            color: "#000000",
            title: { ...exportLayout.scene.zaxis.title, font: { color: "#000000" } },
          },
        }
      }

      // Create enhanced export trace
      const exportData = JSON.parse(JSON.stringify([chartTrace]))
      exportData.forEach((trace) => {
        if (trace.marker && !chartType.includes("pie")) {
          trace.marker.size = trace.marker.size * 1.2

          if (trace.marker.color) {
            if (typeof trace.marker.color === "string") {
              trace.marker.color =
                trace.marker.color === "#63B3ED" || trace.marker.color === "#3182CE" ? "#2B6CB0" : trace.marker.color
            }

            trace.marker.line = { width: 1.5, color: "rgba(0,0,0,0.8)" }
          }
        }

        if (chartType === "line" || trace.mode?.includes("lines")) {
          trace.line = { ...trace.line, width: 3, shape: "spline" }
        }

        if (chartType === "pie") {
          trace.textfont = { color: "#000000", size: 14 }
          trace.outsidetextfont = { color: "#000000", size: 14, weight: "bold" }
        }

        if (chartType.includes("3d") && trace.marker) {
          trace.marker.size = trace.marker.size * 1.5
          trace.marker.opacity = 0.9
        }
      })

      // Handle PDF export
      if (downloadFormat === "pdf") {
        Plotly.toImage(plotElement, {
          format: "png",
          width: clientWidth * 2,
          height: clientHeight * 2,
          scale: 3,
          filename: fileName,
          data: exportData,
          layout: exportLayout,
        })
          .then((pngDataUrl) => {
            const orientation = clientWidth > clientHeight ? "landscape" : "portrait"
            const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" })

            const pdfWidth = orientation === "landscape" ? 297 : 210
            const pdfHeight = orientation === "landscape" ? 210 : 297
            const margin = 10
            const maxImageWidth = pdfWidth - margin * 2
            const maxImageHeight = pdfHeight - margin * 2

            // Calculate image dimensions while preserving aspect ratio
            let imageWidth, imageHeight
            if (maxImageWidth / aspectRatio <= maxImageHeight) {
              imageWidth = maxImageWidth
              imageHeight = maxImageWidth / aspectRatio
            } else {
              imageHeight = maxImageHeight
              imageWidth = maxImageHeight * aspectRatio
            }

            const x = (pdfWidth - imageWidth) / 2
            const y = (pdfHeight - imageHeight) / 2

            const img = new Image()
            img.onload = () => {
              pdf.addImage(pngDataUrl, "PNG", x, y, imageWidth, imageHeight)
              pdf.save(`${fileName}.pdf`)
              setChartState((draft) => {
                draft.isDownloadMenuOpen = false
              })
            }
            img.src = pngDataUrl
          })
          .catch((err) => {
            console.error("Error generating PDF:", err)
            toast.error("Failed to generate PDF. Please try another format.", TOAST_OPTIONS)
          })
        return
      }

      // Handle other formats
      const supportedFormats = ["png", "svg", "jpeg", "webp"]
      if (!supportedFormats.includes(downloadFormat)) {
        toast.error(
          `Sorry, ${downloadFormat.toUpperCase()} format is not supported. Please select another format.`,
          TOAST_OPTIONS,
        )
        return
      }

      // Determine export parameters based on format
      let scale = 1,
        width = clientWidth,
        height = clientHeight
      switch (downloadFormat) {
        case "svg":
          scale = 1
          width = Math.max(clientWidth, 1200)
          height = width / aspectRatio
          break

        case "png":
        case "jpeg":
        case "webp":
          scale = 3
          width = Math.min(clientWidth * 1.5, 2400)
          height = width / aspectRatio
          break
      }

      // Generate and download the image
      Plotly.toImage(plotElement, {
        format: downloadFormat,
        width,
        height,
        scale,
        filename: fileName,
        imageDataOnly: false,
        data: exportData,
        layout: exportLayout,
      })
        .then((dataUrl) => {
          if (downloadFormat !== "svg") {
            const img = new Image()
            img.onload = function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height

              const ctx = canvas.getContext("2d")
              ctx.imageSmoothingEnabled = true
              ctx.imageSmoothingQuality = "high"
              ctx.drawImage(this, 0, 0)

              const finalDataUrl =
                downloadFormat === "jpeg"
                  ? canvas.toDataURL(`image/${downloadFormat}`, 0.95)
                  : canvas.toDataURL(`image/${downloadFormat}`)

              downloadFile(finalDataUrl, `${fileName}.${downloadFormat}`)
              setChartState((draft) => {
                draft.isDownloadMenuOpen = false
              })
            }
            img.src = dataUrl
          } else {
            downloadFile(dataUrl, `${fileName}.${downloadFormat}`)
            setChartState((draft) => {
              draft.isDownloadMenuOpen = false
            })
          }
        })
        .catch((err) => {
          console.error(`Error generating image:`, err)
          toast.error(`Failed to generate ${downloadFormat.toUpperCase()}.`, TOAST_OPTIONS)
        })
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to download chart. Please try again.", ERROR_TOAST_OPTIONS)
    }
  }, [chartType, xAxis, yAxis, zAxis, layout, chartTrace, downloadFormat, setChartState, processedData, chartOptions])

  const getAvailableDownloadFormats = useCallback(() => {
    if (is3DChart(chartType)) {
      return DOWNLOAD_OPTIONS.filter((option) => ["glb", "png", "jpeg", "webp"].includes(option.value))
    }
    return DOWNLOAD_OPTIONS.filter((option) => option.value !== "glb")
  }, [chartType])

  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analysisName, setAnalysisName] = useState("")
  const [includeAiInsights, setIncludeAiInsights] = useState(true)

  const handleSaveClick = () => {
    // Check permissions before showing modal
    if (!userPermissions.canSave) {
      toast.error("You don't have permission to save analyses. Please contact your administrator.", ERROR_TOAST_OPTIONS)
      return
    }

    setAnalysisName(`Analysis - ${layout.title.text}`)
    setIncludeAiInsights(hasAiInsights) // Default to true if insights are available
    setShowModal(true)
  }

  const handleSaveAnalysis = async () => {
    if (!analysisName.trim()) {
      toast.error("Please add name for analysis.", ERROR_TOAST_OPTIONS)
      return
    }
    if (!xAxis || !yAxis) {
      toast.error("Please select axes before saving analysis", ERROR_TOAST_OPTIONS)
      return
    }

    // Double-check permissions
    if (!userPermissions.canSave) {
      toast.error("You don't have permission to save analyses.", ERROR_TOAST_OPTIONS)
      setShowModal(false)
      return
    }

    setIsSaving(true)
    try {
      // Prepare sample data (first 3 rows)
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

      // Include AI insights if available and user wants to include them
      if (hasAiInsights && includeAiInsights) {
        analysisData.aiInsights = {
          promptType: aiInsights.insights.promptType,
          insights: aiInsights.insights.insights,
          generatedAt: aiInsights.insights.metadata?.analysisDate || new Date().toISOString(),
          metadata: aiInsights.insights.metadata || {},
        }
      }

      const { success, data, genericErrors, fieldErrors } = await saveAnalysis(analysisData)
      if (success) {
        toast.success(data.message, SUCCESS_TOAST_OPTIONS)
        if (onAnalysisSaveSuccess) {
          onAnalysisSaveSuccess()
        }
        setShowModal(false)
        return
      }

      // Handle field errors (including analysis limit from 429 response)
      if (fieldErrors?.analysisLimit) {
        toast.error(fieldErrors.analysisLimit, ERROR_TOAST_OPTIONS)
        setShowModal(false)
        return
      }

      if (fieldErrors?.permission) {
        toast.error(fieldErrors.permission, ERROR_TOAST_OPTIONS)
        setShowModal(false)
        return
      }

      showGenericErrorAsToast(genericErrors)
    } catch (error) {
      console.error("Error saving analysis:", error)
      // Handle network errors or other exceptions
      if (error.response?.status === 429) {
        toast.error("Analysis save limit reached. Please contact support to increase your limit.", ERROR_TOAST_OPTIONS)
        setShowModal(false)
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to save analyses. Please contact your administrator.", ERROR_TOAST_OPTIONS)
        setShowModal(false)
      } else {
        toast.error("Failed to save analysis. Please try again.", ERROR_TOAST_OPTIONS)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Get save button text based on AI insights availability
  const getSaveButtonText = () => {
    if (hasAiInsights) {
      return "Save Analysis"
    }
    return "Save Analysis"
  }

  // Get save button icon based on AI insights availability
  const getSaveButtonIcon = () => {
    if (hasAiInsights) {
      return <Brain className="w-4 h-4" />
    }
    return <Save className="w-4 h-4" />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Data Visualization</h2>
      </div>

      {/* Permission Status for Save Feature */}
      {!userPermissions.canSave && (
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm sm:text-base font-medium text-amber-800 dark:text-amber-200">
              Save Analysis Restricted
            </p>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1">
              Your account has read-only access. You can view and download charts but cannot save analyses.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2 text-card-foreground">Sheet</label>
          <select
            className="w-full p-2 sm:p-3 rounded border bg-muted border-primary/10  text-sm focus:outline-none"
            onChange={handleSheetSelection}
            value={selectedSheet}
          >
            {sheetNames.map((sheet, index) => (
              <option key={index} value={sheet} className="bg-secondary text-secondary-foreground">
                {sheet}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2 text-card-foreground">Chart Type</label>
          <select
            className="w-full p-2 sm:p-3 rounded border bg-muted border-primary/10  text-sm focus:outline-none"
            onChange={(e) =>
              setChartState((draft) => {
                draft.chartType = e.target.value
              })
            }
            value={chartType}
          >
            {CHART_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value} className="bg-secondary text-secondary-foreground">
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

      {(is3DChart(chartType) || chartType === "line3d") && (
        <>
          {/* Chart Description */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              {chartType === "scatter3d" && (
                <span>
                  3D Scatter plots show relationships between three numerical variables using points in 3D space.
                </span>
              )}
              {chartType === "surface" && (
                <span>
                  3D Surface plots create a continuous surface from your data, useful for visualizing mathematical
                  functions and geographic data.
                </span>
              )}
              {chartType === "mesh3d" && (
                <span>
                  3D Mesh plots connect your data points to form a wireframe surface, ideal for complex shapes and
                  irregular datasets.
                </span>
              )}
              {chartType === "line3d" && (
                <span>
                  3D Line plots connect data points with lines in 3D space, perfect for visualizing paths and
                  trajectories.
                </span>
              )}
            </div>
          </div>

          {/* Warning for Z-axis requirement */}
          {!zAxis && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                A Z-axis selection is required for 3D visualizations.
              </p>
            </div>
          )}
        </>
      )}

      {/* Chart Options */}
      <ChartOptions chartType={chartType} onOptionsChange={handleOptionsChange} />

      {/* Plot Container */}
      <div className="border border-border rounded-lg p-2 sm:p-4 bg-card">
        <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
          <ErrorBoundary>
            <Plot
              ref={plotRef}
              data={[chartTrace]}
              layout={{
                ...layout,
                margin: {
                  l: window.innerWidth < 640 ? 40 : 80,
                  r: window.innerWidth < 640 ? 20 : 80,
                  t: window.innerWidth < 640 ? 40 : 80,
                  b: window.innerWidth < 640 ? 40 : 80,
                  pad: 4,
                },
                font: {
                  ...layout.font,
                  size: window.innerWidth < 640 ? 10 : 12,
                },
                title: {
                  ...layout.title,
                  font: {
                    ...layout.title.font,
                    size: window.innerWidth < 640 ? 16 : 22,
                  },
                },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: window.innerWidth < 640 ? ["lasso2d", "select2d"] : [],
                modeBarButtons: [
                  ["resetViews", "zoomIn2d", "zoomOut2d", ...(window.innerWidth >= 640 ? ["pan2d"] : [])],
                ],
              }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* 3D Chart Pro Tip */}
      {is3DChart(chartType) && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <Info className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800 dark:text-green-200">
            <p>
              <strong>Pro tip:</strong> Download this 3D chart as GLB to view it in 3D viewers, AR applications, or VR
              environments.
            </p>
          </div>
        </div>
      )}

      {/* AI Insights Section - Moved after chart */}
      {aiPromptTypes.length > 0 && (
        <div className="bg-card border border-border rounded-lg">
          {/* Collapsible Header */}
          <div
            className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() =>
              setAiInsights((draft) => {
                draft.isExpanded = !draft.isExpanded
              })
            }
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">AI Insights</h3>
              {aiInsights.insights && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Generated</span>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${aiInsights.isExpanded ? "rotate-180" : ""
                }`}
            />
          </div>

          {/* Collapsible Content */}
          {aiInsights.isExpanded && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end mb-4 mt-4">
                {/* Analysis Type Dropdown - Similar to Download Format */}
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Analysis Type</label>
                  <div className="relative" ref={promptMenuRef}>
                    <div className="flex">
                      <button
                        onClick={() =>
                          setAiInsights((draft) => {
                            draft.isPromptMenuOpen = !draft.isPromptMenuOpen
                          })
                        }
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted text-muted-foreground border border-border text-sm rounded-l-md hover:bg-muted/80 transition-colors flex-1 justify-between ${aiInsights.isPromptMenuOpen ? "border-r-0" : "border-r-0"
                          }`}
                        disabled={aiInsights.isGenerating}
                      >
                        <span className="truncate">
                          {aiPromptTypes.find((p) => p.type === aiInsights.selectedPromptType)?.label || "Select Type"}
                        </span>
                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      </button>
                      <button
                        onClick={handleGenerateInsights}
                        disabled={aiInsights.isGenerating || !canGenerateAiInsights}
                        className={`px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground text-sm rounded-r-md transition-colors disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center ${aiInsights.isGenerating ? "bg-primary/80" : ""
                          }`}
                        title={
                          !canGenerateAiInsights
                            ? "AI insights require data and appropriate permissions"
                            : "Generate AI insights for your data"
                        }
                      >
                        {aiInsights.isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">Generate</span>
                          </>
                        )}
                      </button>
                    </div>

                    {aiInsights.isPromptMenuOpen && (
                      <div className="absolute left-0 mt-1 w-full bg-card border border-border shadow-lg rounded-md z-10">
                        <div className="py-2 px-3 bg-muted text-sm font-medium text-muted-foreground rounded-t-md">
                          Select Analysis Type
                        </div>
                        <ul className="py-1 max-h-48 overflow-y-auto">
                          {aiPromptTypes.map((promptType) => (
                            <li
                              key={promptType.type}
                              onClick={() => handlePromptSelect(promptType.type)}
                              className="px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-card-foreground">{promptType.label}</div>
                                  <div className="text-xs text-muted-foreground">{promptType.description}</div>
                                </div>
                                {aiInsights.selectedPromptType === promptType.type && (
                                  <span className="text-primary">✓</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Copy Button */}
                {aiInsights.insights && (
                  <button
                    onClick={handleCopyInsights}
                    className="flex items-center gap-2 px-3 py-2 sm:py-3 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors"
                    title="Copy insights to clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
                  </button>
                )}
              </div>

              {!canGenerateAiInsights && (
                <div className="mb-4 text-sm text-muted-foreground">
                  {userPermissions.role !== "admin" && userPermissions.permissions === "Read Only"
                    ? "AI insights require admin access or full permissions."
                    : "Upload data to generate AI insights."}
                </div>
              )}

              {/* AI Insights Display */}
              {aiInsights.error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Error generating insights</p>
                      <p className="text-sm text-destructive/80 mt-1">{aiInsights.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {aiInsights.insights && (
                <div className="bg-muted/30 border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">
                        {aiInsights.insights.sheetName} • {aiInsights.insights.promptType} analysis
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setAiInsights((draft) => {
                          draft.insights = null
                          draft.error = null
                        })
                      }
                      className="flex items-center gap-1.5 text-xs px-2 py-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-card-foreground rounded-md transition-colors"
                      title="Clear insights and generate new ones"
                    >
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                      {aiInsights.insights.insights}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Rows:</span> {aiInsights.insights.metadata.totalRows}
                      </div>
                      <div>
                        <span className="font-medium">Columns:</span> {aiInsights.insights.metadata.columnCount}
                      </div>
                      <div>
                        <span className="font-medium">Generated:</span>{" "}
                        {new Date(aiInsights.insights.metadata.analysisDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Analysis Limit Warning */}
      {analysisLimitReached && !analysisUnlimited && (
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm sm:text-base font-medium text-destructive">Analysis Save Limit Reached</p>
            <p className="text-xs sm:text-sm text-destructive/80 mt-1">
              You have reached your analysis save limit. Please contact support to increase your limit or delete some
              existing analyses.
            </p>
          </div>
        </div>
      )}

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
              className="flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-muted text-muted-foreground border sm:border-r-0 border-border text-sm rounded-l-md sm:rounded-r-none hover:bg-muted/80 transition-colors w-full sm:w-auto"
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
                    <span className="text-card-foreground">{option.label}</span>
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

        {/* Save Analysis Button */}
        <button
          onClick={handleSaveClick}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${hasAiInsights
            ? "bg-gradient-to-r from-primary/90 to-purple-700 hover:from-primary hover:to-purple-600 text-white shadow-md border border-purple-400/20"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          disabled={!xAxis || !yAxis || (analysisLimitReached && !analysisUnlimited) || !userPermissions.canSave}
          title={
            !userPermissions.canSave
              ? "You don't have permission to save analyses"
              : analysisLimitReached && !analysisUnlimited
                ? "Analysis save limit reached"
                : hasAiInsights
                  ? "Save analysis with AI insights"
                  : "Save analysis"
          }
        >
          {getSaveButtonIcon()}
          <span>{getSaveButtonText()}</span>
          {hasAiInsights && (
            <span className="text-xs bg-white/30 dark:bg-white/40 px-1.5 py-0.5 rounded-full font-medium shadow-sm">
              +AI
            </span>
          )}
        </button>
      </div>

      {/* Save Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border p-4 sm:p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Save Analysis</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-card-foreground">Analysis Name</label>
              <input
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                className="w-full p-2 sm:p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                placeholder="Enter a name for this analysis"
              />
            </div>

            {/* AI Insights Toggle */}
            {hasAiInsights && (
              <div className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">Include AI Insights</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAiInsights}
                      onChange={(e) => setIncludeAiInsights(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-purple-600"></div>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {includeAiInsights
                    ? "AI insights will be saved with your analysis"
                    : "Only chart configuration will be saved"}
                </p>
              </div>
            )}

            {/* Save Preview */}
            <div className="mb-4 p-3 bg-muted/30 border border-border rounded-md">
              <h4 className="text-sm font-medium text-card-foreground mb-2">What will be saved:</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                  Chart configuration ({chartType})
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                  Axis settings ({xAxis} vs {yAxis}
                  {zAxis ? ` vs ${zAxis}` : ""})
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                  Data sample preview
                </li>
                {hasAiInsights && includeAiInsights && (
                  <li className="flex items-center gap-1.5 text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    AI insights ({aiInsights.insights?.promptType} analysis)
                  </li>
                )}
              </ul>
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
                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px] gap-2 ${hasAiInsights && includeAiInsights
                  ? "bg-gradient-to-r from-primary/90 to-purple-700 hover:from-primary hover:to-purple-600 text-white shadow-md border border-purple-400/20"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
              >
                {isSaving ? (
                  <Spinner1 className="w-4 h-4 border-2 border-current" />
                ) : (
                  <>
                    {hasAiInsights && includeAiInsights ? <Brain className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{hasAiInsights && includeAiInsights ? "Save with AI" : "Save"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartBuilder
