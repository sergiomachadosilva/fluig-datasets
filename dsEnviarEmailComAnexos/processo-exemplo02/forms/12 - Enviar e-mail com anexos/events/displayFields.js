function displayFields(form, customHTML) {
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	try {
		var ATIVIDADE = Number(getValue("WKNumState")) ? Number(getValue("WKNumState")) : INICIO;
		var MODO = form.getFormMode();
		var customJS = "<script>";


		customJS += "function getAtividade(){ return '" + ATIVIDADE + "'};";
		customJS += "function getMode(){ return '" + MODO + "'};";
		customJS += "</script>"
		customHTML.append(customJS)
		

	} catch (err) {
		throw "function " + arguments.callee.name + " => " + err.toString();
	}
}

