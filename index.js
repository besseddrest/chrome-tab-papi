import initKeybinds from "./scripts/keybinds.js";

const initDaddy = () => {
    document.addEventListener("DOMContentLoaded", async () => {
        let formatted = null;
        const tabs = await getTabs();

        if (tabs) {
            formatted = formatTabData(tabs);

            await saveToLocalStorage(formatted);

            const currentWin = await chrome.windows.getCurrent();
            renderItems(currentWin.id).then((res) => {
                initKeybinds(res.formatted, currentWin.id);
            });
        }

        const userConfig = await chrome.storage.sync.get(["user"]);

        if (userConfig) {
            const conf = {
                theme: userConfig.user ? userConfig.user.theme : "default",
                font: userConfig.user ? userConfig.user.font : "default",
            };

            await chrome.storage.sync.set({ user: conf });
            setColorScheme(conf.theme);
        }

        const scheme = document.getElementById("scheme-picker");

        scheme.addEventListener("change", async (ev) => {
            setColorScheme(ev.target.value);
        });
    });
};

async function setColorScheme(name) {
    const html = document.getElementsByTagName("html")[0];
    html.className = "";
    html.classList.add(`theme-${name}`);

    const options = document.getElementById("scheme-picker").children;

    for (const child of options) {
        if (child.value === name) {
            child.selected = "selected";
        }
    }

    const user = {
        theme: name,
    };

    await chrome.storage.sync.set({ user: user });
}

async function renderItems(wid) {
    const data = await chrome.storage.local.get(["formatted"]);

    if (data) {
        const sites = document.querySelector("#sites .grid__content");
        const items = Object.entries(data.formatted.byHost).sort(
            (a, b) => b[1].ids.length - a[1].ids.length,
        );

        for (const item of items) {
            const row = document.createElement("div");
            row.classList.add("grid__record");
            row.id = item[1].gid;
            row.innerHTML = `
                <div class="grid__host">${item[0]}</div>
                <div class="grid__count">${item[1].ids.length}</div>
            `;
            sites.appendChild(row);
        }
    }

    return data;
}

async function saveToLocalStorage(data) {
    await chrome.storage.local.set({ formatted: data });
}

function formatTabData(data) {
    const tabState = {
        windowId: null,
        tabSrc: [...data],
        byHost: {},
    };

    for (let i = 0; i < tabState.tabSrc.length; ++i) {
        const curr = tabState.tabSrc[i];
        const hostname = new URL(curr.url).hostname;

        if (!tabState.byHost.hasOwnProperty(hostname)) {
            tabState.windowId = curr.windowId;
            tabState.byHost[hostname] = {
                gid: `g${i}`,
                ids: [],
            };
        }

        tabState.byHost[hostname].ids.push(curr.id);
    }

    // create another property for display
    return tabState;
}

async function getTabs() {
    const currentWin = await chrome.windows.getCurrent();

    const response = await chrome.tabs.query({ windowId: currentWin.id });

    if (!response) {
        throw new Error(`Failed to get tabs with params ${params}`);
    }

    return response;
}

initDaddy();
