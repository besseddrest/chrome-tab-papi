# Tab Papi

Your girlfriend's favorite tab manager.

## Purpose

Manage your tab clutter with speed, from your keyboard.

I made this so I can keep my overall tab count tidy, quickly.

If you use vim, you might like this.

## Disclaimer

Papi needs permission - it uses the tab URLs in order to sort the data.

The data will be fetched every time you open Tab Papi.

While it's open, it manages a simplified dataset in your local storage and
updates the DOM (of the extension) directly. Doing it this way makes it a bit
more tedious for me to keep the list up to date, but I chose this approach in
case anyone felt that constantly fetching tab info is instrusive.

## Keybinds

Recommended first step would be to create a keybind to activate Papi

- Click "Manage Extensions"
- Click Keyboard shortcuts
- Under Tab Papi, add your keyboard shortcut for "Activate the extension"

I prefer `Ctrl+P`, though keep in mind this might clash with your browser's 'Print'
command.

**Note:** All keybinds apply only to current window, and only when Papi is activated

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

## TODO

- mouse support...
- theme/colorscheme
- Papi for other browsers
