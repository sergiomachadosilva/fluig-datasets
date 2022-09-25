function enableFields(form) {

	var ATIVIDADE = Number(getValue("WKNumState")) ? Number(getValue("WKNumState")) : INICIO;
	

	if (ATIVIDADE != INICIO) {
		form.setEnabled("emailDestinatario", false);
		form.setEnabled("assuntoEmail", false);
		form.setEnabled("formatEmail", false);
		
		// Anexo Registro de Nascimento
		form.setEnabled("fdRegistroNascimento", false);
		form.setEnabled("fnRegistroNascimento", false);
		
		// Anexo CPF
		form.setEnabled("fdCpf", false);
		form.setEnabled("fnCpf", false);
		
		// Anexo Foto
		form.setEnabled("fdFoto", false);
		form.setEnabled("fnFoto", false);
		
		// Bloqueia os campos da tabela pai e filho	
		disableInputTable(form)
	}
	
}

/**
 * Bloqueia os campos da tabela pai e filho
 * @param {object} form Parâmetro obrigatório, formController 
 * @return {void}
 * @author Sérgio Machado
 */
function disableInputTable(form) {
	var indexes = form.getChildrenIndexes("tblDocumentos");
	for (var i = 0; i < indexes.length; i++) {
		form.setEnabled(("documentoDesc___" + indexes[i]), false);
		form.setEnabled(("fdDocumento___" + indexes[i]), false);
		form.setEnabled(("fnDocumento___" + indexes[i]), false);
		form.setEnabled(("documentoEmail___" + indexes[i]), false);
	}
}

