const input = document.querySelector("#realInput");
const mirror = document.querySelector("#mirror");
const caret = document.querySelector("#caret");

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

function updateCaret(e) {
    if (e?.key && e.key.length !== 1) return;

    const textBeforeCaret = input.value.substring(2, input.selectionStart);
    const formattedText = "$ " + textBeforeCaret.replace(/ /g, "\u00a0");
    mirror.textContent = formattedText;
    input.value = formattedText;

    const rect = mirror.getBoundingClientRect();
    caret.style.left = rect.width + 2 + "px";
    caret.style.top = rect.height + "px";
}

// loadFiles();

input.addEventListener("input", updateCaret);
input.addEventListener("click", updateCaret);
input.addEventListener("keyup", updateCaret);
updateCaret();

input.focus();
