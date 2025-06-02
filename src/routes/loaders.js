import { getAdminDashboardAnalytics, getAiPromptTypes, getAllAnalyses, getAllUploads, getUserAccessStatus } from "@/api";

export const analysisHistoryLoader = async () => {
    return await getAllAnalyses();
};

export const adminDashboardAnalyticsLoader = async () => {
    return await getAdminDashboardAnalytics();
}

export const dashboardLoader = async () => {
    try {
        const [analysesResponse, uploadsResponse] = await Promise.all([
            getAllAnalyses(6),
            getAllUploads()
        ]);

        const stats = {
            totalUploads: uploadsResponse.success ? uploadsResponse.data?.totalCount || 0 : 0,
            savedAnalyses: analysesResponse.success ? analysesResponse.data?.totalCount || 0 : 0
        };

        // Prepare error messages if any request failed
        const errors = [];
        if (!analysesResponse.success) {
            errors.push(...(analysesResponse.genericErrors || ['Failed to load recent analyses.']));
        }
        if (!uploadsResponse.success) {
            errors.push(...(uploadsResponse.genericErrors || ['Failed to load uploads']));
        }

        // Return combined data in a format ready for the Dashboard component
        return {
            success: analysesResponse.success && uploadsResponse.success,
            data: {
                stats,
                recentAnalyses: analysesResponse.success ?
                    (analysesResponse.data?.analyses || []) : [],
                uploads: uploadsResponse.success ?
                    (uploadsResponse.data?.uploads || []) : []
            },
            genericErrors: errors.length > 0 ? errors : null
        };

    } catch (error) {
        console.error("Dashboard data loading error:", error);
        return {
            success: false,
            data: {
                stats: { totalUploads: 0, savedAnalyses: 0 },
                recentAnalyses: [],
                uploads: []
            },
            genericErrors: ['Unexpected error loading dashboard data.']
        };
    }
}

export const fileuploadLoader = async () => {
    return await getAiPromptTypes();
}

export const dashboardLayoutLoader = async () => {
    return await getUserAccessStatus();
}