// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// eslint-disable-next-line no-unused-vars
const vscode = require('vscode');
const { init } = require('./src/init');
const { defaultCompletions } = require('./src/providers/completionsProvider')
const { includeDirProvider } = require('./src/providers/documentLinkProvider')
const registerCommands = require('./src/registerCommands')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	registerCommands(); // initialize the commands
	init(context);

	console.log('Congratulations, your extension "avr-utils" is now active!');


	context.subscriptions.push(
		defaultCompletions,
		includeDirProvider
	)

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
