/**
 * Retorna as propriedades de um documento
 * @param {string} fileDescription Parâmetro obrigatório, descrição do documento
 * @return {boolean|object} Caso o documento exista, retorna um objeto com as propriedades {id, versao, nomeArquivo}, 
 caso não exista, retorna falso
 * @author Sérgio Machado
 */
function documentoDto(fileDescription) {
	var docs = hAPI.listAttachments();
	for (var i = 0; i < docs.size(); i++) {
		var doc = docs.get(i);
		if (fileDescription == doc.getDocumentDescription()) {
			return { id: String(doc.getDocumentId()), versao: String(doc.getVersion()), nomeArquivo: String(doc.getPhisicalFile())};
		}
	}
	return false;
}


/**
 * Retorna a extensão de um arquivo
 * @param {string} phisicalFile Parâmetro obrigatório, nome físico do arquivo
 * @return {string}
 * @author Sérgio Machado
 */
function obterExtensao(phisicalFile){
	var extensao = "." + phisicalFile.split(".").pop();
	return extensao;
}


/**
 * Verifica se existe todos os documentos inseridos na tabela pai e filho na aba de anexos
 * @param {string[]} erros Parâmetro obrigatório, array com os erros
 * @return {void}
 * @author Sérgio Machado
 */
function documentosTabelaExiste(erros) {
	var indexes = hAPI.getChildrenIndexes("tblDocumentos");
	for (var i = 0; i < indexes.length; i++) {
		var fileName = String(hAPI.getCardValue("fnDocumento___" + indexes[i]));
		var fileDescription = String(hAPI.getCardValue("fdDocumento___" + indexes[i]));
		
		if (fileName) {
			if (!documentoDto(fileDescription)) {
				erros.push("Não foi encontrado o anexo <b>" + fileName + "</b> da linha " + (i+1));
			}
		}
	}
}
