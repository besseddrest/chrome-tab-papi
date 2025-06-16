document.addEventListener("DOMContentLoaded", () => {
    getTabs({}, (tabs) => {
        chrome.storage.local.set({ initialTabs: tabs }, () => {
            console.log("v2 Initial tab data set in local storage");

            summarizeWindows(tabs);
        });
    });
});

async function summarizeWindows(tabs) {
    const initial = await chrome.storage.local.get(["initialTabs"]);
    const formatted = {};
    let windowIdx = 0;

    if (initial) {
        for (let record of initial.initialTabs) {
            const parentId = record.windowId;

            if (formatted.hasOwnProperty(parentId)) {
                formatted[parentId].items.push(record);
            } else {
                formatted[parentId] = {
                    name: `Window ${windowIdx + 1}`,
                    id: parentId,
                    items: [record],
                };
                windowIdx++;
            }
        }

        summarizeTabs(formatted);
    } else {
        // if we don't have it for some reason
    }
}

function summarizeTabs(windows) {
    for (const [_, value] of Object.entries(windows)) {
        const temp = [...value.items];
        value.items = {};

        for (let item of temp) {
            const host = new URL(item.url).hostname;

            if (value.items.hasOwnProperty(host)) {
                value.items[host].tabs.push(item);
            } else {
                value.items[host] = {
                    name: host,
                    tabs: [item],
                };
            }
        }
    }

    chrome.storage.local.set({ formatted: windows }, async () => {
        console.log("Saved tab data byWindow in local storage");
        const currentWin = await chrome.windows.getCurrent();
        createSummary(currentWin.id);
    });
}

async function createSummary(windowId) {
    const data = await chrome.storage.local.get(["formatted"]);
    if (data) {
        const sites = document.getElementById("sites");
        const groups = data.formatted[windowId].items;

        const sorted = Object.values(groups).sort((a, b) => {
            return b.tabs.length - a.tabs.length;
        });

        for (const group of sorted) {
            const tmpl = document.getElementById("tmpl_counts");
            const newItem = tmpl.content.cloneNode(true);

            newItem.querySelector(".group__host").textContent = `${group.name}`;
            newItem.querySelector(".group__count").textContent =
                `${group.tabs.length}`;

            sites.appendChild(newItem);
        }

        // gotta wait til we have data rendered
        addListeners();
    }
}

function getTabs(query, cb) {
    chrome.tabs.query(query, (tabs) => {
        cb(tabs);
    });
}

function addListeners() {
    let tabIdx = 0;
    const tabHeaders = document.querySelectorAll(".tabs li");
    const tabContent = document.querySelectorAll(".tab__content");

    let rowIdx = -1;
    const tableRows = document.querySelectorAll(".group__record");

    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
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

        if (tabIdx === 0) {
            if (e.key === "ArrowUp" || e.key === "k") {
                if (rowIdx === 0 || rowIdx === -1) {
                    rowIdx = tableRows.length - 1;
                    tableRows[0].classList.remove("selected");
                } else {
                    tableRows[rowIdx].classList.remove("selected");
                    rowIdx--;
                }
            }
            if (e.key === "ArrowDown" || e.key === "j") {
                if (rowIdx === tableRows.length - 1 || rowIdx === -1) {
                    tableRows[tableRows.length - 1].classList.remove(
                        "selected",
                    );
                    rowIdx = 0;
                } else {
                    tableRows[rowIdx].classList.remove("selected");
                    rowIdx++;
                }
            }
            tableRows[rowIdx].classList.add("selected");
        }
    });
}
