import { X } from "lucide-react"
import Plot from "react-plotly.js"

function ChartPreviewModal({ isOpen, analysis, chartData, isLoading, onClose }) {
    if (!isOpen || !analysis) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate pr-2">{analysis.name}</h3>
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

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <div className="p-3 sm:p-6 h-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Loading chart data...</p>
                                </div>
                            </div>
                        ) : chartData ? (
                            <div className="h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                                <Plot
                                    data={chartData.data}
                                    layout={{
                                        ...chartData.layout,
                                        // Override layout for better mobile responsiveness
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
                                        // Ensure legend is responsive
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
                                        // Make toolbar more mobile-friendly
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
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">The analysis data could not be loaded</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with analysis details - only show on larger screens */}
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartPreviewModal
