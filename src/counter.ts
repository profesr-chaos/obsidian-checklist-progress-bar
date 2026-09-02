/**
 * How the item counts are rendered after the bar.
 *
 * - `fraction`:  `4/10`
 * - `open-done`: `6 open · 4 done`
 * - `both`:      `4/10 · 6 open`
 */
export type CounterStyle = 'fraction' | 'open-done' | 'both';

export const DEFAULT_COUNTER_STYLE: CounterStyle = 'fraction';

/** Labels shown in the settings dropdown, keyed by style. Order matters. */
export const COUNTER_STYLE_LABELS: Record<CounterStyle, string> = {
    'fraction': 'Fraction (4/10)',
    'open-done': 'Open and done (6 open · 4 done)',
    'both': 'Both (4/10 · 6 open)',
};

const COUNTER_STYLES: ReadonlySet<string> = new Set<string>(Object.keys(COUNTER_STYLE_LABELS));

/** Narrows an arbitrary stored value to a known style, falling back to the default. */
export function toCounterStyle(value: unknown): CounterStyle {
    return typeof value === 'string' && COUNTER_STYLES.has(value)
        ? (value as CounterStyle)
        : DEFAULT_COUNTER_STYLE;
}

/** Formats the count portion of the progress line (without the percentage). */
export function formatCounter(style: CounterStyle, checked: number, total: number): string {
    const open = total - checked;

    switch (style) {
        case 'open-done':
            return `${open} open · ${checked} done`;
        case 'both':
            return `${checked}/${total} · ${open} open`;
        case 'fraction':
        default:
            return `${checked}/${total}`;
    }
}
