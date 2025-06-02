/**
 * @module SaveAnalysis
 * @description Sends analysis data (including Excel metadata, chart config, and more) to the server for saving.
 */


// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Sends analysis data to the server for saving.
 * Typically used after processing an Excel file on the frontend.
 * 
 * @async
 * @function saveAnalysis
 * @param {Object} data - Analysis data to be saved.
 * @param {string} data.name - Name of the analysis.
 * @param {string} data.fileName - Original Excel file name (.xls/.xlsx).
 * @param {string} data.sheetName - Sheet name from the Excel file.
 * @param {Object} data.chartConfig - Chart configuration object.
 * @param {Object} data.dataSample - Sample data object with headers, rows, and totalRows.
 * @param {string} [data.thumbnail] - Optional base64 thumbnail image of the chart.
 * @returns {Promise<ApiResponse>} The response object
 */
const saveAnalysis = async (data) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.SAVE_ANALYSIS, data);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/saveAnalysis: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['analysisLimit']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default saveAnalysis;