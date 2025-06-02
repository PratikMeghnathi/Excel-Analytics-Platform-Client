/**
 * @module GetAiPromptTypes
 * @description Fetches all AI prompt types.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches all AI prompt types.
 * 
 * @async
 * @function getAiPromptTypes
 * @returns {Promise<ApiResponse>} The response object
 */
const getAiPromptTypes = async () => {
    try {
        const res = await apiClient.get(API_ENDPOINTS.GET_AI_PROMPT_TYPES);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/getAiPromptTypes: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAiPromptTypes;