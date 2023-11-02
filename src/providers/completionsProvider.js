let vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { includeDir } = require("../utils");

function _getCompletions(directory, type) {
    let completions = [];
    let subdirs = []; // list of subdirectories to search for headers in

    function populator() {
        const files = fs.readdirSync(path.join(directory, ...subdirs));
        files.forEach((file) => {
            if (fs.statSync(path.join(directory, ...subdirs, file)).isDirectory()) {
                subdirs.push(file);
                populator();
            } else if (file.endsWith(type)) {
                const c = new vscode.CompletionItem(path.join(...subdirs, file), vscode.CompletionItemKind.File);
                c.insertText = `${path.join(...subdirs, file)}>`;
                completions.push(c);
            }
        });
        if (subdirs.length > 0) {
            subdirs.pop();
        }
    }
    populator();
    return completions;
}

/**
 *
 * @para {string} directory - Directory to search for header files in.
 * @para  {string[]} triggers - List of triggers for enabling the completions e.g `['<','.']`.
 * @para {string} type - type of file to get completions for. Default is `'.h'`
 * @returns {vscode.Disposable}
 */
function _registerCompletions({ directory, triggers = [], regex = /#include\s+<([^>]*)$/ }) {
    return vscode.languages.registerCompletionItemProvider(
        "c",
        {
            provideCompletionItems: (document, position) => {
                // Get the text of the document up to the completion position.
                const text = document.lineAt(position).text.substring(0, position.character);
                const match = text.match(regex);
                if (match) {
                    return {
                        isIncomplete: false,
                        items: _getCompletions(directory, ".h"),
                    };
                }
                return undefined;
            },
        },
        ...triggers
    );
}

module.exports = {
    defaultCompletions: _registerCompletions({ directory: includeDir(), triggers: ["<"] }),
    registerCompletions: _registerCompletions,
};
