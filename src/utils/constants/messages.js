/**
 * @module Messages
 * @description Application messages about success and errors
 */

/**
 * Validation error messages for form fields and user input
 * @constant {Object}
 * @property {string} REQUIRED_FIELD - Default message for required fields
 * @property {Object} EMAIL - Email-specific validation messages
 * @property {string} EMAIL.INVALID - Invalid email format message
 * @property {string} EMAIL.ALREADY_EXISTS - Duplicate email registration message
 * @property {string} CONFIRM_PASSWORD - Password mismatch message
 * @property {string} USER_NAME - Username requirements message
 */
export const VALIDATION_ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required.',
    EMAIL: {
        INVALID: 'Please enter a valid email address',
        ALREADY_EXISTS: 'This email is already registered'
    },
    CONFIRM_PASSWORD: 'Passwords does not match',
    USERNAME: 'Username must be 4-16 characters long and can only contain letters, numbers, @, and _'
}


/**
 * API error messages mapped to different error scenarios
 * @constant {Object}
 * @property {string} NETWORK - Network connectivity problems
 * @property {string} TIMEOUT - Request timeout message
 * @property {string} CANCELLED - Aborted request message
 * 
 * @property {string} BAD_REQUEST_400 - Invalid request data
 * @property {string} UNAUTHORIZED_401 - Authentication required
 * @property {string} FORBIDDEN_403 - Permission denied
 * @property {string} NOT_FOUND_404 - Resource not found
 * @property {string} CONFLICT_409 - Resource state conflict
 * @property {string} TOO_MANY_REQUESTS_429 - Rate limiting
 * 
 * @property {string} SERVER_ERROR_500 - Generic server error
 * @property {string} BAD_GATEWAY_502 - Upstream server issues
 * @property {string} SERVICE_UNAVAILABLE_503 - Maintenance/downtime
 * @property {string} GATEWAY_TIMEOUT_504 - Upstream timeout
 * 
 * @property {string} CLIENT_ERROR - Generic client-side issue
 * @property {string} UNKNOWN - Catch-all error message
 */
export const API_ERROR_MESSAGES = {
    // Client-side errors
    NETWORK: 'Network error. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    CANCELLED: 'Request was cancelled.',

    // Server-side errors (specific status codes)
    BAD_REQUEST_400: 'Invalid request. Please check your data and try again.',
    UNAUTHORIZED_401: 'Authentication required. Please log in and try again.',
    FORBIDDEN_403: 'You don\'t have permission to access this resource.',
    NOT_FOUND_404: 'Resource not found.',
    CONFLICT_409: 'Request conflict with current state of the resource.',
    TOO_MANY_REQUESTS_429: 'Too many requests. Please try again later.',

    // Server errors
    SERVER_ERROR_500: 'Server error occurred. Please try again later.',
    BAD_GATEWAY_502: 'Bad gateway. Please try again later.',
    SERVICE_UNAVAILABLE_503: 'Service temporarily unavailable. Please try again later.',
    GATEWAY_TIMEOUT_504: 'Gateway timeout. Please try again later.',

    // Generic fallbacks
    CLIENT_ERROR: 'Client error occurred. Please check your request.',
    UNKNOWN: 'An unexpected error occurred. Please try again.'
};


/**
 * API success messages for application
 * @constant {Object}
 * @property {string} SIGNUP - Signup Successful
 * 
 */
export const API_SUCCESS_MESSAGES = {
    SIGNUP: "Signup Successful! Your account is created. Sign in to get started."
}