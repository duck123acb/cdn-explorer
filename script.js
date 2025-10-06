const input = document.querySelector("#realInput");
const mirror = document.querySelector("#mirror");
const caret = document.querySelector("#caret");
const path = document.querySelector("#path");
const outputContainer = document.querySelector("#output");

class File {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
}
class Directory {
    constructor(name="cdn", path="cdn") {
        this.name = name;
        this.path = path;
        this.items = null;
    }

    async load() {
        this.items = []; // loading

        const res = await fetch(`https://api.github.com/repos/duck123acb/duck123acb.github.io/contents/${this.path}`);
        const items = await res.json();

        for (const item of items) {
            if (item.type === "dir") {
                this.items.push(new Directory(item.name, item.path));
            } else {
                this.items.push(new File(item.name, `https://duck123acb.github.io/${item.path}`));
            }
        };

        path.textContent = this.path;
    }
}

const allowedKeys = ["ArrowLeft", "ArrowRight"];
let commandHistory = [];
let historyIndex = null;
let currentCommand = "";

let currentDir = new Directory();

function log(message) {
    const element = document.createElement("p");
    element.textContent = message;
    outputContainer.appendChild(element);
}

async function cd(dirName) {
    let dir;

    if (dirName === "/" || dirName === undefined)
        dir = new Directory();
    else if (dirName === "..") {
        const lastSlash = currentDir.path.lastIndexOf("/");
    
        if (lastSlash === -1) {
            log("Already at root directory.");
            return;
        }

        const newPath = currentDir.path.substring(0, lastSlash);
        const newName = newPath.substring(newPath.lastIndexOf("/") + 1) || newPath;

        dir = new Directory(newName, newPath);
    }
    else {
        dir = currentDir.items.find(f => f instanceof Directory && f.name === dirName);
        if (!dir) return log(`Directory ${dirName} not found.`);
    }

    await dir.load();
    currentDir = dir;
}
function ls() {
    if (!currentDir.items || currentDir.items.length === 0)
        log("Items are still loading!");

    log(currentDir.items.map(f => f.name).join("  "));
}

function updateCaret(event) { // the cursor technically gets desynced in long strings but its fine
    if (event?.key && event.key.length !== 1 && !allowedKeys.includes(event.key)) return;

    // input update
    const textWhole = input.value.substring(2);
    input.value = "$ " + textWhole;

    // cursor update
    const textBeforeCaret = input.value.substring(2, input.selectionStart);
    mirror.textContent = "$ " + textBeforeCaret.replace(/ /g, "\u00a0");
    const rect = mirror.getBoundingClientRect();
    caret.style.left = rect.width + 2 + "px";
    caret.style.top = rect.height + 2 + "px";
}

function runCommand(command) {
    commandHistory.push(command);
    const commandName = command.split(" ");

    switch (commandName[0]) {
        case "help":
            log(
`help - Lists all commands.
ls - Lists all files in current directory.
cd - Allows user to change directory by specifying the directory to change to.
open - Allows user to open specified file in a new tab.`
            );
            break;

        case "ls":
            ls();
            break;

        case "cd":
            cd(commandName[1]);
            break;

        case "open":

            break;

        case "clear":
            outputContainer.replaceChildren();
            break;
    
        default:
            log(`Command: ${commandName[0]} not found. Run help to see available commands.`);
            break;
    }

    historyIndex = null; 
    currentCommand = "";
    input.value = "";
    updateCaret();
}
function scrollCommands(up, command) {
    if (commandHistory.length === 0) return;

    if (historyIndex === null) {
        currentCommand = command;
        historyIndex = up ? commandHistory.length - 1 : null;
    }
    else {
        historyIndex += up ? -1 : 1;
        if (historyIndex < 0) historyIndex = 0;
        if (historyIndex >= commandHistory.length) historyIndex = null;
    }

    input.value = historyIndex === null ? "$ " + currentCommand : "$ " + commandHistory[historyIndex];
    updateCaret();
}
function handleInput(event) {
    const command = input.value.substring(2);
    if (event.key === "Enter")
        runCommand(command);
    else if (event.key === "ArrowUp") {
        scrollCommands(true, command);
    }
    else if (event.key === "ArrowDown") {
        scrollCommands(false, command);
    }
    else
        updateCaret(event);
}

currentDir.load();

input.addEventListener("input", handleInput);
input.addEventListener("click", handleInput);
input.addEventListener("keyup", handleInput);
updateCaret();
