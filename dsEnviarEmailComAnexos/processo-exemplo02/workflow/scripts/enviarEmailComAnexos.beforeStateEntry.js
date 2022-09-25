function beforeStateEntry(sequenceId) {

	try {
		var erros = [];

		if (sequenceId == APROVACAO_2) {

			var anexoRegNascFile = String(hAPI.getCardValue("fnRegistroNascimento"));
			var anexoRegNascDesc = String(hAPI.getCardValue("fdRegistroNascimento"));

			var anexoCpfFile = String(hAPI.getCardValue("fnCpf"));
			var anexoCpfDesc = String(hAPI.getCardValue("fdCpf"));

			var anexoFotoFile = String(hAPI.getCardValue("fnFoto"));
			var anexoFotoDesc = String(hAPI.getCardValue("fdFoto"));

			if (anexoRegNascFile) {
				if (!documentoDto(anexoRegNascDesc)) {
					erros.push("Não foi encontrado o anexo <b>" + anexoRegNascFile + "</b>");
				}
			}

			if (anexoCpfFile) {
				if (!documentoDto(anexoCpfDesc)) {
					erros.push("Não foi encontrado o anexo <b>" + anexoCpfFile + "</b>");
				}
			}

			if (anexoFotoFile) {
				if (!documentoDto(anexoFotoDesc)) {
					erros.push("Não foi encontrado o anexo <b>" + anexoFotoFile + "</b>");
				}
			}
			
			// Valida os documentos inseridos na tabela pai e filho se eles existem na aba de anexos
			documentosTabelaExiste(erros);
		}

		// Se existir alguma mensagem no array de erros, lança uma exceção
		if (erros.length) {
			throw formatarErros(erros);
		}

	} catch (err) {
		throw ("<br/> function <b>" + arguments.callee.name + "</b> => " + err.toString());
	}
}

/**
 * Formata os erros 
 * @param {String[]} erros Parâmetro obrigatório, array com os erros
 * @returns {String} - Retorna uma string contendo todos os erros dentro de uma tag ul
 * @author Sérgio Machado
 */
function formatarErros(erros) {
	var strErros = '';
	for (var i = 0; i < erros.length; i++) {
		strErros += '<li style="margin-bottom: 10px;">' + erros[i] + '</li>';
	}
	var listErros = '<ul style="padding-left: 17px;color: red;list-style: disc;">' + strErros + '</ul><br/>';
	return 'Favor informar os anexos obrigatórios:<br/><br/>' + listErros;
}