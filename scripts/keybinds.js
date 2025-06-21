export default function createCommands(tabState, wid) {
    let tabIdx = 0;
    let rowIdx = -1;
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");
    const tableRows = document.querySelectorAll(".group__record");

    const state = {
        selected: null,
        ids: [],
        name: "",
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
            Tab: () => cycleTabs(),
        };

        keybinds[e.key]();
    });

    function cleanPapi() {
        // TODO
        // maybe we only need to keep the tab data in local storage up to date
        // vs query() and setting local storage
    }

    function moveTabsLeft() {
        chrome.tabs.move(state.ids, {
            index: 0,
        });
    }

    function moveTabsRight() {
        chrome.tabs.move(state.ids, {
            index: -1,
        });
    }

    function updateState(gid) {
        let target;

        for (const record of Object.values(tabState[wid].info)) {
            if (record.gid === gid) {
                target = record;
                break;
            }
        }

        state.gid = target.gid;
        state.ids = target.ids;
        state.name = target.name;
        console.log(state);
    }

    function deleteTabsAll() {
        deleteTabs(state.ids);
    }

    async function deleteTabs(ids) {
        await chrome.tabs.remove(ids);

        cleanPapi();
    }

    function reduceTabs() {
        const tmp = state.ids.slice(0, state.ids.length - 1);
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
