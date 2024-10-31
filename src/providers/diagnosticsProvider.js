let vscode = require("vscode");

/**
 * 
 * @param {string} fullErrorMessageOutput 
 * @returns {{ file: string, position: vscode.Position, message: string, snippet: string }[]}
 */
function parseErrors(fullErrorMessageOutput) {
    const errorPattern = /(.*):(\d+):(\d+): error: (.*)/;
    const snippetPattern = /(.*)[\n|\r][\n|\r](.*)[\n|\r][\n|\r](.*)/;

    const lines = fullErrorMessageOutput.split('\n');
    const errors = [];
    let currentFile = '';

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(errorPattern);
        if (match) {
            // Extract file, line, and error message
            currentFile = match[1];
            const lineNumber = parseInt(match[2], 10) - 1; // Convert to 0-indexed
            const characterIndex = parseInt(match[3], 10) - 1;
            const message = match[4];

            // Try to get the code snippet on subsequent lines
            const snippetMatch = lines.slice(i + 1, i + 4).join('\n').match(snippetPattern);
            // console.log(snippetMatch)
            // const snippet = snippetMatch ? `${snippetMatch[1]}\n${snippetMatch[2]}\n${snippetMatch[3]}\n` : '';
            const snippet = '';
            var pos = new vscode.Position(lineNumber,characterIndex);

            errors.push({ file: currentFile, position: pos, message, snippet });
        }
    }

    return errors;
}

/**
 * @type {Map<string, Array<vscode.Diagnostic>>}
 */
let filesWithDiagnotics = new Map;

/**
 * @type {vscode.DiagnosticCollection}
 */
let globalDiagnostics = vscode.languages.createDiagnosticCollection('AVR Utils');

/**
 * 
 * @param {string} key 
 * @param {vscode.Diagnostic} diagnostic 
 */
function pushDiagnostic(key, diagnostic) {
    let oldvalue = filesWithDiagnotics.get(key);
    if (oldvalue) {
        oldvalue.push(diagnostic);
        filesWithDiagnotics.set(key, oldvalue);
    } else {
        filesWithDiagnotics.set(key, [diagnostic]);
    }
}

/**
 * Adds diagnostics to the "Problems tab"
 * @param {{ file: string, position: vscode.Position, message: string, snippet: string }[]} errors 
 */
function addDiagnostics(errors) {
    filesWithDiagnotics.clear();

    errors.forEach(error => {
        const range = new vscode.Range(error.position, error.position); // Adjust the range as needed

        const diagnostic = new vscode.Diagnostic(range, error.message, vscode.DiagnosticSeverity.Error);
        diagnostic.source = 'AVR Utils';
        pushDiagnostic(error.file, diagnostic);
    });
    filesWithDiagnotics.forEach((value, key) => {
        const uri = vscode.Uri.file(key);
        globalDiagnostics.set(uri, value);
    });
}

/**
 * @param {string} fullErrorMessage 
 */
function generateDiagnostics(fullErrorMessage) {
    clearDiagnostics();
    let parse = parseErrors(fullErrorMessage);
    addDiagnostics(parse);
}

function clearDiagnostics() {
    globalDiagnostics.clear();
}

module.exports = {
    generateDiagnostics,
    clearDiagnostics,
}
