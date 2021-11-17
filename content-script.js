const isSandbox = document.currentScript && document.currentScript.hasAttribute('sandbox');
const iframe = document.querySelector('iframe#codex-sandbox');
const historyDiv = (isSandbox) ? document.querySelector('div#history') : null;

// Maintain command history, support command toggling
const commandHistory = [];
let commandIndex = 0;

// Display text box at bottom of page
const div = document.createElement("div");
div.id = "codex-tray"

const input = document.createElement("input");
input.type = "text"
input.placeholder = "Enter Codex completion prompt ..."
input.style = "width: 80%;"

const button = document.createElement("button")
button.type = "submit"
button.innerHTML = "Run"

const pageIcon = document.createElement('img');
pageIcon.src = chrome.runtime.getURL('assets/img/page.png');
pageIcon.setAttribute('title', "Open blank sandbox page");

const sidebarBtn = document.createElement("button");
sidebarBtn.innerHTML = "Open Sidebar";
sidebarBtn.addEventListener("click", () => displaySidebar);

div.append(input);
div.append(button);
if (!isSandbox) div.append(pageIcon);
document.body.append(div);
input.focus();

button.addEventListener("click", () => submitCommand(input.value));
pageIcon.addEventListener("click", () => chrome.runtime.sendMessage({ type: "openSandbox" }));
input.addEventListener("keyup", e => {
    // On "Enter", submit command
    if (e.key === "Enter") submitCommand(e.target.value)

    // On "Arrow Up", display previous command
    if (e.key === "ArrowUp") {
        // if (commandIndex === commands.length - 1)
        // If commandIndex at end of array (if = length - 1), store temporary text
    }

    // On "Arrow Down", display previous command
    if (e.key === "ArrowDown") {
        // If commandIndex at end of array (if = length - 1), enter temporary text
    }
});

// Submit command to Codex
function submitCommand(command) {

    // Clear input 
    input.value = ""

    // 
    commandHistory.push(command);
    // commandIndex = commands
    // Keep track of commandIndex - where in list the command is 
    // Put 

    // Fetch command history (commands, Codex completions) from DOM
    const scripts = document.querySelectorAll('script[data-codex="true"]');
    const history = (isSandbox) ? historyDiv.innerText : Object.values(scripts).map(script => script.innerHTML).join("")

    chrome.runtime.sendMessage({ type: "fetchCompletion", command: command, history: history }, response => {
        console.log(`/* Command: ${command} */\n${response.completion}`);
        (isSandbox) ? sendToSandbox(command, response.completion) : addScript(command, response.completion);
    });
}

// Add completion returned by Codex in script on DOM head 
function addScript(command, completion) {
    const script = document.createElement('script');
    script.dataset.codex = "true";
    script.innerHTML = `/* Command: ${command} */\n${completion}`;
    document.head.append(script)
}

// Send completion to sandboxed frame
function sendToSandbox(command, completion) {
    iframe.contentWindow.postMessage(`/* Command: ${command} */\n${completion}`, "*");
    historyDiv.innerText += `/* Command: ${command} */\n${completion}`
}

// Display sidebar element
function displaySidebar() {
    const div = document.createElement('div');
    div.id = "codex-sidebar";
    div.style = "width: 15%; position: fixed; height: 100vh;"
    document.body.insertBefore(div, document.body.firstChild);
}