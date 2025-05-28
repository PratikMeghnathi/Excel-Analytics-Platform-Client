/**
 * @module Signin
 * @description Authenticate user detail on server
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Requests for user authentication
 * @async
 * @function signin
 * @param {Object} userData - user data 
 * @param {string} userData.email - email address of user
 * @param {string} userData.password - password of user
 * @returns {Promise<ApiResponse>} The response object
 */
const signin = async (userData) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.AUTH.SIGNIN, userData);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/auth/signin: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['credentials']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default signin;