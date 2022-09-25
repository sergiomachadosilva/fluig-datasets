function validateForm(form) {

	var ATIVIDADE = Number(getValue("WKNumState")) ? Number(getValue("WKNumState")) : INICIO;
	var PROX_ATIVIDADE = Number(getValue("WKNextState"))
	var TAREFA_COMPLETA = (getValue("WKCompletTask") == "true");

	if (!TAREFA_COMPLETA || ATIVIDADE == PROX_ATIVIDADE) {
		return;
	}


	try {
		
		var erros = [];

		if (ATIVIDADE == INICIO) {
			var emailDestinatario = String(form.getValue("emailDestinatario"));
			var assunto = String(form.getValue("assuntoEmail"));
			var corpoEmail = org.jsoup.Jsoup.parse(String(form.getValue("corpoEmail")));
			var body = String(corpoEmail.body().text()); // Pega somente o conteúdo texto da tag body
			var anexoRegNasc = String(form.getValue("fnRegistroNascimento"))
			
		
			if (!validarEmail(emailDestinatario)) {
				erros.push("Informe um e-mail válido para o destinatário");
			}

			if (!assunto) {
				erros.push("Informe o assunto do e-mail");
			}else if(assunto.length < 10){
				erros.push("O assunto do e-mail deve conter no mínimo 10 caracteres");
			}
			
			if (!body) {
				erros.push("Informe o conteúdo para o corpo do e-mail");
			} else if(body.length < 10){
				erros.push("O corpo do e-mail deve conter no mínimo 10 caracteres");
			}
			
			if(!anexoRegNasc){
				erros.push("Informe o anexo Registro de Nascimento");
			}
			
			// Valida a tabela pai e filho
			validarInputsTable(form, erros)
		}
		

		// Se existir alguma mensagem no array de erros, lança uma exceção
		if (erros.length) {
			throw formatarErros(erros);
		}

	} catch (err) {
		throw err
	}
}

/**
 * Verifica se um endereço de e-mail é válido
 * @param {string} email Parâmetro obrigatório, endereço de email
 * @return {boolean} Retorna verdadeiro caso o e-mail seja válido, caso contrário, retorna falso
 * @author Sérgio Machado
 */
function validarEmail(email) {
	var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
	if (email == '' || !er.test(email)) {
		return false;
	} else {
		return true
	}
}

/**
 * Valida os campos da tabela pai e filho
 * @param {object} form Parâmetro obrigatório, formController 
 * @param {String[]} erros Parâmetro obrigatório, array com os erros
 * @return {void}
 * @author Sérgio Machado
 */
function validarInputsTable(form, erros) {
	var indexes = form.getChildrenIndexes("tblDocumentos");
	for (var i = 0; i < indexes.length; i++) {
		var documentoDesc = String(form.getValue("documentoDesc___" + indexes[i]));
		
		if(!documentoDesc){
			erros.push("Informe o campo <b>Descrição</b> na linha " + (i+1));
		}else if(descRepetida(form, indexes[i], documentoDesc)){
			erros.push("Descrição duplicada na linha " + (i+1));
		}
			
		if(campoVazio(form, ("fnDocumento___" + indexes[i]))){
			erros.push("Informe o campo <b>Documento</b> na linha " + (i+1));
		}
	}
}


/**
 * Verifica se a descrição esta repetido na tabela Pai e Filho
 * @param {object} form Parâmetro obrigatório, objeto formController
 * @param {(String|Number)} row Parâmetro obrigatório, índice da tabela pai e filho
 * @param {String} descricao Parâmetro obrigatório
 * @returns {number} Retorna o índice da tabela que tem a descrição repetida
 * @author Sérgio Machado
 */
function descRepetida(form, row, descricao) {
	var indexes = form.getChildrenIndexes("tblDocumentos");
	for (var i = 0; i < indexes.length; i++) {
		var rowDesc = String(form.getValue("documentoDesc___" + indexes[i]));
		if ((descricao == rowDesc) && (row != indexes[i])) {
			return Number(indexes[i]);
		}
	}
}

/**
 * Formata os erros 
 * @param {String[]} erros Parâmetro obrigatório, array com os erros
 * @returns {String} - Retorna uma string contendo todos os erros dentro de uma tag ul
 * @author Sérgio Machado
 */
function formatarErros(erros) {
	var strErros = "";
	for (var i = 0; i < erros.length; i++) {
		strErros += "<li style='margin-bottom: 10px;'>" + erros[i] + "</li>";
	}
	var listErros = "<ul style='padding-left: 17px;color: red;list-style: disc;'>" + strErros + "</ul><br/>";
	return "Favor informar os campos obrigatórios:<br/><br/>" + listErros;
}


function campoVazio(form, fieldname) {
	if ((form.getValue(fieldname) == null) || (form.getValue(fieldname) == undefined) || (form.getValue(fieldname).trim() == "")) {
		return true;
	}
	return false;
} 