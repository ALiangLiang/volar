import * as shared from '@volar/shared';
import type * as vscode from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as vue from 'vscode-vue-languageservice';

export function register(
	connection: vscode.Connection,
	documents: vscode.TextDocuments<TextDocument>,
	noStateLs: vue.DocumentLanguageService,
) {
	connection.onDocumentFormatting(handler => {
		const document = documents.get(handler.textDocument.uri);
		if (!document) return;
		return noStateLs.doFormatting(document, handler.options);
	});
	connection.onFoldingRanges(handler => {
		const document = documents.get(handler.textDocument.uri);
		if (!document) return;
		return noStateLs.getFoldingRanges(document);
	});
	connection.languages.onLinkedEditingRange(handler => {
		const document = documents.get(handler.textDocument.uri);
		if (!document) return;
		return noStateLs.findLinkedEditingRanges(document, handler.position);
	});
	connection.onRequest(shared.GetTagCloseEditsRequest.type, handler => {
		const document = documents.get(handler.textDocument.uri);
		if (!document) return;
		return noStateLs.doTagComplete(document, handler.position);
	});
}
