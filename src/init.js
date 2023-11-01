const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { devices, initWorkspace, thisWorkspace, dataObject } = require("./constants");
const { createLinkProvider } = require("./providers/documentLinkProvider");

let _selectedDevice = null;
let _compileButtonVisible = false;

const compileButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 2);
const selectDeviceButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);

/**
 *
 * @param {vscode.ExtensionContext} context
 */
async function init(context) {
    vscode.commands.registerCommand("avr-utils.selectDevice", selectDevice);

    getWorkspaceRelatedStuff(context);
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
        if (event.removed.length > 0) {
            workspaceNotYetAccessible = true;
            context.subscriptions.pop();
        }
        if (event.added.length > 0) {
            getWorkspaceRelatedStuff(context);
        }
    });

    fs.readFile(path.join(__dirname, "storage", "data.json"), "utf8", (err) => {
        if (err) {
            dataObject({
                toolchain_directory: `${path.join(os.homedir(), "Documents")}`,
            });
            return;
        }
    });

    initButtons();
    buttonVisibility();
}

function initButtons() {
    /*compile button*/
    compileButton.text = `$(debug-start) Build`;
    compileButton.tooltip = "Compile the code for the selected device";
    compileButton.command = "avr-utils.compileProject";

    /*select device button*/
    if (_selectedDevice) {
        selectDeviceButton.text = _selectedDevice;
        selectDeviceButton.tooltip = `Compiling for ${_selectedDevice}`;
        showCompileButton();
    } else {
        selectDeviceButton.text = "Select AVR Device";
    }
    selectDeviceButton.command = "avr-utils.selectDevice";
}

async function buttonVisibility() {
    while (true) {
        await new Promise((r) => {
            setTimeout(r, 500);
        });
        try {
            if (vscode.window.activeTextEditor) {
                if (vscode.window.activeTextEditor.document.languageId !== "c" && vscode.window.activeTextEditor.document.languageId !== "asm") {
                    toggleButtons(true);
                } else {
                    toggleButtons();
                }
            } else {
                toggleButtons(true);
            }
        } finally {
        }
    }
}

function toggleButtons(hide = false) {
    if (hide) {
        if (_compileButtonVisible) compileButton.hide();
        selectDeviceButton.hide();
    } else {
        if (_compileButtonVisible) compileButton.show();
        selectDeviceButton.show();
    }
}

async function selectDevice() {
    const _devOpt = await vscode.window.showQuickPick(devices, {
        placeHolder: "Select AVR Device",
        canPickMany: false,
        title: "List of Available AVR Devices",
    });
    if (_devOpt !== null) {
        _selectedDevice = _devOpt;
        selectDeviceButton.text = _selectedDevice;
        if (_devOpt.endsWith("-asm")) {
            _selectedDevice = _devOpt.substring(0, _devOpt.length - 4);
            selectDeviceButton.text = _selectedDevice + " (Assembly Only)";
        }
        selectDeviceButton.tooltip = `Compiling for ${_selectedDevice}`;
        if (!_compileButtonVisible) showCompileButton();
        //write to project.json
        fs.writeFileSync(path.join(thisWorkspace().uri.fsPath, "project.json"), JSON.stringify({ avrDevice: _selectedDevice }), "utf8");
    }
}
function showCompileButton() {
    _compileButtonVisible = true;
    compileButton.show();
}

async function spinCompileButton() {
    compileButton.text = "$(sync~spin) Building...";
    await new Promise((r) => {
        setTimeout(r, 750);
    });
    compileButton.text = "$(debug-start) Build";
}

function getSelectedDevice() {
    return _selectedDevice;
}

let workspaceNotYetAccessible = true;
/**
 * @param {vscode.ExtensionContext} context
 */
async function getWorkspaceRelatedStuff(context) {
    if (workspaceNotYetAccessible) {
        if (vscode.workspace.workspaceFolders) {
            initWorkspace();
            const c_cpp = require("./c_cpp");
            c_cpp();
            context.subscriptions.push(createLinkProvider(/#include "(.*)"/, thisWorkspace().uri.fsPath));
            if (fs.existsSync(path.join(thisWorkspace().uri.fsPath, "project.json"))) {
                let thejson = JSON.parse(fs.readFileSync(path.join(thisWorkspace().uri.fsPath, "project.json"), "utf8"));
                if (thejson.avrDevice) {
                    _selectedDevice = thejson.avrDevice;
                }
            } else {
                fs.writeFileSync(path.join(thisWorkspace().uri.fsPath, "project.json"), JSON.stringify({ avrDevice: _selectedDevice }), "utf8");
            }
            workspaceNotYetAccessible = false;
        }
    }
}

module.exports = {
    init,
    spinCompileButton: spinCompileButton,
    selectedDevice: getSelectedDevice,
};
