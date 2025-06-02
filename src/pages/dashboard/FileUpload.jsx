import { useEffect, useState } from "react"
import { uploadExcel } from "@/api"
import { ChartBuilder, DataTable } from "@/components"
import { handleExcelFile, showGenericErrorAsToast } from "@/utils"
import { useImmer } from "use-immer"
import { useTheme } from "@/hooks"
import { Upload, FileSpreadsheet, AlertCircle, Info, BarChart3, Infinity, Shield } from "lucide-react"
import { useLoaderData } from "react-router-dom"
import { useUserAccessStatusData } from "@/layout"

function FileUpload() {
  const { isDarkMode } = useTheme()

  // Get AI_PROMPTS types from loader
  const response = useLoaderData()

  useEffect(() => {
    if (!response.success && response.genericErrors) {
      showGenericErrorAsToast(response.genericErrors)
    }
  }, [response])

  // Get data from dashboard context instead of useLoaderData
  const { userPermissions, usageLimits, handleUploadSuccess, handleAnalysisSaveSuccess } = useUserAccessStatusData()

  const [data, setData] = useImmer({
    headers: [],
    columnTypes: [],
    sheetNames: [],
    data: [],
    totalRows: 0,
    allSheets: [],
    originalFileName: "",
    dataSetId: "",
  })
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Helper functions to handle both unlimited and limited cases
  const isUploadLimitReached = () => {
    if (usageLimits.uploads.unlimited) return false
    // Handle both old structure (limitReached property) and new structure (numeric comparison)
    if (usageLimits.uploads.limitReached !== undefined) return usageLimits.uploads.limitReached
    return typeof usageLimits.uploads.limit === "number" && usageLimits.uploads.current >= usageLimits.uploads.limit
  }

  const isNearUploadLimit = () => {
    if (usageLimits.uploads.unlimited) return false
    if (typeof usageLimits.uploads.limit !== "number") return false
    const remaining =
      usageLimits.uploads.remaining !== undefined
        ? usageLimits.uploads.remaining
        : usageLimits.uploads.limit - usageLimits.uploads.current
    return remaining <= usageLimits.uploads.limit * 0.2 && remaining > 0
  }

  const getUploadStatusText = () => {
    if (usageLimits.uploads.unlimited) return "Unlimited"
    if (isUploadLimitReached()) return "Limit Reached"

    // Handle both structures for remaining count
    if (usageLimits.uploads.remaining !== undefined) {
      return `${usageLimits.uploads.remaining} remaining`
    } else if (typeof usageLimits.uploads.limit === "number") {
      const remaining = usageLimits.uploads.limit - usageLimits.uploads.current
      return `${remaining} remaining`
    }
    return `${usageLimits.uploads.current} used`
  }

  const isAnalysisLimitReached = () => {
    if (usageLimits.analyses.unlimited) return false
    // Handle both old structure (limitReached property) and new structure (numeric comparison)
    if (usageLimits.analyses.limitReached !== undefined) return usageLimits.analyses.limitReached
    return typeof usageLimits.analyses.limit === "number" && usageLimits.analyses.current >= usageLimits.analyses.limit
  }

  const isNearAnalysisLimit = () => {
    if (usageLimits.analyses.unlimited) return false
    if (typeof usageLimits.analyses.limit !== "number") return false
    const remaining =
      usageLimits.analyses.remaining !== undefined
        ? usageLimits.analyses.remaining
        : usageLimits.analyses.limit - usageLimits.analyses.current
    return remaining <= usageLimits.analyses.limit * 0.2 && remaining > 0
  }

  const getAnalysisStatusText = () => {
    if (usageLimits.analyses.unlimited) return "Unlimited"
    if (usageLimits.analyses.limitReached) return "Limit Reached"

    // Handle both structures for remaining count
    if (usageLimits.analyses.remaining !== undefined) {
      return `${usageLimits.analyses.remaining} remaining`
    } else if (typeof usageLimits.analyses.limit === "number") {
      const remaining = usageLimits.analyses.limit - usageLimits.analyses.current
      return `${remaining} remaining`
    }
    return `${usageLimits.analyses.current} used`
  }

  const handleFileUpload = async (e) => {
    // Check permissions before attempting upload
    if (!userPermissions.canUpload) {
      setError("You don't have permission to upload files. Please contact your administrator.")
      return
    }

    // Check upload limit before processing
    if (isUploadLimitReached()) {
      setError("Upload limit reached. Please contact support to increase your limit.")
      return
    }

    setError("")
    setData({
      headers: [],
      columnTypes: [],
      sheetNames: [],
      data: [],
      totalRows: 0,
      allSheets: [],
      originalFileName: "",
      dataSetId: "",
    })
    try {
      const file = await handleExcelFile(e)
      if (!file) return
      setIsLoading(true)
      try {
        const formData = new FormData()
        formData.append("excelFile", file)
        const { success, data, fieldErrors, genericErrors } = await uploadExcel(formData)

        if (success && data.sheets && data.sheets.length > 0) {
          const sheetNames = data.sheets.map((sheet) => sheet.sheetName)
          setData({
            headers: data.sheets[0].headers,
            columnTypes: data.sheets[0].columnTypes,
            sheetNames: sheetNames,
            data: data.sheets[0].data || [],
            totalRows: data.sheets[0].totalRows,
            allSheets: data.sheets,
            originalFileName: data.originalFileName,
            dataSetId: data.dataSetId,
          })
          setSelectedSheetIndex(0)

          // Update upload count after successful upload
          handleUploadSuccess()
          return
        }

        // Handle field errors (including upload limit from 429 response)
        if (fieldErrors) {
          if (fieldErrors.excelFile) {
            setError(fieldErrors.excelFile)
          } else if (fieldErrors.uploadLimit) {
            setError(fieldErrors.uploadLimit)
          } else if (fieldErrors.permission) {
            setError(fieldErrors.permission)
          }
          setData({
            headers: [],
            columnTypes: [],
            sheetNames: [],
            data: [],
            totalRows: 0,
            allSheets: [],
            originalFileName: "",
            dataSetId: "",
          })
        }

        showGenericErrorAsToast(genericErrors)
      } catch (error) {
        console.log("Error uploading excel file:", error)
        // Handle network errors or other exceptions
        if (error.response?.status === 429) {
          setError("Upload limit reached. Please contact support to increase your limit.")
        } else if (error.response?.status === 403) {
          setError("You don't have permission to upload files. Please contact your administrator.")
        } else {
          setError("An error occurred while uploading the file. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    } catch (error) {
      setError(error.message || error)
      setData({
        headers: [],
        columnTypes: [],
        sheetNames: [],
        data: [],
        totalRows: 0,
        allSheets: [],
        originalFileName: "",
        dataSetId: "",
      })
    }
  }

  const handleSheetChange = (index) => {
    const sheetIndex = Number.parseInt(index)

    if (data.allSheets && data.allSheets[sheetIndex]) {
      const selectedSheet = data.allSheets[sheetIndex]
      setData((draft) => {
        draft.headers = selectedSheet.headers
        draft.columnTypes = selectedSheet.columnTypes
        draft.data = selectedSheet.data || []
        draft.totalRows = selectedSheet.totalRows
      })
      setSelectedSheetIndex(sheetIndex)
    }
  }

  const hasData = data && data.headers && data.headers.length > 0

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-3 sm:mb-4">Upload & Analyze Data</h2>

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
          Role: {userPermissions.role} • Upload: {userPermissions.canUpload ? "Allowed" : "Restricted"} • Save:{" "}
          {userPermissions.canSave ? "Allowed" : "Restricted"}
        </div>
      </div>

      {/* Permission Restriction Warning */}
      {!userPermissions.canUpload && (
        <div className="mb-4 flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm sm:text-base font-medium text-destructive">Upload Restricted</p>
            <p className="text-xs sm:text-sm text-destructive/80 mt-1">
              Your account has read-only access. Contact your administrator to request upload permissions.
            </p>
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Upload Limit Card */}
        <div className="bg-card rounded-md p-3 border">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Upload Usage</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-300 ${usageLimits.uploads.unlimited
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : isUploadLimitReached()
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : isNearUploadLimit()
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
            >
              {usageLimits.uploads.unlimited && <Infinity className="w-3 h-3" />}
              {getUploadStatusText()}
            </span>
          </div>

          {!usageLimits.uploads.unlimited &&
            typeof usageLimits.uploads.limit === "number" &&
            usageLimits.uploads.limit > 0 && (
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${isUploadLimitReached() ? "bg-destructive" : isNearUploadLimit() ? "bg-amber-500" : "bg-primary"
                    }`}
                  style={{
                    width: `${Math.min((usageLimits.uploads.current / usageLimits.uploads.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            )}

          <div className="text-xs text-muted-foreground mt-1">
            {usageLimits.uploads.unlimited
              ? `${usageLimits.uploads.current} uploads completed`
              : typeof usageLimits.uploads.limit === "number"
                ? `${usageLimits.uploads.current} of ${usageLimits.uploads.limit} used`
                : `${usageLimits.uploads.current} uploads completed`}
          </div>
        </div>

        {/* Analysis Limit Card */}
        <div className="bg-card rounded-md p-3 border">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Analysis Usage</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-300 ${usageLimits.analyses.unlimited
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : isAnalysisLimitReached()
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : isNearAnalysisLimit()
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
            >
              {usageLimits.analyses.unlimited && <Infinity className="w-3 h-3" />}
              {getAnalysisStatusText()}
            </span>
          </div>

          {!usageLimits.analyses.unlimited &&
            typeof usageLimits.analyses.limit === "number" &&
            usageLimits.analyses.limit > 0 && (
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${isAnalysisLimitReached() ? "bg-destructive" : isNearAnalysisLimit() ? "bg-amber-500" : "bg-primary"
                    }`}
                  style={{
                    width: `${Math.min((usageLimits.analyses.current / usageLimits.analyses.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            )}

          <div className="text-xs text-muted-foreground mt-1">
            {usageLimits.analyses.unlimited
              ? `${usageLimits.analyses.current} analyses saved`
              : typeof usageLimits.analyses.limit === "number"
                ? `${usageLimits.analyses.current} of ${usageLimits.analyses.limit} used`
                : `${usageLimits.analyses.current} analyses saved`}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 w-full bg-fileupload-bg rounded-md shadow-md flex flex-col gap-4 sm:gap-6">
        {/* File Upload Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <label htmlFor="file-upload" className="block text-lg sm:text-xl font-semibold text-foreground">
              Upload Excel File
            </label>
          </div>

          {/* Upload Limit Warning - only show if not unlimited */}
          {!usageLimits.uploads.unlimited && isUploadLimitReached() && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-medium text-destructive">Upload Limit Reached</p>
                <p className="text-xs sm:text-sm text-destructive/80 mt-1">
                  You have used all {usageLimits.uploads.limit} of your available uploads. Please contact support to
                  increase your limit.
                </p>
              </div>
            </div>
          )}

          {/* Near Limit Warning - only show if not unlimited */}
          {!usageLimits.uploads.unlimited && isNearUploadLimit() && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-medium text-amber-800 dark:text-amber-200">
                  Approaching Upload Limit
                </p>
                <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You have {usageLimits.uploads.remaining || usageLimits.uploads.limit - usageLimits.uploads.current}{" "}
                  uploads remaining out of {usageLimits.uploads.limit}. Consider managing your files or contact support
                  for more uploads.
                </p>
              </div>
            </div>
          )}

          {/* Custom File Upload Button */}
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".xlsx, .xls"
              disabled={
                isLoading || !userPermissions.canUpload || (!usageLimits.uploads.unlimited && isUploadLimitReached())
              }
            />
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors
                ${isLoading || !userPermissions.canUpload || (!usageLimits.uploads.unlimited && isUploadLimitReached())
                  ? "border-muted bg-muted/50 cursor-not-allowed"
                  : "border-primary/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                }
              `}
            >
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
              <p className="text-sm sm:text-base font-medium text-foreground mb-1 sm:mb-2">
                {isLoading
                  ? "Processing file..."
                  : !userPermissions.canUpload
                    ? "Upload restricted"
                    : !usageLimits.uploads.unlimited && isUploadLimitReached()
                      ? "Upload limit reached"
                      : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {!userPermissions.canUpload
                  ? "Contact your administrator for upload permissions."
                  : !usageLimits.uploads.unlimited && isUploadLimitReached()
                    ? "You have reached your upload limit. Please contact support to increase your limit."
                    : "Supports .xlsx and .xls files (Max 10MB)"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-md">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm sm:text-base text-muted-foreground">Processing your file...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-medium text-destructive">Upload Error</p>
                <p className="text-xs sm:text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {hasData && !error && (
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-green-800 dark:text-green-200">
                  File uploaded successfully!
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-300 mt-1">
                  {data.originalFileName} • {data.totalRows} rows • {data.sheetNames.length} sheet(s)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Builder Section */}
        {!error && hasData && (
          <>
            <div className="w-full h-px bg-border my-2 sm:my-4"></div>
            <div>
              <ChartBuilder
                sheetNames={data.sheetNames}
                headers={data.headers}
                columnTypes={data.columnTypes}
                initialData={data.data}
                isDarkMode={isDarkMode}
                handleSheetChange={handleSheetChange}
                selectedSheetIndex={selectedSheetIndex}
                originalFileName={data.originalFileName}
                dataSetId={data.dataSetId}
                analysisLimitReached={
                  !usageLimits.analyses.unlimited &&
                  (usageLimits.analyses.limitReached ||
                    (typeof usageLimits.analyses.limit === "number" &&
                      usageLimits.analyses.current >= usageLimits.analyses.limit))
                }
                analysisLimit={usageLimits.analyses.limit}
                analysisCurrent={usageLimits.analyses.current}
                analysisUnlimited={usageLimits.analyses.unlimited}
                onAnalysisSaveSuccess={handleAnalysisSaveSuccess}
                userPermissions={userPermissions}
                aiPromptTypes={response.success ? response.data?.promptTypes || [] : []}
              />
            </div>

            <div className="w-full h-px bg-border my-2 sm:my-4"></div>

            {/* Data Preview Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">Data Preview</h2>
              <DataTable
                headers={data.headers}
                data={data.data || []}
                totalRows={data.totalRows || 0}
                columnTypes={data.columnTypes}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
