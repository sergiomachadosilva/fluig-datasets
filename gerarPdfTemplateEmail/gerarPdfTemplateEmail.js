function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();

	try {

		dataset.addColumn('documentId');
		
		var templateCodigo = "PDF_meuTemplate"; // Código do template de E-Mail que foi cadastrado no Fluig
		var templateArquivo = "templateTeste.html"; // Arquivo HTML do template
		var pastaGed = 201; // ID da pasta no GED onde será armazenado o PDF gerado
		var nomeArquivoGed = "Lista_de_Estados.pdf"; // Nome do arquivo que será salvo


		// Obtém a lista de parâmetros
		var parametros = getParametros();
		
		// Passa a lista de parâmetros para a função responsável por renderizar o template de E-mail
		var strHtml = renderizarTemplateEmail(parametros, templateCodigo, null, templateArquivo);
		
		// Passa a string do HTML para a função criar o PDF e retornar seu base64 
		var strBase64 = gerarPdf(strHtml);
		
		// Passa a string base64 para a função abaixo salvar no GED
		var documentId = salvarArquivo(strBase64, nomeArquivoGed, pastaGed);

		// Retorna Id do documento que foi salvo
		dataset.addRow([documentId]);

	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([("function " + arguments.callee.name + " => " + ex.toString())]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}


/**
 * Monta lista de parâmetros a serem renderizados no no template
 * @return {hashMap}
 * @author Sérgio Machado
 */
function getParametros(){
	try {
		//Monta mapa com parâmetros do template
		var parametros = new java.util.HashMap();
		parametros.put("logo", diretorioFluig()+"/repository/wcmdir/wcm/tenants/wcm/custom/assets/head_background.gif");

		var estados = new java.util.ArrayList();
		estados.add({nome: "Acre", sigla: "AC"});
		estados.add({nome: "Alagoas", sigla: "AL"});
		estados.add({nome: "Amapá", sigla: "AP"});
		estados.add({nome: "Amazonas", sigla: "AM"});
		estados.add({nome: "Bahia", sigla: "BA"});
		estados.add({nome: "Ceará", sigla: "CE"});
		estados.add({nome: "Distrito Federal", sigla: "DF"});
		estados.add({nome: "Espírito Santo", sigla: "ES"});
		estados.add({nome: "Goiás", sigla: "GO"});
		estados.add({nome: "Maranhão", sigla: "MA"});
		estados.add({nome: "Mato Grosso", sigla: "MT"});
		estados.add({nome: "Mato Grosso do Sul", sigla: "MS"});
		estados.add({nome: "Minas Gerais", sigla: "MG"});
		estados.add({nome: "Pará", sigla: "PA"});
		estados.add({nome: "Paraíba", sigla: "PB"});
		estados.add({nome: "Paraná", sigla: "PR"});
		estados.add({nome: "Pernambuco", sigla: "PE"});
		estados.add({nome: "Piauí", sigla: "PI"});
		estados.add({nome: "Rio de Janeiro", sigla: "RJ"});
		estados.add({nome: "Rio Grande do Norte", sigla: "RN"});
		estados.add({nome: "Rio Grande do Sul", sigla: "RS"});
		estados.add({nome: "Rondônia", sigla: "RO"});
		estados.add({nome: "Roraima", sigla: "RR"});
		estados.add({nome: "Santa Catarina", sigla: "SC"});
		estados.add({nome: "São Paulo", sigla: "SP"});
		estados.add({nome: "Sergipe", sigla: "SE"});
		estados.add({nome: "Tocantins", sigla: "TO"});
		parametros.put("estados", estados);
		
		parametros.put("nome", "Sérgio");
		parametros.put("sobrenome", "Machado");
		
		return parametros;
		
	} catch (ex) {
		throw "function " + arguments.callee.name + " => " + ex.toString()
	}	
}


/**
 * Processa template de E-Mail
 * @param {hashMap} parametros Parâmetro obrigatório, lista de parâmetros
 * @param {string} tplCodigo Parâmetro obrigatório, Código do template
 * @param {?string} tplIdioma Parâmetro opcional, Idioma do template, caso não informado o valor padrão será 'pt_BR'
 * @param {string} tplArquivo Parâmetro obrigatório, Nome do arquivo html do template com a extesão
 * @return {string} Retorna a string do HTML renserizado
 * @author Sérgio Machado
 */
function renderizarTemplateEmail(parametros, tplCodigo, tplIdioma, tplArquivo) {
	try {
		
		if(!tplIdioma){
			tplIdioma = "pt_BR"
		}

		// Importa class da biblioteca Freemarker
		importClass(Packages.freemarker.template.Template);

		// Diretório padrão da empresa
		var diretorioPadrao = fluigAPI.getTenantService().getTenantData(["dirDefault"]).get("dirDefault")
		var templateCaminho = diretorioPadrao + "/templates/tplmail/" + tplCodigo + "/" + tplIdioma + "/" + tplArquivo;
		var templateHtml = new java.io.File(templateCaminho)

		// Ler o arquivo HTML a partir do objeto 'templateHtml'.
		var reader = new java.io.FileReader(templateHtml)

		// Objeto que representa o HTML que será preenchido com dados dinâmicos
		var template = new Template(null, reader)

		// Variável usada para capturar o resultado do processamento do modelo HTML
		var writer = new java.io.StringWriter();

		/* Executa método process, passando o mapa parametros e o writer como parâmetros 
		 * Isso processa o modelo HTML, preenchendo-o com os valores do mapa parametros
		 */
		template.process(parametros, writer);

		/* O retorno será o resultado do processamento do modelo HTML
		 * que contém uma string que representa o HTML final com todos os valores preenchidos
		 */
		return writer.toString();

	} catch (ex) {
		throw "function " + arguments.callee.name + " => " + ex.toString()
	}
}



/**
 * Converte string html em um arquivo PDF usando a bibloteca  itextpdf
 * @param {string} strHtml Parâmetro obrigatório, string do html
 * @return {string} Retorna base64 do pdf
 * @author Sérgio Machado
 */
function gerarPdf(strHtml) {
	try {
		// Importa as classes
		importClass(Packages.com.itextpdf.text.Document);
		importClass(Packages.com.itextpdf.text.PageSize);
		importClass(Packages.com.itextpdf.text.Rectangle);
		importClass(Packages.com.itextpdf.text.pdf.PdfWriter);
		importClass(Packages.com.itextpdf.tool.xml.XMLWorkerHelper);
		importClass(Packages.java.io.ByteArrayOutputStream);
		importClass(Packages.java.util.Base64);

		// Define as dimensões da página para o tamanho A4
		var pageSize = new Rectangle(PageSize.A4);
		
		// Cria um novo documento com as dimensões da página A4 e margens de 36 pontos
		var document = new Document(pageSize, 36, 36, 36, 36);

		// Cria um novo stream de saída para capturar o conteúdo do PDF
		var byteArrayOutputStream = new ByteArrayOutputStream();

		// Cria o arquivo PDF
		var writer = PdfWriter.getInstance(document, byteArrayOutputStream);

		// Abre o documento para escrita
		document.open();

		// Converte a string HTML em um array de bytes 
		var is = new java.io.ByteArrayInputStream(new java.lang.String(strHtml).getBytes());
		
		// Converter o HTML em PDF
		XMLWorkerHelper.getInstance().parseXHtml(writer, document, is);

		// Fecha o documento
		document.close();

		// Codifica o conteúdo do PDF em base64 e o retorna como uma string
		var pdfAsBase64 = Base64.getEncoder().encodeToString(byteArrayOutputStream.toByteArray());

		return pdfAsBase64;

	} catch (ex) {
		throw "function " + arguments.callee.name + " => " + ex.toString()
	}
}


/**
 * Salva o documento no GED
 * @param {string} stringBase64 Parâmetro obrigatório, base64 do arquivo
 * @param {string} description Parâmetro obrigatório, descrição do arquivo com a extensão
 * @param {number} ParentDocumentId Parâmetro obrigatório, Id da pasta onde será salvo o arquivo
 * @return {number} Retorna o id do documento que foi criado no GED
 * @author Sérgio Machado
 */
function salvarArquivo(stringBase64, description, parentDocumentId) {
	try {

		var docDto = docAPI.newDocumentDto();
		docDto.setParentDocumentId(parentDocumentId);
		docDto.setDocumentTypeId("");
		docDto.setDocumentDescription(description);
		docDto.setVersion(1000);

		var attachArray = new java.util.ArrayList();
		var attach = docAPI.newAttachment();

		// Tranforma a string base64 em um byteArray
		var byteArray = java.util.Base64.getDecoder().decode(new String(stringBase64));

		//Arquivo físico do documento
		attach.setFileName(description);
		attach.setFilecontent(byteArray);
		attach.setPrincipal(true);
		attach.setAttach(false);

		// Adiciona o arquivo físico ao array de anexos
		attachArray.add(attach);

		var doc = docAPI.createDocument(docDto, attachArray, null, null, null);

		return doc.getDocumentId()

	} catch (ex) {
		throw "function " + arguments.callee.name + " => " + ex.toString()
	}
}


/**
 * Retorna caminho do diretório de instalação do fluig
 * @return {string} 
 * @author Sérgio Machado
 */
function diretorioFluig(){
	try {
		// Retorna o caminho [PASTA DE INSTALAÇÃO]\appserver
		var diretorioAtual = new java.io.File(".").getCanonicalFile();
		
		// Retrocede um nível na estrutura de pastas
        var diretorioAtualParent = diretorioAtual.getParentFile();
        
        // Retorna o caminho completo da pasta onde foi instalado o Fluig
        return diretorioAtualParent.getAbsolutePath();
	} catch (ex) {
		throw ex
	}
}