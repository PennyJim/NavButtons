(async function () {

const activeTab = {
    active: true,
    currentWindow: true
}
const domainRegex = /^(?:[^:]+:\/\/(?:[^@\/?]+@)?([^:\/?]+))?/

let domain;
let domainActive;
let domainExists;
let isTesting = !browser == undefined;
console.assert(!isTesting, "Running as non-extension")

function handleError(e) {
    document.body.classList.add("errored");
    console.error(e);
    document.getElementById("error-content").innerText = e.message;
}

function updateSettings(e) {
    let setObject = {}
    try {
        if (e.target.id != "isActive" && !domainExists) {
            document.getElementById("isActive").checked = true;
            domainExists = true;
        }
        setObject[domain] = {
            regex: document.getElementById("regex").value,
            match: document.getElementById("match").value,
            getbtns: document.getElementById("getbtns").value,
            isSingle: document.getElementById("isSingle").checked,
            useMouse: document.getElementById("useMouse").checked,
            useArrows: document.getElementById("useArrows").checked
        }
        setObject[domainActive] = document.getElementById("isActive").checked;
        console.log(setObject)
        browser.storage.local.set(setObject);
        if (!domainExists) domainExists = true;
    } catch (error) {
        handleError(error);
        //For testing purposes
        window.localStorage.setItem(domain, JSON.stringify(setObject[domain]));
        window.localStorage.setItem(domain + "-active", setObject[domain + "-active"]);
    }
}

function setupListeners() {
    document.querySelector("form").addEventListener("change", (e) => {
        let doUpdate = true;
        switch (e.target.id) {
            case "isActive":
                console.log(`${domain} is now ${e.target.checked ? "en" : "dis"}abled`)
                break;
            case "isSingle":
                if (e.target.checked) {
                    document.body.classList.add('singlepage');
                } else {
                    document.body.classList.remove('singlepage');
                }
                console.log(`${domain} is ${e.target.checked ? "single " : "multi-"}paged`);
                break;
            case "useMouse":
                console.log(`${domain} ${e.target.checked ? "will" : "won't"} nav on horizontal scroll`);
                break;
            case "useArrows":
                console.log(`${domain} ${e.target.checked ? "will" : "won't"} nav on arrow keys`);
                break;
            case "match":
                //Validate if match is valid
            case "regex":
                console.log(`${e.target.id}: ${e.target.value}`);
                break;
            case "getbtns":
                console.log(`function getButtons() {\n${e.target.value}\n}`);
                let textarea = document.querySelector(".textarea")
                try {
                    eval(`() => {${e.target.value}}`);
                    textarea.id = ""
                } catch (e) {
                    doUpdate = false;
                    textarea.id = "syntax"
                }
                break;
            default:
                console.error("What the fuck is this??", e.target);
            case "options":
                doUpdate = false;
                break;
        }
        if (doUpdate) {
            updateSettings(e);
        }
    });
    document.getElementById("regex").addEventListener("input", (e) => {
        let length = e.target.value.length;
        if (length == 0) {
            length = e.target.placeholder.length;
        }
        e.target.style.width = (length + 1) + 'ch'
    });
}

function setDomain(newDomain) {
    domain = `${domainRegex.exec(newDomain)[1]}`;
    domainActive = `${domain}-active`
    if (domain == "undefined") {
        //TODO: Disable shit because it's not designed to work without one
        document.getElementById("domain").innerText = "Invalid Site"
    } else {
        document.getElementById("domain").innerText = domain;
        document.getElementById("match").placeholder = `https://${domain}`
    }
}

async function main() {
    try {
        if (isTesting) {
            let newDomain = /^(?:[^:]+:\/\/(?:[^@\/?]+@)?([^:\/?]+))?/.exec(document.location.href)[1];
            // newDomain = "pennyjim.com"
            setDomain(newDomain);
        } else {
            let [tab] = await browser.tabs.query(activeTab);
            setDomain(tab.url);
            let settings = await browser.storage.local.get([domain, domainActive]);
            settings.length = Object.keys(settings).length
            
            if (settings.length == 0) { return; }
            domainExists = true;
            if (settings.length != 2) {
                handleError(new Error(`Expected 2 results. Got ${settings.length}`));
                return;
            }

            for (const [key, value] of Object.entries(settings[domain])) {
                console.log
                let item = document.getElementById(key);
                item.checked = value;
                item.value = value;
            }
        }
    } catch (error) {
        handleError(error);
    }
}

setupListeners();
main();

}) ();