function AxisSelector({ label, options, value, onSelect, optional = false }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2 text-card-foreground">{label}</label>
            <select
                className="w-full p-2 sm:p-3 rounded border bg-muted border-primary/10  text-sm focus:outline-none"
                onChange={(e) =>
                    onSelect((draft) => {
                        if (label === "X Axis") {
                            draft.xAxis = e.target.value || null
                        } else if (label === "Y Axis") {
                            draft.yAxis = e.target.value || null
                        } else if (label === "Z Axis") {
                            draft.zAxis = e.target.value || null
                        }
                    })
                }
                value={value || ""}
            >
                {optional && (
                    <option className="bg-secondary text-secondary-foreground text-sm" key={"none"} value="None">
                        None
                    </option>
                )}
                {options.map((opt) => (
                    <option className="bg-secondary text-secondary-foreground text-sm" key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default AxisSelector
