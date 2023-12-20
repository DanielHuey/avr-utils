const { defaultCompletions } = require("./providers/completionsProvider");
const { includeDirProvider } = require("./providers/documentLinkProvider");
const { definitions } = require("./providers/definitionProvider");

/**@param {import("vscode").ExtensionContext} context */
function _(context) {
    context.subscriptions.push(defaultCompletions, includeDirProvider, definitions);
}

module.exports = _;
