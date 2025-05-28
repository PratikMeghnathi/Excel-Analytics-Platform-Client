/**
 * @module DeleteAnalysis
 * @description Deletes a specific analysis by its ID.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Deletes a specific analysis based on the provided analysis ID.
 * 
 * @async
 * @function deleteAnalysis
 * @param {string} analysisId - The unique identifier of the analysis to be deleted.
 * @returns {Promise<ApiResponse>} A promise that resolves to the API response object.
 */
const deleteAnalysis = async (analysisId) => {
    try {
        const res = await apiClient.delete(`${API_ENDPOINTS.DELETE_ANALYSIS}/${analysisId}`);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/deleteAnalysis: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default deleteAnalysis;