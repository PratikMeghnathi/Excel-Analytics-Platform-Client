import { useCallback, useEffect, useState } from "react"
import { useNavigation } from "react-router-dom"
import {
  prepareChartData, showGenericErrorAsToast,
  Search, Grid, List, Shield,
  ChartArea
} from "@/utils"
import { deleteAnalysis, getAnalysisById } from "@/api"
import { useTheme } from "@/hooks"
import { useImmer } from "use-immer"
import { AnalysisCard, ChartPreviewModal, Spinner1 } from "@/components"
import { useUserAccessStatusData } from "@/layout"
import { useLoaderData } from "react-router-dom"

function AnalysisHistory() {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"
  const { isDarkMode } = useTheme()

  // Get user permissions and usage limits from dashboard context
  const { userPermissions, handleAnalysisDeleteSuccess } = useUserAccessStatusData()

  // Get analysis data from the component's own loader
  const response = useLoaderData()

  // State for all analyses
  const [analyses, setAnalyses] = useImmer([])
  const [filteredAnalyses, setFilteredAnalyses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, name
  const [viewMode, setViewMode] = useState("grid") // grid, list

  // State for chart preview
  const [isAnalysisDataLoading, setIsAnalysisDataLoading] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useImmer(null)
  const [chartData, setChartData] = useState(null)
  const [showChartModal, setShowChartModal] = useState(false)
  const [isAnalysisDeleting, setIsAnalysisDeleting] = useState(false)

  // Derived states
  const hasError = !response.success
  const hasAnalyses = analyses.length > 0
  const hasFilteredAnalyses = filteredAnalyses.length > 0

  // Initialize analyses state from response data
  useEffect(() => {
    if (response.success && response.data && response.data.analyses) {
      setAnalyses(response.data.analyses)
    }
  }, [response, setAnalyses])

  // Handle errors from response
  useEffect(() => {
    if (!response.success && response.genericErrors) {
      showGenericErrorAsToast(response.genericErrors)
    }
  }, [response])

  // Filter and sort analyses
  useEffect(() => {
    let filtered = [...analyses]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (analysis) =>
          analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          analysis.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          analysis.sheetName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    setFilteredAnalyses(filtered)
  }, [analyses, searchTerm, sortBy])

  // Close the chart preview modal
  const handleCloseModal = useCallback(() => {
    setShowChartModal(false)
    setSelectedAnalysis(null)
    setChartData(null)
  }, [setSelectedAnalysis])

  // Function to handle when user clicks on a card
  const handleAnalysisClick = useCallback(
    async (analysis) => {      
      setIsAnalysisDataLoading(true)
      setSelectedAnalysis(analysis)
      setShowChartModal(true)

      try {
        const { dataSetId, sheetIndex, _id: analysisId } = analysis;
        const { success, data, genericErrors } = await getAnalysisById(dataSetId, sheetIndex, analysisId)
        if (success) {
          // Prepare chart visualization data
          const chartVisualization = prepareChartData(analysis, data.rows, isDarkMode)

          // Combine chart data with table data and AI insights
          const completeChartData = {
            ...chartVisualization,
            // Table data
            rows: data.rows,
            headers: analysis.dataSample?.headers || [],
            totalRows: data.rows?.length || 0,
            // AI insights data
            hasAiInsights: data.hasAiInsights || false,
            aiInsights: data.aiInsights || null,
          }

          setChartData(completeChartData)
          return
        }
        showGenericErrorAsToast(genericErrors)
      } catch (error) {
        console.error("Error loading analysis:", error)
        showGenericErrorAsToast(["Failed to load analysis data. Please try again."])
        setShowChartModal(false)
      } finally {
        setIsAnalysisDataLoading(false)
      }
    },
    [isDarkMode, setSelectedAnalysis],
  )

  // Function to delete analysis
  const handleRemoveAnalysis = useCallback(
    async (e, analysisId) => {
      e.stopPropagation()

      // Check permissions before attempting delete
      if (!userPermissions.canDelete) {
        showGenericErrorAsToast(["You don't have permission to delete analyses. Please contact your administrator."])
        return
      }

      setIsAnalysisDeleting(true)
      try {
        const { success, genericErrors } = await deleteAnalysis(analysisId)
        if (success) {
          setAnalyses((draft) => draft.filter((analysis) => analysis._id !== analysisId))
          // Update usage limits after successful delete
          handleAnalysisDeleteSuccess()
          return
        }
        showGenericErrorAsToast(genericErrors)
      } catch (error) {
        console.error("Error deleting analysis:", error)
        showGenericErrorAsToast(["Failed to delete analysis. Please try again."])
      } finally {
        setIsAnalysisDeleting(false)
      }
    },
    [setAnalyses, userPermissions.canDelete, handleAnalysisDeleteSuccess],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner1 className="w-8 h-8 border-3 border-loading-spinner-color" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">Analysis History</h2>

        {/* Results count - only show when there are analyses */}
        {hasAnalyses && (
          <div className="text-sm text-muted-foreground">
            {hasFilteredAnalyses ? (
              <>
                {filteredAnalyses.length} of {analyses.length} analyses
                {searchTerm && ` matching "${searchTerm}"`}
              </>
            ) : searchTerm ? (
              `No analyses matching "${searchTerm}"`
            ) : (
              `${analyses.length} total analyses`
            )}
          </div>
        )}
      </div>

      {/* User Permission Status */}
      <div className="mb-4 bg-card rounded-md p-3 border">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Account Status</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${userPermissions.permissions === "Read Only"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              }`}
          >
            {userPermissions.permissions}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Role: {userPermissions.role} • Delete: {userPermissions.canDelete ? "Allowed" : "Restricted"}
        </div>
      </div>

      {/* Search and Filter Controls */}
      {hasAnalyses && (
        <div className="bg-card rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none bg-background text-sm"
              />
            </div>

            {/* Sort and View Controls */}
            <div className="flex gap-2 sm:gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none bg-background text-sm min-w-[120px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggle - Hidden on mobile */}
              <div className="hidden sm:flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                    }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                    }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading analysis history...</p>
          </div>
        </div>
      ) : hasError ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Failed to load analysis history</p>
          <p className="text-sm mt-1">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      ) : !hasAnalyses ? (
        <div className="bg-card p-6 sm:p-8 rounded-md flex flex-col items-center">
          <div className="text-4xl sm:text-6xl mb-4 text-muted-foreground"><ChartArea size={38} /></div>
          <p className="text-base sm:text-lg text-muted-foreground mb-2">No analysis history found</p>
          <p className="text-sm text-muted-foreground">Upload and analyze data to see your history here.</p>
        </div>
      ) : !hasFilteredAnalyses ? (
        <div className="bg-card p-6 sm:p-8 rounded-md text-center">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <p className="text-base sm:text-lg text-muted-foreground mb-2">No analyses match your search</p>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your search terms or filters.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          <div
            className={`grid gap-3 sm:gap-4 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 max-w-4xl mx-auto"
              }`}
          >
            {filteredAnalyses.map((analysis) => (
              <AnalysisCard
                key={analysis._id}
                analysis={analysis}
                onClick={handleAnalysisClick}
                onRemove={handleRemoveAnalysis}
                compact={viewMode === "list"}
                canDelete={userPermissions.canDelete}
              />
            ))}
          </div>

          {/* Load More Button - for future pagination */}
          {filteredAnalyses.length >= 20 && (
            <div className="text-center mt-6 sm:mt-8">
              <button className="px-6 py-2 border border-muted-foreground rounded-md hover:bg-muted transition text-sm">
                Load More Analyses
              </button>
            </div>
          )}
        </>
      )}

      {/* Chart Preview Modal */}
      <ChartPreviewModal
        isOpen={showChartModal}
        analysis={selectedAnalysis}
        chartData={chartData}
        isLoading={isAnalysisDataLoading}
        onClose={handleCloseModal}
      />

      {/* Loading overlay for delete operation */}
      {isAnalysisDeleting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-3 max-w-sm w-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Deleting analysis...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisHistory
