window.addEventListener("DOMContentLoaded", () => {
    // Define page input elements
    const inputs = {
        apiKey: document.querySelector('input#api-key'),
        sanitizeXSS: document.querySelector('input#sanitize-xss')
    }

    // Set options on initial load
    setOptions();

    // Add 'Save' button click event listener
    document.querySelector('button#save').addEventListener('click', saveOptions);

    // Set options based on values based in Chrome storage
    function setOptions() {
        chrome.storage.local.get('options', data => {
            if (!data.options) return
            inputs.apiKey.value = data.options.apiKey || "";
            inputs.sanitizeXSS.checked = data.options.sanitizeXSS;
        })
    }

    // Save options in Chrome local storage
    function saveOptions() {
        const options = {
            apiKey: inputs.apiKey.value,
            sanitizeXSS: inputs.sanitizeXSS.checked
        }
        chrome.storage.local.set({ options: options });
    }
});