# Tab Papi (Google Chrome)

Blazingly-fast tab management from your keyboard.

Use the predefined keybinds to tidy the tabs in any browser window.

If you are a keyboard-focused computer user, you might like this.

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
| Up, Down, j, k | Select/highlight group tabs by hostname |

### Actions

**Note:** The current/visible tab will always remain open

| Bind | Desc |
| -------- | ------- |
| Left, Right, h, l | Shift all group tabs to start or end |
| d | Delete all group tabs |
| o | Open all group tabs in new window |
| r | Reduce group tabs TO 1 - the most recent is preserved (I think)
| 1, 2, 3, 4 | Reduce group tabs BY # - oldest tabs are removed first

## Settings

The following color schemes are available, and should persist (you might have to
be logged-in to your browser account). Changing these settings will
auto-save/auto-update Tab Papi

- default
- dark
- Rose Pine Moon
- Catpuccin Mocha
- Tokyo Night
- Nord
- Gruvbox dark
- Dracula

## Accessibility

At the core of this project is having all control from your keyboard. Obviously,
this is an accessibility issue.

I'll consider adding support for mouse events if there's enough interest, but
off the top of my head this will prob require some design adjustments to
preserve some parity of experience between keyboard-focused vs balanced
users.

## TODO

- Papi for Gecko based browsers
- mouse support...
