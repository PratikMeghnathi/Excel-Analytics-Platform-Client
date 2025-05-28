/**
 * @module Routes
 * @description Application route paths configuration
 */

/**
 * Main route paths used throughout the application
 * @constant {Object}
 * @property {string} WELCOME - Welcome page
 * @property {string} SIGNIN - User authentication path
 * @property {string} SIGNUP - User registration path
 * 
 * @property {string} ABOUT - User registration path
 * @property {string} FEATURES - Features page
 * @property {string} CONTACT - Contact us page
 * @property {string} PRIVACY_POLICY - Privacy policy page
 * @property {string} TERMS_OF_SERVICES - Terms and services page
 * 
 * @property {string} DASHBOARD - Main authenticated user area/dashboard
 * 
 * @property {string} NOT_FOUND - Catch-all route for 404 pages
 */
const PATHS = {
    // auth routes
    SIGNUP: "/sign-up",
    SIGNIN: "/sign-in",

    // landing page routes
    WELCOME: "/welcome",
    ABOUT: "/about",
    FEATURES: "/features",
    CONTACT: "/contact-us",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_OF_SERVICES: "/terms-of-services",

    // dashboard routes
    DASHBOARD: "/dashboard",
    FILE_UPLOAD: "file-upload",
    ANALYSIS_HISTORY: "analysis-history",

    // admin only routes
    ADMIN_PANEL: "admin-panel",

    // other routes
    FORBIDDEN: "/FORBIDDEN",
    NOT_FOUND: "*",
};

export default PATHS;