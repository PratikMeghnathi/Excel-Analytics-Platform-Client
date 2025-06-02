/**
 * @module GetAllAnalyses
 * @description Fetches all saved analyses for the current user.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches all saved analyses
 * associated with the currently logged-in user.
 * 
 * @async
 * @function getAllAnalyses
 * @param {number} [limit] - Optional max number of analyses to fetch.
 * @returns {Promise<ApiResponse>} The response object
 */
const getAllAnalyses = async (limit) => {
    try {
        const url = limit && Number.isInteger(limit) && limit > 0
            ? `${API_ENDPOINTS.GET_ALL_ANALYSES}?limit=${limit}`
            : API_ENDPOINTS.GET_ALL_ANALYSES;

        const res = await apiClient.get(url);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/getAllAnalyses: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAllAnalyses;