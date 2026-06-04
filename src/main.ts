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
        const result = this.processLines(lines);
        const newContent = result.join('\n');

        if (newContent !== content) {
            const cursor = editor.getCursor();
            editor.setValue(newContent);
            editor.setCursor(cursor);
        }
    }

    private processLines(lines: string[]): string[] {
        const result: string[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            if (line === undefined) break;

            if (this.isProgressBarLine(line)) {
                // Find all checklist items between this progress bar and the next one
                const checklistItems: string[] = [];
                let j = i + 1;

                while (j < lines.length) {
                    const nextLine = lines[j];
                    if (nextLine === undefined) break;

                    // Stop at the next progress bar
                    if (this.isProgressBarLine(nextLine)) break;

                    if (this.isChecklistItem(nextLine)) {
                        checklistItems.push(nextLine);
                    }

                    j++;
                }

                const total = checklistItems.length;
                const checked = checklistItems.filter(l => this.isChecked(l)).length;

                // Replace the progress bar line with updated values
                result.push(this.buildProgressBar(checked, total));
                i++;
            } else {
                result.push(line);
                i++;
            }
        }

        return result;
    }

    private buildProgressBar(checked: number, total: number): string {
        if (total === 0) return '> [!progress] No checklist items found';

        const percentage = Math.round((checked / total) * 100);
        const barLength = 20;
        const filled = Math.round((checked / total) * barLength);
        const empty = barLength - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);


        return `> [!progress] ${bar} ${checked}/${total} (${percentage}%)`;
    }

    private isProgressBarLine(line: string): boolean {
        return /^>\s*\[!progress\]/.test(line);
    }

    private isChecklistItem(line: string): boolean {
        return /^(\s*)-\s+\[( |x|X)\]/.test(line);
    }

    private isChecked(line: string): boolean {
        return /^(\s*)-\s+\[x\]/i.test(line);
    }

    private getIndentLevel(line: string): number {
        const match = line.match(/^(\s*)/);
        return match ? match[1]?.length ?? 0 : 0;
    }
}
