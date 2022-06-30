// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
await import("https://unpkg.com/sweetalert/dist/sweetalert.min.js")
'use strict';

//Variables to change for different websites
// let settings.ReaderRegex = /comics\/.*\/\d+/
// let settings.doMouseButton = true
// let settings.doArrowKeys = true
// let settings.getButtons = () => {
//     return document.querySelectorAll(".row .d-flex a.v-btn--router, .row .d-flex button.v-btn--disabled");
// }
// {
//     ReaderRegex: "regex",
//     doMouseButton: "bool",
//     doArrowKeys: "bool",
//     getButtons: "string (of function body)"
// }
//Get settings for page
let hostname = window.location.hostname
// let settings = await (browser.storage.local.get(hostname))[hostname]
let settings = JSON.parse(window.localStorage.getItem(hostname));
settings.getButtons = new Function("", settings.getbns)

//Sleep function;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
//pushState and replaceState events
const _wr = function(type) {
    var orig = history[type];
    return function() {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState');
// history.replaceState = _wr('replaceState');
//On history only page change
let currentPage;
function historyChange(e)
{
    if (document.URL.match(settings.ReaderRegex))
    {
        getBtns(1000);
        addEvents();
        console.log("Chapter");
    }
    else
    {
        removeBtns();
        removeEvents();
        console.log("Not-Chapter");
    }
}
window.addEventListener('popstate', historyChange);
window.addEventListener('pushState', historyChange);
//window.addEventListener('replaceState', historyChange);

var nextBtn, backBtn, pressNextBtn, pressBackBtn;
let keyEvent = (e) =>
{
    try {
//		console.log("Keyboard Button");
        if (e.code === "ArrowRight") pressNextBtn();
        else if (e.code === "ArrowLeft") pressBackBtn();
    }
    catch (e) { console.warn(e); }
}
let scrollEvent = (e) =>
{
    try {
//		console.log("Mouse Button");
        if (e.detail === 1) pressNextBtn();
        else if (e.detail === -1) pressBackBtn();
    }
    catch (e) { console.warn(e); }
}

async function getBtns(timeDelay, buttonFunction)
{
    //Wait for page to be constructed
    await sleep(timeDelay);

    //Get all chapter links
    [backBtn, nextBtn] = settings.getButtons();
    console.log("Getting chapter links"/*, backBtn, nextBtn*/);
}
function removeBtns()
{
    backBtn = nextBtn = undefined
}

function createButtonHandlers()
{
    //Make button handlers
    pressNextBtn = () =>
    {
        if (nextBtn == undefined || nextBtn.tagName != "A")
        {
            console.warn("No next chapter");
            swal("Missing Button", "No next chapter button was found.", "error");
        }
        else { nextBtn.click(); }
    };

    pressBackBtn = () =>
    {
        if (backBtn == undefined || backBtn.tagName != "A")
        {
            console.warn("No previous chapter");
            swal("Missing Button", "No previous chapter button was found.", "error");
        }
        else { backBtn.click(); }
    };
}

function addEvents()
{
    if (settings.doArrowKeys)    document.addEventListener('keyup', keyEvent);
    if (settings.doMouseButton)  document.addEventListener('DOMMouseScroll', scrollEvent);
}

function removeEvents()
{
    document.removeEventListener('keyup', keyEvent);
    document.removeEventListener('DOMMouseScroll', scrollEvent);
}

historyChange();
createButtonHandlers();