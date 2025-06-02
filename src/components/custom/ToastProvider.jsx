import { Toaster } from "react-hot-toast"

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={12}
            containerStyle={{
                bottom: 24,
            }}
            toastOptions={{
                duration: 4000,
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
                success: {
                    style: {
                        borderColor: "var(--toast-success-border)",
                    },
                },
                error: {
                    style: {
                        borderColor: "var(--toast-error-border)",
                    },
                },
            }}
        />
    )
}
