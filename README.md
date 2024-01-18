# OpenAI Codex Extension

An experimental Chromium extension for executing [OpenAI Codex](https://openai.com/blog/openai-codex/) completions in-browser. 

Interacts with the OpenAI [Codex Completion API](https://beta.openai.com/docs/api-reference/completions) for generating Javascript code using OpenAI's natural language models.

## Usage

Click on the extension's icon (browserAction) to initialize the content script on the current tab. You can also initialize the content script using the customizable keyboard shortcut `Ctrl+Shift+C`/`Command+MacCtrl+C`

An input will be added to the bottom of the tab. Enter short commands to be submitted to the Codex Completion API, and the resulting completion returned from the API will be executed in the current tab. You can also open a blank sandbox page to execute Codex completions on a blank page.

For additional clarity, check out the [Examples](#examples) section.

## Development 

Prerequisites:
- OpenAI API key - See https://openai.com/api/

Load the extension in your broswer for local development and testing - more info [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

## Examples

<img src="./exclude/codex-example.gif" alt="Codex Example" width="600">

```text
make the background red
find all the h1 elements and make them white
now make them bold
make all svgs and their paths white
make the background color a linear gradient from light blue to dark blue
make the dark blue color a bit lighter
```

[Creating a space game with OpenAI Codex (from OpenAI)](https://player.vimeo.com/video/583550498)

```text
add this image of a rocketship: https://i1.sndcdn.com/artworks-j8xjG7zc1wmTeO7b-O6l83w-t500x500.jpg
make it be smallish
crop it circularly
make it be vertically centered; put on the left side of the page
animate the rocketship horizontally, bouncing off the left/right walls
go half speed
disable scrollbars
now set background to the color of space
when the rocket is clicked, temporarily display some text saying "Firing thrusters!" in white on the current location -- and temporarily speed up 4x for 0.25 second
...
```

## Contributing

Contributions are **welcome** and will be fully **credited**. See [CONTRIBUTING](CONTRIBUTING.md) for more details.

## To-Do

- [ ] Include sidebar where can view log of prompts & completions
- [ ] Use keyboard to toggle thru command history
- [ ] Handle content script re-injection
