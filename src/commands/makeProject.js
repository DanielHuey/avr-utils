const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
const os = require('os')

async function makeProject() {
    const parentfolder = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        title: 'Select a folder to create your project in.',
        canSelectMany: false,
    })
    if (!parentfolder) return;

    let folderName = await vscode.window.showInputBox({
        placeHolder: 'project_name',
        title: 'Enter a name for your project',
        validateInput: (value) => {
            if (value.length < 3) {
                return 'Please enter a better name for your project.'
            }
        }
    })
    if (!folderName) return;
    folderName = folderName.replace(" ", "_");

    const projectPath = path.join(parentfolder[0].toString(), folderName).replace("file:", "")
    console.log(projectPath)
    try {
        const folderExists = await vscode.workspace.fs.stat(vscode.Uri.file(projectPath));
        if (folderExists) {
            const value = await vscode.window.showErrorMessage(`Folder ${projectPath} already exists. Do you wish to overwrite it?`, 'Yes', 'No')
            if (value === 'Yes') {
                await vscode.workspace.fs.delete(vscode.Uri.file(projectPath), { recursive: true });
            } else {
                return
            }
        }
    } catch (err) { }

    const debugDir = path.join(projectPath, 'Debug')
    const srcDir = path.join(projectPath, 'src')
    console.log(debugDir)
    console.log(srcDir)

    await vscode.workspace.fs.createDirectory(vscode.Uri.file(projectPath));
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(debugDir));
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(srcDir));

    fs.writeFile(path.join(srcDir, "main.c"), `/**
 * main.c
 * 
 * Created: ${new Date().toISOString()}
 * Author: ${os.userInfo().username}
 */

#include <avr/io.h>

int main(void) {
    /* Replace with your application code */
    while(1){
        
    }
}
`, (err) => {
        if (err) throw err
    })

    vscode.window.showInformationMessage('Open newly created Project?', 'Yes', 'No')
        .then((value) => {
            if (value === 'Yes') {
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath))
            }
        })
}

module.exports = makeProject;