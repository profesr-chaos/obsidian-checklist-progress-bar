import {
    Editor,
    EditorChange,
    MarkdownView,
    Plugin,
    WorkspaceLeaf,
} from 'obsidian';
import {
    ChecklistProgressBarSettingTab,
    ChecklistProgressBarSettings,
    normaliseSettings,
} from './settings';
import { formatCounter } from './counter';

/**
 * Supported optional colour tokens for the progress callout.
 * Usage: `> [!progress]` (default) or `> [!progress bl]`, `> [!progress pi]`, ...
 * Keys must stay in sync with the selectors in styles.css.
 */
const PROGRESS_COLOURS = [
    'bl', // blue
    'cy', // cyan
    'te', // teal
    'gr', // green
    'li', // lime
    'ye', // yellow
    'am', // amber
    'or', // orange
    're', // red
    'pi', // pink
    'ma', // magenta
    'pu', // purple
    'in', // indigo
    'br', // brown
    'gy', // grey
] as const;

type ProgressColour = typeof PROGRESS_COLOURS[number];

const COLOUR_SET: ReadonlySet<string> = new Set<string>(PROGRESS_COLOURS);

/** Matches the callout line and captures the blockquote prefix and optional colour token. */
const PROGRESS_LINE_RE = /^(\s*(?:>\s?)+)\[!progress(?:[ \-_]+([A-Za-z]{2,}))?\]/;

const CHECKLIST_ITEM_RE = /^\s*[-*+]\s+\[( |x|X)\]/;
const CHECKED_ITEM_RE = /^\s*[-*+]\s+\[x\]/i;

interface ProgressBarLine {
    /** Blockquote prefix, preserved verbatim so nested quotes survive a rewrite. */
    prefix: string;
    /** Normalised colour token, or null when the default styling applies. */
    colour: ProgressColour | null;
}

export default class ChecklistProgressBar extends Plugin {
    settings!: ChecklistProgressBarSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new ChecklistProgressBarSettingTab(this.app, this));

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                this.updateProgressBars(editor);
            })
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf | null) => {
                if (!leaf) return;
                const view = leaf.view;
                if (view instanceof MarkdownView && view.editor) {
                    this.updateProgressBars(view.editor);
                }
            })
        );
    }

    async loadSettings(): Promise<void> {
        this.settings = normaliseSettings(await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    /** Re-renders the progress bars in the active note, e.g. after a setting changes. */
    refreshActiveEditor(): void {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view?.editor) {
            this.updateProgressBars(view.editor);
        }
    }

    /**
     * Rewrites only the progress bar lines whose text has changed.
     *
     * Replacing the whole document with `setValue` resets the scroll position
     * (and wipes undo history, folds and selections), so the changed lines are
     * applied as a single transaction instead. `processLines` never adds or
     * removes lines, so every change is confined to its own line and the
     * positions stay valid for the whole batch.
     */
    private updateProgressBars(editor: Editor): void {
        const lines = editor.getValue().split('\n');
        const newLines = this.processLines(lines);

        const changes: EditorChange[] = [];
        for (let i = 0; i < lines.length; i++) {
            const oldText = lines[i];
            const newText = newLines[i];
            if (oldText === undefined || newText === undefined || oldText === newText) continue;

            changes.push({
                from: { line: i, ch: 0 },
                to: { line: i, ch: oldText.length },
                text: newText,
            });
        }

        if (changes.length > 0) {
            editor.transaction({ changes });
        }
    }

    private processLines(lines: string[]): string[] {
        const result: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined) continue;

            const progressBar = this.parseProgressBarLine(line);
            if (!progressBar) {
                result.push(line);
                continue;
            }

            let total = 0;
            let checked = 0;

            for (let j = i + 1; j < lines.length; j++) {
                const nextLine = lines[j];
                if (nextLine === undefined) break;
                if (this.parseProgressBarLine(nextLine)) break;

                if (CHECKLIST_ITEM_RE.test(nextLine)) {
                    total++;
                    if (CHECKED_ITEM_RE.test(nextLine)) checked++;
                }
            }

            result.push(this.buildProgressBar(progressBar, checked, total));
        }

        return result;
    }

    /**
     * Returns the parsed callout descriptor, or null when the line is not a progress bar.
     * An unrecognised colour token is treated as the default palette so typos degrade gracefully.
     */
    private parseProgressBarLine(line: string): ProgressBarLine | null {
        const match = PROGRESS_LINE_RE.exec(line);
        if (!match) return null;

        const prefix = match[1] ?? '> ';
        const token = match[2]?.toLowerCase();

        return {
            prefix,
            colour: token && COLOUR_SET.has(token) ? (token as ProgressColour) : null,
        };
    }

    private buildProgressBar(source: ProgressBarLine, checked: number, total: number): string {
        const label = source.colour ? `[!progress ${source.colour}]` : '[!progress]';

        const barLength = 20;
        
        const ratio = total === 0 ? 0 : checked / total;
        const percentage = Math.round(ratio * 100);
        const filled = Math.min(barLength, Math.max(0, Math.round(ratio * barLength)));
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        const counter = formatCounter(this.settings.counterStyle, checked, total);

        return `${source.prefix}${label} ${bar} ${counter} (${percentage}%)`;
    }
}