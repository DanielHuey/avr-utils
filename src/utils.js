const { platform } = require("os");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

module.exports = {
    devices: deviceList(),
    currentPlatform: platform(),
    downloadsUrl: "https://ww1.microchip.com/downloads/aemDocuments/documents/DEV/ProductDocuments/SoftwareTools/",
    ends: ends(),
    dataObject,
    thisWorkspace: getThisWorkspace,
    changeWorkspace,
    initWorkspace,
    includeDir,
    anInnerDir,
    toolchainDir,
    /** @type {Map<string, vscode.Location[]>} */
    previousDefinitions: new Map(),
};

let _thisWorkspace = null;
function initWorkspace() {
    _thisWorkspace = vscode.workspace.workspaceFolders[0];
}
/**@returns {vscode.WorkspaceFolder} Returns the active WorkspaceFolder */
function getThisWorkspace() {
    return _thisWorkspace;
}
async function changeWorkspace() {
    const workspace = await vscode.window.showWorkspaceFolderPick({
        placeHolder: "Select preferred workspace",
    });
    _thisWorkspace = workspace;
}
/** The `data.json` object
 * @param {Object} saveObject
 */
function dataObject(saveObject = null) {
    if (saveObject !== null) {
        fs.writeFileSync(path.join(__dirname, "storage", "data.json"), JSON.stringify(saveObject), "utf-8");
        return;
    }
    return JSON.parse(fs.readFileSync(path.join(__dirname, "storage", "data.json"), "utf8"));
}
/** Toolchain Directory */
function toolchainDir() {
    return dataObject().toolchain_directory;
}
function includeDir() {
    return path.join(toolchainDir(), "avr", "include");
}

function anInnerDir() {
    let dir = "";
    if (fs.existsSync(path.join(getThisWorkspace().uri.fsPath, getThisWorkspace().name))) {
        dir = getThisWorkspace().name;
    }
    return dir;
}

function ends() {
    return [
        {
            platforms: ["win32"],
            endpoint: "avr8-gnu-toolchain-3.7.0.1796-win32.any.x86_64.zip",
            streamName: "toolchain.zip",
        },
        {
            platforms: ["linux", "freebsd", "openbsd", "netbsd", "cygwin"],
            endpoint: "avr8-gnu-toolchain-3.7.0.1796-linux.any.x86_64.tar.gz",
            streamName: "toolchain.tar.gz",
        },
        {
            platforms: ["darwin"],
            endpoint: "avr8-gnu-toolchain-3.7.0.1796-darwin.any.x86_64.tar.gz",
            streamName: "toolchain.tar.gz",
        },
    ];
}

function deviceList() {
    return [
        "at43usb320",
        "at43usb355",
        "at76c711",
        "at86rf401",
        "at90c8534",
        "at90can128",
        "at90can32",
        "at90can64",
        "at90pwm1",
        "at90pwm161",
        "at90pwm2",
        "at90pwm216",
        "at90pwm2b",
        "at90pwm3",
        "at90pwm316",
        "at90pwm3b",
        "at90s1200-asm",
        "at90s2313",
        "at90s2323",
        "at90s2333",
        "at90s2343",
        "at90s4414",
        "at90s4433",
        "at90s4434",
        "at90s8515",
        "at90s8535",
        "at90scr100",
        "at94K",
        "ata5272",
        "ata5505",
        "ata5702m322",
        "ata5782",
        "ata5790",
        "ata5790n",
        "ata5831",
        "ata6285",
        "ata6286",
        "ata6289",
        "ata6612c",
        "ata6613c",
        "ata6614q",
        "ata6616c",
        "ata6617c",
        "ata664251",
        "ata664251",
        "atmega103",
        "atmega128",
        "atmega1280",
        "atmega1281",
        "atmega1284",
        "atmega1284",
        "atmega1284p",
        "atmega128rfa1",
        "atmega128rfr2",
        "atmega128rfr2",
        "atmega16",
        "atmega161",
        "atmega162",
        "atmega163",
        "atmega164a",
        "atmega164p",
        "atmega164pa",
        "atmega165",
        "atmega165a",
        "atmega165p",
        "atmega165pa",
        "atmega168",
        "atmega168a",
        "atmega168p",
        "atmega168pa",
        "atmega16a",
        "atmega16a",
        "atmega2560",
        "atmega2561",
        "atmega2564rfr2",
        "atmega256rfr2",
        "atmega32",
        "atmega32a",
        "atmega323",
        "atmega324a",
        "atmega324p",
        "atmega324pa",
        "atmega325",
        "atmega3250",
        "atmega3250a",
        "atmega3250p",
        "atmega3250pa",
        "atmega325a",
        "atmega325p",
        "atmega328",
        "atmega328p",
        "atmega406",
        "atmega48",
        "atmega48a",
        "atmega48p",
        "atmega48pa",
        "atmega48pb",
        "atmega640",
        "atmega644",
        "atmega644a",
        "atmega644p",
        "atmega644pa",
        "atmega644rfr2",
        "atmega64",
        "atmega64a",
        "atmega64a",
        "atmega64c1",
        "atmega64hve",
        "atmega64hve2",
        "atmega64m1",
        "atmega8",
        "atmega8a",
        "atmega8hva",
        "atmega88",
        "atmega88a",
        "atmega88p",
        "atmega88pa",
        "atmega88pb",
        "atmega8515",
        "atmega8535",
        "atxmega128a1",
        "atxmega128a1u",
        "atxmega128a3",
        "atxmega128a3u",
        "atxmega128a4u",
        "atxmega128b1",
        "atxmega128b3",
        "atxmega128c3",
        "atxmega128d3",
        "atxmega128d4",
        "atxmega192a3",
        "atxmega192a3u",
        "atxmega192c3",
        "atxmega192d3",
        "atxmega256a3",
        "atxmega256a3b",
        "atxmega256a3bu",
        "atxmega256a3u",
        "atxmega256c3",
        "atxmega256d3",
        "atxmega32a4",
        "atxmega32a4u",
        "atxmega32c3",
        "atxmega32c4",
        "atxmega32d3",
        "atxmega32d4",
        "atxmega32e5",
        "atxmega384c3",
        "atxmega384d3",
        "atxmega64a1",
        "atxmega64a1u",
        "atxmega64a3",
        "atxmega64a3u",
        "atxmega64a4u",
        "atxmega64b1",
        "atxmega64b3",
        "atxmega64c3",
        "atxmega64d3",
        "atxmega64d4",
        "atxmega8e5",
        "attiny10",
        "attiny11-asm",
        "attiny12-asm",
        "attiny13",
        "attiny13",
        "attiny13a",
        "attiny15-asm",
        "attiny1634",
        "attiny167",
        "attiny20",
        "attiny22",
        "attiny2313",
        "attiny2313a",
        "attiny25",
        "attiny26",
        "attiny261",
        "attiny261a",
        "attiny28-asm",
        "attiny40",
        "attiny4313",
        "attiny43u",
        "attiny44",
        "attiny44a",
        "attiny441",
        "attiny45",
        "attiny461",
        "attiny461a",
        "attiny48",
        "attiny828",
        "attiny84",
        "attiny84a",
        "attiny841",
        "attiny85",
        "attiny861",
        "attiny861a",
        "attiny87",
        "attiny88",
        "m3000",
    ];
}
