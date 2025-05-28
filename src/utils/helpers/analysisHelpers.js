import { getCssVarAsHex } from "@/utils";

export const is3DChart = (chartType) => {
    return chartType.includes('3d') || chartType === 'surface' || chartType === 'mesh3d';
};

export const getColorForScheme = (scheme, isDarkMode) => {
    const colors = {
        viridis: '#440154',
        plasma: '#9c179e',
        warm: '#d13b40',
        cool: '#3b518a',
        default: isDarkMode ? '#63B3ED' : '#3182CE'
    };
    return colors[scheme] || colors.default;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

export const prepareChartData = (analysis, rowData, isDarkMode) => {
    const { chartConfig, dataSample } = analysis;
    const { chartType, xAxis, yAxis, zAxis, additionalOptions = {} } = chartConfig;

    const color = getColorForScheme(additionalOptions?.colorScheme || 'default', isDarkMode);
    const markerSize = additionalOptions?.markerSize || 8;

    // Process the data rows into usable format
    const processedData = rowData.map(row => {
        const processedRow = {};
        dataSample.headers.forEach((header, index) => {
            const rawValue = row[index];

            if (rawValue === undefined || rawValue === null) {
                processedRow[header] = null;
                return;
            }

            if (!isNaN(parseFloat(rawValue)) && typeof rawValue !== 'boolean') {
                processedRow[header] = parseFloat(rawValue);
            }
            else if (rawValue instanceof Date || (typeof rawValue === 'string' && !isNaN(new Date(rawValue).getTime()))) {
                processedRow[header] = new Date(rawValue);
            }
            else {
                processedRow[header] = rawValue;
            }
        });
        return processedRow;
    });

    // Prepare trace for 3D charts
    const prepare3DData = (chartType, processedData, xAxis, yAxis, zAxis, chartOptions) => {
        const markerSize = chartOptions.markerSize || 5;
        const color = getColorForScheme(chartOptions.colorScheme, isDarkMode);

        // Base configuration for 3D traces
        const baseTrace = {
            x: processedData.map(row => row[xAxis]),
            y: processedData.map(row => row[yAxis]),
            z: zAxis ? processedData.map(row => row[zAxis]) : Array(processedData.length).fill(0),
            mode: 'markers',
            marker: {
                size: markerSize,
                color,
                opacity: 0.8,
                line: {
                    width: 0.5,
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                }
            }
        };

        // Add specific configurations based on chart type
        switch (chartType) {
            case 'scatter3d':
                return {
                    ...baseTrace,
                    type: 'scatter3d',
                };

            case 'surface':
                const xValues = [...new Set(processedData.map(row => row[xAxis]))].sort((a, b) => a - b);
                const yValues = [...new Set(processedData.map(row => row[yAxis]))].sort((a, b) => a - b);
                const zMatrix = Array(yValues.length).fill().map(() => Array(xValues.length).fill(null));

                processedData.forEach(row => {
                    if (row[xAxis] !== null && row[yAxis] !== null && row[zAxis] !== null) {
                        const xIdx = xValues.indexOf(row[xAxis]);
                        const yIdx = yValues.indexOf(row[yAxis]);
                        if (xIdx >= 0 && yIdx >= 0) {
                            zMatrix[yIdx][xIdx] = row[zAxis];
                        }
                    }
                });

                // Fill gaps with zeros
                for (let i = 0; i < zMatrix.length; i++) {
                    for (let j = 0; j < zMatrix[i].length; j++) {
                        if (zMatrix[i][j] === null) {
                            zMatrix[i][j] = 0;
                        }
                    }
                }

                return {
                    type: 'surface',
                    x: xValues,
                    y: yValues,
                    z: zMatrix,
                    colorscale: chartOptions.colorScheme || 'Viridis',
                    showscale: true,
                    contours: {
                        z: {
                            show: true,
                            usecolormap: true,
                            highlightcolor: '#ffffff',
                            project: { z: true }
                        }
                    }
                };

            case 'mesh3d':
                return {
                    ...baseTrace,
                    type: 'mesh3d',
                    intensity: processedData.map(row => row[zAxis]),
                    colorscale: chartOptions.colorScheme || 'Viridis',
                    opacity: 0.8,
                    delaunayaxis: 'z'
                };

            case 'line3d':
                return {
                    ...baseTrace,
                    type: 'scatter3d',
                    mode: 'lines',
                    line: {
                        width: 6,
                        color: color,
                        opacity: 0.7
                    }
                };

            default:
                return baseTrace;
        }
    };

    // Create chart trace configuration
    const chartTrace = (() => {
        if (!processedData.length || !xAxis || !yAxis) {
            return {};
        }

        if (is3DChart(chartType) || chartType === 'line3d') {
            return prepare3DData(chartType, processedData, xAxis, yAxis, zAxis, additionalOptions);
        }

        let mode = 'markers';
        if (chartType === 'line') {
            mode = 'lines+markers';
        }
        else if (chartType === 'bar') {
            mode = 'none';
        }

        const baseTrace = {
            x: processedData.map(row => row[xAxis]),
            y: processedData.map(row => row[yAxis]),
            type: chartType.includes('gl') ? chartType.replace('gl', '') : chartType,
            mode,
            marker: {
                size: markerSize,
                color
            }
        };

        if (processedData.length > 1000 && chartType === 'scatter') {
            baseTrace.type = 'scattergl';
        }

        if (chartType === 'pie') {
            return {
                labels: processedData.map(row => row[xAxis]),
                values: processedData.map(row => row[yAxis]),
                type: 'pie',
                marker: { colors: [color] }
            };
        }

        return baseTrace;
    })();

    // Create chart layout configuration
    const layout = (() => {
        const baseLayout = {
            title: {
                text: `${xAxis} v/s ${yAxis}${zAxis ? ` vs ${zAxis}` : ''}`,
                font: {
                    size: 22,
                    color: getCssVarAsHex('--chart-title-color'),
                },
                pad: { t: 10 },
                xref: 'paper',
                x: 0.5
            },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: getCssVarAsHex('--chart-title-color') },
            xaxis: {
                title: {
                    text: xAxis,
                    font: {
                        size: 16,
                        color: getCssVarAsHex('--chart-title-color')
                    },
                    standoff: 20
                },
                gridcolor: getCssVarAsHex('--chart-grid-color'),
            },
            yaxis: {
                title: {
                    text: yAxis,
                    font: {
                        size: 16,
                        color: getCssVarAsHex('--chart-title-color')
                    },
                    standoff: 20
                },
                gridcolor: getCssVarAsHex('--chart-grid-color'),
            },
            margin: { l: 80, r: 80, b: 80, t: 80, pad: 4 },
            showlegend: additionalOptions.showLegend,
            autosize: true,
        };

        if (is3DChart(chartType) || chartType === 'line3d') {
            baseLayout.scene = {
                xaxis: {
                    title: {
                        text: xAxis,
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color'),
                    backgroundcolor: 'transparent',
                    showbackground: true,
                    zerolinecolor: getCssVarAsHex('--chart-title-color')
                },
                yaxis: {
                    title: {
                        text: yAxis,
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color'),
                    backgroundcolor: 'transparent',
                    showbackground: true,
                    zerolinecolor: getCssVarAsHex('--chart-title-color')
                },
                zaxis: {
                    title: {
                        text: zAxis || '',
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color'),
                    backgroundcolor: 'transparent',
                    showbackground: true,
                    zerolinecolor: getCssVarAsHex('--chart-title-color')
                },
                camera: {
                    eye: { x: 1.75, y: 1.75, z: 1.25 },
                    center: { x: 0, y: 0, z: 0 },
                    up: { x: 0, y: 0, z: 1 }
                },
                aspectmode: 'cube',
                aspectratio: { x: 1, y: 1, z: 0.85 }
            };

            if (chartType === 'surface') {
                baseLayout.scene.dragmode = 'orbit';
                baseLayout.margin = { l: 50, r: 50, b: 50, t: 90 };
            } else if (chartType === 'mesh3d') {
                baseLayout.scene.camera.eye = { x: 1.9, y: 1.9, z: 1.6 };
                baseLayout.scene.aspectratio = { x: 1, y: 1, z: 0.9 };
            } else if (chartType === 'line3d') {
                baseLayout.scene.camera.eye = { x: 1.8, y: 1.8, z: 1.4 };
            }
        }

        return baseLayout;
    })();

    return { data: [chartTrace], layout };
};
