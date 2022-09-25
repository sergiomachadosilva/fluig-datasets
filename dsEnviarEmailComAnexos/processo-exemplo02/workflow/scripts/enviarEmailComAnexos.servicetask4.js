function servicetask4(attempt, message) {
	
	try {

		var constraints = [];
		var anexos = [];
		var destinatario = hAPI.getCardValue("emailDestinatario");
		var assunto = hAPI.getCardValue("assuntoEmail");
		var conteudo = hAPI.getCardValue("corpoEmail");
		var textoPlano = hAPI.getCardValue("formatEmail") == "on" ? true : false;
		
		
		
		// Adiciona anexo Registro de nascimento
		var anexoRegNascFile = String(hAPI.getCardValue("fnRegistroNascimento"));
		var anexoRegNascDesc = String(hAPI.getCardValue("fdRegistroNascimento"));
		
		// Verifica se o campo esta preenchido
		if (anexoRegNascFile) {
			var objetoAnexo = documentoDto(anexoRegNascDesc)
			// Verifica se o documento existe
			if (objetoAnexo) {
				// Se existir, adiciona a propriedade descArquivo e adiciona o objeto no array de anexos
				objetoAnexo.descArquivo = "Registro de Nascimento" + obterExtensao(objetoAnexo.nomeArquivo);
				anexos.push(objetoAnexo)
			}
		}


		// Adiciona anexo CPF
		var anexoCpfFile = String(hAPI.getCardValue("fnCpf"));
		var anexoCpfDesc = String(hAPI.getCardValue("fdCpf"));
		
		// Verifica se o campo esta preenchido
		if (anexoCpfFile) {
			var objetoAnexo = documentoDto(anexoCpfDesc)
			// Verifica se o documento existe
			if (objetoAnexo) {
				// Se existir, adiciona a propriedade descArquivo e adiciona o objeto no array de anexos
				objetoAnexo.descArquivo = "CPF" + obterExtensao(objetoAnexo.nomeArquivo);
				anexos.push(objetoAnexo)
			}
		}


		// Adiciona anexo Foto
		var anexoFotoFile = String(hAPI.getCardValue("fnFoto"));
		var anexoFotoDesc = String(hAPI.getCardValue("fdFoto"));
		
		// Verifica se o campo esta preenchido
		if (anexoFotoFile) {
			var objetoAnexo = documentoDto(anexoFotoDesc)
			// Verifica se o documento existe
			if (objetoAnexo) {
				// Se existir, adiciona a propriedade descArquivo e adiciona o objeto no array de anexos
				objetoAnexo.descArquivo = "Foto" + obterExtensao(objetoAnexo.nomeArquivo);
				anexos.push(objetoAnexo)
			}
		}
		
			
		// Percorre a tabela pai e filho
		var indexes = hAPI.getChildrenIndexes("tblDocumentos");
		
		for (var i = 0; i < indexes.length; i++) {
			var enviarEmailArquivo = String(hAPI.getCardValue("documentoEmail___" + indexes[i]));
			var anexoDesc = String(hAPI.getCardValue("fdDocumento___" + indexes[i]));
			var descricao = String(hAPI.getCardValue("documentoDesc___" + indexes[i]));
		
			// Verifica se o campo checkbox da tabela pai e filho esta marcado
			if(enviarEmailArquivo){
				var objetoAnexo = documentoDto(anexoDesc)
				// Verifica se o documento existe
				if (objetoAnexo) {
					// Se existir, adiciona a propriedade descArquivo e adiciona o objeto no array de anexos
					objetoAnexo.descArquivo = (descricao + obterExtensao(objetoAnexo.nomeArquivo));
					anexos.push(objetoAnexo)
				}
			}
		}
		
 
		constraints.push(DatasetFactory.createConstraint("nomeRemetente", "Empresa XPTO", null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("destinatario", destinatario, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("assunto", assunto, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("conteudo", conteudo, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("textoPlano", textoPlano, null, ConstraintType.MUST));
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

