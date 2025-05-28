/**
 * @module GetAnalysisById
 * @description Fetches a specific sheet's analysis data for a given dataset ID and sheet index.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches a specific sheet's analysis data based on the dataset ID and sheet index.
 * 
 * @async
 * @function getAnalysisById
 * @param {string} dataSetId - The unique identifier of the dataset.
 * @param {number} sheetIndex - The index of the sheet to retrieve within the dataset.
 * @returns {Promise<ApiResponse>} The response object
 */
const getAnalysisById = async (dataSetId, sheetIndex = 0) => {
    try {
        const res = await apiClient.get(`${API_ENDPOINTS.GET_ANALYSIS_BY_ID}/${dataSetId}/${sheetIndex}`);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/getAnalysisById: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAnalysisById;