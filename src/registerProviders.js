const { defaultCompletions } = require("./providers/completionsProvider");
const { includeDirProvider } = require("./providers/documentLinkProvider");
const { definitions } = require("./providers/definitionProvider");
const { diagnosticsCollection } = require("./providers/diagnosticsProvider");

/**@param {import("vscode").ExtensionContext} context */
function _(context) {
    context.subscriptions.push(defaultCompletions, includeDirProvider, definitions, diagnosticsCollection);
}

module.exports = _;
