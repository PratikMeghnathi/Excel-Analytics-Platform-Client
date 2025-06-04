import { useCallback, useMemo, useReducer } from "react"
import { ChevronRight, ChevronDown } from "@/utils"

const COLOR_SCHEMES = {
    DEFAULT: "default",
    VIRIDIS: "viridis",
    PLASMA: "plasma",
    WARM: "warm",
    COOL: "cool",
}

const optionsReducer = (state, action) => {
    switch (action.type) {
        case "SET_COLOR_SCHEME":
            return { ...state, colorScheme: action.payload }
        case "SET_MARKER_SIZE":
            return { ...state, markerSize: Number.parseInt(action.payload, 10) }
        case "SET_SHOW_LEGEND":
            return { ...state, showLegend: action.payload }
        case "TOGGLE_OPTIONS_PANEL":
            return { ...state, showOptions: !state.showOptions }
        default:
            return state
    }
}

function ChartOptions({ onOptionsChange, chartType }) {
    const colorSchemeOptions = useMemo(
        () => [
            { label: "Default", value: COLOR_SCHEMES.DEFAULT },
            { label: "Viridis", value: COLOR_SCHEMES.VIRIDIS },
            { label: "Plasma", value: COLOR_SCHEMES.PLASMA },
            { label: "Warm", value: COLOR_SCHEMES.WARM },
            { label: "Cool", value: COLOR_SCHEMES.COOL },
        ],
        [],
    )

    const initialState = {
        showOptions: false,
        colorScheme: COLOR_SCHEMES.DEFAULT,
        markerSize: 3,
        showLegend: true,
    }
    const [state, dispatch] = useReducer(optionsReducer, initialState)
    const { showOptions, colorScheme, markerSize, showLegend } = state

    // Only show marker size option for scatter charts
    const showMarkerSizeOption = useMemo(() => chartType === "scatter" || chartType === "scatter3d", [chartType])

    const handleOptionChange = useCallback(
        (option, value) => {
            let actionType
            switch (option) {
                case "colorScheme":
                    actionType = "SET_COLOR_SCHEME"
                    break
                case "markerSize":
                    actionType = "SET_MARKER_SIZE"
                    break
                case "showLegend":
                    actionType = "SET_SHOW_LEGEND"
                    break
            }

            if (actionType) {
                dispatch({ type: actionType, payload: value })
                onOptionsChange({ [option]: option === "markerSize" ? Number.parseInt(value, 10) : value })
            }
        },
        [onOptionsChange],
    )

    const toggleOptions = useCallback(() => {
        dispatch({ type: "TOGGLE_OPTIONS_PANEL" })
    }, [])

    return (
        <div className="mt-4">
            <button
                onClick={toggleOptions}
                className="flex items-center gap-1 text-sm text-card-foreground hover:text-primary cursor-pointer transition-colors p-2 rounded-md hover:bg-muted/50"
            >
                {showOptions ? (
                    <>
                        <ChevronDown size={16} />
                        Hide Advanced Options
                    </>
                ) : (
                    <>
                        <ChevronRight size={16} />
                        Show Advanced Options
                    </>
                )}
            </button>
            {showOptions && (
                <div className="mt-3 p-4 bg-muted/30 border border-border rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-card-foreground">Color Scheme</label>
                        <select
                            className="w-full p-2 sm:p-3 rounded border bg-muted border-primary/10  text-sm focus:outline-none"
                            value={colorScheme}
                            onChange={(e) => handleOptionChange("colorScheme", e.target.value)}
                        >
                            {colorSchemeOptions.map(({ label, value }) => (
                                <option key={value} value={value} className="bg-secondary text-secondary-foreground text-sm">
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {showMarkerSizeOption && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-card-foreground">Marker Size</label>
                            <input
                                type="range"
                                min="2"
                                max="8"
                                value={markerSize}
                                onChange={(e) => handleOptionChange("markerSize", e.target.value)}
                                className="w-full cursor-pointer accent-primary"
                            />
                            <div className="text-xs text-muted-foreground mt-1">Value: {markerSize}</div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-card-foreground">Show Legend</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="checkbox"
                                checked={showLegend}
                                onChange={(e) => handleOptionChange("showLegend", e.target.checked)}
                                className="h-4 w-4 cursor-pointer accent-primary rounded border-border"
                            />
                            <span className="text-sm text-card-foreground">Display legend</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChartOptions
