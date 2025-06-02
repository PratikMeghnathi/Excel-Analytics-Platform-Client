"use client"

import { X, Table, Brain, Copy, Check } from "lucide-react"
import Plot from "react-plotly.js"
import { useState, useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { DataTable } from "./"
import { ERROR_TOAST_OPTIONS, SUCCESS_TOAST_OPTIONS } from "@/utils"

function ChartPreviewModal({ isOpen, analysis, chartData, isLoading, onClose }) {
    const [activeTab, setActiveTab] = useState("chart") // chart, data, insights
    const [isCopied, setIsCopied] = useState(false)

    const handleCopyInsights = useCallback(async () => {
        if (chartData?.aiInsights?.insights) {
            try {
                await navigator.clipboard.writeText(chartData.aiInsights.insights)
                setIsCopied(true)
                toast.success("Insights copied to clipboard!", SUCCESS_TOAST_OPTIONS)
                setTimeout(() => setIsCopied(false), 2000)
            } catch (error) {
                toast.error("Failed to copy insights.", ERROR_TOAST_OPTIONS)
            }
        }
    }, [chartData?.aiInsights])

    // Reset to chart tab when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab("chart")
        }
    }, [isOpen])

    // Check if we have data for the table and AI insights
    const hasTableData = chartData?.rows && chartData?.rows.length > 0
    const hasAiInsights = chartData?.hasAiInsights && chartData?.aiInsights?.insights

    if (!isOpen || !analysis) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold truncate pr-2">{analysis.name}</h3>
                            {analysis.hasAiInsights && (
                                <span className="text-xs bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-medium">
                                    AI Enhanced
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {analysis.sheetName} • {analysis.chartConfig?.chartType?.toUpperCase() || "CHART"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 hover:bg-muted rounded-full cursor-pointer flex-shrink-0 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="border-b bg-muted/30 px-3 sm:px-4 flex-shrink-0">
                    <div className="flex gap-1 sm:gap-2">
                        <button
                            onClick={() => setActiveTab("chart")}
                            className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "chart"
                                ? "border-primary text-primary bg-background"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Chart
                        </button>
                        {hasTableData && (
                            <button
                                onClick={() => setActiveTab("data")}
                                className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "data"
                                    ? "border-primary text-primary bg-background"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Table className="w-4 h-4" />
                                Data
                                <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">{chartData.totalRows}</span>
                            </button>
                        )}
                        {hasAiInsights && (
                            <button
                                onClick={() => setActiveTab("insights")}
                                className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "insights"
                                    ? "border-primary text-primary bg-background"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Brain className="w-4 h-4" />
                                AI Insights
                            </button>
                        )}
                    </div>
                </div>

                {/* Content - This is the key change */}
                <div className="flex-1 min-h-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Loading analysis data...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chart Tab */}
                            {activeTab === "chart" && (
                                <div className="h-full p-3 sm:p-6">
                                    {chartData?.data ? (
                                        <div className="h-full min-h-[300px]">
                                            <Plot
                                                data={chartData.data}
                                                layout={{
                                                    ...chartData.layout,
                                                    autosize: true,
                                                    margin: {
                                                        l: window.innerWidth < 640 ? 40 : 60,
                                                        r: window.innerWidth < 640 ? 20 : 40,
                                                        t: window.innerWidth < 640 ? 40 : 60,
                                                        b: window.innerWidth < 640 ? 40 : 60,
                                                    },
                                                    font: {
                                                        size: window.innerWidth < 640 ? 10 : 12,
                                                    },
                                                    legend: {
                                                        ...chartData.layout.legend,
                                                        orientation: window.innerWidth < 640 ? "h" : chartData.layout.legend?.orientation || "v",
                                                        x: window.innerWidth < 640 ? 0 : chartData.layout.legend?.x,
                                                        y: window.innerWidth < 640 ? -0.2 : chartData.layout.legend?.y,
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
                                                    modeBarStyle: {
                                                        height: window.innerWidth < 640 ? "30px" : "35px",
                                                    },
                                                }}
                                                style={{ width: "100%", height: "100%" }}
                                                useResizeHandler={true}
                                                className="rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center h-full">
                                            <div className="text-center">
                                                <div className="text-4xl sm:text-6xl mb-4 text-muted-foreground">📊</div>
                                                <p className="text-sm sm:text-base text-muted-foreground">No chart data available</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                    The analysis data could not be loaded
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Data Tab */}
                            {activeTab === "data" && hasTableData && (
                                <div className="h-full overflow-auto p-3 sm:p-6">
                                    <div className="h-full">
                                        <DataTable
                                            data={chartData.rows}
                                            headers={chartData.headers}
                                            totalRows={chartData.totalRows}
                                            columnTypes={[]} // Column types can be added if needed
                                        />
                                    </div>
                                </div>
                            )}

                            {/* AI Insights Tab */}
                            {activeTab === "insights" && hasAiInsights && (
                                <div className="h-full overflow-auto">
                                    <div className="p-3 sm:p-6">
                                        <div className="max-w-4xl mx-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="w-5 h-5 text-primary" />
                                                    <h4 className="text-lg font-semibold text-card-foreground">AI Analysis</h4>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        {chartData.aiInsights.promptType || "Analysis"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleCopyInsights}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors"
                                                    title="Copy insights to clipboard"
                                                >
                                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
                                                </button>
                                            </div>

                                            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-lg p-4 sm:p-6">
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                                                        {chartData.aiInsights.insights}
                                                    </div>
                                                </div>

                                                {/* Metadata */}
                                                {chartData.aiInsights.metadata && (
                                                    <div className="mt-6 pt-4 border-t border-primary/20">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                                                            {chartData.aiInsights.metadata.totalRows && (
                                                                <div>
                                                                    <span className="font-medium">Rows Analyzed:</span>{" "}
                                                                    {chartData.aiInsights.metadata.totalRows}
                                                                </div>
                                                            )}
                                                            {chartData.aiInsights.metadata.columnCount && (
                                                                <div>
                                                                    <span className="font-medium">Columns:</span>{" "}
                                                                    {chartData.aiInsights.metadata.columnCount}
                                                                </div>
                                                            )}
                                                            {chartData.aiInsights.generatedAt && (
                                                                <div>
                                                                    <span className="font-medium">Generated:</span>{" "}
                                                                    {new Date(chartData.aiInsights.generatedAt).toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer with analysis details - only show on larger screens for chart tab */}
                {activeTab === "chart" && !isLoading && (
                    <div className="hidden sm:block border-t p-3 sm:p-4 bg-muted/30 flex-shrink-0">
                        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span>
                                <strong>File:</strong> {analysis.filename}
                            </span>
                            <span>
                                <strong>Created:</strong> {new Date(analysis.createdAt).toLocaleDateString()}
                            </span>
                            {analysis.chartConfig && (
                                <span>
                                    <strong>Axes:</strong> {analysis.chartConfig.xAxis} × {analysis.chartConfig.yAxis}
                                    {analysis.chartConfig.zAxis && ` × ${analysis.chartConfig.zAxis}`}
                                </span>
                            )}
                            {hasAiInsights && (
                                <span className="text-primary">
                                    <strong>AI Enhanced:</strong> {chartData.aiInsights.promptType} analysis included
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChartPreviewModal
