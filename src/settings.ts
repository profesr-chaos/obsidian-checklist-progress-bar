import { App, PluginSettingTab, Setting } from 'obsidian';
import ChecklistProgressBar from './main';
import {
    COUNTER_STYLE_LABELS,
    CounterStyle,
    DEFAULT_COUNTER_STYLE,
    toCounterStyle,
} from './counter';

export interface ChecklistProgressBarSettings {
    /** How the item counts are shown after the bar. */
    counterStyle: CounterStyle;
}

export const DEFAULT_SETTINGS: ChecklistProgressBarSettings = {
    counterStyle: DEFAULT_COUNTER_STYLE,
};

/** Merges stored data over the defaults, discarding unknown or malformed values. */
export function normaliseSettings(data: unknown): ChecklistProgressBarSettings {
    const stored = (data ?? {}) as Partial<Record<keyof ChecklistProgressBarSettings, unknown>>;
    return {
        counterStyle: toCounterStyle(stored.counterStyle),
    };
}

export class ChecklistProgressBarSettingTab extends PluginSettingTab {
    plugin: ChecklistProgressBar;

    constructor(app: App, plugin: ChecklistProgressBar) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Counter style')
            .setDesc('How the item counts are shown after the bar. Existing bars update the next time their note is edited.')
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions(COUNTER_STYLE_LABELS)
                    .setValue(this.plugin.settings.counterStyle)
                    .onChange(async (value) => {
                        this.plugin.settings.counterStyle = toCounterStyle(value);
                        await this.plugin.saveSettings();
                        this.plugin.refreshActiveEditor();
                    })
            );
    }
}
