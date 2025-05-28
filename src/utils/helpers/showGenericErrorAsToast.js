import toast from "react-hot-toast";
export const TOAST_OPTIONS = {
    duration: 4000,
    position: 'bottom-center',
    style: {
        backgroundColor: 'var(--toast-bg)', 
        color: 'var(--toast-text)',        
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',               
        padding: '12px 16px',              
    },
};

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
            toast.error(message, TOAST_OPTIONS);
            shownErrors.add(message);
        }
    });
};