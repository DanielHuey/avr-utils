const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pro = require("child_process");
const {
    currentPlatform,
    downloadsUrl,
    ends,
    thisWorkspace,
    changeWorkspace,
    anInnerDir,
    toolchainDir,
    dataObject,
    currentExtension,
    sendCursorTo,
} = require("../utils");
const { resetIncludeDir } = require("../providers/documentLinkProvider");
const { selectedDevice, spinCompileButton } = require("../init");

async function compileProject() {
    if (currentExtension() == ".h") return;
    vscode.workspace.saveAll();
    if (!vscode.window.activeTextEditor.document.uri.fsPath.includes(thisWorkspace().uri.fsPath)) {
        await changeWorkspace();
    }
    if (!fs.existsSync(toolchainDir()) || !fs.existsSync(path.join(toolchainDir(), "bin"))) {
        let checkForToolchain = await vscode.window.showErrorMessage(
            `No toolchain found at "${toolchainDir()}".\nDownload a new toolchain?`,
            { modal: true },
            "Yes",
            "Locate Toolchain Directory"
        );
        if (checkForToolchain === "Yes") {
            //proceed to get toolchain
            vscode.commands.executeCommand("avr-utils.getToolchain", currentPlatform, downloadsUrl, ends);
            return;
        }
        if (checkForToolchain === "Locate Toolchain Directory") {
            let toolchain = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectMany: false,
                canSelectFolders: true,
                title: 'Locate the avr8-gnu-toolchain folder that contains a "bin" folder that has the avr-gcc executable.',
                defaultUri: vscode.Uri.file(path.join(os.homedir(), "Documents")),
            });
            if (toolchain) {
                const extension_data = dataObject();
                extension_data.toolchain_directory = toolchain[0].fsPath;
                dataObject(extension_data);
                compileProject();
            }
        }
        resetIncludeDir();
        return;
    }
    if (!selectedDevice() && currentExtension() === ".c") {
        vscode.window.showErrorMessage("Please select a device first");
        return;
    }

    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(path.join(thisWorkspace().uri.fsPath, anInnerDir(), "Debug")));
    } catch (_) {
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(thisWorkspace().uri.fsPath, anInnerDir(), "Debug")));
    }
    const buildCmd = `"${path.join(toolchainDir(), "bin", currentExtension() === ".c" ? "avr-gcc" : "avr-as")}" ${
        currentExtension() === ".c" ? `-x c -mmcu=${selectedDevice()} ` : ""
    } "${vscode.window.activeTextEditor.document.uri.fsPath}"`;
    const mainDotO = `${buildCmd} -o "${path.join(thisWorkspace().uri.fsPath, anInnerDir(), "Debug", `main.o`)}"`;
    const elfCmd = `${buildCmd} -o "${path.join(thisWorkspace().uri.fsPath, anInnerDir(), "Debug", `${thisWorkspace().name}.elf`)}"`;
    const hexCmd = `"${path.join(toolchainDir(), "bin", "avr-objcopy")}" -O ihex -R .eeprom -R .fuse -R .lock -R .signature -R .user_signatures "${path.join(
        thisWorkspace().uri.fsPath,
        anInnerDir(),
        "Debug",
        `${thisWorkspace().name}.elf`
    )}" "${path.join(thisWorkspace().uri.fsPath, anInnerDir(), "Debug", `${thisWorkspace().name}.hex`)}"`;

    spinCompileButton();
    pro.exec(`${mainDotO} && ${elfCmd} && ${hexCmd}`,{windowsHide:true},(err)=>{
        if (err) {
            var msg = err.message.split("\n",2)[1];
            vscode.window.showErrorMessage("Build Failed:\n" + msg);
            var msgsplits = msg.split(":");
            var line = Number(msgsplits[2]);
            var character = Number(msgsplits[3]) - 1;
            var pos = new vscode.Position(line,character);
            sendCursorTo(pos);
        } else {
            vscode.window.showInformationMessage("Build Completed");
        }
        spinCompileButton(false);
    });
    
}

module.exports = compileProject;
