import { getAnalysisById } from "@/api"
import { AnalysisCard, ChartPreviewModal } from "@/components"
import { useTheme } from "@/hooks"
import { formatDate, PATHS, prepareChartData, showGenericErrorAsToast, Upload } from "@/utils"
import { ArrowRight, AreaChartIcon as ChartArea } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useLoaderData, useNavigation } from "react-router-dom"

function Dashboard() {
    const { isDarkMode } = useTheme()
    const response = useLoaderData()
    const navigation = useNavigation()

    // Check if page is currently loading (during navigation)
    const isLoading = navigation.state === "loading"

    // Extract data from the loader response
    const { stats, recentAnalyses, uploads } = response.data || {
        stats: { totalUploads: 0, savedAnalyses: 0 },
        recentAnalyses: [],
        uploads: [],
    }

    // Show errors as toast notifications
    useEffect(() => {
        if (!response.success && response.genericErrors) {
            showGenericErrorAsToast(response.genericErrors)
        }
    }, [response])

    // Chart preview state
    const [isAnalysisDataLoading, setIsAnalysisDataLoading] = useState(false)
    const [selectedAnalysis, setSelectedAnalysis] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [showChartModal, setShowChartModal] = useState(false)

    // Function to handle when user clicks on an analysis card
    const handleAnalysisClick = useCallback(
        async (analysis) => {
            setIsAnalysisDataLoading(true)
            setSelectedAnalysis(analysis)
            setShowChartModal(true)

            try {
                const { dataSetId, sheetIndex } = analysis
                const { success, data, genericErrors } = await getAnalysisById(dataSetId, sheetIndex)
                if (success) {
                    const chartDataResult = prepareChartData(analysis, data.rows, isDarkMode)
                    setChartData(chartDataResult)
                    return
                }
                showGenericErrorAsToast(genericErrors)
            } catch (error) {
                console.error("Error fetching analysis data:", error)
                showGenericErrorAsToast(["Failed to load analysis data. Please try again."])
                setShowChartModal(false)
            } finally {
                setIsAnalysisDataLoading(false)
            }
        },
        [isDarkMode],
    )

    // Close the chart preview modal
    const handleCloseModal = useCallback(() => {
        setShowChartModal(false)
        setSelectedAnalysis(null)
        setChartData(null)
    }, [])

    return (
        <div>
            <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-3 sm:mb-4">Dashboard</h2>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-4 sm:p-6 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl">
                        <Upload />
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold mt-2">Total Uploads</h3>
                    <p className="text-xl sm:text-2xl font-bold">{isLoading ? "..." : stats.totalUploads}</p>
                </div>
                <div className="p-4 sm:p-6 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl">
                        <ChartArea />
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold mt-2">Saved Analyses</h3>
                    <p className="text-xl sm:text-2xl font-bold">{isLoading ? "..." : stats.savedAnalyses}</p>
                </div>
            </div>

            {/* Recent Analyses Section */}
            <div className="bg-card rounded-md shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Analyses</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                    </div>
                ) : recentAnalyses.length === 0 ? (
                    <p className="text-muted-foreground">No analyses saved yet.</p>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <div
                            className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] sm:auto-cols-[minmax(300px,1fr)] gap-3 sm:gap-4"
                            style={{
                                overflowX: "scroll",
                                scrollbarWidth: "none",
                                WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                            }}
                        >
                            {recentAnalyses.map((analysis) => (
                                <AnalysisCard key={analysis._id} analysis={analysis} onClick={handleAnalysisClick} compact={true} />
                            ))}

                            {/* Navigate Button Card */}
                            <div className="flex flex-col gap-0.5 items-center justify-center rounded-md min-w-[250px] sm:min-w-[300px] text-muted-foreground">
                                <Link
                                    to={PATHS.ANALYSIS_HISTORY}
                                    className="text-sm p-2 bg-muted rounded-full hover:bg-muted-foreground/30 transition"
                                >
                                    <ArrowRight />
                                </Link>
                                <span className="text-xs sm:text-sm">View All Analyses</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Uploads Section */}
            <div className="bg-card rounded-md shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Uploads</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                    </div>
                ) : uploads.length === 0 ? (
                    <p className="text-muted-foreground">No uploads yet.</p>
                ) : (
                    <>
                        {/* Desktop Table - Hidden on small screens */}
                        <div className="hidden sm:block">
                            <ul className="space-y-2">
                                {/* Header Row */}
                                <li className="flex justify-between items-center font-semibold border-b py-2">
                                    <span className="w-[5%]">#</span>
                                    <span className="w-[45%]">Filename</span>
                                    <span className="w-[20%] text-right">Size</span>
                                    <span className="w-[30%] text-right">Uploaded</span>
                                </li>

                                {/* Data Rows */}
                                {uploads.map((upload, index) => (
                                    <li key={upload._id} className="flex justify-between items-center py-2 border-b text-sm">
                                        <span className="w-[5%]">{index + 1}</span>
                                        <span className="w-[45%] font-medium truncate">{upload.originalName}</span>
                                        <span className="w-[20%] text-muted-foreground text-right">{upload.fileSize}</span>
                                        <span className="w-[30%] text-muted-foreground text-right">{formatDate(upload.createdAt)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mobile Card View - Shown only on small screens */}
                        <div className="sm:hidden space-y-3">
                            {uploads.map((upload, index) => (
                                <div key={upload._id} className="border rounded-md p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">#{index + 1}</span>
                                        <span className="text-xs text-muted-foreground">{upload.fileSize}</span>
                                    </div>
                                    <div className="font-medium truncate mb-1">{upload.originalName}</div>
                                    <div className="text-xs text-muted-foreground">{formatDate(upload.createdAt)}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Chart Preview Modal - Reused from components */}
            <ChartPreviewModal
                isOpen={showChartModal}
                analysis={selectedAnalysis}
                chartData={chartData}
                isLoading={isAnalysisDataLoading}
                onClose={handleCloseModal}
            />
        </div>
    )
}

export default Dashboard
