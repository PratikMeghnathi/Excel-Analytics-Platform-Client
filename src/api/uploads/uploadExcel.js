/**
 * @module UploadExcel
 * @description Upload Excel file to server for processing and analysis
 */


// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Uploads an Excel file to the server.
 * @async
 * @function uploadExcel
 * @param {FormData} data - FormData object containing the Excel file.
 * @returns {Promise<ApiResponse>} The response object
 */
const uploadExcel = async (data) => {
    try {
        const res = await apiClient.post(API_ENDPOINTS.UPLOAD_EXCEL, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Error in api/upload/uploadExcel: ', error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['excelFile']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default uploadExcel;