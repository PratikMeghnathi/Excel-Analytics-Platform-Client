/**
 * @module Routes
 * @description Application route configuration
 */

import { createBrowserRouter, Navigate } from "react-router-dom";

import { PATHS } from "@/utils";
import { DashboardLayout, LandingLayout } from "@/layout";
import { About, AdminPage, AnalysisHistory, Contact, Dashboard, Features, FileUpload, Forbidden, NotFound, PrivacyPolicy, ResetPassword, Signin, Signup, TermsOfServices, VeriifyEmail, Welcome } from "@/pages";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import { adminDashboardAnalyticsLoader, analysisHistoryLoader, dashboardLayoutLoader, dashboardLoader, fileuploadLoader } from "./loaders";

/**
 * Main application router configuration
 * @constant {Array<Object>}
 */
const Router = createBrowserRouter(
    [
        {
            path: '/',
            element: <LandingLayout />,
            children: [
                { index: true, element: <Navigate to={PATHS.WELCOME} replace /> },
                { path: PATHS.WELCOME, element: <Welcome /> },
                {
                    path: PATHS.SIGNIN,
                    element: <PublicRoute restricted><Signin /></PublicRoute>
                }, {
                    path: PATHS.SIGNUP,
                    element: <PublicRoute restricted><Signup /></PublicRoute>
                },
                {
                    path: PATHS.VERIFY_EMAIL,
                    element: <VeriifyEmail />
                },
                {
                    path: PATHS.RESET_PASSWORD,
                    element: <ResetPassword />
                },
                { path: PATHS.ABOUT, element: <About /> },
                { path: PATHS.CONTACT, element: <Contact /> },
                { path: PATHS.FEATURES, element: <Features /> },
                { path: PATHS.TERMS_OF_SERVICES, element: <TermsOfServices /> },
                { path: PATHS.PRIVACY_POLICY, element: <PrivacyPolicy /> },
            ]
        }, {
            path: PATHS.DASHBOARD,
            element: <ProtectedRoute ><DashboardLayout /></ProtectedRoute>,
            loader: dashboardLayoutLoader,
            children: [
                { index: true, element: <Dashboard />, loader: dashboardLoader },
                { path: PATHS.FILE_UPLOAD, element: <FileUpload />, loader: fileuploadLoader, },
                { path: PATHS.ANALYSIS_HISTORY, element: <AnalysisHistory />, loader: analysisHistoryLoader },
                {
                    path: PATHS.ADMIN_PANEL,
                    element: <ProtectedRoute requiredRoles={['admin']}><AdminPage /></ProtectedRoute>,
                    loader: adminDashboardAnalyticsLoader
                },
            ]
        },
        { path: PATHS.FORBIDDEN, element: <Forbidden /> },
        { path: PATHS.NOT_FOUND, element: <NotFound /> }
    ]
);

export default Router;