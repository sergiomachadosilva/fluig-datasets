var INICIO = 1;

$(document).ready(function() {
	
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