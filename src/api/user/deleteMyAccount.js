/**
 * @module DeleteMyAccount
 * @description Sends a request to delete the current user's account.
 * The request must include the user's password for confirmation.
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
 * @function deleteMyAccount
 * @param {Object} data - The request body containing the user's password.
 * @param {string} data.password - The user's password for confirmation.
 * @returns {Promise<ApiResponse>} The response object containing user settings.
 */
const deleteMyAccount = async (data) => {
    try {
        const res = await apiClient.delete(API_ENDPOINTS.DELETE_MY_ACCOUNT, {
            headers: {
                'X-Password-Confirmation': data.password
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/user/deleteMyAccount: ', error);
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}

export default deleteMyAccount;
