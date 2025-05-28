export const findFirstColumnOfType = (columnType, type) => {
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

    if (types.numeric >= 2) {
        return {
            chartType: 'scatter',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')],
            yAxis: headers[findSecondColumnOfType(columnTypes, 'numeric')]
        }
    }
    else if (types.numeric === 1 && types.string >= 1) {
        return {
            chartType: 'bar',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'string')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    }
    else if (types.date >= 1 && types.numeric >= 1) {
        return {
            chartType: 'line',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'date')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    } else if (types.string >= 1 && types.numeric >= 1) {
        return {
            chartType: 'bar',
            xAxis: headers[findFirstColumnOfType(columnTypes, 'string')],
            yAxis: headers[findFirstColumnOfType(columnTypes, 'numeric')]
        };
    }

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