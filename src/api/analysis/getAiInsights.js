/**
 * @module GetAiInsights
 * @description Fetches AI-generated insights for a specific dataset and sheet.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches AI-generated insights based on the specified dataset, sheet, and prompt type.
 * 
 * @async
 * @function getAiInsights
 * @param {string} dataSetId - The ID of the dataset to fetch insights for.
 * @param {number} [sheetIndex=0] - The index of the sheet within the dataset.
 * @param {string} [promptType='summary'] - The type of AI prompt to use (e.g., 'summary', 'trend', etc.).
 * @returns {Promise<ApiResponse>} The response object
 */
const getAiInsights = async (dataSetId, sheetIndex = 0, promptType = 'summary') => {
    try {
        const res = await apiClient.get(`${API_ENDPOINTS.GET_AI_INSIGHTS}/${dataSetId}/${sheetIndex}?promptType=${promptType}`);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/getAiInsights: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['aiService', 'aiQuota', 'dataQuality', 'permission']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAiInsights;