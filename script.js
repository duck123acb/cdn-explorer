const input = document.querySelector("#realInput");
const mirror = document.querySelector("#mirror");
const caret = document.querySelector("#caret");

const allowedKeys = ["ArrowLeft", "ArrowRight"];
let commandHistory = [];
let historyIndex = null;
let currentCommand = "";

async function loadFiles(path = "cdn") {
    const res = await fetch(`https://api.github.com/repos/duck123acb/duck123acb.github.io/contents/${path}`);
    const files = await res.json();

    files.forEach(file => {
        if (file.type === "dir") {
            loadFiles(file.path);
        } else {
            const url = `https://duck123acb.github.io/${file.path}`
            console.log(url);
        }
    });
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
    const commandName = command.split(" ")[0];

    switch (commandName) {
        case "help":
            console.log(
`help - Lists all commands.
ls - Lists all files in current directory.
cd - Allows user to change directory by specifying the directory to change to.
open - Allows user to open specified file in a new tab.`
            );
            break;

        case "ls":
            
            break;

        case "cd":
            
            break;

        case "open":

            break;
    
        default:
            console.log(`Command: ${commandName} not found. Run help to see available commands.`);
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

    console.log(historyIndex);
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

loadFiles();

input.addEventListener("input", handleInput);
input.addEventListener("click", handleInput);
input.addEventListener("keyup", handleInput);
updateCaret();

input.focus();
