const vscode = require("vscode");
const tar = require("tar");
const decompress = require("decompress");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { get } = require("https");
const { dataObject } = require("../utils");

/**
 * @typedef End
 * @property {string[]} platforms - The platforms that the endpoint accepts
 * @property {string} endpoint - The endpoint to download from
 * @property {string} streamName - The name of the file to stream to
 */

/**
 * @param {NodeJS.Platform} platform - The platform to get the toolchain for.
 * @param {string} downloadsUrl - The url to download the toolchain from
 * @param {End[]} ends - The list of ends
 */
async function getToolchain(platform, downloadsUrl, ends) {
    let newUrl = "";
    let streamName = "";
    ends.forEach((item) => {
        item.platforms.forEach((p) => {
            if (p === platform) {
                newUrl = downloadsUrl + item.endpoint;
                streamName = item.streamName;
            }
        });
    });
    vscode.window.showInformationMessage(`Downloading toolchain for ${platform}\n${newUrl}`);

    get(newUrl, (response) => {
        response.pipe(fs.createWriteStream(path.join(os.homedir(), "Documents",streamName)));
        response.on("end", async () => {
            vscode.window.showInformationMessage("Toolchain downloaded");

            let directory = null;
            let chooseOwnDir = await vscode.window.showInformationMessage(
                'Would you like to save the toolchain to a different folder?\nDefault is "~/Documents/AVR Utils"',
                "Yes",
                "No"
            );
            if (chooseOwnDir === "Yes") {
                directory = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectMany: false,
                    canSelectFolders: true,
                    title: "Select a folder to save the toolchain to.",
                    defaultUri: vscode.Uri.file(path.join(os.homedir(), "Documents")),
                });
            }
            if (!directory) {
                try {
                    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(os.homedir(), "Documents", "AVR Utils", "toolchain")));
                } catch (_) {
                    await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(os.homedir(), "Documents", "AVR Utils", "toolchain")));
                }
                directory = path.join(os.homedir(), "Documents", "AVR Utils", "toolchain");
            } else {
                try {
                    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(directory[0].fsPath, "toolchain")));
                } catch (error) {
                    await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(directory[0].fsPath, "toolchain")));
                }
                console.log(directory[0]);
                directory = path.join(directory[0].fsPath, "toolchain");
            }

            fs.readFile(path.join(__dirname, "..", "storage", "data.json"), "utf8", (err, data) => {
                if (err) throw err;
                const extension_data = JSON.parse(data);
                extension_data.toolchain_directory = directory;
                dataObject(extension_data);
            });

            platform.toString()==="win32"
            ? extractZip(`${path.join(os.homedir(), "Documents",streamName)}`, directory)
            : extractTarball(`${path.join(os.homedir(), "Documents",streamName)}`, directory);
        });
    });
}

/**
 *
 * @param {string} tarball - path to tarball
 * @param {string} directory - directory to extract to
 */
function extractTarball(tarball, directory) {
    fs.createReadStream(tarball)
        .pipe(
            tar.x({
                C: directory,
                strip: 1,
            })
        )
        .on("finish", () => {
            vscode.window.showInformationMessage(`Toolchain extracted to ${directory}`);
            fs.unlinkSync(tarball);
        });
}
/**
 *
 * @param {string} file - path to file
 * @param {string} directory - directory to extract to
 */
function extractZip(file, directory) {
    decompress(file,directory,{strip:1}).then(()=>{
        vscode.window.showInformationMessage(`Toolchain extracted to ${directory}`);
        fs.unlinkSync(file);
    });
}

module.exports = getToolchain;
