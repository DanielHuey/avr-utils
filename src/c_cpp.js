const path = require("path");
const fs = require("fs");
const { thisWorkspace } = require("./utils");

const extJson = {
    unwantedRecommendations: [
        "ms-vscode.cpptools",
    ]
};

/**
 * This function creates a `extensions.json` file inside the `.vscode` folder.
 */
function extensionsJson() {
    const pathtovscode = path.join(thisWorkspace().uri.fsPath, ".vscode");
    // if (!fs.existsSync(pathtovscode)) {
    //     fs.mkdirSync(pathtovscode);
    // }
    if (fs.existsSync(path.join(pathtovscode, "extensions.json"))) {
        const extObj = JSON.parse(fs.readFileSync(path.join(pathtovscode, "extensions.json"), "utf8"));
        if (!extObj.unwantedRecommendations.includes("ms-vscode.cpptools")) extObj.unwantedRecommendations.push("ms-vscode.cpptools");
        fs.writeFileSync(path.join(pathtovscode, "extensions.json"), JSON.stringify(extObj, null, 4));
        return
    }
    else fs.writeFileSync(path.join(pathtovscode, "extensions.json"), JSON.stringify(extJson, null, 4));
}

module.exports = extensionsJson;
