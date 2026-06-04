import { App, PluginSettingTab } from 'obsidian';
import ChecklistProgressBar from './main';

export interface MyPluginSettings {
    // Ready for future settings
}

export const DEFAULT_SETTINGS: MyPluginSettings = {};

export class SampleSettingTab extends PluginSettingTab {
    plugin: ChecklistProgressBar;

    constructor(app: App, plugin: ChecklistProgressBar) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Checklist Progress Bar' });
        containerEl.createEl('p', { text: 'Progress bars are automatically displayed above checklist blocks.' });
    }
}
