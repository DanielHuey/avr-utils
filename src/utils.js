const { platform, homedir } = require("os");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

module.exports = {
    devices: deviceList(),
    headerfile:devicesAndFiles,
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
    sendCursorTo,
    workspaceConfig: vscode.workspace.getConfiguration,
    currentExtension: () => path.extname(vscode.window.activeTextEditor.document.fileName),
};

function devicesAndFiles() {
    let device_and_file = JSON.parse(fs.readFileSync(path.join(__dirname, "storage", "device_and_file.json"), "utf8"));
    return device_and_file
}

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
    if (saveObject) {
        fs.writeFileSync(path.join(__dirname, "storage", "data.json"), JSON.stringify(saveObject), "utf-8");
        return;
    }
    fs.readFile(path.join(__dirname, "storage", "data.json"), "utf8", (err) => {
        if (err) {
            dataObject({
                toolchain_directory: `${path.join(homedir(), "Documents")}`,
            });
            return;
        }
    });
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

/**
 * 
 * @param {vscode.Position} pos 
 */
function sendCursorTo(pos){
    var origin = new vscode.Position(0,0)
    vscode.window.activeTextEditor.selection = new vscode.Selection(origin,origin)
    vscode.commands.executeCommand("cursorMove",{
        to: "down",
        by: "line",
        value: (pos.line-1),
    })
    vscode.commands.executeCommand("cursorMove",{
        to: pos.character<=1 ? "left" : "right",
        by: "character",
        value: pos.character,
    })
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
    return Object.keys(devicesAndFiles());
}
