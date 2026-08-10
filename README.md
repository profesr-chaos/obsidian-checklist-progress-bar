# Checklist Progress Bar

Automatically display a live progress bar above any checklist block in your Obsidian notes.

![Progress bar example](image.png)

---

## Release Notes

### 1.0.1
- **Optional colour codes.** Add a two letter code after `progress` to change the accent colour, for example `> [!progress bl]` for blue. 15 colours available, see [Colours](#colours). Unrecognised codes fall back to the default purple.
- **Empty checklists now render a bar.** A progress callout with no items below it shows `0/0 (0%)` instead of the text "No checklist items found".
- **Nested blockquotes preserved.** A progress bar inside a nested quote keeps its `>` prefix when it updates, rather than being flattened to a single level.
- **Scroll position retained** when a bar updates in a long note.

### 1.0.0
- Initial release. Live progress bars above checklist blocks, multiple bars per note, dark and light theme styling.

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

Add an optional two letter colour code after `progress` to change the accent colour of the bar. Without a code, the bar uses the default purple.

```
> [!progress]     ← default (purple)
> [!progress bl]  ← blue
> [!progress pi]  ← pink
```

Everything else works exactly the same. The colour is preserved as the bar updates, and each bar in a note can use a different colour.

### Available colours

| Code | Colour  | Code | Colour  | Code | Colour  |
|------|---------|------|---------|------|---------|
| `bl` | Blue    | `li` | Lime    | `ma` | Magenta |
| `cy` | Cyan    | `ye` | Yellow  | `pu` | Purple  |
| `te` | Teal    | `am` | Amber   | `in` | Indigo  |
| `gr` | Green   | `or` | Orange  | `br` | Brown   |
| `re` | Red     | `pi` | Pink    | `gy` | Grey    |

### Example

```
> [!progress gr] ████████████████████ 4/4 (100%)

- [x] Draft the proposal
- [x] Internal review
- [x] Client sign off
- [x] Kick off

> [!progress am] █████░░░░░░░░░░░░░░░ 1/4 (25%)

- [x] Set up staging
- [ ] Migrate database
- [ ] Smoke test
- [ ] Cut over
```
<img width="831" height="957" alt="image" src="https://github.com/user-attachments/assets/fca8c901-c327-4f11-b438-9e2820cca43b" />

> **Note:** An unrecognised colour code falls back to the default purple rather than breaking the bar, so a typo is harmless.

---

## Features

- Live updates on every keystroke — no need to reload or save
- Optional colour codes, 15 colours to choose from
- Supports nested checklist items at any indentation level
- Multiple progress bars per note, each tracking its own block and colour
- Clean callout styling with both dark and light theme support
- Zero configuration required

---

## Installation

### Via Community Plugins *(recommended)*
1. Open Obsidian and go to **Settings → Community Plugins**
2. Search for **Checklist Progress Bar**
3. Click **Install**, then **Enable**

### Manual
1. Download the latest release from [GitHub Releases](https://github.com/)
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
