var INICIO = 1;

$(document).ready(function() {
	
	displayBtnFiles();
	tableLineCount();
	
	if((getMode() == "VIEW") || (getAtividade() != INICIO)){
		$('.btnAddNewRow').remove();
		$('.tdDeleteRow').remove();
	}
	
	if(getAtividade() != INICIO){
		invisibleBtnUpload("fnRegistroNascimento");
		invisibleBtnUpload("fnCpf");
		invisibleBtnUpload("fnFoto");
		invisibleBtnUploadTable("tblDocumentos");
	}
	
	initRichEditor("corpoEmail", INICIO);
	
})



/**
 * Inicializa o componente Rich Editor
 * @param {string} inputId Parâmetro obrigatório, Id do textarea onde o componente será inicializado
 * @param {string|Number} atividade Parâmetro obrigatório, código da atividade em que o componente será habilitado para edição
 * @return {void}
 * @author Sérgio Machado
 */
function initRichEditor(inputId, atividade) {
	
	// Variável com valor true ou false, indicando se o Rich Editor será inicializado bloqueado ou não
	const readOnly = !((getAtividade() == atividade) && (getMode() != "VIEW"));

	// Configurações
	var settings = {
		removePlugins: 'fluigimage,fluigvideo',
		resize_enabled: false,
		height: "300px",
		readOnly
	};

	// Inicializa o componente recebendo o id do campo e as configurações
	var editor = FLUIGC.richeditor(inputId, settings);
	
	// Pega a string html que esta armazenada no campo, caso tenha valor gravado
	var htmlString = (document.getElementById(inputId).value || document.getElementById(inputId).textContent);

	// Seta a string html no componente
	editor.setData(htmlString);

	// Grava a string html no campo a cada alteração de conteúdo do componente
	editor.on('change', function() {
		document.getElementById(inputId).value = editor.getData();
	});
}


/**
 * Adiciona uma nova linha na tabela pai e filho
 * @return {void} 
 * @author Sérgio Machado
 */
function addNewRow() {
	try {
		const tablename = "tblDocumentos"
		const idByTimestamp = (new Date().getTime()).toString(32);
		const indice = wdkAddChild(tablename);
		$(`#fdDocumento___${indice}`).val(`anexo_${idByTimestamp}`);
		tableLineCount(tablename)
	} catch (err) {
		console.error("function " + arguments.callee.name + " => " + err)
	}
}


/**
 * Delete uma linha da tabela pai e filho e remove o anexo caso exista
 * @return {void} 
 * @author Sérgio Machado
 */
function destroyRow(event) {
	try {
		const tabela = $(event).closest('table')[0];
		const tablename = tabela.getAttribute("tablename");
		const inputFileName = $(event).closest('tr').find(".inputAnexo").val();
		const inputFileDesc = $(event).closest('tr').find(".descAnexo").val();
		FLUIGC.message.confirm({
			message: `Deseja remover o documento <b>${inputFileName}</b>?`,
			title: 'Confirmação',
			labelYes: 'Sim, quero remover',
			labelNo: 'Não, quero cancelar',
		}, function(result) {
			if (result) {
				fnWdkRemoveChild(event)
				if(inputFileName && inputFileDesc){
					removeFile(inputFileDesc)
				}
				tableLineCount(tablename)
			}
		});
	} catch (e) {
		console.error("function " + arguments.callee.name + " => " + err)
	}
}


/**
 * Desabilita o botão de upload dos anexos de uma tabela pai e filho
 * @param {String} tablename Parâmetro obrigatório, tablename da tabela pai e filho.
 * @return {String} - Retorna string de erros caso apresente erros
 * @author Sérgio Machado
 */
function invisibleBtnUploadTable(tablename){
	try {
		const countRows = $(`[tablename='${tablename}']`).find('tbody tr').not(':first');
		for(let i = 0; i < countRows.length; i++){
			let idInput = countRows.eq(i).find(".inputAnexo")[0].id;
			invisibleBtnUpload(idInput);
		}
		
	} catch (err) {
		console.error("function " + arguments.callee.name + " => " + err)
	}
}

/**
 * Insere a numeração correspondente a cada linha da tabela pai e filho de forma automática.
 * @param {String} tablename Parâmetro obrigatório, tablename da tabela pai e filho.
 * Quando informado um valor válido para tablename, o script irá percorre apenas as linhas da própia tabela.
 * Se informar o valor false para o parâmetro tablename, o script irá percorrer todas as tabelas. Recomendado apenas para o carregamento do formulário.
 * @return {void} 
 * @author Sérgio Machado
 */
function tableLineCount(tablename) {
	try {
		let atributo = "[tablename]";
		if(tablename){
			atributo = `[tablename='${tablename}']`
		} 
		$.each($(atributo), function(index) {
			const tabelaRow = $(this).find('tbody tr').not(':first');
			tabelaRow.each(function(i) {
				tabelaRow.eq(i).find('td.count').html(`<span>${i + 1}</span>`);
			});
		});
	} catch (e) {
		console.error("function " + arguments.callee.name + " => " + err)
	}
}

