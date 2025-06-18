import createCommands from "./scripts/keybinds.js";
import { summarizeWindows } from "./scripts/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabs = await chrome.tabs.query({});

    if (tabs) {
        chrome.storage.local.set({ initialTabs: tabs.data }, () => {
            console.log("v2 Initial tab data set in local storage");
            summarizeWindows(tabs);
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

            await renderItems();

            createCommands();
        }
    });
};

export async function renderItems() {
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
    }
}

export async function saveToLocalStorage(data) {
    await chrome.storage.local.set({ formatted: data });
}

function formatTabData(data) {
    const newData = data.reduce((acc, curr) => {
        const host = new URL(curr.url).hostname;
        const wid = curr.windowId;

        if (!acc.hasOwnProperty(wid)) {
            acc[wid] = {
                wid,
                name: host,
                tabs: [],
            };
        }

        acc[wid].tabs.push(curr);
        return acc;
    }, {});

    return newData;
}

async function getTabs(params) {
    const response = await chrome.tabs.query(params);

    if (response) {
        throw new Error(`Failed to get tabs with params ${params}`);
    }

    return response;
}

initPapi();
