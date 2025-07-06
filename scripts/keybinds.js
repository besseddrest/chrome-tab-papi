export default function createCommands(tabState) {
    let tabIdx = 0;
    let rowIdx = -1;
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");
    let tableRows = document.querySelectorAll(".group__record");
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
    };

    // ░█▀▀░█░█░█▀▀░█▀█░▀█▀░█▀▀
    // ░█▀▀░▀▄▀░█▀▀░█░█░░█░░▀▀█
    // ░▀▀▀░░▀░░▀▀▀░▀░▀░░▀░░▀▀▀

    document.addEventListener("keydown", (e) => {
        if (!keybinds.hasOwnProperty(e.key)) return;
        keybinds[e.key]();
    });

    window.addEventListener("blur", () => {
        window.close();
    });

    // ░█▀▀░█▀▀░█▀█░█▀▀░█▀▄░█▀█░█░░
    // ░█░█░█▀▀░█░█░█▀▀░█▀▄░█▀█░█░░
    // ░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀

    // change the DOM directly rather than fetching tab data
    function updateDOM(ids) {
        // remaining tabs for selected
        const diff = [...selected.ids].filter((item) => !ids.includes(item));
        const targetRow = document.getElementById(`${selected.gid}`);
        const idx = Array.prototype.indexOf.call(tableRows, targetRow);

        // TODO: update tabState w/ diff
        if (diff.length === 0) {
            targetRow.remove();
            delete tabState[selected.name];
        } else {
            targetRow.querySelector(".group__count").textContent =
                `${diff.length}`;
            tabState[selected.name].ids = diff;
        }

        // refresh reference
        tableRows = document.querySelectorAll(".group__record");
        tableRows[idx].classList.add("selected");
        rowIdx = idx;
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

    function splitTabs() {
        const newTabs = [...selected.ids];
        const tabId = newTabs.pop();

        chrome.windows.create({ tabId, focused: false }, (window) => {
            chrome.tabs.move(newTabs, { windowId: window.id, index: -1 });
            chrome.windows.update(tabState.windowId);
        });

        window.close();
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
        tabIdx = tabIdx === 0 ? 1 : 0;

        if (tabIdx === 1) {
            tabHeaders[0].classList.remove("active");
            tabContent[0].classList.remove("tab__content--active");
            tabHeaders[1].classList.add("active");
            tabContent[1].classList.add("tab__content--active");
        } else {
            tabHeaders[1].classList.remove("active");
            tabContent[1].classList.remove("tab__content--active");
            tabHeaders[0].classList.add("active");
            tabContent[0].classList.add("tab__content--active");
        }
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
