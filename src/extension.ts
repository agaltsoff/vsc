// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { isUndefined } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//	console.log('Congratulations, your extension "icrequestembracer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.icRequestEmbracer', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello VS Code!');

		// Do something useful
		embraceRequest(vscode.window.activeTextEditor);

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function embraceRequest(e?: vscode.TextEditor) {

	if( isUndefined(e) ) {	return; }

	let d: vscode.TextDocument= e.document;

	let edits= new Array();

	let openBrace: string= '#Область ТекстЗапроса';
	let closeBrace: string= '#КонецОбласти';
	let isOpened: boolean= false;

	for (let lineNo = 0; lineNo < d.lineCount; lineNo++) {
		
		let prvLine: vscode.TextLine | undefined= (lineNo === 0 ? undefined : d.lineAt(lineNo - 1));
		let curLine: vscode.TextLine= d.lineAt(lineNo);
		let nxtLine: vscode.TextLine | undefined= (lineNo === d.lineCount - 1 ? undefined : d.lineAt(lineNo + 1));

		if(curLine.text.toUpperCase().includes('"ВЫБРАТЬ') && (isUndefined(prvLine) || prvLine.text !== openBrace)) {
			edits.push([lineNo, openBrace + '\n']);
			isOpened= true;
		}

		if(isOpened && curLine.text.toUpperCase().includes('";') && (isUndefined(nxtLine) || nxtLine.text !== closeBrace)) {
			edits.push([lineNo + 1, closeBrace + '\n']);
			isOpened= false;
		}

	}

	e.edit((ee: vscode.TextEditorEdit) => {

		edits.forEach((te, editNo: number, tes) => {
			ee.insert(new vscode.Position(te[0], 0), te[1]);

		});
	});

}


