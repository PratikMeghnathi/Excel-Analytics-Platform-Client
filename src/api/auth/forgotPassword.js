/**
 * @module ForgotPassword
 * @description Initiates the forgot password process by sending the user's email to the server.
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
 * @param {{ email: string }} data - An object containing the user's email address.
 * @returns {Promise<ApiResponse>} The response object
 */
const forgotPassword = async (data) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/forgotPassword: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['email']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default forgotPassword;
