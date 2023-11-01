const path = require("path");
const fs = require("fs");
const { platform } = require("os");
const { includeDir, thisWorkspace, toolchainDir } = require("./constants");

const OS = () => {
    if (platform() === "win32") {
        return "Win32";
    } else if (platform() === "darwin") {
        return "Mac";
    } else {
        return "Linux";
    }
};
const c_cppConfig = {
    configurations: [
        {
            name: `${OS()}`,
            includePath: ["${workspaceFolder}/**", `${includeDir()}/**`],
            defines: [],
            compilerPath: `${path.join(toolchainDir(), "bin", "avr-gcc")}`,
            cStandard: "c17",
            cppStandard: "c++14",
            intelliSenseMode: "${default}",
        },
    ],
    version: 4,
};

/**
 * This function creates a `c_cpp_properties.json` file inside the `.vscode` folder.
 */
function createC_cppConfig() {
    const pathtovscode = path.join(thisWorkspace().uri.fsPath, ".vscode");
    if (!fs.existsSync(pathtovscode)) {
        fs.mkdirSync(pathtovscode);
    }
    fs.writeFileSync(path.join(pathtovscode, "c_cpp_properties.json"), JSON.stringify(c_cppConfig, null, 4));
}

module.exports = createC_cppConfig;
