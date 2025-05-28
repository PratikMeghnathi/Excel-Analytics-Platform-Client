/**
 * @module Signout
 * @description Log out the authenticated user
 */

/// <andia path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import apiClient from "../apiClient";
import { handleApiError } from "../apiError";

const signout = async () => {
    try {
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.SIGNOUT);
        window.dispatchEvent(
            new CustomEvent('auth-event', { detail: { type: 'logout' } })
        );
        return { success: true, data };
    } catch (error) {
        console.log('Error in api/auth/signout: ', error);
        window.dispatchEvent(
            new CustomEvent('auth-event', { detail: { type: 'logout' } })
        );
        const { fieldErrors, genericErrors } = handleApiError(error);
        return { success: false, fieldErrors, genericErrors };
    }
};

export default signout;