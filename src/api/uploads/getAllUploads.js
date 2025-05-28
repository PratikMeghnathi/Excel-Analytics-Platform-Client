/**
 * @module GetAllUploads
 * @description Fetches all uploaded files for the current user.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches all uploaded files associated with the currently logged-in user.
 * 
 * @async
 * @function getAllUploads
 * @returns {Promise<ApiResponse>} The response object
 */
const getAllUploads = async () => {
    try {
        const res = await apiClient.get(API_ENDPOINTS.GET_ALL_UPLOADS);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/uploads/getAllUploads: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAllUploads;