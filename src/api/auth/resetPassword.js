/**
 * @module ResetPassword
 * @description Resets the user's password using a token and a new password.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Sends a password reset request by posting the user's email to the backend.
 * 
 * @async
 * @function forgotPassword
 * @param {{ token: string, newPassword: string }} data - An object containing the reset token and the new password.
 * @returns {Promise<ApiResponse>} The response object
 */
const resetPassword = async (data) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/resetPassword: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['input', 'password', 'token', 'user']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default resetPassword;