import { useState } from "react"
import { uploadExcel } from "@/api"
import { ChartBuilder, DataTable } from "@/components"
import { handleExcelFile, showGenericErrorAsToast } from "@/utils"
import { useImmer } from "use-immer"
import { useTheme } from "@/hooks"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"

function FileUpload() {
  const { isDarkMode } = useTheme()
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

  const handleFileUpload = async (e) => {
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
          return
        }

        if (fieldErrors && fieldErrors.excelFile) {
          setError(fieldErrors.excelFile)
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

      <div className="p-4 sm:p-6 w-full bg-fileupload-bg rounded-md shadow-md flex flex-col gap-4 sm:gap-6">
        {/* File Upload Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <label htmlFor="file-upload" className="block text-lg sm:text-xl font-semibold text-foreground">
              Upload Excel File
            </label>
          </div>

          {/* Custom File Upload Button */}
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".xlsx, .xls"
              disabled={isLoading}
            />
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors
                ${isLoading ? "border-muted bg-muted/50 cursor-not-allowed" : "border-primary/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"}
              `}
            >
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
              <p className="text-sm sm:text-base font-medium text-foreground mb-1 sm:mb-2">
                {isLoading ? "Processing file..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Supports .xlsx and .xls files (Max 10MB)</p>
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
