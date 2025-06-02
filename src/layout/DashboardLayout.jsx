import { SidebarProvider, SidebarTrigger } from "@/components";
import { DashboardSidebar } from "@/pages";
import { Outlet, useLoaderData } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { showGenericErrorAsToast } from "@/utils";

const UserAccessStatusDataContext = createContext()

export const useUserAccessStatusData = () => {
    const context = useContext(UserAccessStatusDataContext)
    if (!context) {
        throw new Error("useUserAccessStatusData must be used within DashboardLayout.")
    }
    return context
}

export function DashboardLayout() {
    const response = useLoaderData()

    // State for user permissions
    const [userPermissions, setUserPermissions] = useState({
        canUpload: true,
        canSave: true,
        canDelete: true,
        role: "user",
        permissions: "Full Access",
    })

    // State for dynamic usage tracking
    const [usageLimits, setUsageLimits] = useImmer({
        uploads: {
            current: 0,
            limit: 0,
            unlimited: false,
        },
        analyses: {
            current: 0,
            limit: 0,
            unlimited: false,
        },
    })

    // Initialize user permissions and usage limits from loader response
    useEffect(() => {
        if (response?.data?.accessStatus) {
            const { permissions, uploads, analyses } = response.data.accessStatus

            // Handle user permissions
            if (permissions) {
                setUserPermissions({
                    canUpload: permissions.canUpload || false,
                    canSave: permissions.canAnalyze || false,
                    canDelete: permissions.canAnalyze || false,
                    role: permissions.fullAccess ? "admin" : "user",
                    permissions: permissions.level || (permissions.readOnly ? "Read Only" : "Full Access"),
                })
            }

            // Handle usage limits with new structure
            setUsageLimits((draft) => {
                if (uploads) {
                    draft.uploads = {
                        current: uploads.current || 0,
                        limit: uploads.limit === "unrestricted" ? 0 : uploads.limit || 0,
                        unlimited: uploads.unlimited || uploads.limit === "unrestricted",
                    }
                }
                if (analyses) {
                    draft.analyses = {
                        current: analyses.current || 0,
                        limit: analyses.limit === "unrestricted" ? 0 : analyses.limit || 0,
                        unlimited: analyses.unlimited || analyses.limit === "unrestricted",
                    }
                }
            })
        }
    }, [response?.data?.accessStatus, setUsageLimits])

    // Show errors as toast notifications
    useEffect(() => {
        if (response && !response.success && response.genericErrors) {
            showGenericErrorAsToast(response.genericErrors)
        }
    }, [response])

    // Function to update upload count after successful upload
    const handleUploadSuccess = () => {
        setUsageLimits((draft) => {
            if (!draft.uploads.unlimited) {
                draft.uploads.current += 1
                if (draft.uploads.remaining !== undefined) {
                    draft.uploads.remaining = Math.max(0, draft.uploads.remaining - 1)
                }
                if (typeof draft.uploads.limit === "number") {
                    draft.uploads.limitReached = draft.uploads.current >= draft.uploads.limit
                }
            }
        })
    }

    // Function to update analysis count after successful save
    const handleAnalysisSaveSuccess = () => {
        setUsageLimits((draft) => {
            if (!draft.analyses.unlimited) {
                draft.analyses.current += 1
                if (draft.analyses.remaining !== undefined) {
                    draft.analyses.remaining = Math.max(0, draft.analyses.remaining - 1)
                }
                if (typeof draft.analyses.limit === "number") {
                    draft.analyses.limitReached = draft.analyses.current >= draft.analyses.limit
                }
            }
        })
    }

    // Function to update analysis count after successful delete
    const handleAnalysisDeleteSuccess = () => {
        setUsageLimits((draft) => {
            if (!draft.analyses.unlimited) {
                draft.analyses.current = Math.max(0, draft.analyses.current - 1)
                if (draft.analyses.remaining !== undefined) {
                    draft.analyses.remaining += 1
                }
                if (typeof draft.analyses.limit === "number") {
                    draft.analyses.limitReached = draft.analyses.current >= draft.analyses.limit
                }
            }
        })
    }

    // Context value
    const userAccessStatusData = {
        userPermissions,
        usageLimits,
        handleUploadSuccess,
        handleAnalysisSaveSuccess,
        handleAnalysisDeleteSuccess,
        response,
    }

    return (
        <UserAccessStatusDataContext.Provider value={userAccessStatusData}>
            <SidebarProvider defaultOpen={true}>
                <div className="flex w-full h-screen overflow-hidden bg-background text-foreground">
                    <DashboardSidebar className="hidden md:block" />

                    {/* Main Content Area */}
                    <div className="grow p-4 space-y-4 overflow-y-auto bg-background">
                        {/* Mobile Sidebar Trigger */}
                        <div className="md:hidden mb-4">
                            <SidebarTrigger className="py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer text-center" />
                        </div>

                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </UserAccessStatusDataContext.Provider>
    );
}