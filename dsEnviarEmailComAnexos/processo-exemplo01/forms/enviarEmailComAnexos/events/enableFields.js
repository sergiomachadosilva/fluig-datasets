function enableFields(form) {

	var ATIVIDADE = Number(getValue("WKNumState")) ? Number(getValue("WKNumState")) : INICIO;
	

	if (ATIVIDADE != INICIO) {
		form.setEnabled("emailDestinatario", false);
		form.setEnabled("assuntoEmail", false);
	}
	
}

