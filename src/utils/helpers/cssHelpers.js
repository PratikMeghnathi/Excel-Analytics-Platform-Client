import { oklch, formatHex, formatRgb } from 'culori';

export function getCssVarAsHex(name) {
    return formatHex(oklch(getComputedStyle(document.documentElement).getPropertyValue(name)?.trim()));
}
export function getCssVarAsRGB(name) {
    return formatRgb(oklch(getComputedStyle(document.documentElement).getPropertyValue(name)?.trim()));
}
