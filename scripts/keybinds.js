export default function createCommands(tabState) {
    let tabIdx = 0;
    let rowIdx = -1;
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");
    let tableRows = Array.from(document.querySelectorAll(".grid__record"));
    const msg = document.querySelector("h1 small");
    const selected = {
        gid: null,
        name: "",
        ids: [],
    };

    // ░█▀▄░▀█▀░█▀█░█▀▄░█▀▀
    // ░█▀▄░░█░░█░█░█░█░▀▀█
    // ░▀▀░░▀▀▀░▀░▀░▀▀░░▀▀▀

    const keybinds = {
        ArrowUp: () => navigateUp(),
        ArrowDown: () => navigateDown(),
        ArrowLeft: () => moveTabsLeft(),
        ArrowRight: () => moveTabsRight(),
        h: () => moveTabsLeft(),
        k: () => navigateUp(),
        j: () => navigateDown(),
        l: () => moveTabsRight(),
        d: () => deleteTabsAll(), // delete all tabs
        r: () => reduceTabs(), // reduce TO 1
        o: () => splitTabs(), // open all tabs in new window
        1: () => reduceTabsBy(1), // reduce tabs BY #
        2: () => reduceTabsBy(2),
        3: () => reduceTabsBy(3),
        4: () => reduceTabsBy(4),
        Tab: () => cycleContent(), // toggles btwn List / Info
        Escape: () => window.close(),
    };

    // ░█▀▀░█░█░█▀▀░█▀█░▀█▀░█▀▀
    // ░█▀▀░▀▄▀░█▀▀░█░█░░█░░▀▀█
    // ░▀▀▀░░▀░░▀▀▀░▀░▀░░▀░░▀▀▀

    document.addEventListener("keydown", (ev) => {
        if (!keybinds.hasOwnProperty(ev.key)) return;
        keybinds[ev.key]();
    });

    window.addEventListener("blur", (ev) => {
        ev.stopPropagation();
    });

    // ░█▀▀░█▀▀░█▀█░█▀▀░█▀▄░█▀█░█░░
    // ░█░█░█▀▀░█░█░█▀▀░█▀▄░█▀█░█░░
    // ░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀

    // change the DOM directly rather than fetching tab data
    function updateDOM(ids) {
        // remaining tabs for selected
        const diff = [...selected.ids].filter((item) => !ids.includes(item));
        const targetRow = document.getElementById(`${selected.gid}`);

        if (diff.length === 0) {
            targetRow.remove();
            delete tabState.byHost[selected.name];
            rowIdx -= 1;
            // refresh reference
            tableRows = Array.from(document.querySelectorAll(".grid__record"));
        } else {
            targetRow.querySelector(".grid__count").textContent =
                `${diff.length}`;
            const children = targetRow.parentElement.children;
            tabState.byHost[selected.name].ids = diff;
        }

        // TODO: sort the list since we've closed some tabs to preserve descending order before replacing in dom

        tableRows.sort((a, b) => {
            return (
                parseInt(b.querySelector(".grid__count").textContent) -
                parseInt(a.querySelector(".grid__count").textContent)
            );
        });
        for (const row of tableRows) {
            if (row.classList.contains("selected")) {
                row.classList.remove("selected");
            }
            if (row.id === selected.gid) {
                row.classList.add("selected");
            }
        }

        rowIdx = tableRows.indexOf(targetRow);
        document
            .querySelector("#sites .grid__content")
            .replaceChildren(...tableRows);
    }

    // just keeps track of the highlighted tab
    // TODO: this needs to update based on the DOM, not localstorage
    function updateState(gid) {
        for (const [key, value] of Object.entries(tabState.byHost)) {
            if (value.gid === gid) {
                selected.gid = gid;
                selected.ids = value.ids;
                selected.name = key;
                break;
            }
        }
    }

    // ░█▀█░█▀▀░▀█▀░▀█▀░█▀█░█▀█░█▀▀
    // ░█▀█░█░░░░█░░░█░░█░█░█░█░▀▀█
    // ░▀░▀░▀▀▀░░▀░░▀▀▀░▀▀▀░▀░▀░▀▀▀

    function reduceTabsBy(num) {
        const ids = selected.ids.splice(0, num);
        deleteTabs(ids);
    }

    // BUG: if active tab is last in list it will only open by itself in a new window
    // selected.ids.pop() is just a placeholder
    function splitTabs() {
        if (document.querySelector("#sites .selected")) {
            chrome.windows.create({ tabId: selected.ids.pop() }, (window) => {
                chrome.tabs.move(selected.ids, {
                    windowId: window.id,
                    index: -1,
                });
            });

            window.close();
        }
    }

    function moveTabsLeft() {
        chrome.tabs.move(selected.ids, {
            index: 0,
        });
    }

    function moveTabsRight() {
        chrome.tabs.move(selected.ids, {
            index: -1,
        });
    }

    function deleteTabsAll() {
        deleteTabs(selected.ids);
    }

    async function deleteTabs(ids) {
        msg.classList.remove("hide");

        setTimeout(() => {
            msg.classList.add("hide");
        }, 100);

        const [currentTab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const filtered = ids.filter((id) => id !== currentTab.id);

        await chrome.tabs.remove(filtered);
        updateDOM(filtered);
    }

    function reduceTabs() {
        const tmp = selected.ids.slice(0, selected.ids.length - 1);
        deleteTabs(tmp);
    }

    // ░█▄█░█▀█░█░█░█▀▀░█▄█░█▀▀░█▀█░▀█▀
    // ░█░█░█░█░▀▄▀░█▀▀░█░█░█▀▀░█░█░░█░
    // ░▀░▀░▀▀▀░░▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░░▀░

    function cycleContent() {
        const prev = tabIdx;
        tabIdx = tabIdx === 2 ? 0 : tabIdx + 1;

        tabHeaders[prev].classList.remove("active");
        tabContent[prev].classList.remove("tab__content--active");
        tabHeaders[tabIdx].classList.add("active");
        tabContent[tabIdx].classList.add("tab__content--active");
    }

    function navigateDown() {
        if (rowIdx === tableRows.length - 1 || rowIdx === -1) {
            tableRows[tableRows.length - 1].classList.remove("selected");
            rowIdx = 0;
        } else {
            tableRows[rowIdx].classList.remove("selected");
            rowIdx++;
        }

        tableRows[rowIdx].classList.add("selected");
        updateState(tableRows[rowIdx].id);
    }

    function navigateUp() {
        if (rowIdx === 0 || rowIdx === -1) {
            rowIdx = tableRows.length - 1;
            tableRows[0].classList.remove("selected");
        } else {
            tableRows[rowIdx].classList.remove("selected");
            rowIdx--;
        }
        tableRows[rowIdx].classList.add("selected");

        updateState(tableRows[rowIdx].id);
    }
}
