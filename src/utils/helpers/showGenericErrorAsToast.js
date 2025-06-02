import toast from "react-hot-toast";
import { ERROR_TOAST_OPTIONS } from "../ui";

/**
 * Displays toast notifications for generic (non-field-specific) error messages.
 * Prevents showing duplicate messages by using an internal Set.
 *
 * @function showGenericErrorAsToast
 * @param {Object} [genericErrors={}] - An object where each value is a generic error message string
 * @returns {void}
 */
export const showGenericErrorAsToast = (genericErrors = {}) => {
    if (!genericErrors || typeof genericErrors !== 'object') return;

    const shownErrors = new Set();
    Object.values(genericErrors).forEach((message) => {
        if (typeof message === 'string' && !shownErrors.has(message)) {
            console.log('Generic error (Toast):', message);
            toast.error(message, ERROR_TOAST_OPTIONS);
            shownErrors.add(message);
        }
    });
};