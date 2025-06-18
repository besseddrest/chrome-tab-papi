import createCommands from "./scripts/keybinds.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabs = await chrome.tabs.query({});

    if (tabs) {
        chrome.storage.local.set({ initialTabs: tabs.data }, () => {
            console.log("v2 Initial tab data set in local storage");
        });
    }
});

const initPapi = () => {
    document.addEventListener("DOMContentLoaded", async () => {
        let formatted = null;
        // fetch and process tab data
        const tabs = await getTabs({});

        if (tabs) {
            formatted = formatTabData(tabs);

            await saveToLocalStorage(formatted);

            const currentWin = await chrome.windows.getCurrent();
            renderItems(currentWin.id).then(() => {
                createCommands();
            });
        }
    });
};

export async function renderItems(wid) {
    const data = await chrome.storage.local.get(["formatted"]);

    if (data) {
        const sites = document.getElementById("sites");
        const group = data.formatted[wid];

        const items = Object.entries(group.info).sort(
            (a, b) => b[1].ids.length - a[1].ids.length,
        );

        for (const item of items) {
            const tmpl = document.getElementById("tmpl_counts");
            const newItem = tmpl.content.cloneNode(true);

            newItem.querySelector(".group__host").textContent = `${item[0]}`;
            newItem.querySelector(".group__count").textContent =
                `${item[1].ids.length}`;

            sites.appendChild(newItem);
        }
    }
}

export async function saveToLocalStorage(data) {
    await chrome.storage.local.set({ formatted: data });
}

function formatTabData(data) {
    const newData = data.reduce((acc, curr) => {
        const wid = curr.windowId;

        if (!acc.hasOwnProperty(wid)) {
            acc[wid] = {
                wid,
                tabs: [],
            };
        }

        acc[wid].tabs.push(curr);
        return acc;
    }, {});

    for (const obj of Object.values(newData)) {
        const tabs = [...obj.tabs];

        const info = tabs.reduce((acc, curr) => {
            const hostname = new URL(curr.url).hostname;

            if (!acc.hasOwnProperty(hostname)) {
                acc[hostname] = {
                    ids: [],
                };
            }
            acc[hostname].ids.push(curr.id);
            return acc;
        }, {});

        // info.sort((a, b) => b.ids.length - a.ids.length1);

        obj.info = info;
    }

    // create another property for display
    return newData;
}

async function getTabs(params) {
    const response = await chrome.tabs.query(params);

    if (!response) {
        throw new Error(`Failed to get tabs with params ${params}`);
    }

    return response;
}

initPapi();
