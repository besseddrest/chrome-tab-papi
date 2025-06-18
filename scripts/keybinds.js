let tabIdx = 0;
let rowIdx = -1;
const tabHeaders = document.querySelectorAll(".tabs li");
const tabContent = document.querySelectorAll(".tab__content");
const tableRows = document.querySelectorAll(".group__record");

console.log(tabHeaders);
console.log(tabContent);
console.log(tableRows);

export default function createCommands() {
    document.addEventListener("keydown", (e) => {
        const keybinds = {
            ArrowUp: () => navigateUp(),
            ArrowDown: () => navigateDown(),
            j: () => navigateUp(),
            k: () => navigateDown(),
            Tab: () => cycleTabs(),
        };

        keybinds[e.key]();
    });
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
}

function navigateUp() {
    if (rowIdx === 0 || rowIdx === -1) {
        rowIdx = tableRows.length - 1;
        tableRows[0].classList.remove("selected");
    } else {
        tableRows[rowIdx].classList.remove("selected");
        rowIdx--;
    }
}
