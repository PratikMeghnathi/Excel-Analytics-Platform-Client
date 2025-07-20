/**
 * @module ResendVerificationEmail
 * @description Sends a request to resend the email verification link to the user's email address.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Sends a request to the backend to resend the email verification link.
 *
 * @async
 * @function resendVerificationEmail
 * @param {{ email: string }} data - An object containing the user's email address.
 * @returns {Promise<ApiResponse>} The response object
 */
const resendVerificationEmail = async (data) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL, data);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/resendVerificationEmail: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['email']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default resendVerificationEmail;
