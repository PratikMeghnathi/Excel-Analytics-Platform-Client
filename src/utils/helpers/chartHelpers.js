const findFirstColumnOfType = (columnType, type) => {
    return columnType.findIndex(col => col.type === type);
}
const findSecondColumnOfType = (columnTypes, type) => {
    let found = false;
    for (let i = 0; i < columnTypes.length; i++) {
        if (columnTypes[i].type === type) {
            if (found) {
                return i;
            }
            found = true;
        }
    }
    return findFirstColumnOfType(columnTypes, type);
}

const findThirdColumnOfType = (columnTypes, type) => {
    let count = 0;
    for (let i = 0; i < columnTypes.length; i++) {
        if (columnTypes[i].type === type) {
            count++;
            if (count === 3) {
                return i;
            }
        }
    }
    return findSecondColumnOfType(columnTypes, type);
}

export const suggestChartType = (columnTypes, headers) => {
    const types = {
        numeric: 0,
        string: 0,
        date: 0,
        boolean: 0
    }
    columnTypes.forEach(col => {
        if (types[col.type] !== undefined) {
            types[col.type]++;
        }
    });

    if (types.numeric >= 3) {   // For 3D charts, we need at least 3 numeric columns
        return {
            chartType: 'scatter3d',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')],
            yAxis: headers[findSecondColumnOfType(columnTypes, 'numeric')],
            zAxis: headers[findThirdColumnOfType(columnTypes, 'numeric')]
        }
    }
    else if (types.numeric >= 2) {  // For 2D scatter plots
        return {
            chartType: 'scatter',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')],
            yAxis: headers[findSecondColumnOfType(columnTypes, 'numeric')]
        }
    }
    else if (types.numeric === 1 && types.string >= 1) {    // For bar charts with categorical data
        return {
            chartType: 'bar',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'string')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    }
    else if (types.date >= 1 && types.numeric >= 1) {   // For line charts with time series data
        return {
            chartType: 'line',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'date')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    } else if (types.string >= 1 && types.numeric >= 1) {   // For pie charts with categorical data

        if (types.string === 1 && types.numeric === 1) {    // If the data seems more appropriate for a pie chart (few categories)

            const stringColIndex = findFirstColumnOfType(columnTypes, 'string');

            // Check if there are few unique values in the string column (good for pie charts)
            const uniqueValues = new Set();
            columnTypes.forEach(col => {
                if (col.type === 'string') {
                    uniqueValues.add(col.name);
                }
            });

            if (uniqueValues.size <= 8) {
                return {
                    chartType: 'pie',
                    xAxis: headers[findFirstColumnOfType(columnTypes, 'string')],
                    yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
                };
            }
        }

        // Default to bar chart for string + numeric
        return {
            chartType: 'bar',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'string')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    }

    // Default fallback
    return {
        chartType: 'scatter',
        xAxis: headers[0],
        yAxis: headers.length > 1 ? headers[1] : headers[0]
    };
}

export const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};