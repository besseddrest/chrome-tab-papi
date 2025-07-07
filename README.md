# Tab Papi (Google Chrome)

Your girlfriend's favorite tab manager.

## Keybinds

The first thing I recommend is to create a keybind to activate Papi.

- Click **Manage Extensions**
- Click **Keyboard shortcuts**
- Under Tab Papi, add your keyboard shortcut for **Activate the extension**

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

## Purpose

Let's be real:

You like to keep your tabs open. You can't really explain why - you think
there's a tab of some importance in the haystack... but if it were that important
you wouldn't have let it become part of the haystack.

You try to justify your tab overdose by telling yourself that your computer can
handle it. You've turned on the browser's memory saving feature and you're
pretty sure you can tell the difference.

You probably should close those windows - it'll actually free up the memory.

If you've made it this far - welcome! You're just as stubborn as me.

I made this cause I wanted a simple yet fast way to keep this bad habit somewhat
under control. It's actually been pretty helpful, so I thought I'd share with my
fellow degenerates.

I've tried other extensions and they don't really do it for me. One extension
limited the total number of tabs I can open. It became annoying. Others require
you to be more involved. Okay; I only really tried 2 different extensions.

Think of it this way: It's like doing your laundry, but leaving it in the basket
because you're too lazy to fold everything and put it away.

If you use vim, you might like this.

I've been developing since 2008, but this is the first lil feature that I'm
sharing publicly. It's simple, but I'm proud of it; I hope you enjoy it.

## Disclaimer

Papi needs permission - it uses the tab URLs in order to sort the data.

The data will be fetched every time you open Tab Papi.

While it's open, it manages a simplified dataset in your local storage and
updates the DOM (of the extension) directly. Doing it this way makes it a bit
more tedious for me to keep the list up to date, but I chose this approach in
case anyone felt that constantly fetching tab info is instrusive.

## Accessibility

At the core of this project is having all control from your keyboard. Obviously,
this is an accessibility issue.

I'll consider adding support for mouse events if there's enough interest, but
off the top of my head this will prob require some design adjustments to
preserve some parity of experience between keyboard-focused vs balanced
users.

## TODO

- mouse support...
- theme/colorscheme
- Papi for other browsers
