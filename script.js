const input = document.querySelector("#realInput");
const mirror = document.querySelector("#mirror");
const caret = document.querySelector("#caret");

const allowedKeys = ["ArrowLeft", "ArrowRight"];

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

function updateCaret(event) {
    if (event?.key && event.key.length !== 1 && !allowedKeys.includes(event.key)) return;

    // input update
    const textWhole = input.value.substring(2);
    input.value = "$ " + textWhole;

    // cursor update
    const textBeforeCaret = input.value.substring(2, input.selectionStart);
    mirror.textContent = "$ " + textBeforeCaret.replace(/ /g, "\u00a0");
    const rect = mirror.getBoundingClientRect();
    caret.style.left = rect.width + 2 + "px";
    caret.style.top = rect.height + "px";
}

function handleInput(event) {
    if (event.key === "Enter") {

    }
    else if (event.key === "Up") {

    }
    else if (event.key === "Down") {
        
    }
    else
        updateCaret(event);
}

// loadFiles();

input.addEventListener("input", handleInput);
input.addEventListener("click", handleInput);
input.addEventListener("keyup", handleInput);
updateCaret();

input.focus();
