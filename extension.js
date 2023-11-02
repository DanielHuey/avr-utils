// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// eslint-disable-next-line no-unused-vars
const vscode = require('vscode');
const { init } = require('./src/init');
const { defaultCompletions } = require('./src/providers/completionsProvider')
const { includeDirProvider } = require('./src/providers/documentLinkProvider')
const { definitions } = require('./src/providers/definitionProvider');
const registerCommands = require('./src/registerCommands');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	registerCommands(); // initialize the commands
	context.subscriptions.push(
		defaultCompletions,
		includeDirProvider,
		definitions
	)
	init(context);

	console.log('"avr-utils" is now active!');



}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
