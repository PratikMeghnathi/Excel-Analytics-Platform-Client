/**
 * @module UpdateUser
 * @description Updates user settings such as permissions, upload limits, and analysis limits.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Updates user settings such as permissions, upload limits, and analysis limits.
 *
 * @async
 * @function updateUser
 * @param {Object} data - User data to update.
 * @param {string} data.permissions - Permission level assigned to the user (e.g., "Read Only", "Full access").
 * @param {string|number} data.uploadLimit - Maximum number of uploads allowed for the user.
 * @param {string|number} data.analysisLimit - Maximum number of analyses the user can perform.
 * @returns {Promise<ApiResponse>} The response object
 */
const updateUser = async (data) => {
    console.log(data);
    try {
        const res = await apiClient.patch(API_ENDPOINTS.UPDATE_USER, data);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/user/updateUser: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default updateUser;