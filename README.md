# Tab Papi (Google Chrome)

Blazingly-fast tab management from your keyboard.

Use the predefined keybinds to tidy the tabs in any browser window.

If you are a keyboard-focused computer user, you might like this.

## Installation

- Chrome Web Store (tba)
- clone this repo and add this extension in developer mode

## Keybinds

The first thing I recommend is to create a keybind to activate Papi.

- Click **Manage Extensions**
- Click **Keyboard shortcuts**
- Under Tab Papi, add your keyboard shortcut for **Activate the extension**

I prefer `Ctrl+P`, though keep in mind this might clash with your browser's 'Print'
command.

**Note:** Keybinds apply only to current window, and only when Papi is activated

### Movement

| Bind | Desc |
| -------- | ------- |
| Tab | Toggle btwn List/Info content |
| ↑, ↓, j, k | Select/highlight group tabs by hostname |

### Actions

**Note:** The current/visible tab will always remain open

| Bind | Desc |
| -------- | ------- |
| ←, →, h, l | Shift all group tabs to start or end |
| d | Delete all group tabs |
| o | Open all group tabs in new window |
| r | Reduce group tabs TO 1 - the most recent is preserved (I think)
| 1-4 | Reduce group tabs BY # - oldest tabs are removed first

## Settings

The following color schemes are available, and should persist (you might have to
be logged-in to your browser account). Changing these settings will
auto-save/auto-update Tab Papi

- default
- dark
- Catpuccin
- Dracula
- Everforest
- Gruvbox
- Nord
- Rose Pine
- Sandevistan (experimental)
- Tokyo Night

## Accessibility

At the core of this project is having all control from your keyboard. Obviously,
this is an accessibility issue.

I'll consider adding support for mouse events if there's enough interest, but
off the top of my head this will prob require some design adjustments to
preserve some parity of experience between keyboard-focused vs balanced
users.

## Known Bugs

If the active tab:

- is in selected group
- is last in that group
- and number of tabs in selected group is > 1

the tab will only open by itself if you try to open the group in a new window.
Somehow if the active tab is in any other position or by itself, it works as
expected.

## TODO

- Papi for Gecko based browsers
- mouse support...
