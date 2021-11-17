window.addEventListener("message", event => {
    if (event.origin.startsWith("chrome-extension://")) {
        const script = document.createElement('script');
        script.dataset.codex = "true";
        script.innerHTML = event.data;
        document.head.append(script);
    }
});