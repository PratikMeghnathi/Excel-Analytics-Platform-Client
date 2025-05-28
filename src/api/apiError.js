/**
 * @module ApiErrorHandling
 * @description Utility module for handling API errors in a standardized way.
 * Provides classes and functions to create, format, and process API errors consistently.
 */

import { API_ERROR_CODES, API_ERROR_MESSAGES } from "@/utils";

/**
 * Custom error class for API-related errors
 * @class ApiError
 * @extends Error
 */
export class ApiError extends Error {
    /**
   * Creates an instance of ApiError.
   * @param {Object} params - The error parameters
   * @param {string} params.message - The error message
   * @param {number} params.status - The HTTP status code
   * @param {string} [params.statusText=null] - The HTTP status text
   * @param {string|number} params.errorCode - Custom error code
   * @param {Object|null} [params.serverErrors=null] - Server-provided errors by field
   */
    constructor({ message, status, statusText = null, errorCode, serverErrors = null }) {
        super(message)
        this.errorCode = errorCode;
        this.status = status;
        this.serverErrors = serverErrors;
        this.statusText = statusText;
        this.name = 'ApiError';
    }
}

/**
 * Maps HTTP status codes to predefined error messages
 * @function getErrorMessageByStatus
 * @param {number} status - The HTTP status code
 * @returns {string} The corresponding error message
 */
export const getErrorMessageByStatus = (status) => {
    switch (status) {
        case 400: return API_ERROR_MESSAGES.BAD_REQUEST_400;
        case 401: return API_ERROR_MESSAGES.UNAUTHORIZED_401;
        case 403: return API_ERROR_MESSAGES.FORBIDDEN_403;
        case 404: return API_ERROR_MESSAGES.NOT_FOUND_404;
        case 409: return API_ERROR_MESSAGES.CONFLICT_409;
        case 429: return API_ERROR_MESSAGES.TOO_MANY_REQUESTS_429;
        case 500: return API_ERROR_MESSAGES.SERVER_ERROR_500;
        case 502: return API_ERROR_MESSAGES.BAD_GATEWAY_502;
        case 503: return API_ERROR_MESSAGES.SERVICE_UNAVAILABLE_503;
        case 504: return API_ERROR_MESSAGES.GATEWAY_TIMEOUT_504;
        default:
            if (status >= 400 && status < 500) return API_ERROR_MESSAGES.CLIENT_ERROR;
            if (status >= 500) return API_ERROR_MESSAGES.SERVER_ERROR_500;
            return API_ERROR_MESSAGES.UNKNOWN;
    }
};

/**
 * Converts an Axios error response into a standardized ApiError instance
 * @function createApiError
 * @param {Object} error - The Axios error object
 * @returns {ApiError} Standardized API error object
 */
export const createApiError = (error) => {
    if (!error.response) {
        return new ApiError({ code: API_ERROR_CODES.NETWORK_ERROR, message: API_ERROR_MESSAGES.NETWORK, status: 0 });
    }
    const { status, statusText, data } = error.response;

    const code = data?.code || API_ERROR_CODES.UNKNOWN_ERROR;
    const errorEntries = Object.entries(data?.errors || {});
    const message = getErrorMessageByStatus(status);

    let serverErrors = null;
    for (const [key, value] of errorEntries) {
        if (!serverErrors) {
            serverErrors = {};
        }
        serverErrors[key] = value.message;
    }
    return new ApiError({ message, status, statusText, errorCode: code, serverErrors });
}

/**
 * Processes an ApiError and separates field-specific errors from generic errors.
 * This utility function can be used with any API request to properly categorize errors.
 * @function handleApiError
 * @param {ApiError} error - The error to handle
 * @param {string[]} [fieldsToHandle=[]] - List of field names to extract as field errors
 * @returns {Object} Object containing separated fieldsErrors and genericErrors
 * @returns {Object|null} returns.fieldErrors - Field-specific errors (for form validation)
 * @returns {Object|null} returns.genericErrors - Generic errors (for toast notifications, etc.)
 */
export const handleApiError = (error, fieldsToHandle = []) => {
    if (!(error instanceof ApiError)) {
        return { fieldErrors: null, genericErrors: { client: API_ERROR_MESSAGES.UNKNOWN } }
    }
    if (!error.serverErrors) {
        return { fieldErrors: null, genericErrors: { [!error.status ? 'client' : 'server']: error.message } }
    }

    let fieldErrors = null;
    let genericErrors = null;
    for (const [key, value] of Object.entries(error.serverErrors)) {
        if (Array.isArray(fieldsToHandle) && fieldsToHandle.length > 0 && fieldsToHandle.includes(key)) {
            if (!fieldErrors) {
                fieldErrors = {};
            }
            fieldErrors[key] = value;
        }
        else {
            if (!genericErrors) {
                genericErrors = {};
            }
            genericErrors[key] = value;
        }
    }
    return { fieldErrors, genericErrors };
}

// const error = createApiError({
//     response: {
//         data: {
//             code: 123,
//             errors: {
//                 email: {
//                     message: 'email errors.',
//                 },
//                 password: {
//                     message: 'password error.',
//                 },
//                 serverError: {
//                     message: 'internal server error.'
//                 }
//             }
//         } && null,
//         status: 500
//     }
// });
// console.log(handleApiError(error, ['email', 'password']))