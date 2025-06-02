/**
 * @module VerifyResetToken
 * @description Verifies the validity of a password reset token with the server.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Verifies if a given password reset token is valid by sending it to the backend.
 * 
 * @async
 * @param {string} token - The password reset token to verify.
 * @returns {Promise<ApiResponse>} The response object
 */
const verifyResetToken = async (token) => {
    try {
        const res = await apiClient.get(`${API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN}?token=${token}`);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/verifyResetToken: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['token']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default verifyResetToken;