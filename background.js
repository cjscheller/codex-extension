// On install, store default options and open options page
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ options: { apiKey: '', sanitizeXSS: false } });
    chrome.runtime.openOptionsPage();
});

// On button/page action, submit content script
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.insertCSS(tab.id, { file: "content-script.css" });
    chrome.tabs.executeScript(tab.id, { file: "content-script.js" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (sender.tab && request.type === "fetchCompletion") {
        fetchCompletion(request.command, request.history).then(completion => {
            sendResponse({ completion: completion })
        });
    }
    if (sender.tab && request.type === "openSandbox") {
        chrome.tabs.create({ url: chrome.extension.getURL("sandbox/blank.html") }, null)
        return null;
    }
    // Indicates handler will return response asynchronously
    return true;
});

// Fetch completion from Codex API with given prompt, appended to previously executed prompts
async function fetchCompletion(prompt, history) {
    
    // Fetch options
    const options = await new Promise(resolve => {
        chrome.storage.local.get('options', result => {
            resolve(result.options);
        });
    });

    // If API key not set, open extension options page
    if (!options.apiKey) {
        chrome.runtime.openOptionsPage();
        return "";
    }

    // Append new command to end of prompt
    let fullPrompt = `${codexPrompt}\n${history}`;
    fullPrompt += `/* Command: ${prompt} */\n`;
    console.log(fullPrompt);

    // Define request data, fetch completion from OpenAI
    const data = {
        prompt: fullPrompt,
        max_tokens: 1000,
        temperature: 0,
        stop: "/* Command:"
    }

    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${options.apiKey}`,
        },
        body: JSON.stringify(data)
    })

    const resp = await response.json();
    let completion = resp.choices[0].text;

    // If sanitize XSS option enabled ...
    if (options.sanitizeXSS) {
        completion = filterXSS(completion);
    }

    return completion;
}

// Define prompt for Codex completion API. Sourced from OpenAI playground
// Note that this "script" does not execute, it's instead used to instruct/prompt Codex on what content to generate
const codexPrompt = `
<|endoftext|>/* I incrementally modify an HTML page via <script> injection. Written for Chrome. */
/* Command: Add "Hello World", by adding an HTML DOM node */
var helloWorld = document.createElement('div');
helloWorld.id = "codex-hello-world"
helloWorld.innerHTML = 'Hello World';
document.body.appendChild(helloWorld);
/* Command: Clear the page. */
while (document.body.firstChild) {
  document.body.removeChild(document.getElementById("codex-hello-world"));
}
`