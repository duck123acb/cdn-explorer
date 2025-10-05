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

loadFiles();

//TODO: setup HTML from loading the files