/**
 * @module VerifyEmail
 * @description Verifies a user's email using a token by sending a request to the server.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Verifies a user's email by sending a verification token to the backend.
 * 
 * @async
 * @function verifyEmail
 * @param {string} token - The email verification token.
 * @returns {Promise<ApiResponse>} The response object
 */
const verifyEmail = async (token) => {
    try {
        const res = await apiClient.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/verifyEmail: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['email', 'token']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default verifyEmail;
