function servicetask4(attempt, message) {
	
	try {

		var constraints = [];
		var anexos = [];
		var destinatario = hAPI.getCardValue("emailDestinatario");
		var assunto = hAPI.getCardValue("assuntoEmail");
		var conteudo = hAPI.getCardValue("corpoEmail");
		
		// Lista com os anexos presentes na solicitação
 		var docs = hAPI.listAttachments();
 						
		for (var i = 0; i < docs.size(); i++) {
		    var doc = docs.get(i);
		    anexos.push({ id: Number(doc.getDocumentId()), versao: Number(doc.getVersion()), nomeArquivo: String(doc.getPhisicalFile())});
		}
 
		constraints.push(DatasetFactory.createConstraint("nomeRemetente", "Empresa XPTO", null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("destinatario", destinatario, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("assunto", assunto, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("conteudo", conteudo, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("anexos", JSON.stringify(anexos), null, ConstraintType.MUST));

		var dataset = DatasetFactory.getDataset("dsEnviarEmailComAnexos", null, constraints, null);
		
		var retorno = dataset.getValue(0, "STATUS");
		
		if(retorno != "OK"){
			throw retorno;
		}
 
	} catch (err) {
		throw ("function " + arguments.callee.name + " => " + err.toString());
	}
	
}