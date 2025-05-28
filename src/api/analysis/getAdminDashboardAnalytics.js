/**
 * @module GetAdminDashboardAnalytics
 * @description Fetches analytics data for the admin dashboard, including total users, uploads, analyses, and peak activity.
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Fetches analytics metrics for the admin dashboard.
 *
 * @async
 * @function getAdminDashboardAnalytics
 * @returns {Promise<ApiResponse>} The response object
 */
const getAdminDashboardAnalytics = async () => {
    try {
        const res = await apiClient.get(API_ENDPOINTS.GET_ADMIN_DASHBOARD_ANALYTICS);
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/analysis/getAdminDashboardAnalytics: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default getAdminDashboardAnalytics;