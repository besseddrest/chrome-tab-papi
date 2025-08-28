// ░█░█░█▀▀░█░█░█▀▄░▀█▀░█▀█░█▀▄░█▀▀
// ░█▀▄░█▀▀░░█░░█▀▄░░█░░█░█░█░█░▀▀█
// ░▀░▀░▀▀▀░░▀░░▀▀░░▀▀▀░▀░▀░▀▀░░▀▀▀

let tabIdx = 0;
let rowIdx = -1;
const selected = {
    gid: null,
    name: "",
    ids: [],
};
let marked = [];

export default function initKeybinds(tabState) {
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");
    let tableRows = Array.from(document.querySelectorAll(".grid__record"));

    const keybinds = {
        ArrowUp: () => navigateUp(),
        ArrowDown: () => navigateDown(),
        ArrowLeft: () => moveTabs("left"),
        ArrowRight: () => moveTabs("right"),
        h: () => moveTabs("left"),
        k: () => navigateUp(),
        j: () => navigateDown(),
        l: () => moveTabs("right"),
        d: () => deleteTabsAll(),
        r: () => reduceTabs(),
        x: () => addMark(),
        s: () => separate(),
        1: () => reduceTabsBy(1),
        2: () => reduceTabsBy(2),
        3: () => reduceTabsBy(3),
        4: () => reduceTabsBy(4),
        Tab: () => cycleContent(),
        Escape: () => window.close(),
    };

    document.addEventListener("keydown", (ev) => {
        if (!keybinds.hasOwnProperty(ev.key)) return;
        keybinds[ev.key]();
    });

    window.addEventListener("blur", (ev) => {
        ev.stopPropagation();
    });

    // Updates the DOM after action by editing the popup DOM directly
    function updateDOM(ids) {
        // when we reduceTabsBy, keep track of remaining so we can update count
        const diff = [...selected.ids].filter((item) => !ids.includes(item));
        const targetRow = document.getElementById(`${selected.gid}`);

        if (diff.length === 0) {
            targetRow.remove();
            delete tabState.byHost[selected.name];

            if (marked.length > 0) {
                for (const name of marked) {
                    delete tabState.byHost[name];

                    const otherRow = tableRows.find(
                        (el) =>
                            el.querySelector(".grid__host").textContent ===
                            name,
                    );

                    if (otherRow) {
                        otherRow.remove();
                    }
                }
                marked = [];
            }

            rowIdx -= 1;
            // refresh reference
            tableRows = Array.from(document.querySelectorAll(".grid__record"));
        } else {
            targetRow.querySelector(".grid__count").textContent =
                `${diff.length}`;
            tabState.byHost[selected.name].ids = diff;
        }

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

    function getMarkedTabIds() {
        if (marked.length === 0) {
            return [];
        }
        const ids = [];

        for (const name of marked) {
            ids.push(...tabState.byHost[name].ids);
        }

        return ids;
    }

    // just keeps track of the highlighted/selected row
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

    function reduceTabsBy(num) {
        const ids = selected.ids.splice(0, num);
        deleteTabs(ids);
    }

    function addMark() {
        if (selected.gid) {
            const temp = document.querySelector("#sites .selected");

            if (!temp.classList.contains("marked")) {
                temp.classList.add("marked");
                marked.push(selected.name);
            } else {
                const idx = marked.indexOf(selected.name);
                temp.classList.remove("marked");
                marked.splice(idx, 1);
            }
        }
    }

    // Takes selected group and marked groups (if any) and opens in a new window
    // There's an edge case where the active tab doesn't play nice, so the new
    // window opens with a New Tab, we move the tabs, then remove the New Tab
    // kinda easier this way, TBH
    function separate() {
        if (document.querySelector("#sites .selected")) {
            let temp = [...selected.ids];

            if (marked.length > 0) {
                temp = [];
                for (const row of tableRows) {
                    row.classList.remove("marked");
                }
                for (const name of marked) {
                    temp.push(...tabState.byHost[name].ids);
                }

                marked = [];
            }

            // creates a new window but with a default 'New Tab'
            chrome.windows.create({ focused: true }, async (window) => {
                chrome.tabs.move(temp, {
                    windowId: window.id,
                    index: -1,
                });

                const newTab = window.tabs[0].id;
                // so we delete it
                chrome.tabs.remove(newTab);
            });

            window.close();
        }
    }

    function moveTabs(dir) {
        const ids = getMarkedTabIds();
        const direction = dir === "left" ? 0 : -1;

        if (marked.indexOf(selected.name) === -1) {
            ids.push(...selected.ids);
        }

        chrome.tabs.move(ids, {
            index: direction,
        });
    }

    function deleteTabsAll() {
        const temp = [...selected.ids];

        if (marked.length > 0) {
            for (const name of marked) {
                temp.push(...tabState.byHost[name].ids);
            }
        }

        deleteTabs(temp);
    }

    async function deleteTabs(ids) {
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
