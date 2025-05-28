const handleExcelFile = (e) => {
    return new Promise((resolve, reject) => {
        const file = e.target.files[0];

        if (!file) {
            reject(new Error('No file selected.'));
            return;
        }

        if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
            reject(new Error('File must be an Excel file (.xls or .xlsx).'));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            // File successfully loaded
            resolve(file);
        };

        reader.onerror = () => {
            reject(new Error('Failed to load the file.'));
        };

        reader.readAsArrayBuffer(file);
    });
};

export default handleExcelFile;