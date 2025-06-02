/**
 * @module GetUserAccessStatus
 * @description Fetches the current user's settings, including permissions, upload limits, and analysis limits.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches the current user's limits and permissions from the server.
 *
 * @async
 * @function getUserAccessStatus
 * @returns {Promise<ApiResponse>} The response object containing user settings.
 */
const getUserAccessStatus = async () => {
    try {
        const res = await apiClient.get(API_ENDPOINTS.GET_USER_ACCESS_STATUS);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/user/getUserAccessStatus: ', error);
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}

export default getUserAccessStatus;
