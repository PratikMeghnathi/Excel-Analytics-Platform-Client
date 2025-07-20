export const TOAST_OPTIONS = {
    duration: 4000,
    position: "bottom-center",
    style: {
        backgroundColor: "var(--toast-bg)",
        color: "var(--toast-text)",
        border: "1px solid var(--toast-border)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "1.5",
        maxWidth: "420px",
        minWidth: "320px",
    },
}

// Enhanced options for different toast types
export const SUCCESS_TOAST_OPTIONS = {
    ...TOAST_OPTIONS,
    style: {
        ...TOAST_OPTIONS.style,
        borderColor: "var(--toast-success-border)",
    },
}

export const ERROR_TOAST_OPTIONS = {
    ...TOAST_OPTIONS,
    style: {
        ...TOAST_OPTIONS.style,
        borderColor: "var(--toast-error-border)",
    },
}

export const INFO_TOAST_OPTIONS = {
    ...TOAST_OPTIONS,
    style: {
        ...TOAST_OPTIONS.style,
        borderColor: "var(--toast-info-border)",
    },
}