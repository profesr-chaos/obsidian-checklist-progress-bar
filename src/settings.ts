import { App, PluginSettingTab } from 'obsidian';
import ChecklistProgressBar from './main';

export type ChecklistProgressBarSettings = Record<string, never>;

export const DEFAULT_SETTINGS: ChecklistProgressBarSettings = {};

export class ChecklistProgressBarSettingTab extends PluginSettingTab {
    plugin: ChecklistProgressBar;

    constructor(app: App, plugin: ChecklistProgressBar) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('p', { text: 'Progress bars are automatically displayed above checklist blocks.' });
    }
}
