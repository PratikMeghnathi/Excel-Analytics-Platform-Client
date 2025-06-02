/**
 * @module Signup
 * @description Register user detail on server
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Requests for user registration
 * @async
 * @function signup
 * @param {Object} userData - user data 
 * @param {string} userData.email - email address of user
 * @param {string} userData.username - username of user
 * @param {string} userData.password - password of user
 * @returns {Promise<ApiResponse>} The response object
 */
const signup = async (userData) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/signup: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['input', 'email', 'password']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default signup;
