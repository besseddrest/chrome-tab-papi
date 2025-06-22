import { renderItems } from "../papi.js";
export default function createCommands(tabState, wid) {
    let tabIdx = 0;
    let rowIdx = -1;
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");
    const tableRows = document.querySelectorAll(".group__record");

    const selected = {
        gid: null,
        name: "",
        ids: [],
    };

    document.addEventListener("keydown", (e) => {
        const keybinds = {
            ArrowUp: () => navigateUp(),
            ArrowDown: () => navigateDown(),
            ArrowLeft: () => moveTabsLeft(),
            ArrowRight: () => moveTabsRight(),
            h: () => moveTabsLeft(),
            k: () => navigateUp(),
            j: () => navigateDown(),
            l: () => moveTabsRight(),
            d: () => deleteTabsAll(),
            r: () => reduceTabs(),
            o: () => splitTabs(),
            1: () => reduceTabsBy(1),
            2: () => reduceTabsBy(2),
            3: () => reduceTabsBy(3),
            4: () => reduceTabsBy(4),
            Tab: () => cycleTabs(),
        };

        keybinds[e.key]();
    });

    async function cleanPapi(ids) {
        const diff = [...selected.ids].filter((item) => !ids.includes(item));

        // TODO: too many states
        tabState.byHost[selected.hostname].ids = diff;
        selected.ids = diff;

        await chrome.storage.local
            .set({ formatted: tabState })
            .then(async () => {
                await renderItems(tabState.windowId);
            });
    }

    function reduceTabsBy(num) {
        const ids = selected.ids.splice(0, num);
        deleteTabs(ids);
    }

    function splitTabs() {
        const newTabs = [...selected.ids];
        const tabId = newTabs.pop();

        chrome.windows.create({ tabId }, (window) => {
            chrome.tabs.move(newTabs, { windowId: window.id, index: -1 });
        });

        cleanPapi([tabId, ...newTabs]);
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

    function deleteTabsAll() {
        deleteTabs(selected.ids);
    }

    async function deleteTabs(ids) {
        const [currentTab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const filtered = ids.filter((id) => id !== currentTab.id);

        const result = await chrome.tabs.remove(filtered);
        if (result) {
            cleanPapi(ids);
        }
    }

    function reduceTabs() {
        const tmp = selected.ids.slice(0, selected.ids.length - 1);
        deleteTabs(tmp);
    }

    function cycleTabs() {
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
