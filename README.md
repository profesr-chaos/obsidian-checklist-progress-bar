# Checklist Progress Bar

Automatically display a live progress bar above any checklist block in your Obsidian notes.

<img width="747" height="369" alt="image" src="https://github.com/user-attachments/assets/ed1d8d8b-6775-43fa-ac00-52b93783e371" />

---

## How It Works

Place a `> [!progress]` callout directly above a checklist block. The plugin will automatically calculate how many items are checked and update the progress bar in real time as you tick things off.

```
> [!progress] ███████████░░░░░░░░░ 9/16 (56%)

- [x] Set up project repository
- [x] Define initial requirements
- [ ] Design system architecture
- [ ] Implement core data models
...
```

No configuration needed — just drop in the callout and start checking things off.

---

## Usage

1. Open any note with a checklist
2. Add the following line directly above your list:

```
> [!progress]
```

3. The progress bar updates automatically as you check and uncheck items

> **Note:** The `> [!progress]` line must appear directly before your checklist block. Items are counted from that line down to the next progress bar or end of file.

---

## Colours

Add an optional two letter colour code after `progress` to change the accent colour of the bar. 

```
> [!progress]     ← default (purple)
> [!progress bl]  ← blue
> [!progress pi]  ← pink
```

### Available colours

| Code | Colour  | Code | Colour  | Code | Colour  |
|------|---------|------|---------|------|---------|
| `bl` | Blue    | `li` | Lime    | `ma` | Magenta |
| `cy` | Cyan    | `ye` | Yellow  | `pu` | Purple  |
| `te` | Teal    | `am` | Amber   | `in` | Indigo  |
| `gr` | Green   | `or` | Orange  | `br` | Brown   |
| `re` | Red     | `pi` | Pink    | `gy` | Grey    |

---

## Settings

Open **Settings → Checklist Progress Bar** to configure the plugin.

### Counter style

Controls how the item counts are shown after the bar. By default the bar shows a fraction of checked items. If you prefer to see the open and done counts spelled out, pick one of the other styles:

| Style | Example |
|---|---|
| Fraction *(default)* | `████████░░░░░░░░░░░░ 4/10 (40%)` |
| Open and done | `████████░░░░░░░░░░░░ 6 open · 4 done (40%)` |
| Both | `████████░░░░░░░░░░░░ 4/10 · 6 open (40%)` |

The setting applies to every progress bar in your vault. The note you have open updates immediately when you change it. Other notes update the next time they are edited.

---

## Features

- Live updates on every keystroke — no need to reload or save
- Keeps your scroll position, cursor and undo history when a bar updates
- Optional colour codes, 15 colours to choose from
- Choice of fraction or open/done counters
- Supports nested checklist items at any indentation level
- Multiple progress bars per note, each tracking its own block and colour
- Clean callout styling with both dark and light theme support
- Zero configuration required, with an optional counter style setting

---

## Installation

### Via Community Plugins *(recommended)*
1. Open Obsidian and go to **Settings → Community Plugins**
2. Search for **Checklist Progress Bar**
3. Click **Install**, then **Enable**

### Manual
1. Download the latest release from [GitHub Releases](https://github.com/profesr-chaos/obsidian-checklist-progress-bar/releases)
2. Copy `main.js`, `manifest.json`, and `styles.css` into your vault at:
   ```
   <vault>/.obsidian/plugins/checklist-progress-bar/
   ```
3. Restart Obsidian and enable the plugin under **Settings → Community Plugins**

---

## Compatibility

- Obsidian **v1.0.0** and above
- Works in both **Live Preview** and **Reading** mode

---

## Feedback & Contributions

Found a bug or have a feature request? Open an issue on [GitHub](https://github.com/profesr-chaos/obsidian-checklist-progress-bar). Pull requests are welcome.
