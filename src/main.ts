import {
    Editor,
    MarkdownView,
    Plugin,
    WorkspaceLeaf,
} from 'obsidian';
import {
    DEFAULT_SETTINGS,
    MyPluginSettings,
    SampleSettingTab,
} from './settings';

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
    settings!: MyPluginSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SampleSettingTab(this.app, this));

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

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private updateProgressBars(editor: Editor): void {
        const content = editor.getValue();
        const lines = content.split('\n');
        const newContent = this.processLines(lines).join('\n');

        if (newContent !== content) {
            const cursor = editor.getCursor();
            const scroll = editor.getScrollInfo();
            editor.setValue(newContent);
            editor.setCursor(cursor);
            editor.scrollTo(scroll.left, scroll.top);
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

        return `${source.prefix}${label} ${bar} ${checked}/${total} (${percentage}%)`;
    }
}